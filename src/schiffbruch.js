//ddraw
let lpDDSPrimary = null;   // DirectDraw primary surface
let lpDDSBack = null;      // DirectDraw back surface
let lpDDSMisc = null;      // DirectDraw Bilder surface
let lpDDSPanel = null;     // DirectDraw Panel surface
let lpDDSGuyAni = null;    // DirectDraw GuyAni surface
let lpDDSAnimation = null; // DirectDraw Animation surface
let lpDDSKarte = null;      // DirectDraw MiniMap surface
let lpDDSSchrift = null;    // DirectDraw Schrift surface
let lpDDSSchrift1 = null;   // DirectDraw Schrift1 surface
let lpDDSSchrift2 = null;   // DirectDraw Schrift2 surface
let lpDDSTextFeld = null;   // DirectDraw TextFeld surface
let lpDDSPapier = null;     // DirectDraw Paier surface
let lpDDSBaum = null;      // DirectDraw Bäume surface
let lpDDSBau = null;       // DirectDraw Bauwerke surface
let lpDDSCredits = null;   // DirectDraw Credits surface
let lpDDSLogo = null;		// DirectDraw Logo surface
let lpDDSCursor = null;    // DirectDraw Cursor surface
let lpDDSButtons = null;   // DirectDraw Buttons surface
let lpDDSInventar = null;  // DirectDraw Inventar surface
let lpDDSScape = null;      // DirectDraw Landschaft surface
let lpDDSSchatzkarte = null;// SchatzkartenSurface
let lpdsbWav = new Array(WAVANZ); //Wavedateispeicher

let Spielzustand = SZNICHTS;	   // in welchem Zustand ist das Spiel?
let MouseAktiv = false;    // Mouse angestellt?
let LAnimation = true;	   // Ist die Landschaftanimation angeschaltet?
let Gitter;			//Gitternetz an/aus
let ScapeGrenze = RECT();     //Diese Koordinaten zeigen die Größe der Landschaft an
let Flusslaenge = new Array(FLUSSANZAHL);
let CursorTyp;		//Welcher Cursortyp?
let LastCursorType;
let Button0down;	//linke Maustaste gedrückt gehalten
let Button1down;	//rechte Maustaste gedrückt gehalten
let RouteLaenge;	//Länge
let RoutePunkt;		//Aktueller Index in RouteKoor
let Schrittx, Schritty; //Zum Figur laufen lassen
let Zeit;			//Start der Sekunde
let Bild, LastBild;	//Anzahl der Bilder in der Sekunde
let rcRectdes = RECT(), rcRectsrc = RECT(); //Ständig benötigte Variable zum Blitten
let Tag, Stunden, Minuten;		//Wieviel Uhr (0-12h)
let StdString;	//Standard string
let RohString;	//Darin wird gespeichert, wieviel Rohstoffe noch benötigt werden
let PapierText;			//Wieviel Papier? (in Pixel) -1 = Kein Text
let HauptMenue;			//Welches Menü?
let TwoClicks;				//Für Aktionen mit zwei Mausklicks
let Chance;					//Wie groß ist die Chance am Tag gerettet zu werden
let BootsFahrt;				//Gerade mit dem Boot unterwegs?
let Nacht;					//Wird die Tageszusammenfassung angezeigt?
let Soundzustand;			//-1 = keine Soundkarte;0=kein Sound;1=Sound an
let Spielbeenden = false;	//Wenn true wird das Spiel sofort beendet
let Frage;					//-1=KeineFrage;0=Frage wird gestellt;1=Ja;2=Nein
let pi = Math.PI;		//pi, was sonst
let AbspannNr = 0;			//Zähler für Abspann
let AbspannZustand = 0;			//Wo im Abspann
let SchatzGef = false;	//wurde der Schatz gefunden

// Pathfinding
let Step, Steps;
let LenMap = Array.from(Array(MAXYKACH), x => Array(MAXXKACH).fill(0));

class TEXTBEREICH {
    constructor() {
        this.Aktiv = false; //Steht Text in diesem Bereich?
        this.rcText = RECT(); //Die Position des Ausgabe
    }
}

let TextBereich = Array.from(Array(TEXTANZ), x => new TEXTBEREICH());

let Camera = ZWEID();					//aktueller Kartenausschnitt
let MousePosition = ZWEID();			//     "    Mauskoordinaten
let RouteZiel = ZWEID(), RouteStart = ZWEID();	// Koordinaten des Starts und des Endes der Route
let Route = Array.from(Array(MAXXKACH * MAXYKACH), x => ZWEID());	// Liste der Routenpunkte
let RouteKoor = Array.from(Array(2 * MAXXKACH * MAXYKACH), x => ZWEID()); // Liste der Routenkoordinaten
let SaveRoute = Array.from(Array(2 * MAXXKACH * MAXYKACH), x => ZWEID()); // Zum zwischenspeichern der Route
let NewPos = ZWEID();					// Nur innerhalb des Pathfindings benutzt
let GuyPosScreenStart = ZWEID();	    // Absolute StartPosition bei einem Schritt (Für CalcGuyKoor)
let SchatzPos = ZWEID();				//Hier ist der Schatz vergraben

let RGBSTRUCT = (r = 0, g = 0, b = 0) => ({
    r, g, b,
    copy: function () {
        return RGBSTRUCT(this.r, this.g, this.b);
    },
});

let Guy = {
    Aktiv: false,//Ist er aktiv?
    Aktion: 0, //Welche Aktion (Suchen, fischen ...) (übergeordnet über Zustand)
    Pos: ZWEID(),	// KachelPosition der Spielfigur
    PosAlt: ZWEID(), //Die ursprünglich Position in der Kachel (für die Aktionsprozeduren)
    PosScreen: ZWEID(), // Absolute Position der Spielfigur
    Zustand: 0, //Was macht er gerade? (Animation)(linkslaufen,rechtslaufen...,angeln..)
    AkNummer: 0, //Bei welcher Aktion (für die Aktionsprozeduren)
    Resource: [0, 0, 0],	//Wieviel Wasservorrat usw
    Inventar: Array(BILDANZ).fill(0), //Welche Rohstoffe usw. besitzt man
};

class BMP {
    constructor() {
        this.rcSrc = RECT();     //Quelle des 1. Bildes
        this.rcDes = RECT();		//Falls es immer an die gleiche Stelle gezeichnet wird. (Buttons)
        this.Rohstoff = Array(BILDANZ).fill(0); //Anzahl des i.Rohstoffs, den man zum Bau benötigt
    }
}

let Bmp = Array.from(Array(BILDANZ), x => new BMP());
let Wav = Array.from(Array(WAVANZ), x => ({}));
let AbspannListe = Array.from(Array(10), x => Array.from(Array(10), x => ({Aktiv: false, Bild: 0})));	//Namenabfolge im Abspann

class SCAPE {
    constructor() {
        this.ObPos = ZWEID();		//Die Koordinaten des Objekts (relativ zu xScreen und yScreen)
        this.GPosAlt = ZWEID();		// Damit der Guy an der richtigen Stelle (x,y) weiterbaut
        this.Rohstoff = Array.from(BILDANZ, x => 0); //Anzahl des i.Rohstoffs, den man noch zum bauen braucht
    }
}

let Scape = Array.from(Array(MAXYKACH), x => Array.from(Array(MAXXKACH), x => new SCAPE()));
let Flusslauf = Array.from(Array(FLUSSANZAHL), x => Array.from(Array(MAXFLUSS), x => ({x: 0, y: 0})));

let canvas = document.querySelector("#canvas");
let ctx = null;
let audioCtx = null;
let cur_mouse_state = {
    x: 0,
    y: 0,
    lX: 0,
    lY: 0,
    lZ: 0,
    rgbButtons: [0, 0, 0, 0],
};
let keymap = {};

function is_int(n)
{
    return n % 1 === 0;
}

function set_cursor(type)
{
    if(CursorTyp !== type) {
        console.log("set cursor to ", type);
        LastCursorType = CursorTyp;
        CursorTyp = type;
    }
}

function copy_zweid(d, s)
{
    d.x = s.x;
    d.y = s.y;
}

function copy_rect(d, s)
{
    d.left = s.left;
    d.right = s.right;
    d.top = s.top;
    d.bottom = s.bottom;
    if(
        d.left === undefined ||
        d.right === undefined || d.top === undefined || d.bottom === undefined)
            throw "rect undefined";
}

function rand()
{
    return Math.floor(Math.random() * 0xffFFffFF);
}

function loadImage(alias)
{
    let url = BMP_FILENAMES[alias];
    let img = document.createElement("img");
    img.is_ready = false;
    img.onload = () => {
        img.is_ready = true;
    };
    img.src = url;
    return img;
}

function createSurface(w, h)
{
    let off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    off.ctx = off.getContext("2d", {alpha: false});
    return off;
}

function LoadString(id)
{
    return messages[id];
}

function InitDDraw()
{
    console.log("InitDDraw");
    // Set the video mode to 800x600
    canvas.width = MAXX;
    canvas.height = MAXY;
    ctx = canvas.getContext("2d");
    canvas.ctx = ctx;

    //In diese Surface sollen die Bausteine geladen werden
    lpDDSMisc = loadImage(Misc);
    //In diese Surface sollen das Panel geladen werden
    lpDDSPanel = loadImage(Panel);
    //In diese Surface sollen die Animation der Figur gespeichert werden
    lpDDSGuyAni = loadImage(GuyAni);
    //In diese Surface sollen die Landschaftsanimationen gespeichert werden
    lpDDSAnimation = loadImage(Animation);
    //In diese Surface soll die Schrift1 gespeichert werden
    lpDDSSchrift1 = loadImage(Schrift1);
    //In diese Surface soll die Schrift2 gespeichert werden
    lpDDSSchrift2 = loadImage(Schrift2);
    //In diese Surface soll das Papier gespeichert werden
    lpDDSPapier = loadImage(Papier);
    //In diese Surface solln die B�ume gespeichert werden
    lpDDSBaum = loadImage(Baum);
    //In diese Surface solln die Cursor gespeichert werden
    lpDDSCursor = loadImage(Cursorbmp);
    //In diese Surface solln die Buttons gespeichert werden
    lpDDSButtons = loadImage(Buttons);
    //In diese Surface solln das TextFeld gespeichert werden
    lpDDSTextFeld = loadImage(TextFeld);
    //In diese Surface solln das Inventar gespeichert werden
    lpDDSInventar = loadImage(Inventarbmp);
    //In diese Surface solln die Bauwerke gespeichert werden
    lpDDSBau = loadImage(Bau);
    //In diese Surface solln die Credits gespeichert werden
    lpDDSCredits = loadImage(Credits);
    //In diese Surface solln das Logo gespeichert werden
    lpDDSLogo = loadImage(Logo);

    //In diese Surface soll die MiniMap gespeichert werden
    lpDDSKarte = createSurface(2 * MAXXKACH, 2 * MAXYKACH);
    //In diese Surface soll die Landschaft gespeichert werden
    lpDDSScape = createSurface(MAXSCAPEX, MAXSCAPEY);
    //document.body.appendChild(lpDDSScape);
    //In diese Surface soll die Schrift gespeichert werden
    lpDDSSchrift = createSurface(MAXX, MAXY);
    //In diese Surface soll die Schatzkarte gespeichert werden
    lpDDSSchatzkarte = createSurface(SKARTEX, SKARTEY);
    console.log("...done");
}

function InitDSound()
{
    console.log("InitDSound");
    audioCtx = new AudioContext();
    console.log("...done");
}

function LoadSound(Sound)
{
    fetch(Wav[Sound].Dateiname)
        .then(response => response.arrayBuffer())
        .then(buffer => audioCtx.decodeAudioData(buffer))
        .then(sound => lpdsbWav[Sound] = sound);

    //TODO: Die Standardlautstärke festlegen
    // lpdsbWav[Sound]->SetVolume((long)(-10000+100*Wav[Sound].Volume));
}

function PlaySound(Sound, Volume)
{
    //console.log("play sound ", Sound, " volume ", Volume);
    if (lpdsbWav[Sound] && !lpdsbWav[Sound].src) {
        const source = audioCtx.createBufferSource();
        source.buffer = lpdsbWav[Sound];
        source.connect(audioCtx.destination);
        if(Wav[Sound].Loop) source.loop = true;
        console.log("sound", Sound, "looped", Wav[Sound].Loop);
        source.start();
        source.buffer.src = source;
        source.onended = () => {
            lpdsbWav[Sound].src = null;
        };
    }

    /*
	short z;

	if ((Sound === 0) || (Soundzustand <= 0)) return;

	z = -10000+100*Wav[Sound].Volume;
	lpdsbWav[Sound]->SetVolume((long)(-10000+(10000+z)*Volume/100));
	if (Wav[Sound].Loop) lpdsbWav[Sound]->Play(null,null,DSBPLAY_LOOPING);
	else lpdsbWav[Sound]->Play(null,null,null);
	 */
}

function StopSound(Sound)
{
    if (lpdsbWav[Sound]) {
        let src = lpdsbWav[Sound].src;
        if (src) {
            src.stop();
            lpdsbWav[Sound].src = null;
        }
    }
}

function SaveGame()
{
    let data = {
        Scape, Guy, BootsFahrt, Camera, Chance, Gitter, HauptMenue, LAnimation, Minuten, ScapeGrenze, SchatzPos,
        Spielzustand, Stunden, Tag, TextBereich, SchatzGef, Bmp
    };

    window.localStorage.setItem('save.dat', JSON.stringify(data));
}

function LoadGame()
{
    let data = window.localStorage.getItem('save.dat');
    if (!data) return false;
    data = JSON.parse(data);

    Scape = data.Scape;
    Guy = data.Guy;
    BootsFahrt = data.BootsFahrt;
    Camera = data.Camera;
    Chance = data.Chance;
    Gitter = data.Gitter;
    HauptMenue = data.HauptMenue;
    LAnimation = data.LAnimation;
    Minuten = data.Minuten;
    ScapeGrenze = data.ScapeGrenze;
    SchatzPos = data.SchatzPos;
    Spielzustand = data.Spielzustand;
    Stunden = data.Stunden;
    Tag = data.Tag;
    TextBereich = data.TextBereich;
    SchatzGef = data.SchatzGef;

    for (let i = 0; i < BILDANZ; i++) {
        Bmp[i].Animation = data.Bmp[i].Animation;
        Bmp[i].Phase = data.Bmp[i].Animation;
        Bmp[i].First = data.Bmp[i].First;
    }

    return true;
}

function Blitten(lpDDSVon, lpDDSNach, Transp)
{
    if(!is_int(rcRectsrc.left) || !is_int(rcRectsrc.top) ||
        !is_int(rcRectsrc.right) || !is_int(rcRectsrc.bottom) ||
        !is_int(rcRectdes.left) || !is_int(rcRectdes.top) ||
        !is_int(rcRectdes.right) || !is_int(rcRectdes.bottom))
    {
    }
    // TODO: handle transparency?
    lpDDSNach.ctx.drawImage(
        lpDDSVon,
        rcRectsrc.left | 0,
        rcRectsrc.top | 0,
        (rcRectsrc.right - rcRectsrc.left) | 0,
        (rcRectsrc.bottom - rcRectsrc.top) | 0,
        rcRectdes.left | 0,
        rcRectdes.top | 0,
        (rcRectdes.right - rcRectdes.left) | 0,
        (rcRectdes.bottom - rcRectdes.top) | 0
    );
}

function Blit_destrect(lpDDSVon, lpDDSNach)
{
    if(!is_int(rcRectsrc.left) || !is_int(rcRectsrc.top) ||
        !is_int(rcRectsrc.right) || !is_int(rcRectsrc.bottom) ||
        !is_int(rcRectdes.left) || !is_int(rcRectdes.top) ||
        !is_int(rcRectdes.right) || !is_int(rcRectdes.bottom))
    {
    }
    lpDDSNach.ctx.drawImage(
        lpDDSVon,
        rcRectdes.left | 0,
        rcRectdes.top | 0,
        (rcRectdes.right - rcRectdes.left) | 0,
        (rcRectdes.bottom - rcRectdes.top) | 0,
        rcRectdes.left,
        rcRectdes.top,
        (rcRectdes.right - rcRectdes.left) | 0,
        (rcRectdes.bottom - rcRectdes.top) | 0
    );
}

function InitDInput()
{
    console.log("InitDInput");
    canvas.onmousemove = e => {
        let rect = canvas.getBoundingClientRect();
        cur_mouse_state.lX = e.clientX - cur_mouse_state.x - rect.left;
        cur_mouse_state.lY = e.clientY - cur_mouse_state.y - rect.top;
        cur_mouse_state.x = e.clientX - rect.left;
        cur_mouse_state.y = e.clientY - rect.top;
    };

    canvas.onmousedown = e => {
        if (e.button === 0) cur_mouse_state.rgbButtons[0] = 0x80;
        if (e.button === 2) cur_mouse_state.rgbButtons[1] = 0x80;
    };

    canvas.onmouseup = e => {
        if (e.button === 0) cur_mouse_state.rgbButtons[0] = 0;
        if (e.button === 2) cur_mouse_state.rgbButtons[1] = 0;
    };

    window.onkeydown = e => {
        console.log("keydown ", e.key)
        keymap[e.key] = true;
    };

    window.onkeyup = e => {
        keymap[e.key] = false;
    };
    console.log("...done");
}

function CheckMouse()
{
    let dims = cur_mouse_state; //Da werden die Daten der Maus gespeichert
    let Button; //Welcher Knopf ist gedrückt worden
    let Push;	//Knopf gedrückt(1) oder losgelassen(-1) oder gedrückt(0) gehalten
    let xDiff, yDiff; //Die Differenz zur vorherigen Position ((Für Scrollen)

    //Mausbewegung
    xDiff = dims.lX;
    yDiff = dims.lY;
    MousePosition.x = dims.x;
    MousePosition.y = dims.y;
    if (MousePosition.x < 0) MousePosition.x = 0;
    if (MousePosition.x > MAXX - 2) MousePosition.x = MAXX - 2;
    if (MousePosition.y < 0) MousePosition.y = 0;
    if (MousePosition.y > MAXY - 2) MousePosition.y = MAXY - 2;

    if (TwoClicks === -1) {
        if (Guy.Aktiv) {
            if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSTOP].rcDes) &&
                (Bmp[BUTTSTOP].Phase !== -1)) set_cursor(CUPFEIL);
            else set_cursor(CUUHR);
        } else set_cursor(CUPFEIL);
    }
    Button = -1;

    if (dims.rgbButtons[0] & 0x80) {
        Button = 0;
        if (Button0down) Push = 0;
        else {
            Push = 1;
            Button0down = true;
        }
    } else {
        if (Button0down) {
            Button = 0;
            Push = -1;
            Button0down = false;
        }
    }


    if (dims.rgbButtons[1] & 0x80) {
        Button = 1;
        if (Button1down) Push = 0;
        else {
            Push = 1;
            Button1down = true;
        }
    } else {
        if (Button1down) {
            Button = 1;
            Push = -1;
            Button1down = false;
        }
    }

    //Wenn ein Text steht, dann bei Mausdruck Text weg
    if (PapierText !== -1) {
        if (Frage === 0) {
            if (InRect(MousePosition.x, MousePosition.y, Bmp[JA].rcDes)) {
                set_cursor(CUPFEIL);
                if ((Button === 0) && (Push === 1)) {
                    Frage = 1;
                    Textloeschen(TXTPAPIER);
                    PapierText = -1;
                    Guy.Aktiv = false;
                    PlaySound(WAVKLICK2, 100);
                }
            } else if (InRect(MousePosition.x, MousePosition.y, Bmp[NEIN].rcDes)) {
                set_cursor(CUPFEIL);
                if ((Button === 0) && (Push === 1)) {
                    Frage = 2;
                    Textloeschen(TXTPAPIER);
                    PapierText = -1;
                    Guy.Aktiv = false;
                    PlaySound(WAVKLICK2, 100);
                }
            } else if ((Button === 0) && (Push === 1)) PlaySound(WAVKLICK, 100);
        } else if ((Button !== -1) && (Push === 1)) {
            Textloeschen(TXTPAPIER);
            PapierText = -1;
            Guy.Aktiv = false;
        }
        return;

    }

    //Animationen und Text löschen (werden dann von den MouseIn.. Sachen neu angestellt
    Textloeschen(TXTTEXTFELD);
    ButtAniAus();

    //Wenn der Guy aktiv dann linke Mouse-Buttons ignorieren
    if ((Guy.Aktiv) && (Button === 0)) {
        if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSTOP].rcDes)) &&
            (Bmp[BUTTSTOP].Phase !== -1)) ;
        else Button = -1;
    }

    //die Maus ist in der Spielflaeche ->
    if (InRect(MousePosition.x, MousePosition.y, rcSpielflaeche))
        MouseInSpielflaeche(Button, Push, xDiff, yDiff);
    //die Maus ist im Panel ->
    if (InRect(MousePosition.x, MousePosition.y, rcPanel))
        MouseInPanel(Button, Push);
}

function CheckKey()
{
    if (Spielzustand === SZLOGO) {
        if (keymap.Escape || keymap.Return || keymap[" "]) //Logo Abbrechen
        {
            keymap.Escape = false;
            keymap.Return = false;
            keymap[" "] = false;
            StopSound(WAVLOGO);
            NeuesSpiel(false);
            return 2;
        }
    } else if (Spielzustand === SZINTRO) {
        if (keymap.Escape || keymap.Return || keymap[" "]) //Intro Abbrechen
        {
            StopSound(WAVSTURM); //Sound hier sofort stoppen
            StopSound(WAVSCHWIMMEN); //Sound hier sofort stoppen
            Guy.Aktiv = false;
            for (let x = Guy.Pos.x; x < MAXXKACH; x++) {
                Guy.Pos.x = x;
                Entdecken();
                if (Scape[Guy.Pos.x][Guy.Pos.y].Art !== 1) break;
            }
            Scape[Guy.Pos.x - 2][Guy.Pos.y].Objekt = WRACK;
            Scape[Guy.Pos.x - 2][Guy.Pos.y].ObPos.x = Bmp[WRACK].rcDes.left;
            Scape[Guy.Pos.x - 2][Guy.Pos.y].ObPos.y = Bmp[WRACK].rcDes.top;

            Guy.PosScreen.x = floor(
                (Scape[Guy.Pos.x][Guy.Pos.y].xScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                    Scape[Guy.Pos.x][Guy.Pos.y].xScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) / 2
            );
            Guy.PosScreen.y = floor(
                (Scape[Guy.Pos.x][Guy.Pos.y].yScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) / 2
            );
            RouteStart.x = -1;
            RouteStart.y = -1;
            RouteZiel.x = -1;
            RouteZiel.y = -1;
            Camera.x = Guy.PosScreen.x - floor(rcSpielflaeche.right / 2);
            Camera.y = Guy.PosScreen.y - floor(rcSpielflaeche.bottom / 2);
            if (BootsFahrt) ChangeBootsFahrt();
            Guy.Zustand = GUYLINKS;
            Guy.Aktion = AKNICHTS;
            Spielzustand = SZSPIEL;
            Guy.PosAlt = Guy.PosScreen;
            SaveGame();
            return 1;
        }
    } else if (Spielzustand === SZGERETTET) {
        if (keymap.Escape || keymap.Return || keymap[" "]) {
            Spielzustand = SZABSPANN;
            return 1;
        }
    } else if (Spielzustand === SZSPIEL) {
        if (keymap.ArrowRight) Camera.x += 10;
        if (keymap.ArrowLeft) Camera.x -= 10;
        if (keymap.ArrowDown) Camera.y += 10;
        if (keymap.ArrowUp) Camera.y -= 10;
        if (keymap.Escape) {
            Guy.AkNummer = 0;
            Guy.Aktiv = false;
            Guy.Aktion = AKSPIELVERLASSEN;
        }
        if (keymap.F11) {
            Guy.AkNummer = 0;
            Guy.Aktiv = false;
            Guy.Aktion = AKNEUBEGINNEN;
        }
        if (keymap.g) {
            Gitter = !Gitter;
            Generate();
        }
        if (keymap.a) {
            LAnimation = !LAnimation;
            Generate();
        }
        if (keymap.s) {	//Sound ausschalten
            if (Soundzustand === 0) Soundzustand = 1;
            else if (Soundzustand === 1) Soundzustand = 0;
        }
    } else if (Spielzustand === SZABSPANN) {
        if (keymap.Escape || keymap.Return || keymap[" "]) {
            StopSound(WAVABSPANN);
            return 0;
        }
    }
    return 1;
}

function AddTime(h, m)
{
    Stunden += h;
    Minuten += m;
    if (Minuten >= 60) {
        Minuten -= 60;
        Stunden++;
    }
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            //Feuer nach einer bestimmten Zeit ausgehen lassen
            if (Scape[x][y].Objekt === FEUER) {
                Scape[x][y].Timer += ((60 * h + m) * 0.0005);
                if (Scape[x][y].Timer >= 1) {
                    Scape[x][y].Objekt = -1;
                    Scape[x][y].Timer = 0;
                    Scape[x][y].ObPos.x = 0;
                    Scape[x][y].ObPos.y = 0;
                    Scape[x][y].Phase = -1;
                    Chance -= 2 + 2 * Scape[x][y].Hoehe;
                }
            }
            if ((Scape[x][y].Phase === -1) ||
                ((Scape[x][y].Objekt !== FELD) &&
                    (Scape[x][y].Objekt !== BUSCH))) continue; //Wenn kein Fruchtobjekt weiter
            if (Scape[x][y].Phase >= Bmp[Scape[x][y].Objekt].Anzahl) continue;
            if (Scape[x][y].Objekt === FELD) Scape[x][y].Phase += ((60 * h + m) * 0.005);
            else if (Scape[x][y].Objekt === BUSCH) Scape[x][y].Phase += ((60 * h + m) * 0.0005); //pro Minute Reifungsprozess fortführen
            if (Scape[x][y].Phase > Bmp[Scape[x][y].Objekt].Anzahl - 1)
                Scape[x][y].Phase = Bmp[Scape[x][y].Objekt].Anzahl - 1;
        }
    }
    AddResource(GESUNDHEIT, (60 * h + m) * (Guy.Resource[WASSER] - 50 + Guy.Resource[NAHRUNG] - 50) / 1000);

    if ((Spielzustand === SZSPIEL) && (!BootsFahrt)) {
        for (let i = 0; i <= (60 * h + m); i++) {
            if (Chance === 0) break;
            if (rand() % ((int)(1 / (Chance / 72000))) === 1) {
                Guy.Aktiv = false;
                Guy.AkNummer = 0;
                Guy.Aktion = AKGERETTET;
                break;
            }
        }
    }
}

function AddResource(Art, Anzahl) //Fügt wassser usw hinzu
{
    Guy.Resource[Art] += Anzahl;
    if (Guy.Resource[Art] > 100) Guy.Resource[Art] = 100;
    if (Guy.Resource[Art] < 0) Guy.Resource[Art] = 0;
    //Wann tod
    if ((Guy.Resource[GESUNDHEIT] <= 0) && (Guy.Aktion !== AKTOD) &&
        (Guy.Aktion !== AKTAGENDE) && (Spielzustand === SZSPIEL)) {
        Guy.Aktiv = false;
        Guy.AkNummer = 0;
        Guy.Aktion = AKTOD;
    }
}

function LimitScroll()
{
    if (Camera.x < ScapeGrenze.left)
        Camera.x = ScapeGrenze.left;
    if (Camera.x + rcSpielflaeche.right > ScapeGrenze.right)
        Camera.x = ScapeGrenze.right - rcSpielflaeche.right;
    if (Camera.y < ScapeGrenze.top)
        Camera.y = ScapeGrenze.top;
    if (Camera.y + rcSpielflaeche.bottom > ScapeGrenze.bottom)
        Camera.y = ScapeGrenze.bottom - rcSpielflaeche.bottom;
}

function GetKachel(PosX, PosY)
{
    let Erg = ZWEID();

    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {		//Die in Betracht kommenden Kacheln rausfinden
            if ((PosX > Scape[x][y].xScreen) && (PosX < Scape[x][y].xScreen + KXPIXEL) &&
                (PosY > Scape[x][y].yScreen) && (PosY < Scape[x][y].yScreen + KYPIXEL)) {
                if ((InDreieck(PosX, PosY,
                    Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][0].x,
                    Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][0].y,
                    Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][1].x,
                    Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][1].y,
                    Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][3].x,
                    Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][3].y)) ||
                    (InDreieck(PosX, PosY,
                        Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][2].x,
                        Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][2].y,
                        Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][1].x,
                        Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][1].y,
                        Scape[x][y].xScreen + EckKoor[Scape[x][y].Typ][3].x,
                        Scape[x][y].yScreen + EckKoor[Scape[x][y].Typ][3].y))) {
                    Erg.x = x;
                    Erg.y = y;
                    return Erg;
                }
            }
        }
    }
    Erg.x = -1;
    Erg.y = -1;
    return Erg;
}

function MakeRohString(x, y, Objekt)
{
    let TmpString = "";
    let keinRohstoff = true;

    RohString = "";
    if (Objekt === -1) {
        for (let i = 0; i < BILDANZ; i++) {
            if (Scape[x][y].Rohstoff[i] !== 0) keinRohstoff = false;
        }
    } else {
        for (let i = 0; i < BILDANZ; i++) {
            if (Bmp[Objekt].Rohstoff[i] !== 0) keinRohstoff = false;
        }
    }
    if (keinRohstoff) return;
    RohString += " ->";

    for (let i = 0; i < BILDANZ; i++) {
        if (Objekt === -1) {
            if (Scape[x][y].Rohstoff[i] === 0) continue;
        } else {
            if (Bmp[Objekt].Rohstoff[i] === 0) continue;
        }
        RohString += " ";
        switch (i) {
            case ROHAST:
                TmpString = LoadString("AST");
                break;
            case ROHSTEIN:
                TmpString = LoadString("STEIN");
                break;
            case ROHBLATT:
                TmpString = LoadString("BLATT");
                break;
            case ROHLIANE:
                TmpString = LoadString("LIANE");
                break;
            case ROHSTAMM:
                TmpString = LoadString("STAMM");
                break;
        }
        RohString += TmpString;
        RohString += "=";
        if (Objekt === -1) RohString += Scape[x][y].Rohstoff[i];
        else RohString += Bmp[Objekt].Rohstoff[i];
    }
}

function MouseInSpielflaeche(Button, Push, xDiff, yDiff)
{
    let Text = "";
    let TextTmp = "";

    //Info anzeigen
    let Erg = GetKachel((MousePosition.x + Camera.x), (MousePosition.y + Camera.y));
    if ((Erg.x !== -1) && (Erg.y !== -1) && Scape[Erg.x][Erg.y].Entdeckt) {
        Text = LoadString(TerrainInfoLabels[Scape[Erg.x][Erg.y].Art]);

        if ((Scape[Erg.x][Erg.y].Objekt !== -1) && (Scape[Erg.x][Erg.y].Objekt !== MEERWELLEN)) {
            TextTmp = LoadString("MIT");
            Text += " " + TextTmp + " ";

            if ((Scape[Erg.x][Erg.y].Objekt >= BAUM1) && (Scape[Erg.x][Erg.y].Objekt <= BAUM4))
                TextTmp = LoadString("BAUMTEXT");
            else if ((Scape[Erg.x][Erg.y].Objekt >= FLUSS1) && (Scape[Erg.x][Erg.y].Objekt <= SCHLEUSE6))
                TextTmp = LoadString("FLUSSTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === BUSCH)
                TextTmp = LoadString("BUSCHTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === ZELT)
                TextTmp = LoadString("ZELTTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === FELD)
                TextTmp = LoadString("FELDTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === BOOT)
                TextTmp = LoadString("BOOTTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === ROHR)
                TextTmp = LoadString("ROHRTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === SOS)
                TextTmp = LoadString("SOSTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === HAUS1)
                TextTmp = LoadString("HAUS1TEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === HAUS2)
                TextTmp = LoadString("HAUS2TEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === HAUS3)
                TextTmp = LoadString("HAUS3TEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === BAUMGROSS)
                TextTmp = LoadString("BAUMGROSSTEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === FEUERSTELLE)
                TextTmp = LoadString("FEUERSTELLETEXT");
            else if (Scape[Erg.x][Erg.y].Objekt === FEUER)
                TextTmp = LoadString("FEUERTEXT");
            else if ((Scape[Erg.x][Erg.y].Objekt === WRACK) || (Scape[Erg.x][Erg.y].Objekt === WRACK2))
                TextTmp = LoadString("WRACKTEXT");
            Text += TextTmp;

            if ((Scape[Erg.x][Erg.y].Objekt >= FELD) &&
                (Scape[Erg.x][Erg.y].Objekt <= FEUERSTELLE)) {
                //Baufortschrittanzeigen
                Text += " (";
                Text += (Scape[Erg.x][Erg.y].AkNummer * 100) / Bmp[Scape[Erg.x][Erg.y].Objekt].AkAnzahl;
                Text += "%)";
                //benötigte Rohstoffe anzeigen
                MakeRohString(Erg.x, Erg.y, -1);
                Text += RohString;
            }

        }
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(Text, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);
    }

    //rechte Maustastescrollen
    if ((Button === 1) && (Push === 0)) {
        Camera.x += xDiff;
        Camera.y += yDiff;
        set_cursor(CURICHTUNG);
    }

    //Wenn Maustaste gedrückt wird
    if ((Button === 0) && (Push === 1)) {
        if ((Erg.x !== -1) && (Erg.y !== -1) &&
            (Scape[Erg.x][Erg.y].Entdeckt) && (!Guy.Aktiv) &&
            ((Erg.x !== Guy.Pos.x) || (Erg.y !== Guy.Pos.y)) &&
            (Erg.x > 0) && (Erg.x < MAXXKACH - 1) &&
            (Erg.y > 0) && (Erg.y < MAXYKACH - 1)) {
            //Klicksound abspielen
            PlaySound(WAVKLICK2, 100);
            if ((Erg.x === RouteZiel.x) && (Erg.y === RouteZiel.y)) {
                MarkRoute(false);
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktiv = true;
                RoutePunkt = -1;
                Steps = 0;
                Step = 0;
            } else {
                MarkRoute(false);
                RouteStart.x = Guy.Pos.x;
                RouteStart.y = Guy.Pos.y;
                RouteZiel.x = Erg.x;
                RouteZiel.y = Erg.y;
                if (FindTheWay()) MarkRoute(true);
                else //Wenn keine Route gefunden
                {
                    RouteStart.x = -1;
                    RouteStart.y = -1;
                    RouteZiel.x = -1;
                    RouteZiel.y = -1;
                }
            }
        } else PlaySound(WAVKLICK, 100);
    }
}

function ButtAniAus()
{
    for (let i = BUTTGITTER; i <= BUTTDESTROY; i++) {
        Bmp[i].Animation = false;
    }
}

function MouseInPanel(Button, Push)
{
    let mx, my;	//Mauskoordinaten in Minimap

    //wenn die Maus in der Minimap ist ->
    if ((InRect(MousePosition.x, MousePosition.y, rcKarte)) && (Button === 0) && (Push !== -1)) {
        mx = MousePosition.x - rcKarte.left;
        my = MousePosition.y - rcKarte.top;
        Camera.x = floor(
            ((KXPIXEL / 4) * (mx - my) + MAXXKACH * KXPIXEL / 2)
            - (rcSpielflaeche.right - rcSpielflaeche.left) / 2
        );
        Camera.y = floor(
            ((KXPIXEL / 7) * (my + mx))
            - (rcSpielflaeche.bottom - rcSpielflaeche.top) / 2
        );
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTGITTER].rcDes)) {
        if (Gitter) DrawText(messages.GITTERAUS, TXTTEXTFELD, 2);
        else DrawText(messages.GITTERAN, TXTTEXTFELD, 2);

        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Gitter = !Gitter;
            Generate();
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTANIMATION].rcDes)) {
        if (LAnimation) DrawText(messages.ANIMATIONAUS, TXTTEXTFELD, 2);
        else DrawText(messages.ANIMATIONAN, TXTTEXTFELD, 2);

        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            LAnimation = !LAnimation;
            Generate();
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSOUND].rcDes)) {
        if (Soundzustand === 1) DrawText(messages.SOUNDAUS, TXTTEXTFELD, 2);
        else if (Soundzustand === 0) DrawText(messages.SOUNDAN, TXTTEXTFELD, 2);
        else DrawText(messages.KEINSOUND, TXTTEXTFELD, 2);

        if ((Button === 0) && (Push === 1)) {
            if (Soundzustand === 1) {
                for (i = 1; i < WAVANZ; i++) StopSound(i);
                Soundzustand = 0;
            } else if (Soundzustand === 0) {
                Soundzustand = 1;
                PlaySound(WAVKLICK2, 100);
            } else PlaySound(WAVKLICK, 100);
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTBEENDEN].rcDes)) {
        DrawText(messages.BEENDEN, TXTTEXTFELD, 2);
        Bmp[BUTTBEENDEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            Guy.Aktiv = false;
            Guy.Aktion = AKSPIELVERLASSEN;
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTNEU].rcDes)) {
        DrawText(messages.NEU, TXTTEXTFELD, 2);
        Bmp[BUTTNEU].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            Guy.Aktiv = false;
            Guy.Aktion = AKNEUBEGINNEN;
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTTAGNEU].rcDes)) {
        DrawText(messages.TAGNEU2, TXTTEXTFELD, 2);
        Bmp[BUTTTAGNEU].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            Guy.Aktiv = false;
            Guy.Aktion = AKTAGNEUBEGINNEN;
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTAKTION].rcDes)) {
        if (HauptMenue === MEAKTION) DrawText(messages.MEAKTIONZU, TXTTEXTFELD, 2);
        else DrawText(messages.MEAKTIONAUF, TXTTEXTFELD, 2);
        Bmp[BUTTAKTION].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if (HauptMenue === MEAKTION) HauptMenue = MEKEINS;
            else HauptMenue = MEAKTION;
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTBAUEN].rcDes) &&
        (Bmp[BUTTBAUEN].Phase !== -1)) {
        if (HauptMenue === MEBAUEN) DrawText(messages.MEBAUENZU, TXTTEXTFELD, 2);
        else DrawText(messages.MEBAUENAUF, TXTTEXTFELD, 2);
        Bmp[BUTTBAUEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if (HauptMenue === MEBAUEN) HauptMenue = MEKEINS;
            else HauptMenue = MEBAUEN;
        }
    } else if (InRect(MousePosition.x, MousePosition.y, Bmp[BUTTINVENTAR].rcDes)) {
        if (HauptMenue === MEINVENTAR) DrawText(messages.MEINVENTARZU, TXTTEXTFELD, 2);
        else DrawText(messages.MEINVENTARAUF, TXTTEXTFELD, 2);
        Bmp[BUTTINVENTAR].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if (HauptMenue === MEINVENTAR) HauptMenue = MEKEINS;
            else HauptMenue = MEINVENTAR;
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTWEITER].rcDes)) &&
        (Bmp[BUTTWEITER].Phase !== -1)) {
        DrawText(messages.WEITER, TXTTEXTFELD, 2);

        Bmp[BUTTWEITER].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Bmp[BUTTSTOP].Phase = 0;
            MarkRoute(false);
            RouteZiel.x = -1;
            RouteZiel.y = -1;
            Guy.PosAlt = Guy.PosScreen;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
            switch (Scape[Guy.Pos.x][Guy.Pos.y].Objekt) {
                case ZELT:
                    Guy.Aktion = AKZELT;
                    break;
                case FELD:
                    Guy.Aktion = AKFELD;
                    break;
                case BOOT:
                    Guy.Aktion = AKBOOT;
                    break;
                case ROHR:
                    Guy.Aktion = AKROHR;
                    break;
                case SOS:
                    Guy.Aktion = AKSOS;
                    break;
                case HAUS1:
                    Guy.Aktion = AKHAUS1;
                    break;
                case HAUS2:
                    Guy.Aktion = AKHAUS2;
                    break;
                case HAUS3:
                    Guy.Aktion = AKHAUS3;
                    break;
                case FEUERSTELLE:
                    Guy.Aktion = AKFEUERSTELLE;
                    break;
            }
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSTOP].rcDes)) &&
        (Bmp[BUTTSTOP].Phase !== -1)) {
        DrawText(messages.STOP, TXTTEXTFELD, 2);

        Bmp[BUTTSTOP].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            Guy.Aktion = AKABBRUCH;
            Bmp[BUTTSTOP].Phase = -1;
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTABLEGEN].rcDes)) &&
        (Bmp[BUTTABLEGEN].Phase !== -1)) {
        DrawText(messages.BEGINNABLEGEN, TXTTEXTFELD, 2);
        Bmp[BUTTABLEGEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if (Scape[Guy.Pos.x][Guy.Pos.y].Art !== 1) Guy.Aktion = AKABLEGEN;
            else Guy.Aktion = AKANLEGEN;

        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSUCHEN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTSUCHEN].Phase !== -1)) {
        DrawText(messages.BEGINNSUCHEN, TXTTEXTFELD, 2);
        Bmp[BUTTSUCHEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            Guy.Aktion = AKSUCHEN;
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTESSEN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTESSEN].Phase !== -1)) {
        DrawText(messages.BEGINNESSEN, TXTTEXTFELD, 2);
        Bmp[BUTTESSEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if (((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BUSCH) ||
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === FELD)) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase === Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl - 1)) Guy.Aktion = AKESSEN;
            else if (((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= FLUSS1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= SCHLEUSE6)) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ROHR) &&
                    (Scape[Guy.Pos.x][Guy.Pos.y].Phase === 1)))
                Guy.Aktion = AKTRINKEN;
            else PapierText = DrawText(messages.KEINESSENTRINKEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSCHLAFEN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTSCHLAFEN].Phase !== -1)) {
        DrawText(messages.BEGINNSCHLAFEN, TXTTEXTFELD, 2);
        Bmp[BUTTSCHLAFEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if (Scape[Guy.Pos.x][Guy.Pos.y].Art !== 1) {
                Guy.AkNummer = 0;
                Guy.Aktion = AKSCHLAFEN;
            } else PapierText = DrawText(messages.NICHTAUFWASSERSCHLAFEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTFAELLEN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTFAELLEN].Phase !== -1)) {
        DrawText(messages.BEGINNFAELLEN, TXTTEXTFELD, 2);
        Bmp[BUTTFAELLEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if (Guy.Inventar[ROHSTAMM] <= 10) {
                if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                    (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4)) {
                    Guy.Aktion = AKFAELLEN;
                } else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BAUMGROSS) ||
                    ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= HAUS1) &&
                        (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= HAUS3)))
                    PapierText = DrawText(messages.BAUMZUGROSS, TXTPAPIER, 1);
                else PapierText = DrawText(messages.KEINBAUM, TXTPAPIER, 1);
            } else PapierText = DrawText(messages.ROHSTAMMZUVIEL, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTANGELN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTANGELN].Phase !== -1)) {
        DrawText(messages.BEGINNANGELN, TXTTEXTFELD, 2);
        Bmp[BUTTANGELN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if (((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= FLUSS1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= SCHLEUSE6)) ||
                (BootsFahrt)) Guy.Aktion = AKANGELN;
            else PapierText = DrawText(messages.KEINWASSER, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTANZUENDEN].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTANZUENDEN].Phase !== -1)) {
        DrawText(messages.BEGINNANZUENDEN, TXTTEXTFELD, 2);
        Bmp[BUTTANZUENDEN].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === FEUERSTELLE) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Aktion = AKANZUENDEN;
            else PapierText = DrawText(messages.KEINEFEUERST, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTAUSSCHAU].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTAUSSCHAU].Phase !== -1)) {
        DrawText(messages.BEGINNAUSSCHAU, TXTTEXTFELD, 2);
        Bmp[BUTTAUSSCHAU].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if (Scape[Guy.Pos.x][Guy.Pos.y].Art !== 1) {
                Guy.AkNummer = 0;
                Guy.Aktion = AKAUSSCHAU;
            } else PapierText = DrawText(messages.WELLENZUHOCH, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSCHATZ].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTSCHATZ].Phase !== -1)) {
        DrawText(messages.BEGINNSCHATZ, TXTTEXTFELD, 2);
        Bmp[BUTTSCHATZ].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Art !== 1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1)) {
                Guy.AkNummer = 0;
                Guy.Aktion = AKSCHATZ;
            } else PapierText = DrawText(messages.GRABENBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSCHLEUDER].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTSCHLEUDER].Phase !== -1)) {
        DrawText(messages.BEGINNSCHLEUDER, TXTTEXTFELD, 2);
        Bmp[BUTTSCHLEUDER].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            Guy.AkNummer = 0;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4)) {
                Guy.AkNummer = 0;
                Guy.Aktion = AKSCHLEUDER;
            } else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BAUMGROSS) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= HAUS1) &&
                    (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= HAUS3)))
                PapierText = DrawText(messages.BAUMZUGROSS, TXTPAPIER, 1);
            else PapierText = DrawText(messages.KEINVOGEL, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSCHATZKARTE].rcDes)) &&
        (HauptMenue === MEAKTION) && (Bmp[BUTTSCHATZKARTE].Phase !== -1)) {
        DrawText(messages.BEGINNSCHATZKARTE, TXTTEXTFELD, 2);
        Bmp[BUTTSCHATZKARTE].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            DrawSchatzkarte();
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTFELD].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTFELD].Phase !== -1)) {
        StdString = LoadString("BEGINNFELD");
        MakeRohString(-1, -1, FELD);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTFELD].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Art === 4)) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKFELD;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) && (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === FELD)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKFELD;
            } else PapierText = DrawText(messages.FELDBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTZELT].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTZELT].Phase !== -1)) {
        StdString = LoadString("BEGINNZELT");
        MakeRohString(-1, -1, ZELT);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTZELT].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Art !== -1)) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKZELT;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKZELT;
            } else PapierText = DrawText(messages.ZELTBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTBOOT].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTBOOT].Phase !== -1)) {
        StdString = LoadString("BEGINNBOOT");
        MakeRohString(-1, -1, BOOT);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTBOOT].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Art === 2) &&
                ((Scape[Guy.Pos.x - 1][Guy.Pos.y].Art === 1) ||
                    (Scape[Guy.Pos.x][Guy.Pos.y - 1].Art === 1) ||
                    (Scape[Guy.Pos.x + 1][Guy.Pos.y].Art === 1) ||
                    (Scape[Guy.Pos.x][Guy.Pos.y + 1].Art === 1))) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKBOOT;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BOOT)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKBOOT;
            } else PapierText = DrawText(messages.BOOTBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTROHR].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTROHR].Phase !== -1)) {
        StdString = LoadString("BEGINNROHR");
        MakeRohString(-1, -1, ROHR);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTROHR].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0)) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKROHR;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ROHR)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKROHR;
            } else PapierText = DrawText(messages.ROHRBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTSOS].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTSOS].Phase !== -1)) {
        StdString = LoadString("BEGINNSOS");
        MakeRohString(-1, -1, SOS);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTSOS].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0)) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKSOS;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === SOS)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKSOS;
            } else PapierText = DrawText(messages.SOSBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTHAUS1].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTHAUS1].Phase !== -1)) {
        StdString = LoadString("BEGINNHAUS1");
        MakeRohString(-1, -1, HAUS1);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTHAUS1].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4))
                PapierText = DrawText(messages.BAUMZUKLEIN, TXTPAPIER, 1);
            else if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BAUMGROSS) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKHAUS1;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS1)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKHAUS1;
            } else PapierText = DrawText(messages.GEGENDNICHT, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTHAUS2].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTHAUS2].Phase !== -1)) {
        StdString = LoadString("BEGINNHAUS2");
        MakeRohString(-1, -1, HAUS2);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTHAUS2].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4))
                PapierText = DrawText(messages.BAUMZUKLEIN, TXTPAPIER, 1);
            else if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BAUMGROSS)
                PapierText = DrawText(messages.NICHTOHNELEITER, TXTPAPIER, 1);
            else if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS1) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKHAUS2;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS2)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKHAUS2;
            } else PapierText = DrawText(messages.GEGENDNICHT, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTHAUS3].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTHAUS3].Phase !== -1)) {
        StdString = LoadString("BEGINNHAUS3");
        MakeRohString(-1, -1, HAUS3);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTHAUS3].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4))
                PapierText = DrawText(messages.BAUMZUKLEIN, TXTPAPIER, 1);
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BAUMGROSS) ||
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS1))
                PapierText = DrawText(messages.NICHTOHNEPLATTFORM, TXTPAPIER, 1);
            else if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS2) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKHAUS3;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKHAUS3;
            } else PapierText = DrawText(messages.GEGENDNICHT, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTFEUERST].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTFEUERST].Phase !== -1)) {
        StdString = LoadString("BEGINNFEUERSTELLE");
        MakeRohString(-1, -1, FEUERSTELLE);
        StdString += RohString;
        TextBereich[TXTTEXTFELD].Aktiv = true;
        DrawString(StdString, TextBereich[TXTTEXTFELD].rcText.left,
            TextBereich[TXTTEXTFELD].rcText.top, 2);

        Bmp[BUTTFEUERST].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Typ === 0)) {
                Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
                Bmp[BUTTSTOP].Phase = 0;
                Guy.Aktion = AKFEUERSTELLE;
            } else if ((Bmp[BUTTWEITER].Phase !== -1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === FEUERSTELLE)) {
                Bmp[BUTTSTOP].Phase = 0;
                Guy.PosAlt = Guy.PosScreen;
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x,
                    Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y);
                Guy.Aktion = AKFEUERSTELLE;
            } else PapierText = DrawText(messages.FEUERSTELLENBEDINGUNGEN, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[BUTTDESTROY].rcDes)) &&
        (HauptMenue === MEBAUEN) && (Bmp[BUTTDESTROY].Phase !== -1)) {
        DrawText(messages.BEGINNDESTROY, TXTTEXTFELD, 2);
        Bmp[BUTTDESTROY].Animation = true;
        if ((Button === 0) && (Push === 1)) {
            PlaySound(WAVKLICK2, 100);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= FELD) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= FEUERSTELLE)) {
                Guy.AkNummer = 0;
                Guy.Aktion = AKDESTROY;
            } else PapierText = DrawText(messages.KEINBAUWERK, TXTPAPIER, 1);
        }
    } else if ((InRect(MousePosition.x, MousePosition.y, Bmp[INVPAPIER].rcDes)) && (HauptMenue === MEINVENTAR)) {
        for (let i = ROHAST; i <= ROHSCHLEUDER; i++) {
            if (InRect(MousePosition.x, MousePosition.y, Bmp[i].rcDes) && (Guy.Inventar[i] > 0)) {
                if ((Button === 0) && (Push === 1)) {
                    if (TwoClicks === -1) {
                        set_cursor(i);
                        TwoClicks = i;
                    } else CheckBenutze(i);
                }
                switch (i) {
                    case ROHAST:
                        DrawText(messages.AST, TXTTEXTFELD, 2);
                        break;
                    case ROHSTEIN:
                        DrawText(messages.STEIN, TXTTEXTFELD, 2);
                        break;
                    case ROHAXT:
                        DrawText(messages.AXT, TXTTEXTFELD, 2);
                        break;
                    case ROHBLATT:
                        DrawText(messages.BLATT, TXTTEXTFELD, 2);
                        break;
                    case ROHSTAMM:
                        DrawText(messages.STAMM, TXTTEXTFELD, 2);
                        break;
                    case ROHEGGE:
                        DrawText(messages.EGGE, TXTTEXTFELD, 2);
                        break;
                    case ROHLIANE:
                        DrawText(messages.LIANE, TXTTEXTFELD, 2);
                        break;
                    case ROHANGEL:
                        DrawText(messages.ANGEL, TXTTEXTFELD, 2);
                        break;
                    case ROHHAMMER:
                        DrawText(messages.HAMMER, TXTTEXTFELD, 2);
                        break;
                    case ROHFERNROHR:
                        DrawText(messages.FERNROHR, TXTTEXTFELD, 2);
                        break;
                    case ROHSTREICHHOLZ:
                        DrawText(messages.STREICHHOLZ, TXTTEXTFELD, 2);
                        break;
                    case ROHSCHAUFEL:
                        DrawText(messages.SCHAUFEL, TXTTEXTFELD, 2);
                        break;
                    case ROHKARTE:
                        DrawText(messages.KARTE, TXTTEXTFELD, 2);
                        break;
                    case ROHSCHLEUDER:
                        DrawText(messages.SCHLEUDER, TXTTEXTFELD, 2);
                        break;
                }

                break;
            }
        }
    } else if (InRect(MousePosition.x, MousePosition.y, TextBereich[TXTTAGESZEIT].rcText))
        DrawText(messages.SOSPAET, TXTTEXTFELD, 2);
    else if (InRect(MousePosition.x, MousePosition.y, TextBereich[TXTCHANCE].rcText))
        DrawText(messages.CHANCETEXT, TXTTEXTFELD, 2);
    else //TwoClicks löschen
    {
        if ((Button === 0) && (Push === 1)) PlaySound(WAVKLICK, 100);
        TwoClicks = -1;
    }
}

function InDreieck(X, Y, X0, Y0, X1, Y1, X3, Y3)
{
    let x = X;
    let y = Y;
    let x0 = X0;
    let y0 = Y0;
    let x1 = X1;
    let y1 = Y1;
    let x3 = X3;
    let y3 = Y3;

    let c = (x - x1) / (x0 - x1);
    if (c < 0) return false;
    let d = ((y - y3) * (x0 - x1) - (x - x1) * (y0 - y3)) / ((y1 - y3) * (x0 - x1));
    if (d < 0) return false;
    let b = ((y - y0) * (x1 - x0) - (x - x0) * (y1 - y0)) / ((x1 - x0) * (y3 - y1));
    if (b < 0) return false;
    let a = (x - x0) / (x1 - x0) - b;
    if (a < 0) return false;
    return true;
}

function InRect(x, y, rcRect)
{
    return (x <= rcRect.right) && (x >= rcRect.left) &&
        (y <= rcRect.bottom) && (y >= rcRect.top);
}

function PutPixel(x, y, color, dest)
{
    x = x | 0;
    y = y | 0;
    let offset = 4 * (x + y * dest.width);
    dest.data.data[offset] = color[0];
    dest.data.data[offset + 1] = color[1];
    dest.data.data[offset + 2] = color[2];
    dest.data.data[offset + 3] = 255;
}

function lock_canvas(src)
{
    src.data = src.ctx.getImageData(0, 0, src.width, src.height);
}

function upload_canvas(src)
{
    src.ctx.putImageData(src.data, 0, 0)
}

function GetPixel(x, y, src)
{
    x = x | 0;
    y = y | 0;
    let offset = 4 * (x + y * src.width);
    return src.data.data.slice(offset, offset + 4);
}

function fill_dest(color, dest = null)
{
    if (dest === null) dest = lpDDSBack;
    dest.ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    dest.ctx.fillRect(
        rcRectdes.left | 0,
        rcRectdes.top | 0,
        (rcRectdes.right - rcRectdes.left) | 0,
        (rcRectdes.bottom - rcRectdes.top) | 0,
    );
}

function clear_dest(dest = null)
{
    if (dest === null) dest = lpDDSBack;
    dest.ctx.clearRect(
        rcRectdes.left | 0,
        rcRectdes.top | 0,
        (rcRectdes.right - rcRectdes.left) | 0,
        (rcRectdes.bottom - rcRectdes.top) | 0,
    );
}

function NeuesSpiel(neu)
{
    console.log("NeuesSpiel");
    let LoadOK = false;

    InitStructs();

    if (!neu) LoadOK = LoadGame();

    if ((!LoadOK) || (neu)) {
        //Für die Statusanzeige
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        fill_dest([70, 70, 100]);
        //fill_dest([255, 0, 255]);
        clear_dest(lpDDSScape);

        //Landschaft erzeugen

        DrawString("Erschaffe Landschaft...", 5, 5, 2);
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        Blit_destrect(lpDDSSchrift, lpDDSPrimary);
        Compute(200, 600);

        DrawString("Ueberflute Land...", 5, 35, 2);
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        Blit_destrect(lpDDSSchrift, lpDDSPrimary);
        Meer();

        DrawString("Lege Fluss fest...", 5, 65, 2);
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        Blit_destrect(lpDDSSchrift, lpDDSPrimary);
        Fluss();
        CalcKoor();

        DrawString("Pflanze Baeume...", 5, 95, 2);
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        Blit_destrect(lpDDSSchrift, lpDDSPrimary);
        Baeume(30);

        Piratenwrack();

        //Guy Position
        Guy.Pos.x = 1;
        Guy.Pos.y = floor(MAXYKACH / 2);
        Guy.PosScreen.x = floor(
            (Scape[Guy.Pos.x][Guy.Pos.y].xScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) / 2
        );
        Guy.PosScreen.y = floor(
            (Scape[Guy.Pos.x][Guy.Pos.y].yScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen + EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) / 2
        );

        Camera.x = Guy.PosScreen.x - floor(rcGesamt.right / 2);
        Camera.y = Guy.PosScreen.y - floor(rcGesamt.bottom / 2);

        Chance = 0;

        BootsFahrt = false;
        if (!BootsFahrt) ChangeBootsFahrt();

        Tag = 1;
        Stunden = 0;
        Minuten = 0;

        Spielzustand = SZINTRO;
        Guy.Aktiv = false;
        Guy.Zustand = GUYSCHIFF;
        Guy.AkNummer = 0;
        Guy.Aktion = AKINTRO;
    }

    //SchriftSurface löschen
    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = MAXX;
    rcRectdes.bottom = MAXY;
    // fill_dest([255, 0, 255], lpDDSSchrift);
    clear_dest(lpDDSSchrift);

    let Anitmp = LAnimation;
    let Entdeckttmp = Array.from(Array(MAXXKACH), x => Array(MAXYKACH));

    LAnimation = false;
    //Schatzvergraben und Schatzkarte malen
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            Entdeckttmp[x][y] = Scape[x][y].Entdeckt;
            Scape[x][y].Entdeckt = true;
        }
    }
    Generate();//Einmal vor dem Schatz schon entdeckt malen
    Schatz();
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            Scape[x][y].Entdeckt = Entdeckttmp[x][y];
        }
    }
    Entdecken();
    LAnimation = Anitmp;
    Generate(); //Und nochmal ohne das die Gegend entdeckt ist
    Guy.PosAlt = Guy.PosScreen;
    console.log("NeuesSpiel...done");
}

function Generate()
{
    //Die Kartehintergrundfarbe
    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = 2 * MAXXKACH;
    rcRectdes.bottom = 2 * MAXYKACH;
    fill_dest([247, 222, 191], lpDDSKarte);

    //Die Landschaftshintergrundfarbe
    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = MAXSCAPEX;
    rcRectdes.bottom = MAXSCAPEY;
    fill_dest([0, 0, 0], lpDDSScape);
    //clear_dest(lpDDSScape);

    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            if (!Scape[x][y].Entdeckt) continue; //Nicht entdeckte Felder nicht malen

            rcRectdes.left = Scape[x][y].xScreen;
            rcRectdes.top = Scape[x][y].yScreen;
            rcRectdes.right = rcRectdes.left + KXPIXEL;
            rcRectdes.bottom = rcRectdes.top + KYPIXEL;
            if (Scape[x][y].Art === 4) {
                rcRectsrc.left = KXPIXEL * Scape[x][y].Typ;
                rcRectsrc.right = KXPIXEL * Scape[x][y].Typ + KXPIXEL;
                rcRectsrc.top = 0;
                rcRectsrc.bottom = KYPIXEL;
            } else if (Scape[x][y].Art === 0) //trockenes Land
            {
                rcRectsrc.left = KXPIXEL * Scape[x][y].Typ;
                rcRectsrc.right = KXPIXEL * Scape[x][y].Typ + KXPIXEL;
                rcRectsrc.top = 4 * KYPIXEL;
                rcRectsrc.bottom = 5 * KYPIXEL;
            } else {
                if ((Scape[x][y].Typ === 0) && (Scape[x][y].Art === 1)) {
                    rcRectsrc.left = 0 * KXPIXEL;
                    rcRectsrc.top = 3 * KYPIXEL;
                    rcRectsrc.right = 1 * KXPIXEL;
                    rcRectsrc.bottom = 4 * KYPIXEL;
                }
                if ((Scape[x][y].Typ === 0) && (Scape[x][y].Art === 2)) {
                    rcRectsrc.left = 1 * KXPIXEL;
                    rcRectsrc.top = 3 * KYPIXEL;
                    rcRectsrc.right = 2 * KXPIXEL;
                    rcRectsrc.bottom = 4 * KYPIXEL;
                }
                if ((Scape[x][y].Typ === 0) && (Scape[x][y].Art === 3)) {
                    rcRectsrc.left = 2 * KXPIXEL;
                    rcRectsrc.top = 3 * KYPIXEL;
                    rcRectsrc.right = 3 * KXPIXEL;
                    rcRectsrc.bottom = 4 * KYPIXEL;
                }
            }
            //Landschaftskacheln zeichnen
            Blitten(lpDDSMisc, lpDDSScape, true);

            //Gitter drüberlegen
            if (Gitter) {
                rcRectsrc.left = KXPIXEL * Scape[x][y].Typ;
                rcRectsrc.right = KXPIXEL * Scape[x][y].Typ + KXPIXEL;
                rcRectsrc.top = 1 * KYPIXEL;
                rcRectsrc.bottom = 1 * KYPIXEL + KYPIXEL;
                Blitten(lpDDSMisc, lpDDSScape, true);
            }

            //Landschaftsobjekte zeichnen (falls Animationen ausgeschaltet sind)
            if ((!LAnimation) && (Scape[x][y].Objekt !== -1)) {
                if ((Scape[x][y].Objekt >= MEERWELLEN) && (Scape[x][y].Objekt <= SCHLEUSE6)) {
                    rcRectsrc.left = Bmp[Scape[x][y].Objekt].rcSrc.left;
                    rcRectsrc.right = Bmp[Scape[x][y].Objekt].rcSrc.right;
                    if (Scape[x][y].Objekt === MEERWELLEN) {
                        i = rand() % 6;
                        rcRectsrc.top = Bmp[Scape[x][y].Objekt].rcSrc.top + i * Bmp[Scape[x][y].Objekt].Hoehe;
                        rcRectsrc.bottom = Bmp[Scape[x][y].Objekt].rcSrc.bottom + i * Bmp[Scape[x][y].Objekt].Hoehe;
                    } else {
                        rcRectsrc.top = Bmp[Scape[x][y].Objekt].rcSrc.top;
                        rcRectsrc.bottom = Bmp[Scape[x][y].Objekt].rcSrc.bottom;
                    }
                    rcRectdes.left = Scape[x][y].xScreen + Bmp[Scape[x][y].Objekt].rcDes.left;
                    rcRectdes.right = Scape[x][y].xScreen + Bmp[Scape[x][y].Objekt].rcDes.right;
                    rcRectdes.top = Scape[x][y].yScreen + Bmp[Scape[x][y].Objekt].rcDes.top;
                    rcRectdes.bottom = Scape[x][y].yScreen + Bmp[Scape[x][y].Objekt].rcDes.bottom;
                    //Landschaftsobjekt zeichnen
                    Blitten(lpDDSAnimation, lpDDSScape, true);
                }
            }

            //MiniMap zeichnen
            rcRectdes.left = 2 * x;
            rcRectdes.top = 2 * y;
            rcRectdes.right = rcRectdes.left + 2;
            rcRectdes.bottom = rcRectdes.top + 2;

            if ((Scape[x][y].Art === 1) && (Scape[x][y].Typ === 0))	//Meer
                fill_dest([228, 207, 182], lpDDSKarte);
            else {
                if ((Scape[x][y].Typ === 0) &&
                    ((Scape[x][y].Art === 2) ||
                        (Scape[x][y].Art === 3)))	//Strand
                    fill_dest([112, 103, 93], lpDDSKarte);
                else
                    //Land
                    fill_dest([
                            139 + Scape[x][y].Hoehe * 20,
                            128 + Scape[x][y].Hoehe * 20,
                            115 + Scape[x][y].Hoehe * 20],
                        lpDDSKarte);
            }
        }
    }
}

function Zeige()
{
    rcRectsrc.left = Camera.x + rcSpielflaeche.left;
    rcRectsrc.top = Camera.y + rcSpielflaeche.top;
    rcRectsrc.right = Camera.x + rcSpielflaeche.right;
    rcRectsrc.bottom = Camera.y + rcSpielflaeche.bottom;
    rcRectdes.left = rcSpielflaeche.left;
    rcRectdes.top = rcSpielflaeche.top;
    rcRectdes.right = rcSpielflaeche.right;
    rcRectdes.bottom = rcSpielflaeche.bottom;

    Blitten(lpDDSScape, lpDDSBack, false); //Landschaft zeichnen

    ZeichneObjekte();

    ZeichnePanel();

    //Die TagesZeit ausgeben
    Textloeschen(TXTTAGESZEIT);
    TextBereich[TXTTAGESZEIT].Aktiv = true;
    let Stringsave1 = "" + (Stunden + 6);
    let Stringsave2 = "" + Minuten;
    StdString = "";
    if (Stunden + 6 < 10) StdString += "0";
    StdString += Stringsave1;
    StdString += ":";
    if (Minuten < 10) StdString += "0";
    StdString += Stringsave2;
    DrawString(
        StdString,
        (TextBereich[TXTTAGESZEIT].rcText.left),
        (TextBereich[TXTTAGESZEIT].rcText.top),
        2
    );

    if (PapierText !== -1) ZeichnePapier();

    //Die Textsurface blitten
    for (let i = 0; i < TEXTANZ; i++) {
        if (!TextBereich[i].Aktiv) continue; //Die nicht aktiven Felder auslassen
        copy_rect(rcRectsrc, TextBereich[i].rcText);
        copy_rect(rcRectdes, TextBereich[i].rcText);
        Blitten(lpDDSSchrift, lpDDSBack, true);
    }
    //Alles schwarz übermalen und nur das Papier mit Text anzeigen
    if (Nacht) {
        rcRectdes.left = 0;
        rcRectdes.top = 0;
        rcRectdes.right = MAXX;
        rcRectdes.bottom = MAXY;
        fill_dest([0, 0, 0], lpDDSBack);

        if (PapierText !== -1) {
            ZeichnePapier();
            copy_rect(rcRectsrc, TextBereich[TXTPAPIER].rcText);
            copy_rect(rcRectdes, TextBereich[TXTPAPIER].rcText);
            Blitten(lpDDSSchrift, lpDDSBack, true);
        }
        Fade(100, 100, 100);
    }

    /*
    //Cursor
    if (CursorTyp === CUPFEIL)
        ZeichneBilder(
            MousePosition.x, MousePosition.y,
            CursorTyp, rcGesamt, false, -1
        );
    else
        ZeichneBilder(
            MousePosition.x - Bmp[CursorTyp].Breite / 2,
            MousePosition.y - Bmp[CursorTyp].Hoehe / 2,
            CursorTyp, rcGesamt, false, -1
        );

    TODO: maybe draw resource cursor image
    */
    if(LastCursorType !== CursorTyp) {
        switch (CursorTyp) {
            case CUPFEIL:
                canvas.style.cursor = "url(gfx/cursor1.png) 0 0, default";
                break;
            case CUUHR:
                canvas.style.cursor = "url(gfx/cursor3.png) 9 9, default";
                break;
            case CURICHTUNG:
                canvas.style.cursor = "url(gfx/cursor2.png) 9 9, default";
                break;
            default:
                // other images
                break;
        }
        LastCursorType = CursorTyp;
    }

    if (Nacht) Fade(100, 100, 100); //Das muss hier stehen, damit man die Textnachricht in der Nacht lesen kann
}

function ZeigeIntro()
{
    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = MAXX;
    rcRectdes.bottom = MAXY;
    fill_dest([0, 0, 0], lpDDSBack);

    rcRectsrc.left = Camera.x + rcSpielflaeche.left;
    rcRectsrc.top = Camera.y + rcSpielflaeche.top;
    rcRectsrc.right = Camera.x + rcSpielflaeche.right;
    rcRectsrc.bottom = Camera.y + rcSpielflaeche.bottom;
    rcRectdes.left = rcSpielflaeche.left;
    rcRectdes.top = rcSpielflaeche.top;
    rcRectdes.right = rcSpielflaeche.right;
    rcRectdes.bottom = rcSpielflaeche.bottom;

    Blitten(lpDDSScape, lpDDSBack, false); //Landschaft zeichnen

    ZeichneObjekte();

    if (PapierText !== -1) ZeichnePapier();

    //Die Textsurface blitten
    for (let i = 0; i < TEXTANZ; i++) {
        if (!TextBereich[i].Aktiv) continue; //Die nicht aktiven Felder auslassen
        copy_rect(rcRectsrc, TextBereich[i].rcText);
        copy_rect(rcRectdes, TextBereich[i].rcText);
        Blitten(lpDDSSchrift, lpDDSBack, true);
    }
}

function ZeigeAbspann()
{
    PlaySound(WAVABSPANN, 100);

    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = MAXX;
    rcRectdes.bottom = MAXY;
    fill_dest([0, 0, 0], lpDDSBack);

    if (AbspannZustand === 0) {
        ZeichneBilder(
            floor(MAXX / 2 - Bmp[AbspannListe[AbspannNr][0].Bild].Breite / 2),
            100,
            AbspannListe[AbspannNr][0].Bild,
            rcGesamt,
            false,
            -1
        );
        for (let z = 1; z < 10; z++) {
            if (AbspannListe[AbspannNr][z].Aktiv)
                AbspannBlt(
                    AbspannListe[AbspannNr][z].Bild,
                    (100 * Math.sin(pi / MAXY * (Bmp[AbspannListe[AbspannNr][z].Bild].rcDes.top +
                        Bmp[+AbspannListe[AbspannNr][z].Aktiv].Hoehe / 2)))
                );
        }
    } else if (AbspannZustand === 1) {
        copy_rect(rcRectsrc, Bmp[AbspannNr].rcSrc);
        rcRectsrc.top += Bmp[AbspannNr].Phase * Bmp[AbspannNr].Hoehe;
        rcRectsrc.bottom = rcRectsrc.top + Bmp[AbspannNr].Hoehe;

        rcRectdes.left = 2;
        rcRectdes.top = 2;
        rcRectdes.right = Bmp[AbspannNr].Breite + 2;
        rcRectdes.bottom = Bmp[AbspannNr].Hoehe + 2;

        Blitten(Bmp[AbspannNr].Surface, lpDDSBack, true);

        rcRectsrc.left = 0;
        rcRectsrc.top = 0;
        rcRectsrc.right = Bmp[AbspannNr].Breite + 4;
        rcRectsrc.bottom = Bmp[AbspannNr].Hoehe + 4;

        rcRectdes.left = floor(MAXX / 2 - rcRectsrc.right * 10 / 2);
        rcRectdes.top = floor(MAXY / 2 - rcRectsrc.bottom * 10 / 2);
        rcRectdes.right = rcRectdes.left + rcRectsrc.right * 10;
        rcRectdes.bottom = rcRectdes.top + rcRectsrc.bottom * 10;

        Blitten(lpDDSBack, lpDDSBack, false);

        rcRectsrc.left = 100;
        rcRectsrc.top = 2;
        rcRectsrc.right = 100 + Bmp[AbspannNr].Breite + 2;
        rcRectsrc.bottom = Bmp[AbspannNr].Hoehe + 2;

        rcRectdes.left = 2;
        rcRectdes.top = 2;
        rcRectdes.right = Bmp[AbspannNr].Breite + 2;
        rcRectdes.bottom = Bmp[AbspannNr].Hoehe + 2;

        Blitten(lpDDSBack, lpDDSBack, false);
    }
}

function ZeigeLogo()
{
    rcRectdes.left = 0;
    rcRectdes.top = 0;
    rcRectdes.right = MAXX;
    rcRectdes.bottom = MAXY;
    fill_dest([0, 0, 0], lpDDSBack);

    rcRectsrc.left = 0;
    rcRectsrc.right = 500;
    rcRectsrc.top = 0;
    rcRectsrc.bottom = 500;
    rcRectdes.left = Math.floor(MAXX / 2) - 250;
    rcRectdes.right = Math.floor(MAXX / 2) + 250;
    rcRectdes.top = Math.floor(MAXY / 2) - 250;
    rcRectdes.bottom = Math.floor(MAXY / 2) + 250;


    Blitten(lpDDSLogo, lpDDSBack, false);

    PlaySound(WAVLOGO, 100);
}

function AbspannBlt(Bild, Prozent)
{
    ctx.globalAlpha = Prozent / 100;
    copy_rect(rcRectdes, Bmp[Bild].rcDes);
    rcRectdes.right = rcRectdes.left + Bmp[Bild].Breite;
    rcRectdes.bottom = rcRectdes.top + Bmp[Bild].Hoehe;
    copy_rect(rcRectsrc,  Bmp[Bild].rcSrc);
    Blitten(Bmp[Bild].Surface, lpDDSBack, false);
    ctx.globalAlpha = 1;
}

function AbspannCalc()
{
    if (AbspannZustand === 0) {
        for (let k = 1; k < 10; k++) {
            if (AbspannListe[AbspannNr][k].Bild === -1) break;
            if (!AbspannListe[AbspannNr][k].Aktiv) continue;
            let i = 150 / LastBild;
            Bmp[AbspannListe[AbspannNr][k].Bild].rcDes.top -= i;

            if (Bmp[AbspannListe[AbspannNr][k].Bild].rcDes.top < MAXY - 400) {
                if ((!AbspannListe[AbspannNr][k + 1].Aktiv) &&
                    (AbspannListe[AbspannNr][k + 1].Bild !== -1))
                    AbspannListe[AbspannNr][k + 1].Aktiv = true;
            }
            if (Bmp[AbspannListe[AbspannNr][k].Bild].rcDes.top < 0) {
                AbspannListe[AbspannNr][k].Aktiv = false;
                Bmp[AbspannListe[AbspannNr][k].Bild].rcDes.top = floor(MAXY - Bmp[AbspannListe[AbspannNr][k].Bild].Hoehe / 2);
                if (!AbspannListe[AbspannNr][k + 1].Aktiv) {
                    if (AbspannListe[AbspannNr + 1][0].Bild !== -1) {
                        AbspannNr++;
                        AbspannListe[AbspannNr][1].Aktiv = true;
                    } else {
                        AbspannNr = GUYLINKS;
                        AbspannZustand = 1;
                    }
                }
            }
        }
    } else if (AbspannZustand === 1) {
        let i = LastBild / Bmp[AbspannNr].Geschwindigkeit;
        if (i < 1) i = 1;
        if (Bild % i === 0) {
            Bmp[AbspannNr].Phase++;
            if (Bmp[AbspannNr].Phase >= Bmp[AbspannNr].Anzahl) {
                Bmp[AbspannNr].Phase = 0;
                AbspannNr++;
                if (AbspannNr > GUYSCHLEUDER) AbspannNr = GUYLINKS;
            }
        }
    }
}

function ZeichneBilder(x, y, i, Ziel, Reverse, Frucht)
{
    let Phase;

    if (Frucht === -1) Phase = floor(Bmp[i].Phase); else Phase = floor(Frucht);
    copy_rect(rcRectsrc, Bmp[i].rcSrc);
    if (!Reverse) {
        rcRectsrc.top += floor(Phase * (Bmp[i].Hoehe));
    } else {
        rcRectsrc.top = floor(
            Bmp[i].rcSrc.top + (Bmp[i].Anzahl - 1) * Bmp[i].Hoehe - Phase * Bmp[i].Hoehe
        );
    }
    rcRectsrc.bottom = rcRectsrc.top + (Bmp[i].Hoehe);
    rcRectdes.left = x;
    rcRectdes.top = y;
    rcRectdes.right = x + (Bmp[i].Breite);
    rcRectdes.bottom = y + (Bmp[i].Hoehe);
    CalcRect(Ziel);
    Blitten(Bmp[i].Surface, lpDDSBack, true);
}

function ZeichneObjekte()
{
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            let Guyzeichnen = false;
            if ((Guy.Pos.x === x) && (Guy.Pos.y === y)) Guyzeichnen = true;
            //Die nichtsichbaren Kacheln (oder nicht betroffenen) ausfiltern

            if (!((Scape[x][y].xScreen > Camera.x + rcSpielflaeche.left - KXPIXEL) &&
                (Scape[x][y].xScreen < Camera.x + rcSpielflaeche.right + KXPIXEL) &&
                (Scape[x][y].yScreen > Camera.y + rcSpielflaeche.top - KYPIXEL) &&
                (Scape[x][y].yScreen < Camera.y + rcSpielflaeche.bottom + KYPIXEL) &&
                (Scape[x][y].Entdeckt) &&
                ((Scape[x][y].Markiert) || (Scape[x][y].Objekt !== -1) || (Guyzeichnen)))) continue;

            if (Scape[x][y].Markiert) //Die Rahmen um die markierten Kacheln malen
            {
                rcRectsrc.left = KXPIXEL * Scape[x][y].Typ;
                rcRectsrc.right = KXPIXEL * Scape[x][y].Typ + KXPIXEL;
                rcRectsrc.top = 2 * KYPIXEL;
                rcRectsrc.bottom = 3 * KYPIXEL;
                rcRectdes.left = Scape[x][y].xScreen - Camera.x;
                rcRectdes.right = rcRectdes.left + KXPIXEL;
                rcRectdes.top = Scape[x][y].yScreen - Camera.y;
                rcRectdes.bottom = rcRectdes.top + KYPIXEL;
                CalcRect(rcSpielflaeche);
                Blitten(lpDDSMisc, lpDDSBack, true);
            }
            //Landschaftsanimationen malen (und Feld)
            if ((Scape[x][y].Objekt !== -1) && (LAnimation) &&
                ((Scape[x][y].Objekt <= SCHLEUSE6))
                || (Scape[x][y].Objekt === FELD)   //Der Guy ist immer vor diesen Objekten
                || (Scape[x][y].Objekt === ROHR)
                || (Scape[x][y].Objekt === SOS)) {
                //Sound abspielen
                if (((Guy.Pos.x - 1 <= x) && (x <= Guy.Pos.x + 1)) &&
                    ((Guy.Pos.y - 1 <= y) && (y <= Guy.Pos.y + 1))) {
                    let guy_pos_obj = Scape[Guy.Pos.x][Guy.Pos.y].Objekt;

                    if ((x === Guy.Pos.x) && (y === Guy.Pos.y))
                        PlaySound(Bmp[Scape[x][y].Objekt].Sound, 100);
                    else if (guy_pos_obj > -1 && Bmp[Scape[x][y].Objekt].Sound !== Bmp[guy_pos_obj].Sound)
                        PlaySound(Bmp[Scape[x][y].Objekt].Sound, 90);
                }

                ZeichneBilder(Scape[x][y].xScreen + Scape[x][y].ObPos.x - Camera.x,
                    Scape[x][y].yScreen + Scape[x][y].ObPos.y - Camera.y,
                    Scape[x][y].Objekt, rcSpielflaeche, Scape[x][y].Reverse,
                    Scape[x][y].Phase);
            }
            else {

                if (((Scape[x][y].Objekt >= BAUM1) && (Scape[x][y].Objekt <= BAUM4DOWN)) ||
                    (Scape[x][y].Objekt === BAUMGROSS) || (Scape[x][y].Objekt === FEUER) ||
                    (Scape[x][y].Objekt === WRACK) || (Scape[x][y].Objekt === WRACK2) ||
                    (Scape[x][y].Objekt >= ZELT)) //Bäume und Früchte (und alle anderen Objekte) malen
                {
                    //Sound abspielen
                    let Obj = Scape[x][y].Objekt;
                    let GuyObj = Scape[Guy.Pos.x][Guy.Pos.y].Objekt;
                    if (Obj !== -1 && GuyObj !== -1 &&
                        ((Guy.Pos.x - 1 <= x) && (x <= Guy.Pos.x + 1)) &&
                        ((Guy.Pos.y - 1 <= y) && (y <= Guy.Pos.y + 1))) {
                        if ((x === Guy.Pos.x) && (y === Guy.Pos.y))
                            PlaySound(Bmp[Obj].Sound, 100);
                        else if (Bmp[Obj].Sound !== Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Sound)
                            PlaySound(Bmp[Obj].Sound, 90);
                    }
                    if (Guyzeichnen) {
                        if ((Guy.PosScreen.y) < (Scape[x][y].yScreen + Scape[x][y].ObPos.y
                            + Bmp[Scape[x][y].Objekt].Hoehe)) {
                            ZeichneGuy();
                            Guyzeichnen = false;
                        }
                    }

                    ZeichneBilder(Scape[x][y].xScreen + Scape[x][y].ObPos.x - Camera.x,
                        Scape[x][y].yScreen + Scape[x][y].ObPos.y - Camera.y,
                        Scape[x][y].Objekt, rcSpielflaeche, false,
                        Scape[x][y].Phase);
                }
            }
            if (Guyzeichnen) ZeichneGuy();
        }
    }
}

function ZeichneGuy()
{
    if (BootsFahrt) {
        if (Guy.Zustand === GUYSCHIFF) {
            ZeichneBilder(Guy.PosScreen.x - 30 - Camera.x,
                Guy.PosScreen.y - 28 - Camera.y,
                Guy.Zustand, rcSpielflaeche, false, -1);
        } else {
            ZeichneBilder(Guy.PosScreen.x - (Bmp[Guy.Zustand].Breite) / 2 - Camera.x,
                Guy.PosScreen.y - (Bmp[Guy.Zustand].Hoehe) / 2 - Camera.y,
                Guy.Zustand, rcSpielflaeche, false, -1);
        }
    } else ZeichneBilder(Guy.PosScreen.x - (Bmp[Guy.Zustand].Breite) / 2 - Camera.x,
        Guy.PosScreen.y - (Bmp[Guy.Zustand].Hoehe) - Camera.y,
        Guy.Zustand, rcSpielflaeche, false, -1);
    //Sound abspielen
    if (Guy.Aktiv) PlaySound(Bmp[Guy.Zustand].Sound, 100);
}

function ZeichnePapier()
{
    rcRectsrc.left = 0;
    rcRectsrc.top = 0;
    rcRectsrc.right = 464;
    rcRectsrc.bottom = 77;
    rcRectdes.left = TextBereich[TXTPAPIER].rcText.left - 60;
    rcRectdes.top = TextBereich[TXTPAPIER].rcText.top - 30;
    rcRectdes.right = rcRectdes.left + 464;
    rcRectdes.bottom = rcRectdes.top + 77;
    Blitten(lpDDSPapier, lpDDSBack, true);
    rcRectdes.left = rcRectdes.left + 34;
    rcRectdes.top = rcRectdes.top + 77;
    rcRectdes.bottom = TextBereich[TXTPAPIER].rcText.top + PapierText;
    fill_dest([236, 215, 179], lpDDSBack);
    rcRectsrc.left = 0;
    rcRectsrc.top = 77;
    rcRectsrc.right = 464;
    rcRectsrc.bottom = 154;
    rcRectdes.left = TextBereich[TXTPAPIER].rcText.left - 60;
    rcRectdes.top = rcRectdes.bottom - 47;
    rcRectdes.right = rcRectdes.left + 464;
    rcRectdes.bottom = rcRectdes.top + 77;
    Blitten(lpDDSPapier, lpDDSBack, true);
}

function ZeichnePanel()
{
    let Ringtmp;	//für die Sonnenanzeige

    //Karte
    rcRectsrc.left = 0;
    rcRectsrc.top = 0;
    rcRectsrc.right = 2 * MAXXKACH;
    rcRectsrc.bottom = 2 * MAXYKACH;
    rcRectdes.left = rcKarte.left;
    rcRectdes.top = rcKarte.top;
    rcRectdes.right = rcKarte.right;
    rcRectdes.bottom = rcKarte.bottom;
    Blitten(lpDDSKarte, lpDDSBack, false);

    //Spielfigur
    rcRectdes.left = rcKarte.left + 2 * Guy.Pos.x;
    rcRectdes.top = rcKarte.top + 2 * Guy.Pos.y;
    rcRectdes.right = rcRectdes.left + 2;
    rcRectdes.bottom = rcRectdes.top + 2;
    fill_dest([255, 0, 0], lpDDSBack);

    //Position einmalen
    rcRectsrc.left = 205;
    rcRectsrc.top = 0;
    rcRectsrc.right = 205 + 65;
    rcRectsrc.bottom = 65;
    rcRectdes.left = rcKarte.left + (Camera.x + 2 * Camera.y) / (KXPIXEL / 2) - MAXXKACH - 2;
    rcRectdes.top = rcKarte.top + (2 * Camera.y - Camera.x) / (KXPIXEL / 2) + MAXYKACH - 21 - 2;
    rcRectdes.right = rcRectdes.left + 65;
    rcRectdes.bottom = rcRectdes.top + 65;
    CalcRect(rcKarte);
    Blitten(lpDDSPanel, lpDDSBack, true);

    //Panel malen
    rcRectsrc.left = 0;
    rcRectsrc.top = 0;
    rcRectsrc.right = 205;
    rcRectsrc.bottom = 600;
    rcRectdes.left = rcPanel.left;
    rcRectdes.top = rcPanel.top;
    rcRectdes.right = rcPanel.right;
    rcRectdes.bottom = rcPanel.bottom;
    Blitten(lpDDSPanel, lpDDSBack, true);

    //Gitternetzknopf
    if (Gitter) Bmp[BUTTGITTER].Phase = 1; else Bmp[BUTTGITTER].Phase = 0;
    ZeichneBilder(Bmp[BUTTGITTER].rcDes.left,
        Bmp[BUTTGITTER].rcDes.top,
        BUTTGITTER, rcPanel, false, -1);

    //SOUNDknopf
    if ((Soundzustand === 0) || (Soundzustand === -1)) Bmp[BUTTSOUND].Phase = 1; else Bmp[BUTTSOUND].Phase = 0;
    ZeichneBilder(Bmp[BUTTSOUND].rcDes.left,
        Bmp[BUTTSOUND].rcDes.top,
        BUTTSOUND, rcPanel, false, -1);

    //ANIMATIONknopf
    if (!LAnimation) Bmp[BUTTANIMATION].Phase = 1; else Bmp[BUTTANIMATION].Phase = 0;
    ZeichneBilder(Bmp[BUTTANIMATION].rcDes.left,
        Bmp[BUTTANIMATION].rcDes.top,
        BUTTANIMATION, rcPanel, false, -1);

    //BEENDENknopf
    ZeichneBilder(Bmp[BUTTBEENDEN].rcDes.left,
        Bmp[BUTTBEENDEN].rcDes.top,
        BUTTBEENDEN, rcPanel, false, -1);

    //NEUknopf
    ZeichneBilder(Bmp[BUTTNEU].rcDes.left,
        Bmp[BUTTNEU].rcDes.top,
        BUTTNEU, rcPanel, false, -1);

    //TAGNEUknopf
    ZeichneBilder(Bmp[BUTTTAGNEU].rcDes.left,
        Bmp[BUTTTAGNEU].rcDes.top,
        BUTTTAGNEU, rcPanel, false, -1);

    //Aktionsknopf
    if (HauptMenue === MEAKTION) Bmp[BUTTAKTION].Phase = Bmp[BUTTAKTION].Anzahl;
    else if (Bmp[BUTTAKTION].Phase === Bmp[BUTTAKTION].Anzahl) Bmp[BUTTAKTION].Phase = 0;
    ZeichneBilder(Bmp[BUTTAKTION].rcDes.left,
        Bmp[BUTTAKTION].rcDes.top,
        BUTTAKTION, rcPanel, false, -1);

    //BauKnopf
    if (HauptMenue === MEBAUEN) Bmp[BUTTBAUEN].Phase = Bmp[BUTTBAUEN].Anzahl;
    else if (Bmp[BUTTBAUEN].Phase === Bmp[BUTTBAUEN].Anzahl) Bmp[BUTTBAUEN].Phase = 0;
    ZeichneBilder(Bmp[BUTTBAUEN].rcDes.left,
        Bmp[BUTTBAUEN].rcDes.top,
        BUTTBAUEN, rcPanel, false, -1);

    //Inventarknopf
    if (HauptMenue === MEINVENTAR) Bmp[BUTTINVENTAR].Phase = Bmp[BUTTINVENTAR].Anzahl;
    else if (Bmp[BUTTINVENTAR].Phase === Bmp[BUTTINVENTAR].Anzahl) Bmp[BUTTINVENTAR].Phase = 0;
    ZeichneBilder(Bmp[BUTTINVENTAR].rcDes.left,
        Bmp[BUTTINVENTAR].rcDes.top,
        BUTTINVENTAR, rcPanel, false, -1);

    //WEITERknopf
    if (Bmp[BUTTWEITER].Phase !== -1) ZeichneBilder(Bmp[BUTTWEITER].rcDes.left,
        Bmp[BUTTWEITER].rcDes.top,
        BUTTWEITER, rcPanel, false, -1);

    //STOPknopf
    if (Bmp[BUTTSTOP].Phase !== -1) ZeichneBilder(Bmp[BUTTSTOP].rcDes.left,
        Bmp[BUTTSTOP].rcDes.top,
        BUTTSTOP, rcPanel, false, -1);

    //ABLEGENknopf
    if (Bmp[BUTTABLEGEN].Phase !== -1) ZeichneBilder(Bmp[BUTTABLEGEN].rcDes.left,
        Bmp[BUTTABLEGEN].rcDes.top,
        BUTTABLEGEN, rcPanel, false, -1);

    //Welches Men� zeichnen?
    switch (HauptMenue) {
        case MEAKTION:
            for (let i = BUTTSUCHEN; i <= BUTTSCHLEUDER; i++) {
                if (Bmp[i].Phase === -1) {
                    ZeichneBilder(Bmp[i].rcDes.left,
                        Bmp[i].rcDes.top,
                        BUTTFRAGEZ, rcPanel, false, -1);
                    continue;
                }
                ZeichneBilder(Bmp[i].rcDes.left,
                    Bmp[i].rcDes.top,
                    i, rcPanel, false, -1);
            }
            break;
        case MEBAUEN:
            for (let i = BUTTZELT; i <= BUTTDESTROY; i++) {
                if (Bmp[i].Phase === -1) {
                    ZeichneBilder(Bmp[i].rcDes.left,
                        Bmp[i].rcDes.top,
                        BUTTFRAGEZ, rcPanel, false, -1);
                    continue;
                }
                ZeichneBilder(Bmp[i].rcDes.left,
                    Bmp[i].rcDes.top,
                    i, rcPanel, false, -1);
            }
            break;
        case MEINVENTAR:
            ZeichneBilder(Bmp[INVPAPIER].rcDes.left,
                Bmp[INVPAPIER].rcDes.top,
                INVPAPIER, rcPanel, false, -1);
            for (let i = ROHAST; i <= ROHSCHLEUDER; i++) {
                if (Guy.Inventar[i] <= 0) continue;
                ZeichneBilder(Bmp[i].rcDes.left,
                    Bmp[i].rcDes.top,
                    i, rcPanel, false, -1);
                Bmp[ROEMISCH1].rcDes.top = Bmp[i].rcDes.top;
                Bmp[ROEMISCH2].rcDes.top = Bmp[i].rcDes.top;
                for (let j = 1; j <= Guy.Inventar[i]; j++) {
                    if (j < 5) {
                        ZeichneBilder(Bmp[i].rcDes.left + 20 + j * 4,
                            Bmp[ROEMISCH1].rcDes.top,
                            ROEMISCH1, rcPanel, false, -1);
                    } else if (j === 5) ZeichneBilder(Bmp[i].rcDes.left + 23,
                        Bmp[ROEMISCH2].rcDes.top,
                        ROEMISCH2, rcPanel, false, -1);
                    else if ((j > 5) && (j < 10)) {
                        ZeichneBilder(Bmp[i].rcDes.left + 20 + j * 4,
                            Bmp[ROEMISCH1].rcDes.top,
                            ROEMISCH1, rcPanel, false, -1);
                    } else if (j === 10)
                        ZeichneBilder(Bmp[i].rcDes.left + 43,
                            Bmp[ROEMISCH2].rcDes.top,
                            ROEMISCH2, rcPanel, false, -1);
                }
            }
            break;

    }

    //Säule1
    i = Bmp[SAEULE1].Hoehe - Guy.Resource[WASSER] * Bmp[SAEULE1].Hoehe / 100;
    copy_rect(rcRectsrc, Bmp[SAEULE1].rcSrc);
    rcRectsrc.top += i;
    copy_rect(rcRectdes, Bmp[SAEULE1].rcDes);
    rcRectdes.top += i;
    Blitten(Bmp[SAEULE1].Surface, lpDDSBack, true);

    //Säule2
    i = Bmp[SAEULE2].Hoehe - Guy.Resource[NAHRUNG] * Bmp[SAEULE2].Hoehe / 100;
    copy_rect(rcRectsrc, Bmp[SAEULE2].rcSrc);
    rcRectsrc.top += i;
    copy_rect(rcRectdes, Bmp[SAEULE2].rcDes);
    rcRectdes.top += i;
    Blitten(Bmp[SAEULE2].Surface, lpDDSBack, true);

    //Säule3
    i = Bmp[SAEULE3].Hoehe - Guy.Resource[GESUNDHEIT] * Bmp[SAEULE3].Hoehe / 100;
    copy_rect(rcRectsrc, Bmp[SAEULE3].rcSrc);
    rcRectsrc.top += i;
    copy_rect(rcRectdes, Bmp[SAEULE3].rcDes);
    rcRectdes.top += i;
    Blitten(Bmp[SAEULE3].Surface, lpDDSBack, true);

    //Sonnenanzeige
    let diffx = (Bmp[SONNE].rcDes.right - Bmp[SONNE].rcDes.left - Bmp[SONNE].Breite) / 2;
    let diffy = Bmp[SONNE].rcDes.bottom - Bmp[SONNE].rcDes.top - Bmp[SONNE].Hoehe / 2;
    let TagesZeit = (Stunden * 10 + Minuten * 10 / 60);

    ZeichneBilder((Bmp[SONNE].rcDes.left + diffx * Math.cos(pi - pi * TagesZeit / 120) + diffx),
        (Bmp[SONNE].rcDes.top + (-diffy * Math.sin(pi - pi * TagesZeit / 120) + diffy)),
        SONNE, Bmp[SONNE].rcDes, false, -1);

    //Rettungsring
    if (Chance < 100) Ringtmp = Math.floor(100 * Math.sin(pi / 200 * Chance));
    else Ringtmp = 100;
    if (Ringtmp > 100) Ringtmp = 100;
    ZeichneBilder((Bmp[RING].rcDes.left),
        (Bmp[RING].rcDes.top + Ringtmp),
        RING, rcPanel, false, -1);

    //Die ChanceZahl ausgeben
    Textloeschen(TXTCHANCE);
    TextBereich[TXTCHANCE].Aktiv = true;
    TextBereich[TXTCHANCE].rcText.top = Bmp[RING].rcDes.top + Ringtmp + Bmp[RING].Hoehe;
    TextBereich[TXTCHANCE].rcText.bottom = TextBereich[TXTCHANCE].rcText.top + S2YPIXEL;
    StdString = "" + Chance.toFixed(1);
    DrawString(StdString, (TextBereich[TXTCHANCE].rcText.left),
        (TextBereich[TXTCHANCE].rcText.top), 2);

    //TextFeld malen
    rcRectsrc.left = 0;
    rcRectsrc.top = 0;
    rcRectsrc.right = 605;
    rcRectsrc.bottom = 20;
    copy_rect(rcRectdes, rcTextFeld1);
    Blitten(lpDDSTextFeld, lpDDSBack, false);
}

function DrawString(string, x, y, Art)
{
    let Breite, Hoehe;

    if (Art === 1) {
        Breite = S1XPIXEL;
        Hoehe = S1YPIXEL;
    } else if (Art === 2) {
        Breite = S2XPIXEL;
        Hoehe = S2YPIXEL;
    }

    // Länge der Schrift ermitteln
    let length = string.length;

    // Alle Zeichen durchgehen
    for (let index = 0; index < length; index++) {
        //Korrekte indexNummer ermitteln
        let ccode = string.charCodeAt(index);
        let cindex = ccode - ' '.charCodeAt(0);

        if ((string[index] >= ' ') && (string[index] <= '/')) {
            rcRectsrc.left = cindex * Breite;
            rcRectsrc.top = 0;
        }
        if ((string[index] >= '0') && (string[index] <= '?')) {
            rcRectsrc.left = (cindex - 16) * Breite;
            rcRectsrc.top = Hoehe;
        }
        if ((string[index] >= '@') && (string[index] <= 'O')) {
            rcRectsrc.left = (cindex - 16 * 2) * Breite;
            rcRectsrc.top = 2 * Hoehe;
        }
        if ((string[index] >= 'P') && (string[index] <= '_')) {
            rcRectsrc.left = (cindex - 16 * 3) * Breite;
            rcRectsrc.top = 3 * Hoehe;
        }
        if ((string[index] > '_') && (string[index] <= 'o')) {
            rcRectsrc.left = (cindex - 16 * 4) * Breite;
            rcRectsrc.top = 4 * Hoehe;
        }
        if ((string[index] >= 'p') && (string[index] <= '~')) {
            rcRectsrc.left = (cindex - 16 * 5) * Breite;
            rcRectsrc.top = 5 * Hoehe;
        }

        rcRectsrc.right = rcRectsrc.left + Breite;
        rcRectsrc.bottom = rcRectsrc.top + Hoehe;
        rcRectdes.left = x;
        rcRectdes.top = y;
        rcRectdes.right = x + Breite;
        rcRectdes.bottom = y + Hoehe;
        //Zeichen zeichnen
        if (Art === 1) {
            Blitten(lpDDSSchrift1, lpDDSSchrift, true);
            //x Position weiterschieben
            x += S1ABSTAND;
        }
        if (Art === 2) {
            Blitten(lpDDSSchrift2, lpDDSSchrift, true);
            //x Position weiterschieben
            x += S2ABSTAND;
        }
    }
}

function DrawText(Text, Bereich, Art)
{
    let BBreite, BHoehe;
    let StdString2;//Zur Variablenausgabe
    let Anzahl; //Zur Variablenausgabe

    Textloeschen(Bereich);
    TextBereich[Bereich].Aktiv = true;

    if (Art === 1) {
        BBreite = S1ABSTAND;
        BHoehe = S1YPIXEL;
    } else if (Art === 2) {
        BBreite = S2ABSTAND;
        BHoehe = S2YPIXEL;
    }
    let Posx = TextBereich[Bereich].rcText.left;
    let Posy = TextBereich[Bereich].rcText.top;
    let Pos = 0;
    let Posnext = 0;

    while (1) {
        StdString = "";
        Pos = Posnext;
        Posnext = Text.indexOf(" ", Pos + 1);
        let Posnext2 = Text.indexOf("/", Pos + 1);
        if (Posnext !== -1 && Posnext2 !== -1 && Posnext2 <= Posnext) {
            let scratch = Text[Posnext2 + 1]; //Zur Variablenausgabe
            switch (scratch) {
                case 'a':
                    StdString2 = " " + floor(Tag);
                    Anzahl = StdString2.length;
                    DrawString(StdString2, Posx, Posy, Art);
                    Posx += BBreite * (Anzahl);
                    break;
                case 'b':
                    StdString2 = " " + floor(Guy.Resource[GESUNDHEIT]);
                    Anzahl = StdString2.length;
                    DrawString(StdString2, Posx, Posy, Art);
                    Posx += BBreite * (Anzahl);
                    break;
                case 'c':
                    StdString2 = " " + Chance.toFixed(2);
                    Anzahl = StdString2.length;
                    DrawString(StdString2, Posx, Posy, Art);
                    Posx += BBreite * (Anzahl);
                    break;
                case 'd':
                    Frage = 0;
                    copy_rect(rcRectsrc, Bmp[JA].rcSrc);
                    rcRectdes.left = TextBereich[Bereich].rcText.left + 50;
                    rcRectdes.top = Posy + 50;
                    rcRectdes.right = rcRectdes.left + Bmp[JA].Breite;
                    rcRectdes.bottom = rcRectdes.top + Bmp[JA].Hoehe;
                    copy_rect(Bmp[JA].rcDes, rcRectdes);
                    Blitten(Bmp[JA].Surface, lpDDSSchrift, false);

                    copy_rect(rcRectsrc, Bmp[NEIN].rcSrc);
                    rcRectdes.left = TextBereich[Bereich].rcText.left + 220;
                    rcRectdes.top = Posy + 50;
                    rcRectdes.right = rcRectdes.left + Bmp[NEIN].Breite;
                    rcRectdes.bottom = rcRectdes.top + Bmp[NEIN].Hoehe;
                    copy_rect(Bmp[NEIN].rcDes, rcRectdes);
                    Blitten(Bmp[NEIN].Surface, lpDDSSchrift, false);
                    Posy += 115;
                    break;
                case 'z':
                    Posx = TextBereich[Bereich].rcText.left - BBreite;
                    Posy += BHoehe + 3;
                    break;
            }
            Pos = Pos + 3;
            Posnext = Posnext2 + 2;
        }
        if (Posnext === -1) Posnext = Text.length;
        StdString = Text.slice(Pos, Posnext);
        if (Posx + BBreite * (Posnext - Pos) > TextBereich[Bereich].rcText.right) {
            Posx = TextBereich[Bereich].rcText.left - BBreite;
            Posy += BHoehe + 3;
        }
        StdString = StdString.slice(0, Posnext - Pos);
        DrawString(StdString, Posx, Posy, Art);
        if (Posnext === Text.length) break;
        Posx += BBreite * (Posnext - Pos);
    }
    let Erg = (Posy + BHoehe - TextBereich[Bereich].rcText.top);
    if (Erg < 100) Erg = 100;
    return Erg;
}

function Textloeschen(Bereich)
{
    TextBereich[Bereich].Aktiv = false;
    //fill_dest([255, 0, 255], lpDDSSchrift);
    copy_rect(rcRectdes, TextBereich[Bereich].rcText)
    clear_dest(lpDDSSchrift);
}

function DrawSchatzkarte()
{
    Textloeschen(TXTPAPIER);
    TextBereich[TXTPAPIER].Aktiv = true;
    PapierText = SKARTEY;

    rcRectsrc.left = 0;
    rcRectsrc.right = SKARTEX;
    rcRectsrc.top = 0;
    rcRectsrc.bottom = SKARTEY;
    rcRectdes.left = TextBereich[TXTPAPIER].rcText.left;
    rcRectdes.top = TextBereich[TXTPAPIER].rcText.top;
    rcRectdes.right = rcRectdes.left + SKARTEX;
    rcRectdes.bottom = rcRectdes.top + SKARTEY;

    Blitten(lpDDSSchatzkarte, lpDDSSchrift, false);
}

function CalcRect(rcBereich) {
    if (rcRectdes.left < rcBereich.left) {
        rcRectsrc.left = rcRectsrc.left + rcBereich.left - rcRectdes.left;
        rcRectdes.left = rcBereich.left;
    }
    if (rcRectdes.top < rcBereich.top) {
        rcRectsrc.top = rcRectsrc.top + rcBereich.top - rcRectdes.top;
        rcRectdes.top = rcBereich.top;
    }
    if (rcRectdes.right > rcBereich.right) {
        rcRectsrc.right = rcRectsrc.right + rcBereich.right - rcRectdes.right;
        rcRectdes.right = rcBereich.right;
    }
    if (rcRectdes.bottom > rcBereich.bottom) {
        rcRectsrc.bottom = rcRectsrc.bottom + rcBereich.bottom - rcRectdes.bottom;
        rcRectdes.bottom = rcBereich.bottom;
    }
}

function MarkRoute(Mark)
{
    for (let i = 0; i < RouteLaenge; i++) {
        Scape[Route[i].x][Route[i].y].Markiert = Mark;
    }
}

function CheckSpzButton()
{
    if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= FELD) && (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= FEUERSTELLE) &&
        (Scape[Guy.Pos.x][Guy.Pos.y].Phase >= Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl) &&
        (Bmp[BUTTSTOP].Phase === -1)) {
        if (Bmp[BUTTWEITER].Phase === -1) Bmp[BUTTWEITER].Phase = 0;
    } else Bmp[BUTTWEITER].Phase = -1;

    if ((Bmp[BUTTSTOP].Phase === -1) && (((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BOOT) &&
        (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl)) ||
        ((BootsFahrt) &&
            (((Scape[Guy.Pos.x - 1][Guy.Pos.y].Art !== 1) && (Scape[Guy.Pos.x - 1][Guy.Pos.y].Objekt === -1)) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y - 1].Art !== 1) && (Scape[Guy.Pos.x][Guy.Pos.y - 1].Objekt === -1)) ||
                ((Scape[Guy.Pos.x + 1][Guy.Pos.y].Art !== 1) && (Scape[Guy.Pos.x + 1][Guy.Pos.y].Objekt === -1)) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y + 1].Art !== 1) && (Scape[Guy.Pos.x][Guy.Pos.y + 1].Objekt === -1)))))) {
        if (Bmp[BUTTABLEGEN].Phase === -1) Bmp[BUTTABLEGEN].Phase = 0;
    } else Bmp[BUTTABLEGEN].Phase = -1;
}

function CheckRohstoff()
{
    let Benoetigt = 0; //Anzahl der Gesamtbenötigten Rohstoffe
    for (let i = 0; i < BILDANZ; i++) Benoetigt += Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Rohstoff[i];

    //Soviel Rohstoffe werden für diesen Schritt benötigt
    let GebrauchtTmp = Benoetigt / Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].AkAnzahl;
    //Soviel Rohstoffe werden für diesen Schritt benötigt
    let Gebraucht = floor(GebrauchtTmp * Scape[Guy.Pos.x][Guy.Pos.y].AkNummer -
        floor(GebrauchtTmp * (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer - 1)));

    while (1) {
        //Wenn kein Rohstoff mehr vorhanden nur noch einmal die While-Schleife
        let Check = false;
        for (let i = 0; i < BILDANZ; i++) {
            if (Gebraucht === 0) return true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] > 0) &&
                (Guy.Inventar[i] > 0)) {
                Guy.Inventar[i]--;
                Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i]--;
                Gebraucht--;
                if (Gebraucht === 0) return true;
                Check = true;
            }
        }
        if (Check === false) break;
    }
    PapierText = DrawText(messages.ROHSTOFFNICHT, TXTPAPIER, 1);
    Guy.AkNummer = 0;
    Guy.Aktion = AKABBRUCH;
    Bmp[BUTTSTOP].Phase = -1;
    return false;
}

function Event(Eventnr)
{
    if (Eventnr !== AKNICHTS) {
        MarkRoute(false);
        RouteZiel.x = -1;
        RouteZiel.y = -1;
    }
    switch (Eventnr) {
        case AKNICHTS:
            break;
        case AKSUCHEN:
            AkSuchen();
            break;
        case AKESSEN:
            AkEssen();
            break;
        case AKTRINKEN:
            AkTrinken();
            break;
        case AKFAELLEN:
            AkFaellen();
            break;
        case AKFELD:
            AkFeld();
            break;
        case AKTAGENDE:
            AkTagEnde();
            break;
        case AKGERETTET:
            AkGerettet();
            break;
        case AKZELT:
            AkZelt();
            break;
        case AKSCHLAFEN:
            AkSchlafen();
            break;
        case AKABBRUCH:
            AkAbbruch();
            break;
        case AKANGELN:
            AkAngeln();
            break;
        case AKBOOT:
            AkBoot();
            break;
        case AKABLEGEN:
            AkAblegen();
            break;
        case AKANLEGEN:
            AkAnlegen();
            break;
        case AKROHR:
            AkRohr();
            break;
        case AKDESTROY:
            AkDestroy();
            break;
        case AKSOS:
            AkSOS();
            break;
        case AKHAUS1:
            AkHaus1();
            break;
        case AKHAUS2:
            AkHaus2();
            break;
        case AKHAUS3:
            AkHaus3();
            break;
        case AKFEUERSTELLE:
            AkFeuerstelle();
            break;
        case AKANZUENDEN:
            AkAnzuenden();
            break;
        case AKAUSSCHAU:
            AkAusschau();
            break;
        case AKSCHATZ:
            AkSchatz();
            break;
        case AKINTRO:
            AkIntro();
            break;
        case AKSCHLEUDER:
            AkSchleuder();
            break;
        case AKSPIELVERLASSEN:
            AkSpielverlassen();
            break;
        case AKNEUBEGINNEN:
            AkNeubeginnen();
            break;
        case AKTAGNEUBEGINNEN:
            AkTagNeubeginnen();
            break;
        case AKTOD:
            AkTod();
            break;
    }
}

function Compute(MinGroesse, MaxGroesse) //Groesse der Insel in Anzahl der Landkacheln
{
    let gefunden;

    let Mittex = Math.floor(MAXXKACH / 2) - 1;
    let Mittey = Math.floor(MAXYKACH / 2) - 1;

    for (let m = 0; m < 1000; m++)	//100mal wiederholen, oder bis eine geeignete Insel gefunden ist
    {
        for (let y = 0; y < MAXYKACH; y++) {
            for (let x = 0; x < MAXXKACH; x++) {
                Scape[x][y].Typ = 0;
                Scape[x][y].Art = 0;
                Scape[x][y].Hoehe = 0;
                Scape[x][y].Markiert = false;
                Scape[x][y].Begehbar = true;
                Scape[x][y].Entdeckt = false;
                Scape[x][y].LaufZeit = 1;
                Scape[x][y].Objekt = -1;
                Scape[x][y].Reverse = false;
                Scape[x][y].ObPos.x = 0;
                Scape[x][y].ObPos.y = 0;
                Scape[x][y].Phase = -1;
                Scape[x][y].AkNummer = 0;
                Scape[x][y].GPosAlt.x = 0;
                Scape[x][y].GPosAlt.y = 0;
                for (let i = 0; i < BILDANZ; i++) Scape[x][y].Rohstoff[i] = 0;
                Scape[x][y].Timer = 0;
            }
        }

        let x = Mittex;		//Startposition der Berechnung
        let y = Mittey;
        Scape[Mittex][Mittey].Typ = 0;		//Gipfel festlegen (Flach)
        Scape[Mittex][Mittey].Hoehe = GIPFEL;	// und mit der Hoehe

        // l: Spiralring von Innen aus gezählt
        for (let l = 0; l <= Mittey - 1; l++) {
            let i;
            if (l >= Mittex) break;
            y = Mittey - l - 1;
            //Als erstes den oberen Bereich von links nach rechts durchgehen
            for (x = Mittex - l; x <= Mittex + l; x++) {
                gefunden = false;
                let i = 0;
                while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
                {
                    i++;
                    if (i === 1000) gefunden = true;

                    Scape[x][y].Typ = rand() % 13;
                    for (let j = 0; j < 10; j++) {
                        if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 1))) {
                            Scape[x][y].Typ = rand() % 13;
                        }
                    }

                    if ((x === Mittex - l) || ((x !== Mittex - l)
                        && ((Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] !== 0)
                            && (Vierecke[Scape[x - 1][y].Typ][2][Scape[x][y].Typ] !== 0)))) {
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 1) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe - 1;
                            if (Scape[x][y].Hoehe < 0) {
                                Scape[x][y].Typ = 0;
                                Scape[x][y].Hoehe = 0;
                            }
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 2) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe;
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 3) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe + 1;
                            gefunden = true;
                        }
                    }
                    //Verzwickte Fälle ausfiltern
                    if (x + 1 < MAXXKACH && y + 1 < MAXYKACH && (
                        ((Vierecke[Scape[x][y].Typ][2][3] === 2) && (Vierecke[Scape[x + 1][y + 1].Typ][1][4] === 2)) ||
                        ((Vierecke[Scape[x][y].Typ][2][1] === 2) && (Vierecke[Scape[x + 1][y + 1].Typ][1][2] === 2)))
                    ) {
                        gefunden = false;
                    }
                    //Nebeninseln vermeiden
                    if (((Scape[x - 1][y].Typ === 0) && (Scape[x - 1][y].Hoehe === 0)) &&
                        ((Scape[x][y + 1].Typ === 0) && (Scape[x][y + 1].Hoehe === 0))) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }

                }
            }

            //Teil rechts-oben
            x = Mittex + l + 1;
            y = Mittey - l - 1;
            gefunden = false;
            i = 0;
            while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
            {
                i++;
                if (i === 1000) gefunden = true;

                Scape[x][y].Typ = rand() % 13;
                for (let j = 0; j < 10; j++) {
                    if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 5))) {
                        Scape[x][y].Typ = rand() % 13;
                    }
                }

                if (Vierecke[Scape[x - 1][y].Typ][2][Scape[x][y].Typ] === 1) {
                    Scape[x][y].Hoehe = Scape[x - 1][y].Hoehe - 1;
                    if (Scape[x][y].Hoehe < 0) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                    gefunden = true;
                }
                if (Vierecke[Scape[x - 1][y].Typ][2][Scape[x][y].Typ] === 2) {
                    Scape[x][y].Hoehe = Scape[x - 1][y].Hoehe;
                    gefunden = true;
                }
                if (Vierecke[Scape[x - 1][y].Typ][2][Scape[x][y].Typ] === 3) {
                    Scape[x][y].Hoehe = Scape[x - 1][y].Hoehe + 1;
                    gefunden = true;
                }
                //Verzwickte Fälle ausfiltern
                if (x - 1 >= 0 && y + 1 < MAXYKACH && (
                    ((Vierecke[Scape[x][y].Typ][3][2] === 2) && (Vierecke[Scape[x - 1][y + 1].Typ][2][3] === 2)) ||
                    ((Vierecke[Scape[x][y].Typ][3][4] === 2) && (Vierecke[Scape[x - 1][y + 1].Typ][2][1] === 2)))
                ) {
                    gefunden = false;
                }
                //Nebeninseln vermeiden
                if ((Scape[x - 1][y].Typ === 0) && (Scape[x - 1][y].Hoehe === 0)) {
                    Scape[x][y].Typ = 0;
                    Scape[x][y].Hoehe = 0;
                }
            }

            //Den rechten Bereich von oben nach unten durchgehen
            x = Mittex + l + 1;
            for (y = Mittey - l; y <= Mittey + l; y++) {
                gefunden = false;
                let i = 0;
                while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
                {
                    i++;
                    if (i === 1000) gefunden = true;

                    Scape[x][y].Typ = rand() % 13;
                    for (let j = 0; j < 10; j++) {
                        if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 4))) {
                            Scape[x][y].Typ = rand() % 13;
                        }
                    }

                    if ((Vierecke[Scape[x - 1][y].Typ][2][Scape[x][y].Typ] !== 0)
                        && (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] !== 0)) {
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 1) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe - 1;
                            if (Scape[x][y].Hoehe < 0) {
                                Scape[x][y].Typ = 0;
                                Scape[x][y].Hoehe = 0;
                            }
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 2) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe;
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 3) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe + 1;
                            gefunden = true;
                        }
                    }
                    //Verzwickte Fälle ausfiltern
                    if (x - 1 >= 0 && y + 1 < MAXYKACH && (
                        ((Vierecke[Scape[x][y].Typ][3][2] === 2) && (Vierecke[Scape[x - 1][y + 1].Typ][2][3] === 2)) ||
                        ((Vierecke[Scape[x][y].Typ][3][4] === 2) && (Vierecke[Scape[x - 1][y + 1].Typ][2][1] === 2)))
                    ) {
                        gefunden = false;
                    }
                    //Nebeninseln vermeiden
                    if (((Scape[x - 1][y].Typ === 0) && (Scape[x - 1][y].Hoehe === 0)) &&
                        ((Scape[x][y - 1].Typ === 0) && (Scape[x][y - 1].Hoehe === 0))) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                }
            }

            //Teil rechts-unten
            x = Mittex + l + 1;
            y = Mittey + l + 1;
            gefunden = false;
            i = 0;
            while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
            {
                i++;
                if (i === 1000) gefunden = true;

                Scape[x][y].Typ = rand() % 13;
                for (let j = 0; j < 10; j++) {
                    if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 8))) {
                        Scape[x][y].Typ = rand() % 13;
                    }
                }

                if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 1) {
                    Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe - 1;
                    if (Scape[x][y].Hoehe < 0) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                    gefunden = true;
                }
                if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 2) {
                    Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe;
                    gefunden = true;
                }
                if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 3) {
                    Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe + 1;
                    gefunden = true;
                }
                //Verzwickte Fälle ausfiltern

                if (x - 1 >= 0 && y - 1 >= 0 && (
                    ((Vierecke[Scape[x][y].Typ][0][1] === 2) && (Vierecke[Scape[x - 1][y - 1].Typ][3][2] === 2)) ||
                    ((Vierecke[Scape[x][y].Typ][0][3] === 2) && (Vierecke[Scape[x - 1][y - 1].Typ][3][4] === 2)))
                ) {
                    gefunden = false;
                }
                //Nebeninsel vermeiden
                if ((Scape[x][y - 1].Typ === 0) && (Scape[x][y - 1].Hoehe === 0)) {
                    Scape[x][y].Typ = 0;
                    Scape[x][y].Hoehe = 0;
                }
            }

            //Den unteren Bereich von rechts nach links durchgehen
            y = Mittey + l + 1;
            for (x = Mittex + l; x >= Mittex - l; x--) {
                gefunden = false;
                i = 0;
                while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
                {
                    i++;
                    if (i === 1000) gefunden = true;

                    Scape[x][y].Typ = rand() % 13;
                    for (let j = 0; j < 10; j++) {
                        if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 3))) {
                            Scape[x][y].Typ = rand() % 13;
                        }
                    }

                    if ((Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] !== 0)
                        && (Vierecke[Scape[x + 1][y].Typ][0][Scape[x][y].Typ] !== 0)) {
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 1) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe - 1;
                            if (Scape[x][y].Hoehe < 0) {
                                Scape[x][y].Typ = 0;
                                Scape[x][y].Hoehe = 0;
                            }
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 2) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe;
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y - 1].Typ][3][Scape[x][y].Typ] === 3) {
                            Scape[x][y].Hoehe = Scape[x][y - 1].Hoehe + 1;
                            gefunden = true;
                        }
                    }
                    //Verzwickte Fälle ausfiltern
                    if (x - 1 >= 0 && y - 1 >= 0 && (
                        ((Vierecke[Scape[x][y].Typ][0][1] === 2) && (Vierecke[Scape[x - 1][y - 1].Typ][3][2] === 2)) ||
                        ((Vierecke[Scape[x][y].Typ][0][3] === 2) && (Vierecke[Scape[x - 1][y - 1].Typ][3][4] === 2)))
                    ) {
                        gefunden = false;
                    }
                    //Nebeninseln vermeiden
                    if (((Scape[x + 1][y].Typ === 0) && (Scape[x + 1][y].Hoehe === 0)) &&
                        ((Scape[x][y - 1].Typ === 0) && (Scape[x][y - 1].Hoehe === 0))) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                }
            }

            //Teil links-unten
            x = Mittex - l - 1;
            y = Mittey + l + 1;
            gefunden = false;
            i = 0;
            while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
            {
                i++;
                if (i === 1000) gefunden = true;

                Scape[x][y].Typ = rand() % 13;
                for (let j = 0; j < 10; j++) {
                    if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 7))) {
                        Scape[x][y].Typ = rand() % 13;
                    }
                }

                if (Vierecke[Scape[x + 1][y].Typ][0][Scape[x][y].Typ] === 1) {
                    Scape[x][y].Hoehe = Scape[x + 1][y].Hoehe - 1;
                    if (Scape[x][y].Hoehe < 0) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                    gefunden = true;
                }
                if (Vierecke[Scape[x + 1][y].Typ][0][Scape[x][y].Typ] === 2) {
                    Scape[x][y].Hoehe = Scape[x + 1][y].Hoehe;
                    gefunden = true;
                }
                if (Vierecke[Scape[x + 1][y].Typ][0][Scape[x][y].Typ] === 3) {
                    Scape[x][y].Hoehe = Scape[x + 1][y].Hoehe + 1;
                    gefunden = true;
                }
                //Verzwickte Fälle ausfiltern
                if (x + 1 < MAXXKACH && y - 1 >= 0 && (
                    ((Vierecke[Scape[x][y].Typ][1][2] === 2) && (Vierecke[Scape[x + 1][y - 1].Typ][0][3] === 2)) ||
                    ((Vierecke[Scape[x][y].Typ][1][4] === 2) && (Vierecke[Scape[x + 1][y - 1].Typ][0][1] === 2)))
                ) {
                    gefunden = false;
                }
                //Nebeninsel vermeiden
                if ((Scape[x + 1][y].Typ === 0) && (Scape[x + 1][y].Hoehe === 0)) {
                    Scape[x][y].Typ = 0;
                    Scape[x][y].Hoehe = 0;
                }
            }

            //Den linken Bereich von unten nach oben durchgehen
            x = Mittex - l - 1;
            for (y = Mittey + l; y >= Mittey - l - 1; y--) {
                gefunden = false;
                i = 0;
                while (!gefunden)		//Passendes Teil finden und Hoehe festlegen
                {
                    i++;
                    if (i === 1000) gefunden = true;
                    Scape[x][y].Typ = rand() % 13;
                    for (let j = 0; j < 10; j++) {
                        if (!((Scape[x][y].Typ === 0) || (Scape[x][y].Typ === 2))) {
                            Scape[x][y].Typ = rand() % 13;
                        }
                    }

                    if ((Vierecke[Scape[x + 1][y].Typ][0][Scape[x][y].Typ] !== 0)
                        && (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] !== 0)) {
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 1) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe - 1;
                            if (Scape[x][y].Hoehe < 0) {
                                Scape[x][y].Typ = 0;
                                Scape[x][y].Hoehe = 0;
                            }
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 2) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe;
                            gefunden = true;
                        }
                        if (Vierecke[Scape[x][y + 1].Typ][1][Scape[x][y].Typ] === 3) {
                            Scape[x][y].Hoehe = Scape[x][y + 1].Hoehe + 1;
                            gefunden = true;
                        }
                    }
                    //Verzwickte Fälle ausfiltern
                    if (x + 1 < MAXXKACH && y - 1 >= 0 && (
                        ((Vierecke[Scape[x][y].Typ][1][2] === 2) && (Vierecke[Scape[x + 1][y - 1].Typ][0][3] === 2)) ||
                        ((Vierecke[Scape[x][y].Typ][1][4] === 2) && (Vierecke[Scape[x + 1][y - 1].Typ][0][1] === 2)))
                    ) {
                        gefunden = false;
                    }
                    //Nebeninseln vermeiden
                    if (((Scape[x + 1][y].Typ === 0) && (Scape[x + 1][y].Hoehe === 0)) &&
                        ((Scape[x][y + 1].Typ === 0) && (Scape[x][y + 1].Hoehe === 0))) {
                        Scape[x][y].Typ = 0;
                        Scape[x][y].Hoehe = 0;
                    }
                }
            }
        }
        let Anzahl = 0; 		//Anzahl der Landstücke
        let CheckRand = true; //Reicht die Insel bis zum Rand?
        for (y = 0; y < MAXYKACH; y++) {		//Landfläche zählen
            for (x = 0; x < MAXXKACH; x++) {
                if (Scape[x][y].Hoehe > 0) Anzahl++;

                if (Scape[x][y].Typ === 0) Scape[x][y].LaufZeit = 1;
                else Scape[x][y].LaufZeit = 2;

                if ((Scape[x][y].Typ !== 0) &&
                    ((x <= 2) || (x >= MAXXKACH - 2) || (y <= 2) || (y >= MAXYKACH - 2)))
                    CheckRand = false;
            }
        }
        if ((Anzahl > MinGroesse) && (Anzahl < MaxGroesse) && (CheckRand)) break;
    }
}

function Meer()	//Das Meer und den Strand bestimmen
{
    for (let y = 0; y < MAXYKACH; y++) {//Meer rausfinden
        for (let x = 0; x < MAXXKACH; x++) {
            if ((Scape[x][y].Hoehe < 0) ||
                ((Scape[x][y].Hoehe === 0) && (Scape[x][y].Typ === 0))) {
                Scape[x][y].Typ = 0;
                Scape[x][y].Hoehe = 0;
                Scape[x][y].Art = 1;
                Scape[x][y].Objekt = MEERWELLEN;
                Scape[x][y].ObPos.x = Bmp[MEERWELLEN].rcDes.left;
                Scape[x][y].ObPos.y = Bmp[MEERWELLEN].rcDes.top;
                if (rand() % 2 === 0) Scape[x][y].Reverse = true;
                Scape[x][y].Begehbar = false;
                Scape[x][y].Phase = (Bmp[Scape[x][y].Objekt].Anzahl -
                    rand() % (Bmp[Scape[x][y].Objekt].Anzahl) - 1);
            }
        }
    }
    for (let y = 1; y < MAXYKACH - 1; y++) {//Strand rausfinden
        for (let x = 1; x < MAXXKACH - 1; x++) {//Alle Möglichkeiten durchgehen
            if ((Scape[x][y].Typ === 0) && (Scape[x][y].Hoehe === 0)) {
                //Anzahl von angrenzenden Landstücken
                let Anzahl = 0;	//Anzahl rausfinden
                if (Scape[x - 1][y].Typ !== 0) Anzahl++;
                if (Scape[x - 1][y - 1].Typ !== 0) Anzahl++;
                if (Scape[x][y - 1].Typ !== 0) Anzahl++;
                if (Scape[x + 1][y - 1].Typ !== 0) Anzahl++;
                if (Scape[x + 1][y].Typ !== 0) Anzahl++;
                if (Scape[x + 1][y + 1].Typ !== 0) Anzahl++;
                if (Scape[x][y + 1].Typ !== 0) Anzahl++;
                if (Scape[x - 1][y + 1].Typ !== 0) Anzahl++;

                if ((Anzahl >= 1) && (Anzahl < 6)) {
                    Scape[x][y].Art = 2;
                    Scape[x][y].Objekt = -1;
                    Scape[x][y].Reverse = false;
                    Scape[x][y].Begehbar = true;
                    Scape[x][y].Phase = -1;
                    continue;
                }
                if (Anzahl >= 6) {
                    Scape[x][y].Art = 3;
                    Scape[x][y].Objekt = -1;
                    Scape[x][y].Reverse = false;
                    Scape[x][y].Begehbar = false;
                    Scape[x][y].Phase = -1;
                    continue;
                }
                Scape[x][y].Art = 1;		//sonst Meer
                Scape[x][y].Objekt = MEERWELLEN;
                Scape[x][y].ObPos.x = Bmp[MEERWELLEN].rcDes.left;
                Scape[x][y].ObPos.y = Bmp[MEERWELLEN].rcDes.top;
                Scape[x][y].Phase = (Bmp[Scape[x][y].Objekt].Anzahl -
                    rand() % (Bmp[Scape[x][y].Objekt].Anzahl) - 1);
                if (rand() % 2 === 0) Scape[x][y].Reverse = true;
                Scape[x][y].Begehbar = false;
            }
        }
    }
}

function ChangeBootsFahrt()
{
    BootsFahrt = !BootsFahrt;
    //Begehbarkeit umdrehen
    for (let y = 0; y < MAXYKACH; y++)
        for (let x = 0; x < MAXXKACH; x++) Scape[x][y].Begehbar = !Scape[x][y].Begehbar;
}

function Fade(RP, GP, BP)
{
    if(RP === 100 && GP === 100 && BP === 100) {
        gamma_curtain.style.display = "none";
    }
    else {
        gamma_curtain.style.display = "block";
        gamma_curtain.style.backgroundColor = `rgb(${RP*255/100}, ${GP*255/100}, ${BP*255/100})`;
    }
}

function CheckRohr(x, y)
{
    Scape[x][y].Phase = 1;
    if (Scape[x][y].Art === 0) Scape[x][y].Art = 4;
    if (Scape[x - 1][y].Art === 0) Scape[x - 1][y].Art = 4;
    if (Scape[x - 1][y - 1].Art === 0) Scape[x - 1][y - 1].Art = 4;
    if (Scape[x][y - 1].Art === 0) Scape[x][y - 1].Art = 4;
    if (Scape[x + 1][y - 1].Art === 0) Scape[x + 1][y - 1].Art = 4;
    if (Scape[x + 1][y].Art === 0) Scape[x + 1][y].Art = 4;
    if (Scape[x + 1][y + 1].Art === 0) Scape[x + 1][y + 1].Art = 4;
    if (Scape[x][y + 1].Art === 0) Scape[x][y + 1].Art = 4;
    if (Scape[x - 1][y + 1].Art === 0) Scape[x - 1][y + 1].Art = 4;

    if ((Scape[x - 1][y].Objekt === ROHR) && (Scape[x - 1][y].Phase === 0)) CheckRohr(x - 1, y);
    if ((Scape[x][y - 1].Objekt === ROHR) && (Scape[x][y - 1].Phase === 0)) CheckRohr(x, y - 1);
    if ((Scape[x + 1][y].Objekt === ROHR) && (Scape[x + 1][y].Phase === 0)) CheckRohr(x + 1, y);
    if ((Scape[x][y + 1].Objekt === ROHR) && (Scape[x][y + 1].Phase === 0)) CheckRohr(x, y + 1);
}

function FillRohr()
{
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            if ((Scape[x][y].Objekt === ROHR) && (Scape[x][y].Phase < Bmp[ROHR].Anzahl))
                Scape[x][y].Phase = 0;
            if (Scape[x][y].Art === 4) Scape[x][y].Art = 0;
            if ((Scape[x][y].Objekt >= SCHLEUSE1) && (Scape[x][y].Objekt <= SCHLEUSE6)) {
                Scape[x][y].Objekt -= 14;
                Scape[x][y].ObPos.x = Bmp[Scape[x][y].Objekt].rcDes.left;
                Scape[x][y].ObPos.y = Bmp[Scape[x][y].Objekt].rcDes.top;
            }
        }
    }
    //StartRohr finden
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            if ((Scape[x][y].Objekt >= FLUSS1) && (Scape[x][y].Objekt <= SCHLEUSE6)) {
                if (Scape[x][y].Art === 0) Scape[x][y].Art = 4;
                if (Scape[x - 1][y].Art === 0) Scape[x - 1][y].Art = 4;
                if (Scape[x - 1][y - 1].Art === 0) Scape[x - 1][y - 1].Art = 4;
                if (Scape[x][y - 1].Art === 0) Scape[x][y - 1].Art = 4;
                if (Scape[x + 1][y - 1].Art === 0) Scape[x + 1][y - 1].Art = 4;
                if (Scape[x + 1][y].Art === 0) Scape[x + 1][y].Art = 4;
                if (Scape[x + 1][y + 1].Art === 0) Scape[x + 1][y + 1].Art = 4;
                if (Scape[x][y + 1].Art === 0) Scape[x][y + 1].Art = 4;
                if (Scape[x - 1][y + 1].Art === 0) Scape[x - 1][y + 1].Art = 4;
            }
            if ((Scape[x][y].Objekt !== ROHR) || (Scape[x][y].Phase >= Bmp[ROHR].Anzahl))
                continue;
            if ((Scape[x - 1][y].Objekt >= FLUSS5) && (Scape[x - 1][y].Objekt <= FLUSS10)) {
                Scape[x - 1][y].Objekt += 14;
                Scape[x - 1][y].ObPos.x = Bmp[Scape[x - 1][y].Objekt].rcDes.left;
                Scape[x - 1][y].ObPos.y = Bmp[Scape[x - 1][y].Objekt].rcDes.top;
                CheckRohr(x, y);
            } else if ((Scape[x - 1][y].Objekt >= SCHLEUSE1) && (Scape[x - 1][y].Objekt <= SCHLEUSE6)) {
                CheckRohr(x, y);
            }
            if ((Scape[x][y - 1].Objekt >= FLUSS5) && (Scape[x][y - 1].Objekt <= FLUSS10)) {
                Scape[x][y - 1].Objekt += 14;
                Scape[x][y - 1].ObPos.x = Bmp[Scape[x][y - 1].Objekt].rcDes.left;
                Scape[x][y - 1].ObPos.y = Bmp[Scape[x][y - 1].Objekt].rcDes.top;
                CheckRohr(x, y);
            } else if ((Scape[x][y - 1].Objekt >= SCHLEUSE1) && (Scape[x][y - 1].Objekt <= SCHLEUSE6)) {
                CheckRohr(x, y);
            }
            if ((Scape[x + 1][y].Objekt >= FLUSS5) && (Scape[x + 1][y].Objekt <= FLUSS10)) {
                Scape[x + 1][y].Objekt += 14;
                Scape[x + 1][y].ObPos.x = Bmp[Scape[x + 1][y].Objekt].rcDes.left;
                Scape[x + 1][y].ObPos.y = Bmp[Scape[x + 1][y].Objekt].rcDes.top;
                CheckRohr(x, y);
            } else if ((Scape[x + 1][y].Objekt >= SCHLEUSE1) && (Scape[x + 1][y].Objekt <= SCHLEUSE6)) {
                CheckRohr(x, y);
            }
            if ((Scape[x][y + 1].Objekt >= FLUSS5) && (Scape[x][y + 1].Objekt <= FLUSS10)) {
                Scape[x][y + 1].Objekt += 14;
                Scape[x][y + 1].ObPos.x = Bmp[Scape[x][y + 1].Objekt].rcDes.left;
                Scape[x][y + 1].ObPos.y = Bmp[Scape[x][y + 1].Objekt].rcDes.top;
                CheckRohr(x, y);
            } else if ((Scape[x][y + 1].Objekt >= SCHLEUSE1) && (Scape[x][y + 1].Objekt <= SCHLEUSE6)) {
                CheckRohr(x, y);
            }
        }
    }
    //Felder auf trockenen Wiesen löschen
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            if ((Scape[x][y].Objekt === FELD) && (Scape[x][y].Art === 0)) {
                Scape[x][y].Objekt = -1;
                Scape[x][y].ObPos.x = 0;
                Scape[x][y].ObPos.y = 0;
                Scape[x][y].Phase = -1;
                Scape[x][y].AkNummer = 0;
            }
        }
    }
    Generate();
}

function CheckFluss(x, y) //Nachprüfen ob auf aktuellem Teil ein Fluss ist (Nur für die Fluss-Routine)
{
    for (let i = 0; i < FLUSSANZAHL; i++) {
        for (let j = 0; j < MAXFLUSS; j++) {
            if ((x === Flusslauf[i][j].x) && (y === Flusslauf[i][j].y)) return true;
        }
    }
    return false;
}

function Fluss() //Anzahl der Flüsse und der minimale Länge
{
    let l, i;
    let Richtung; //Aktuelle Fliesrichtung von 0-3
    let x0, y0, x1, x2, y1, y2;	  //x2,y2 Koordinate des zu prüfenden Teils
    let Strand;
    let gefunden;
    let Flusstmp = Array.from(Array(MAXFLUSS), x => ({x: 0, y: 0})); //Zum zwischenspeichern des Versuchs

    for (let m = 0; m < FLUSSANZAHL; m++) {
        for (let j = 0; j < MAXFLUSS; j++) {
            Flusslauf[m][j].x = -1;
            Flusslauf[m][j].y = -1;
        }
    }

    for (let m = 0; m < FLUSSANZAHL; m++) {
        let fertig = false;
        let Laengetmp = 0;
        for (let j = 0; j < MAXFLUSS; j++) {
            Flusstmp[j].x = -1;
            Flusstmp[j].y = -1;
        }
        for (let k = 0; k < 1000; k++) {
            for (let o = 0; o < 10000; o++) {
                gefunden = true;
                x0 = rand() % MAXXKACH; //geeignete Quelle bestimmen
                y0 = rand() % MAXYKACH;
                if (CheckFluss(x0, y0)) gefunden = false;
                if ((Scape[x0][y0].Typ !== 0) ||
                    (Scape[x0][y0].Hoehe < 2)) gefunden = false;
                if (gefunden) break;
            }
            if (!gefunden) break;	//Wenn keine Quelle mehr gefunden aufhören
            Flusslauf[m][0].x = x0;
            Flusslauf[m][0].y = y0;
            Strand = false;
            for (i = 1; i < MAXFLUSS; i++) {
                gefunden = false;
                if (!Strand) Richtung = rand() % 4; //Auf dem Strand geradeausfliessen
                for (let l2 = 0; l2 < 4; l2++) {
                    l = (Richtung + l2) % 4;	 //Im Urzeigersinn nachpr�fen und bei der vorgegeben Richtung anfangen

                    x1 = Flusslauf[m][i - 1].x;
                    y1 = Flusslauf[m][i - 1].y;

                    if (l === 0) {
                        x2 = x1 - 1;
                        y2 = y1;
                        if (((Scape[x1][y1].Typ === 0) || (Scape[x1][y1].Typ === 2)) &&
                            ((Scape[x2][y2].Typ === 0) || (Scape[x2][y2].Typ === 2))) {
                            gefunden = (!CheckFluss(x2, y2));
                            if (gefunden) break;
                        }
                    }
                    if (l === 1) {
                        x2 = x1;
                        y2 = y1 - 1;
                        if (((Scape[x1][y1].Typ === 0) || (Scape[x1][y1].Typ === 1)) &&
                            ((Scape[x2][y2].Typ === 0) || (Scape[x2][y2].Typ === 1))) {
                            gefunden = (!CheckFluss(x2, y2));
                            if (gefunden) break;
                        }
                    }
                    if (l === 2) {
                        x2 = x1 + 1;
                        y2 = y1;
                        if (((Scape[x1][y1].Typ === 0) || (Scape[x1][y1].Typ === 4)) &&
                            ((Scape[x2][y2].Typ === 0) || (Scape[x2][y2].Typ === 4))) {
                            gefunden = (!CheckFluss(x2, y2));
                            if (gefunden) break;
                            ;
                        }
                    }
                    if (l === 3) {
                        x2 = x1;
                        y2 = y1 + 1;
                        if (((Scape[x1][y1].Typ === 0) || (Scape[x1][y1].Typ === 3)) &&
                            ((Scape[x2][y2].Typ === 0) || (Scape[x2][y2].Typ === 3))) {
                            gefunden = (!CheckFluss(x2, y2));
                            if (gefunden) break;
                        }
                    }
                }
                if (!gefunden) break;

                Flusslauf[m][i].x = x2;
                Flusslauf[m][i].y = y2;
                Richtung = l;

                if ((Scape[Flusslauf[m][i].x][Flusslauf[m][i].y].Art === 2) &&	//Auf Strand die Richtung beibehalten
                    (Scape[Flusslauf[m][i].x][Flusslauf[m][i].y].Typ === 0)) {
                    if (Strand === true) break;	//Nur ein Strandstück überfliessen
                    else Strand = true;
                }

                if ((Scape[Flusslauf[m][i].x][Flusslauf[m][i].y].Art === 1) &&	//im meer aufhören
                    (Scape[Flusslauf[m][i].x][Flusslauf[m][i].y].Typ === 0)) {
                    fertig = true;
                    break;
                }
            }
            if (fertig) {
                if (i > Laengetmp) {
                    //neue Variante speichern
                    if (gefunden) Laengetmp = i; else Laengetmp = i - 1;
                    for (j = 0; j <= Laengetmp; j++) {
                        Flusstmp[j].x = Flusslauf[m][j].x;
                        Flusstmp[j].y = Flusslauf[m][j].y;
                    }
                }
            }
            for (i = 0; i < MAXFLUSS; i++) {
                Flusslauf[m][i].x = -1;
                Flusslauf[m][i].y = -1;
            }
            i = 0;
            fertig = false;

        }
        //Den längsten Fluss nehmen
        Flusslaenge[m] = Laengetmp;
        for (let j = 0; j <= Flusslaenge[m]; j++) {
            Flusslauf[m][j].x = Flusstmp[j].x;
            Flusslauf[m][j].y = Flusstmp[j].y;
        }

        //Die richtigen Wasserkacheln auswählen
        //x0, y0, x1, y1, x2, y2 = -1;
        for (let m = 0; m < FLUSSANZAHL; m++) {
            for (i = 0; i <= Flusslaenge[m]; i++) {
                //Für die Kachel, einen Vorgang davor
                let Objekt = Scape[x1][y1].Objekt;
                if (Objekt > -1) {
                    Scape[x1][y1].ObPos.x = Bmp[Objekt].rcDes.left;
                    Scape[x1][y1].ObPos.y = Bmp[Objekt].rcDes.top;
                }

                x1 = Flusslauf[m][i].x;
                y1 = Flusslauf[m][i].y;

                Scape[x1][y1].Phase = 0;

                if (Scape[x1][y1].Art === 0) Scape[x1][y1].Art = 4;
                if (Scape[x1 - 1][y1].Art === 0) Scape[x1 - 1][y1].Art = 4;
                if (Scape[x1 - 1][y1 - 1].Art === 0) Scape[x1 - 1][y1 - 1].Art = 4;
                if (Scape[x1][y1 - 1].Art === 0) Scape[x1][y1 - 1].Art = 4;
                if (Scape[x1 + 1][y1 - 1].Art === 0) Scape[x1 + 1][y1 - 1].Art = 4;
                if (Scape[x1 + 1][y1].Art === 0) Scape[x1 + 1][y1].Art = 4;
                if (Scape[x1 + 1][y1 + 1].Art === 0) Scape[x1 + 1][y1 + 1].Art = 4;
                if (Scape[x1][y1 + 1].Art === 0) Scape[x1][y1 + 1].Art = 4;
                if (Scape[x1 - 1][y1 + 1].Art === 0) Scape[x1 - 1][y1 + 1].Art = 4;

                if (i < Flusslaenge[m]) {
                    x2 = Flusslauf[m][i + 1].x;
                    y2 = Flusslauf[m][i + 1].y;
                }

                if (i !== 0) {
                    x0 = Flusslauf[m][i - 1].x;
                    y0 = Flusslauf[m][i - 1].y;
                } else {
                    //Quellen
                    if (x2 > x1) {
                        Scape[x1][y1].Objekt = QUELLE1;
                        continue;
                    }
                    if (x2 < x1) {
                        Scape[x1][y1].Objekt = QUELLE4;
                        continue;
                    }
                    if (y2 > y1) {
                        Scape[x1][y1].Objekt = QUELLE2;
                        continue;
                    }
                    if (y2 < y1) {
                        Scape[x1][y1].Objekt = QUELLE3;
                        continue;
                    }
                }

                //Alle Möglichkeiten durchgehen

                if (Scape[x1][y1].Typ === 1) Scape[x1][y1].Objekt = FLUSS1;
                if (Scape[x1][y1].Typ === 2) Scape[x1][y1].Objekt = FLUSS2;
                if (Scape[x1][y1].Typ === 3) Scape[x1][y1].Objekt = FLUSS3;
                if (Scape[x1][y1].Typ === 4) Scape[x1][y1].Objekt = FLUSS4;

                if (Scape[x1][y1].Typ === 0) {
                    if ((x0 < x1) && (y0 === y1)) {
                        if (Scape[x1][y1].Art === 2) Scape[x1][y1].Objekt = MUENDUNG3; //Mündung
                        else {
                            if ((x1 < x2) && (y1 === y2)) Scape[x1][y1].Objekt = FLUSS5;
                            if ((x1 === x2) && (y1 < y2)) Scape[x1][y1].Objekt = FLUSS7;
                            if ((x1 === x2) && (y1 > y2)) Scape[x1][y1].Objekt = FLUSS9;
                        }
                    }
                    if ((x0 === x1) && (y0 < y1)) {
                        if (Scape[x1][y1].Art === 2) Scape[x1][y1].Objekt = MUENDUNG4; //Mündung
                        else {
                            if ((x1 < x2) && (y1 === y2)) Scape[x1][y1].Objekt = FLUSS8;
                            if ((x1 === x2) && (y1 < y2)) Scape[x1][y1].Objekt = FLUSS6;
                            if ((x1 > x2) && (y1 === y2)) {
                                Scape[x1][y1].Objekt = FLUSS9;
                                Scape[x1][y1].Reverse = true;
                            }
                        }
                    }
                    if ((x0 > x1) && (y0 === y1)) {
                        if (Scape[x1][y1].Art === 2) Scape[x1][y1].Objekt = MUENDUNG1; //Mündung
                        else {
                            if ((x1 > x2) && (y1 === y2)) Scape[x1][y1].Objekt = FLUSS5;
                            if ((x1 === x2) && (y1 < y2)) Scape[x1][y1].Objekt = FLUSS10;
                            if ((x1 === x2) && (y1 > y2)) Scape[x1][y1].Objekt = FLUSS8;
                            Scape[x1][y1].Reverse = true;
                        }
                    }
                    if ((x0 === x1) && (y0 > y1)) {
                        if (Scape[x1][y1].Art === 2) Scape[x1][y1].Objekt = MUENDUNG2; //Mündung
                        else {
                            if ((x1 === x2) && (y1 > y2)) Scape[x1][y1].Objekt = FLUSS6;
                            if ((x1 > x2) && (y1 === y2)) Scape[x1][y1].Objekt = FLUSS7;
                            Scape[x1][y1].Reverse = true;
                            if ((x1 < x2) && (y1 === y2)) {
                                Scape[x1][y1].Objekt = FLUSS10;
                                Scape[x1][y1].Reverse = false;
                            }
                        }
                    }
                }
            }
            //Für das letzte Flussstück
            Scape[x1][y1].ObPos.x = Bmp[Scape[x1][y1].Objekt].rcDes.left;
            Scape[x1][y1].ObPos.y = Bmp[Scape[x1][y1].Objekt].rcDes.top;
        }
    }
}

function Baeume(Prozent)
{
    let Pos = ZWEID(); //Da steht der Baum
    let einGrosserBaum = false;	//gibt es bereits einen großen Baum

    //x,y Diese Kachel wird angeschaut
    for (let y = 0; y < MAXYKACH; y++) {//Alle Kacheln durchgehen
        for (let x = 0; x < MAXXKACH; x++) {
            if ((Scape[x][y].Objekt !== -1) ||
                ((Scape[x][y].Art === 3) && (Scape[x][y].Typ === 0))) continue;
            //Wenn schon ein Objekt da ist oder Treibsand ist, dann mit nächsten Teil weitermachen
            if (rand() % Math.floor(100 / Prozent) !== 0) continue; //Die Wahrscheinlichkeit für einen Baum bestimmen
            while (1) {
                Pos.x = rand() % KXPIXEL;
                Pos.y = rand() % KYPIXEL;
                let Erg = GetKachel(Scape[x][y].xScreen + Pos.x, Scape[x][y].yScreen + Pos.y);
                if ((Erg.x === x) && (Erg.y === y)) break;
            }
            if ((Scape[x][y].Art === 2) && (Scape[x][y].Typ === 0))//Bei Strand nur Palmen nehmen
            {
                Scape[x][y].Objekt = BAUM2;
            } else {
                let r = rand() % 5; //random speicherung
                Scape[x][y].Objekt = BAUM1 + r;
                if ((rand() % 50 === 1) || (!einGrosserBaum)) {
                    Scape[x][y].Objekt = BAUMGROSS;
                    einGrosserBaum = true;
                }
            }
            //Linke obere Ecke speichern
            Scape[x][y].ObPos.x = Pos.x - (Bmp[Scape[x][y].Objekt].Breite) / 2;
            Scape[x][y].ObPos.y = Pos.y - (Bmp[Scape[x][y].Objekt].Hoehe);
            //Startphase
            if (Scape[x][y].Objekt === BUSCH)
                Scape[x][y].Phase = Bmp[Scape[x][y].Objekt].Anzahl - 1;
            else Scape[x][y].Phase = (Bmp[Scape[x][y].Objekt].Anzahl -
                rand() % (Bmp[Scape[x][y].Objekt].Anzahl) - 1);

        }
    }
}

function Piratenwrack()
{
    let x, y;

    let Richtung = rand() % 3;
    switch (Richtung) {
        case 0:
            x = MAXXKACH / 2;
            for (let i = 0; i < MAXYKACH; i++) {
                if (Scape[x][i].Art !== 1) {
                    y = i - 1;
                    break;
                }
            }
            break;
        case 1:
            y = MAXYKACH / 2;
            for (let i = MAXXKACH - 1; i >= 0; i--) {
                if (Scape[i][y].Art !== 1) {
                    x = i + 1;
                    break;
                }
            }
            break;
        case 2:
            x = MAXXKACH / 2;
            for (let i = MAXYKACH - 1; i >= 0; i--) {
                if (Scape[x][i].Art !== 1) {
                    y = i + 1;
                    break;
                }
            }
            break;
    }
    Scape[x][y].Objekt = WRACK2;
    Scape[x][y].ObPos.x = Bmp[WRACK2].rcDes.left;
    Scape[x][y].ObPos.y = Bmp[WRACK2].rcDes.top;
}

function Schatz()
{
    while (1) {
        let x = rand() % (MAXXKACH - 1);
        let y = rand() % (MAXYKACH - 1);
        //nur auf flachen Kacheln ohne Objekt
        if ((Scape[x][y].Objekt === -1) && (Scape[x][y].Typ === 0)
            && (Scape[x][y].Art !== 3)) {
            if (SchatzPos.x === -1) {
                SchatzPos.x = x;
                SchatzPos.y = y;
            }

            lock_canvas(lpDDSScape);
            lock_canvas(lpDDSSchatzkarte);

            //Diese Kachel wird angeschaut
            for (let i = 0; i < SKARTEX; i++) {
                for (let j = 0; j < SKARTEY; j++) {
                    let rgbStruct = GetPixel(
                        (i + Scape[SchatzPos.x][SchatzPos.y].xScreen - SKARTEX / 2 + KXPIXEL / 2),
                        (j + Scape[SchatzPos.x][SchatzPos.y].yScreen - SKARTEY / 2 + 30), lpDDSScape
                    );
                    PutPixel(
                        i, j,
                        [
                            (rgbStruct[0] * 30 + rgbStruct[1] * 59 + rgbStruct[2] * 11) / 100,
                            (rgbStruct[0] * 30 + rgbStruct[1] * 59 + rgbStruct[2] * 11) / 100,
                            (rgbStruct[0] * 30 + rgbStruct[1] * 59 + rgbStruct[2] * 11) / 100 * 3 / 4
                        ],
                        lpDDSSchatzkarte
                    );
                }
            }
            upload_canvas(lpDDSSchatzkarte);

            copy_rect(rcRectsrc, Bmp[KREUZ].rcSrc);
            rcRectdes.left = SKARTEX / 2 - Bmp[KREUZ].Breite / 2;
            rcRectdes.right = rcRectdes.left + Bmp[KREUZ].Breite;
            rcRectdes.top = SKARTEY / 2 - Bmp[KREUZ].Hoehe / 2;
            rcRectdes.bottom = rcRectdes.top + Bmp[KREUZ].Hoehe;
            Blitten(Bmp[KREUZ].Surface, lpDDSSchatzkarte, true);


            lock_canvas(lpDDSSchatzkarte);

            //Weichzeichnen
            for (let i = 0; i < SKARTEX; i++) {
                for (let j = 0; j < SKARTEY; j++) {
                    if ((i > 0) && (i < SKARTEX - 1) && (j > 0) && (j < SKARTEY - 1)) {
                        let rgbleft = GetPixel(i - 1, j, lpDDSSchatzkarte);
                        let rgbtop = GetPixel(i, j - 1, lpDDSSchatzkarte);
                        let rgbright = GetPixel(i + 1, j, lpDDSSchatzkarte);
                        let rgbbottom = GetPixel(i, j + 1, lpDDSSchatzkarte);
                        let rgbStruct = GetPixel(i, j, lpDDSSchatzkarte);
                        PutPixel(
                            i, j,
                            [
                                (rgbleft.r + rgbtop.r + rgbright.r + rgbbottom.r + rgbStruct.r) / 5,
                                (rgbleft.g + rgbtop.g + rgbright.g + rgbbottom.g + rgbStruct.g) / 5,
                                (rgbleft.b + rgbtop.b + rgbright.b + rgbbottom.b + rgbStruct.b) / 5
                            ],
                            lpDDSSchatzkarte
                        );
                    }
                }
            }
            upload_canvas(lpDDSSchatzkarte);
            break;
        }
    }
}

function RotateRight(Dir)	//Richtungskoordinate rechtsrum umrechnen
{
    switch (Dir) {
        case 2 : {
            NewPos.x++;
            NewPos.y++;
            Dir = 4;
            break;
        }
        case 4 : {
            NewPos.x--;
            NewPos.y++;
            Dir = 8;
            break;
        }
        case 8: {
            NewPos.x--;
            NewPos.y--;
            Dir = 1;
            break;
        }
        case 1 : {
            NewPos.x++;
            NewPos.y--;
            Dir = 2;
            break;
        }
    }
    return Dir;
}

function LineIntersect(LineStartPos, Pos, store)
{
    let Sx, Sy;
    let erg = false;

    Steps = 0;

    let Dx = LineStartPos.x - Pos.x;
    let Dy = LineStartPos.y - Pos.y;
    let x = LineStartPos.x;
    let y = LineStartPos.y;
    if (Math.abs(Dx) > Math.abs(Dy)) {
        if (Dx > 0) Sx = -1; else Sx = 1;
        if (Dx === 0) Sy = 0; else Sy = Dy / (Dx * Sx);
        Steps = Math.abs(Dx);
    } else {
        if (Dy > 0) Sy = -1; else Sy = 1;
        if (Dy === 0) Sx = 0; else Sx = Dx / (Dy * Sy);
        Steps = Math.abs(Dy);
    }

    for (let i = 0; i < Steps; i++) {
        if (!Scape[ROUND(x)][ROUND(y)].Begehbar) erg = true;
        if (store) {
            Route[RouteLaenge].x = ROUND(x);
            Route[RouteLaenge].y = ROUND(y);
            RouteLaenge++;
        }
        let Nextx = x + Sx;
        let Nexty = y + Sy;
        if ((ROUND(y) !== ROUND(Nexty)) && (ROUND(x) !== ROUND(Nextx))) {
            if (Scape[ROUND(x)][ROUND(Nexty)].Begehbar) {
                if (store) {
                    Route[RouteLaenge].x = ROUND(x);
                    Route[RouteLaenge].y = ROUND(Nexty);
                    RouteLaenge++;
                }
            } else {
                if (Scape[ROUND(Nextx)][ROUND(y)].Begehbar) {
                    if ((store)) {
                        Route[RouteLaenge].x = ROUND(Nextx);
                        Route[RouteLaenge].y = ROUND(y);
                        RouteLaenge++;
                    }
                } else {
                    erg = true;
                }
            }
        }
        y = Nexty;
        x = Nextx;
    }
    return erg;
}

function FindTheWay()
{
    let Plist = Array(MAXXKACH * MAXYKACH); // Besuchte Punkte merken
    let Llist = Array(MAXXKACH * MAXYKACH); // Länge vom Punkt zum Ziel

    let ShPos = ZWEID();
    let BestLine = ZWEID();
    let ShortKoor = ZWEID();

    for (let AI = 0; AI < MAXYKACH; AI++) {
        for (let BI = 0; BI < MAXXKACH; BI++) {
            LenMap[AI][BI] = 65535;
            Llist[AI * BI] = 0;
            Plist[AI * BI] = {x: 0, y: 0};
        }
    }
    let ShortEntf = -1;
    RouteLaenge = 0;

    let PCnt = 1;
    copy_zweid(Plist[0], RouteStart);
    let DiffX = (RouteStart.x - RouteZiel.x);
    let DiffY = (RouteStart.y - RouteZiel.y);
    Llist[0] = (DiffX * DiffX) + (DiffY * DiffY);

    LenMap[RouteStart.x][RouteStart.y] = 0;
    let Pos = ZWEID();
    copy_zweid(Pos, RouteStart);
    copy_zweid(NewPos, Pos);
    let GoalReached = false;
    while ((!GoalReached) && (PCnt > 0)) {
        //den mit der kürzesten Entfernung zum Ziel finden (der in der Liste ist)
        let Shortest = 0;
        for (let CI = 0; CI <= PCnt - 1; CI++) {
            if (Llist[CI] < Llist[Shortest]) {
                Shortest = CI;
            }
        }
        //Mit dem Nächsten weitermachen
        copy_zweid(Pos, Plist[Shortest]);
        //Den kürzesten merken
        if ((ShortEntf > Llist[Shortest]) || (ShortEntf === -1)) {
            ShortEntf = Llist[Shortest];
            copy_zweid(ShortKoor, Plist[Shortest]);
        }

        //Den Nächsten aus der Liste löschen
        Plist[Shortest] = Plist[PCnt - 1];
        Llist[Shortest] = Llist[PCnt - 1];
        PCnt--;
        copy_zweid(NewPos, Pos);
        let Dir = 2;
        NewPos.y--; //Oben nachschauen anfangen
        for (let BI = 0; BI <= 3; BI++) //In jede Richtung schauen
        {
            //ist das Feld noch nicht besucht und frei?
            if ((LenMap[NewPos.x][NewPos.y] === 65535) &&
                (Scape[NewPos.x][NewPos.y].Begehbar)) {
                // Wieviele Schritte braucht man um zu diesem Feld zu kommen
                let StepCnt = LenMap[Pos.x][Pos.y] + 1;
                LenMap[NewPos.x][NewPos.y] = StepCnt;
                copy_zweid(Plist[PCnt], NewPos);
                //Die Entfernung in die Liste aufnehmen
                DiffX = (NewPos.x - RouteZiel.x);
                DiffY = (NewPos.y - RouteZiel.y);
                Llist[PCnt] = (DiffX * DiffX) + (DiffY * DiffY);
                PCnt++;
            }
            //Ziel erreicht?
            if ((NewPos.x === RouteZiel.x) && (NewPos.y === RouteZiel.y)) {
                GoalReached = true;
                BI = 3;
            }
            Dir = RotateRight(Dir);
        }
    }
    if ((PCnt === 0) || (!Scape[RouteZiel.x][RouteZiel.y].Begehbar)) {
        RouteZiel.x = ShortKoor.x;
        RouteZiel.y = ShortKoor.y;

        if (FindTheWay()) return true;
        else return false;
    }
    else if (GoalReached) //Punkt rückwärts durchgehen und Abkürzungen finden
    {
        // TODO: what the heck does this code? it hangs always
        copy_zweid(Pos, RouteZiel);
        let LineStartPos = ZWEID();
        copy_zweid(LineStartPos, Pos);
        while ((Pos.x !== RouteStart.x) || (Pos.y !== RouteStart.y)) {
            copy_zweid(NewPos, Pos);
            let ShStep = 65535;
            Dir = 2;
            NewPos.y--; //Zuerst nach oben probieren
            for (let AI = 0; AI <= 3; AI++) {
                if (LenMap[NewPos.x][NewPos.y] < ShStep) {
                    ShStep = LenMap[NewPos.x][NewPos.y];
                    copy_zweid(ShPos, NewPos);
                }
                Dir = RotateRight(Dir);
            }
            copy_zweid(Pos, ShPos);

            // Linie beste Linie ohne Unterbrechung finden
            if (!LineIntersect(LineStartPos, Pos, false)) {
                copy_zweid(BestLine, Pos);
            }

            if ((Pos.x === RouteStart.x) && (Pos.y === RouteStart.y)) {
                copy_zweid(Pos, BestLine);
                LineIntersect(LineStartPos, Pos, true);
                copy_zweid(LineStartPos, Pos);
            }
        }
        Route[RouteLaenge].x = RouteStart.x;
        Route[RouteLaenge].y = RouteStart.y;
        RouteLaenge++;

        SortRoute();	//Sortieren
    }
    return true;
}

function CheckRoute(x, y, save, Laenge) //Nachprüfen ob auf aktuellem Teil in der Route ist
{
    if (!save) {
        for (let i = 0; i < RouteLaenge; i++) {
            if ((x === Route[i].x) && (y === Route[i].y)) return true;
        }
    } else {
        for (let i = 0; i <= Laenge; i++) {
            if ((x === SaveRoute[i].x) && (y === SaveRoute[i].y)) return true;
        }
    }
    return false;
}


function SortRoute()
{
    let Pos = ZWEID();
    Pos.x = RouteStart.x;
    Pos.y = RouteStart.y;
    for (let i = 0; i < RouteLaenge; i++) { //Alle Teile vom Start durchgehen
        SaveRoute[i].x = Pos.x;
        SaveRoute[i].y = Pos.y;

        RouteKoor[2 * i].x =
            (Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][0].x +
                Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][2].x) / 2;
        RouteKoor[2 * i].y =
            (Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][1].y +
                Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][3].y) / 2;

        NewPos.x = Pos.x;
        NewPos.y = Pos.y - 1; //oben mit nachschauen anfangen
        let Dir = 2;
        for (let j = 0; j <= 3; j++) {
            if ((CheckRoute(NewPos.x, NewPos.y, false, RouteLaenge)) &&
                (!CheckRoute(NewPos.x, NewPos.y, true, i))) {
                switch (j) {
                    case 0:
                        RouteKoor[2 * i + 1].x =
                            (Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][1].x +
                                Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][2].x) / 2;
                        RouteKoor[2 * i + 1].y =
                            (Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][1].y +
                                Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][2].y) / 2;
                        break;
                    case 1:
                        RouteKoor[2 * i + 1].x =
                            (Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][2].x +
                                Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][3].x) / 2;
                        RouteKoor[2 * i + 1].y =
                            (Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][2].y +
                                Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][3].y) / 2;
                        break;
                    case 2:
                        RouteKoor[2 * i + 1].x =
                            (Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][3].x +
                                Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][0].x) / 2;
                        RouteKoor[2 * i + 1].y =
                            (Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][3].y +
                                Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][0].y) / 2;
                        break;
                    case 3:
                        RouteKoor[2 * i + 1].x =
                            (Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][0].x +
                                Scape[Pos.x][Pos.y].xScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][1].x) / 2;
                        RouteKoor[2 * i + 1].y =
                            (Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][0].y +
                                Scape[Pos.x][Pos.y].yScreen + EckKoor[Scape[Pos.x][Pos.y].Typ][1].y) / 2;
                        break;
                }
                break;
            }

            Dir = RotateRight(Dir);
        }
        Pos.x = NewPos.x;
        Pos.y = NewPos.y;
    }
    for (let i = 0; i <= RouteLaenge; i++) { //Wieder in die Originalroute speichern
        Route[i].x = SaveRoute[i].x;
        Route[i].y = SaveRoute[i].y;
    }
}

function ShortRoute(Zielx, Ziely)
{
    RouteLaenge = 1;
    Route[0].x = Guy.Pos.x;
    Route[0].y = Guy.Pos.y;
    RouteKoor[0].x = Guy.PosScreen.x;
    RouteKoor[0].y = Guy.PosScreen.y;
    Route[1].x = Guy.Pos.x;
    Route[1].y = Guy.Pos.y;
    RouteKoor[1].x = Zielx;
    RouteKoor[1].y = Ziely;

    //Die Animation gleich anschließend starten
    Guy.Aktiv = true;
    if ((BootsFahrt) && (Guy.Zustand !== GUYSCHWIMMEN)) Guy.Zustand = GUYBOOTLINKS;
    else if (Guy.Zustand !== GUYSCHWIMMEN) Guy.Zustand = GUYLINKS;
    RoutePunkt = -1;
    Steps = 0;
    Step = 0;
}

function CheckBenutze(Objekt)
{
    if (((Objekt === ROHSTEIN) && (TwoClicks === ROHAST)) ||
        ((Objekt === ROHAST) && (TwoClicks === ROHSTEIN))) {
        if (Guy.Inventar[ROHAXT] < 1) {
            Guy.Inventar[ROHSTEIN]--;
            Guy.Inventar[ROHAST]--;
            Guy.Inventar[ROHAXT] = 1;
            Bmp[BUTTFAELLEN].Phase = 0;
            Bmp[BUTTBOOT].Phase = 0;
            Bmp[BUTTROHR].Phase = 0;
            PapierText = DrawText(messages.BAUEAXT, TXTPAPIER, 1);
            PlaySound(WAVERFINDUNG, 100);
        } else if (Guy.Inventar[ROHEGGE] < 1) {
            Guy.Inventar[ROHSTEIN]--;
            Guy.Inventar[ROHAST]--;
            Guy.Inventar[ROHEGGE] = 1;
            Bmp[BUTTFELD].Phase = 0;
            PapierText = DrawText(messages.BAUEEGGE, TXTPAPIER, 1);
            PlaySound(WAVERFINDUNG, 100);
        } else {
            PapierText = DrawText(messages.STEINPLUSASTNICHTS, TXTPAPIER, 1);
        }
    } else if (((Objekt === ROHLIANE) && (TwoClicks === ROHAST)) ||
        ((Objekt === ROHAST) && (TwoClicks === ROHLIANE))) {
        if (Guy.Inventar[ROHANGEL] < 1) {
            Guy.Inventar[ROHLIANE]--;
            Guy.Inventar[ROHAST]--;
            Guy.Inventar[ROHANGEL] = 1;
            Bmp[BUTTANGELN].Phase = 0;
            PapierText = DrawText(messages.BAUEANGEL, TXTPAPIER, 1);
            PlaySound(WAVERFINDUNG, 100);
        } else {
            PapierText = DrawText(messages.ASTPLUSLIANENICHTS, TXTPAPIER, 1);
        }
    } else if (((Objekt === ROHLIANE) && (TwoClicks === ROHSTEIN)) ||
        ((Objekt === ROHSTEIN) && (TwoClicks === ROHLIANE))) {
        if (Guy.Inventar[ROHSCHLEUDER] < 1) {
            Guy.Inventar[ROHLIANE]--;
            Guy.Inventar[ROHSTEIN]--;
            Guy.Inventar[ROHSCHLEUDER] = 1;
            Bmp[BUTTSCHLEUDER].Phase = 0;
            PapierText = DrawText(messages.BAUESCHLEUDER, TXTPAPIER, 1);
            PlaySound(WAVERFINDUNG, 100);
        } else {
            PapierText = DrawText(messages.STEINPLUSLIANENICHTS, TXTPAPIER, 1);
        }
    } else {
        PapierText = DrawText(messages.NICHTBASTELN, TXTPAPIER, 1);
    }
    TwoClicks = -1;
}

function Animationen()
{
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            let j = Scape[x][y].Objekt;
            if ((j === -1) || (!Bmp[j].Animation)) continue;
            let i = Math.floor(LastBild / Bmp[j].Geschwindigkeit);
            if (i < 1) i = 1;
            if (Bild % i === 0) {
                if ((j >= BAUM1DOWN) && (j <= BAUM4DOWN) &&  //Die Baumfällenanimation nur ein mal abspielen
                    (Scape[x][y].Phase === Bmp[j].Anzahl - 1)) ;
                else Scape[x][y].Phase++;
                if (Scape[x][y].Phase >= Bmp[j].Anzahl) Scape[x][y].Phase = 0;
            }
        }
    }

    for (let j = BUTTGITTER; j <= BUTTDESTROY; j++) {
        if (!Bmp[j].Animation) continue;
        let i = Math.floor(LastBild / Bmp[j].Geschwindigkeit);
        if (i < 1) i = 1;
        if (Bild % i === 0) {
            Bmp[j].Phase++;
            if (Bmp[j].Phase >= Bmp[j].Anzahl) Bmp[j].Phase = 0;
        }
    }

    //Spielfigur

    //laufen
    if (((Guy.Zustand >= GUYLINKS) && (Guy.Zustand <= GUYUNTEN)) ||
        ((Guy.Zustand >= GUYBOOTLINKS) && (Guy.Zustand <= GUYBOOTUNTEN)) ||
        (Guy.Zustand === GUYSCHIFF) || (Guy.Zustand === GUYSCHWIMMEN)) {
        let i = Math.floor(LastBild / Bmp[Guy.Zustand].Geschwindigkeit);
        if (i < 1) i = 1;
        let loop; //Zwischenspeicher
        if (LastBild - Bmp[Guy.Zustand].Geschwindigkeit < 0) loop = 2; else loop = 1;
        if (BootsFahrt) loop = loop * 2;
        for (let k = 0; k < loop; k++) if ((Bild % i === 0) && (Guy.Aktiv)) CalcGuyKoor();
        return;
    }
    //sonstige Aktionen
    if ((Guy.Zustand >= GUYSUCHEN) && (Guy.Zustand <= GUYSCHLEUDER) &&
        (Bmp[Guy.Zustand].Phase !== Bmp[Guy.Zustand].Anzahl)) {
        let i = Math.floor(LastBild / Bmp[Guy.Zustand].Geschwindigkeit);
        if (i < 1) i = 1;
        if (Bild % i === 0) {
            Bmp[Guy.Zustand].Phase++;
            if (Bmp[Guy.Zustand].Phase >= Bmp[Guy.Zustand].Anzahl) {
                Bmp[Guy.Zustand].Phase = 0;
                if (PapierText === -1) Guy.Aktiv = false;
            }
        }
    }
}

function CalcGuyKoor()
{
    if (Step >= Steps) {
        RoutePunkt++;

        if ((RoutePunkt >= (RouteLaenge > 1 ? 2 * (RouteLaenge - 1) : 1) ||
            ((Guy.Aktion === AKABBRUCH) && (RouteLaenge > 1)))) {
            if (RouteLaenge > 1) Bmp[BUTTSTOP].Phase = -1;
            Bmp[Guy.Zustand].Phase = 0;
            Guy.Aktiv = false;
            RouteZiel.x = -1;
            RouteZiel.y = -1;
            return;
        }
        Guy.Pos.x = Route[Math.floor((RoutePunkt + 1) / 2)].x;
        Guy.Pos.y = Route[Math.floor((RoutePunkt + 1) / 2)].y;
        Entdecken();

        if (BootsFahrt)
            AddTime(0, Scape[Route[Math.floor((RoutePunkt + 1) / 2)].x][Route[Math.floor((RoutePunkt + 1) / 2)].y].LaufZeit * 3);
        else AddTime(0, Scape[Route[Math.floor((RoutePunkt + 1) / 2)].x][Route[Math.floor((RoutePunkt + 1) / 2)].y].LaufZeit * 5);
        AddResource(NAHRUNG, -1);
        AddResource(WASSER, -1);

        if ((Guy.Zustand === GUYSCHIFF) || (Guy.Zustand === GUYSCHWIMMEN)) Guy.Zustand -= 2; //nichts machen
        else if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
        else Guy.Zustand = GUYLINKS;

        if (RouteLaenge > 1)	//Bei normaler Routenabarbeitung die Richung Kachelmäßig rausfinden
        {
            if (Route[Math.floor(RoutePunkt / 2)].x > Route[Math.floor(RoutePunkt / 2 + 1)].x) Guy.Zustand += 0;
            else if (Route[Math.floor(RoutePunkt / 2)].x < Route[Math.floor(RoutePunkt / 2 + 1)].x) Guy.Zustand += 2;
            else if (Route[Math.floor(RoutePunkt / 2)].y < Route[Math.floor(RoutePunkt / 2 + 1)].y) Guy.Zustand += 3;
            else if (Route[Math.floor(RoutePunkt / 2)].y > Route[Math.floor(RoutePunkt / 2 + 1)].y) Guy.Zustand += 1;
        } else {
            if ((RouteKoor[RoutePunkt].x > RouteKoor[RoutePunkt + 1].x) &&
                (RouteKoor[RoutePunkt].y >= RouteKoor[RoutePunkt + 1].y)) Guy.Zustand += 0;
            else if ((RouteKoor[RoutePunkt].x <= RouteKoor[RoutePunkt + 1].x) &&
                (RouteKoor[RoutePunkt].y > RouteKoor[RoutePunkt + 1].y)) Guy.Zustand += 1;
            else if ((RouteKoor[RoutePunkt].x < RouteKoor[RoutePunkt + 1].x) &&
                (RouteKoor[RoutePunkt].y <= RouteKoor[RoutePunkt + 1].y)) Guy.Zustand += 2;
            else if ((RouteKoor[RoutePunkt].x >= RouteKoor[RoutePunkt + 1].x) &&
                (RouteKoor[RoutePunkt].y < RouteKoor[RoutePunkt + 1].y)) Guy.Zustand += 3;
        }

        //Differenz zwischen Ziel und Start
        let Dx = RouteKoor[RoutePunkt + 1].x - RouteKoor[RoutePunkt].x;
        let Dy = RouteKoor[RoutePunkt + 1].y - RouteKoor[RoutePunkt].y;
        GuyPosScreenStart.x = RouteKoor[RoutePunkt].x;
        GuyPosScreenStart.y = RouteKoor[RoutePunkt].y;
        Step = 0;

        if (Math.abs(Dx) > Math.abs(Dy)) {
            if (Dx > 0) Schrittx = 1; else Schrittx = -1;
            if (Dx === 0) Schritty = 0; else Schritty = Dy / (Dx * Schrittx);
            Steps = Math.abs(Dx);

        } else {
            if (Dy > 0) Schritty = 1; else Schritty = -1;
            if (Dy === 0) Schrittx = 0; else Schrittx = Dx / (Dy * Schritty);
            Steps = Math.abs(Dy);
        }

    }

    if (Bild % Scape[Guy.Pos.x][Guy.Pos.y].LaufZeit === 0) {
        Step++;
        let i;
        if (BootsFahrt) i = 4; else i = 2;
        if (Step % i === 0) {
            Bmp[Guy.Zustand].Phase++;
            if (Bmp[Guy.Zustand].Phase >= Bmp[Guy.Zustand].Anzahl) Bmp[Guy.Zustand].Phase = 0;
        }
        Guy.PosScreen.x = GuyPosScreenStart.x + ROUND(Step * Schrittx);
        Guy.PosScreen.y = GuyPosScreenStart.y + ROUND(Step * Schritty);
        if ((Spielzustand === SZINTRO) || (Spielzustand === SZGERETTET)) //Beim Intro führt die Kamera mit
        {
            Camera.x = Guy.PosScreen.x - floor(rcGesamt.right / 2);
            Camera.y = Guy.PosScreen.y - floor(rcGesamt.bottom / 2);
        }
    }
}

function Entdecken()
{
    let Aenderung = false;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!Scape[Guy.Pos.x + i][Guy.Pos.y + j].Entdeckt) {
                Scape[Guy.Pos.x + i][Guy.Pos.y + j].Entdeckt = true;
                Aenderung = true;
            }
        }
    }

    if (Aenderung) Generate();
}

function CalcKoor()
{
    // Bildschirmkoordinaten berechnen und speichern
    for (let y = 0; y < MAXYKACH; y++) {
        for (let x = 0; x < MAXXKACH; x++) {
            Scape[x][y].xScreen = KXPIXEL / 2 * MAXXKACH + 32 +
                x * KXPIXEL / 2 - y * KYPIXEL / 2 +
                (-6 * y) + x; //seltsame Korrekturen
            Scape[x][y].yScreen =
                x * KXPIXEL / 2 + y * KYPIXEL / 2 - 16 * Scape[x][y].Hoehe +
                (-13 * x) + (-8 * y); //seltsame Korrekturen
            if ((x === 0) && (y === 0)) ScapeGrenze.top = Scape[x][y].yScreen;
            if ((x === 0) && (y === MAXYKACH - 1)) ScapeGrenze.left = Scape[x][y].xScreen;
            if ((x === MAXXKACH - 1) && (y === MAXYKACH - 1)) ScapeGrenze.bottom = Scape[x][y].yScreen + KYPIXEL;
            if ((x === MAXXKACH - 1) && (y === 0)) ScapeGrenze.right = Scape[x][y].xScreen + KXPIXEL;
        }
    }
}

function frame(now)
{
    requestAnimationFrame(frame);

    //console.log("frame spielzustand = ", Spielzustand);
    //frametime.innerText = "fps " + LastBild;

    Bild++;
    let Zeitsave = now / 1000;
    const test_period_sec = 5;
    if (Zeit + test_period_sec < Zeitsave) {
        Zeit = Zeitsave;
        LastBild = (LastBild + Bild / test_period_sec) / 2;
        Bild = 0;
        if (LastBild === 0) LastBild = 60;
    }
    if (Spielzustand === SZLOGO) {
        if (CheckKey() === 2) return;		//Das Keyboard abfragen
        ZeigeLogo(); //Bild auffrischen
    }
    else if ((Spielzustand === SZINTRO) || (Spielzustand === SZGERETTET)) {
        if (CheckKey() === 0) return 0;		//Das Keyboard abfragen

        Animationen();  //Animationen weiterschalten
        if (!Guy.Aktiv) Event(Guy.Aktion); //Aktionen starten
        if (Guy.Pos.x !== RouteStart.x) ZeigeIntro(); //Bild auffrischen (if-Abfrage nötig (seltsamerweise))

    }
    else if (Spielzustand === SZSPIEL) {
        if ((Stunden >= 12) && (Minuten !== 0) && (Guy.Aktion !== AKTAGENDE))	//Hier ist der Tag zuende
        {
            if (Guy.Aktion === AKAUSSCHAU) Chance -= 1 + Scape[Guy.Pos.x][Guy.Pos.y].Hoehe;
            Guy.Aktiv = false;
            Guy.AkNummer = 0;
            Guy.Aktion = AKTAGENDE;
        }

        CheckSpzButton();					//Die Spezialknöpfe umschalten
        if (MouseAktiv) CheckMouse();		//Den MouseZustand abchecken
        if (CheckKey() === 0) return 0;		//Das Keyboard abfragen
        LimitScroll();						//Das Scrollen an die Grenzen der Landschaft anpassen
        Animationen();						//Die Animationsphasen weiterschalten
        if (!Guy.Aktiv) Event(Guy.Aktion);  //Die Aktionen starten
        Zeige();//Das Bild zeichnen
        if (Spielbeenden) return 0;

    }
    else if (Spielzustand === SZABSPANN) {
        if (CheckKey() === 0) return 0;
        AbspannCalc();
        ZeigeAbspann();
    }
}

function main()
{
    canvas = document.querySelector("#canvas");
    canvas.oncontextmenu = () => false;
    lpDDSBack = canvas;
    lpDDSPrimary = canvas;
    InitDInput();
    InitDDraw();
    InitDSound();
    Spielzustand = SZLOGO;
    InitStructs();
    requestAnimationFrame(frame);
}

//addEventListener("load", main);

function start_game()
{
    start_button.style.display = "none";
    start_logo.style.display = "none";
    main();
}