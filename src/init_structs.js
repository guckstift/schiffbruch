
async function init_structs()
{
    Bmp = await fetch('./src/bmp_defaults.json').then(response => response.json());

    //Guy
    for(let i=GUYLINKS; i<=GUYUNTEN; i++) {
        Bmp[i].Surface = img_player;
    }

    for(let i=GUYSUCHEN; i<=GUYSCHLEUDER; i++) {
        Bmp[i].Surface = img_player;
    }

    Bmp[GUYSUCHEN].Sound  = sfx_rustle;
    Bmp[GUYESSEN].Sound  = sfx_rustle;
    Bmp[GUYTRINKEN].Sound = sfx_drink;
    Bmp[GUYFAELLEN].Sound = sfx_log;
    Bmp[GUYSCHLAFZELT].Sound  = sfx_snore;
    Bmp[GUYSCHLAFEN].Sound  = sfx_snore;
    Bmp[GUYSCHLAGEN].Sound = sfx_beat;
    Bmp[GUYHAMMER].Sound  = sfx_hammer;
    Bmp[GUYHAMMER2].Sound  = sfx_hammer;
    Bmp[GUYSCHLAFHAUS].Sound  = sfx_snore;
    Bmp[GUYSCHAUFELN].Sound  = sfx_shovel;
    Bmp[GUYSCHIFF].Surface = img_buildings;
    Bmp[GUYSCHIFF].Sound = sfx_storm;
    Bmp[GUYSCHIFFDOWN].Surface = img_buildings;
    Bmp[GUYSCHIFFDOWN].Sound  = sfx_splash;
    Bmp[GUYSCHWIMMEN].Sound  = sfx_swim;

    //Cursor
    for(let i=CUPFEIL; i<=CUUHR; i++) {
        Bmp[i].Surface = img_cursors;
    }

    //Landschaftsanimationen
    for(let i=MEERWELLEN; i<=SCHLEUSE6; i++) {
        Bmp[i].Surface = img_animations;
        Bmp[i].Sound = sfx_stream;
    }

    Bmp[MEERWELLEN].Sound			= sfx_shore;

    Bmp[FELD].Surface = img_buildings;
    Bmp[ZELT].Surface = img_buildings;
    Bmp[BOOT].Surface = img_buildings;
    Bmp[ROHR].Surface = img_buildings;
    Bmp[SOS].Surface = img_buildings;
    Bmp[HAUS1].Surface = img_buildings;
    Bmp[HAUS2].Surface = img_buildings;
    Bmp[HAUS3].Surface = img_buildings;
    Bmp[HAUS3].Sound = sfx_forest;
    Bmp[FEUERSTELLE].Surface = img_buildings;

    //Allgemein Bäume
    for(let i=BAUM1; i<=BAUM4; i++) {
        Bmp[i].Surface = img_trees;
        Bmp[i].Sound = sfx_forest;
    }

    Bmp[BAUMGROSS].Surface = img_trees;
    Bmp[BAUMGROSS].Sound = sfx_forest;

    Bmp[FEUER].Surface = img_buildings;
    Bmp[FEUER].Sound = sfx_fire;

    Bmp[WRACK].Surface = img_buildings;
    Bmp[WRACK2].Surface = img_buildings;
    Bmp[BUSCH].Surface = img_trees;

    //Buttons

    //StandardBmponsinitialisierung
    for (let i=BUTTGITTER; i<=BUTTDESTROY; i++) {
        Bmp[i].Surface = img_buttons;
    }

    //SpzAni
    for (let i=BAUM1DOWN; i<=BAUM4DOWN; i++) {
        Bmp[i].Surface = img_trees;
    }

    Bmp[SAEULE1].Surface = img_gui;
    Bmp[SAEULE2].Surface = img_gui;
    Bmp[SAEULE3].Surface = img_gui;

    //Rohstoffe
    for(i=ROHAST;i<=ROHSCHLEUDER;i++) {
        Bmp[i].Surface = img_inventory;
    }

    Bmp[ROEMISCH1].Surface = img_inventory;

    Bmp[ROEMISCH2].Surface = img_inventory;

    Bmp[INVPAPIER].Surface = img_inventory;

    Bmp[RING].Surface = img_gui;

    Bmp[KREUZ].Surface = img_gui;

    Bmp[JA].Surface = img_paper;
    Bmp[NEIN].Surface = img_paper;

    if (language === "en") {
        //JA
        Bmp[JA].rcSrc.left = 0;
        Bmp[JA].rcSrc.top = 154;
        Bmp[JA].rcSrc.right = Bmp[JA].rcSrc.left + 68;
        Bmp[JA].rcSrc.bottom = Bmp[JA].rcSrc.top + 42;
        //NEIN
        Bmp[NEIN].rcSrc.left = 68;
        Bmp[NEIN].rcSrc.top = 154;
        Bmp[NEIN].rcSrc.right = Bmp[NEIN].rcSrc.left + 68;
        Bmp[NEIN].rcSrc.bottom = Bmp[NEIN].rcSrc.top + 42;
    }
    else if(language === "de") {
        //JA
        Bmp[JA].rcSrc.left = 0;
        Bmp[JA].rcSrc.top = 154;
        Bmp[JA].rcSrc.right = Bmp[JA].rcSrc.left + 41;
        Bmp[JA].rcSrc.bottom = Bmp[JA].rcSrc.top + 42;
        //NEIN
        Bmp[NEIN].rcSrc.left = 41;
        Bmp[NEIN].rcSrc.top = 154;
        Bmp[NEIN].rcSrc.right = Bmp[NEIN].rcSrc.left + 100;
        Bmp[NEIN].rcSrc.bottom = Bmp[NEIN].rcSrc.top + 39;

    }
    Bmp[JA].Breite = (Bmp[JA].rcSrc.right - Bmp[JA].rcSrc.left);
    Bmp[JA].Hoehe = (Bmp[JA].rcSrc.bottom - Bmp[JA].rcSrc.top);
    Bmp[NEIN].Breite = (Bmp[NEIN].rcSrc.right - Bmp[NEIN].rcSrc.left);
    Bmp[NEIN].Hoehe = (Bmp[NEIN].rcSrc.bottom - Bmp[NEIN].rcSrc.top);

    Bmp[SONNE].Surface = img_gui;

    Bmp[PROGRAMMIERUNG].rcSrc.right= Bmp[PROGRAMMIERUNG].rcSrc.left+348;
    Bmp[PROGRAMMIERUNG].rcSrc.bottom=Bmp[PROGRAMMIERUNG].rcSrc.top +49;

    if(language === "en") {
        Bmp[PROGRAMMIERUNG].rcSrc.right= Bmp[PROGRAMMIERUNG].rcSrc.left+284;
        Bmp[PROGRAMMIERUNG].rcSrc.bottom=Bmp[PROGRAMMIERUNG].rcSrc.top +49;
    }

    Bmp[PROGRAMMIERUNG].Surface = img_credits;
    Bmp[DIRKPLATE].Surface = img_credits;
    Bmp[MATTHIAS].Surface = img_credits;

    Bmp[TESTSPIELER].rcSrc.right= Bmp[TESTSPIELER].rcSrc.left+210;
    Bmp[TESTSPIELER].rcSrc.bottom=Bmp[TESTSPIELER].rcSrc.top +55;

    if(language === "en") {
        Bmp[TESTSPIELER].rcSrc.right= Bmp[TESTSPIELER].rcSrc.left+146;
        Bmp[TESTSPIELER].rcSrc.bottom=Bmp[TESTSPIELER].rcSrc.top +55;
    }

    Bmp[TESTSPIELER].Surface = img_credits;
    Bmp[TOBIAS].Surface = img_credits;
    Bmp[SIGRID].Surface = img_credits;
    Bmp[PATHFINDING].Surface = img_credits;
    Bmp[JOHN].Surface = img_credits;
    Bmp[HEIKO].Surface = img_credits;
    Bmp[GISELA].Surface = img_credits;

    //WEITEREHILFE
    Bmp[WEITEREHILFE].rcSrc.right= Bmp[WEITEREHILFE].rcSrc.left+258;
    Bmp[WEITEREHILFE].rcSrc.bottom=Bmp[WEITEREHILFE].rcSrc.top +46;

    if (language === "en") {
        Bmp[WEITEREHILFE].rcSrc.right= Bmp[WEITEREHILFE].rcSrc.left+339;
        Bmp[WEITEREHILFE].rcSrc.bottom=Bmp[WEITEREHILFE].rcSrc.top +59;
    }

    Bmp[WEITEREHILFE].Surface = img_credits;

    //DPSOFTWARE

    Bmp[DPSOFTWARE].rcSrc.left = 0;
    Bmp[DPSOFTWARE].rcSrc.top  = 608;

    if (language === "en") {
        Bmp[DPSOFTWARE].rcSrc.left = 0;
        Bmp[DPSOFTWARE].rcSrc.top  = 622;
    }

    Bmp[DPSOFTWARE].Surface = img_credits;
    Bmp[TRANSLATION].Surface = img_credits;
    Bmp[MARK].Surface = img_credits;
    Bmp[SCHWARZ].Surface = img_credits;
    Bmp[SOUNDS].Surface = img_credits;

    //MUSIK
    Bmp[MUSIK].rcSrc.left = 160;
    Bmp[MUSIK].rcSrc.top  = 310;
    if (language === "en") {
        Bmp[DPSOFTWARE].rcSrc.left = 0;
        Bmp[DPSOFTWARE].rcSrc.top  = 622;
    }

    Bmp[MUSIK].Surface = img_credits;

    for (let i=0; i<10; i++) {
        for (let k=0; k<10; k++) {
            AbspannListe[i][k].Aktiv = false;
            AbspannListe[i][k].Bild = -1;
        }
    }

    AbspannListe[0][0].Bild = PROGRAMMIERUNG;
    AbspannListe[0][1].Aktiv = true; //nur den hier true setzen, l�st dann alles andere aus
    AbspannListe[0][1].Bild = DIRKPLATE;
    AbspannListe[1][0].Bild = MUSIK;
    AbspannListe[1][1].Bild = HEIKO;
    AbspannListe[2][0].Bild = SOUNDS;
    AbspannListe[2][1].Bild = DIRKPLATE;
    AbspannListe[3][0].Bild = TESTSPIELER;
    AbspannListe[3][1].Bild = MATTHIAS;
    AbspannListe[3][2].Bild = TOBIAS;
    AbspannListe[3][3].Bild = SIGRID;
    AbspannListe[4][0].Bild = PATHFINDING;
    AbspannListe[4][1].Bild = JOHN;

    if(language === "en") {
        AbspannListe[5][0].Bild = TRANSLATION;
        AbspannListe[5][1].Bild = MARK;
        AbspannListe[6][0].Bild = WEITEREHILFE;
        AbspannListe[6][1].Bild = HEIKO;
        AbspannListe[6][2].Bild = GISELA;
        AbspannListe[7][0].Bild = SCHWARZ;
        AbspannListe[7][1].Bild = DPSOFTWARE;
    }
    else {
        AbspannListe[5][0].Bild = WEITEREHILFE;
        AbspannListe[5][1].Bild = HEIKO;
        AbspannListe[5][2].Bild = GISELA;
        AbspannListe[6][0].Bild = SCHWARZ;
        AbspannListe[6][1].Bild = DPSOFTWARE;
    }

    //Textausgabe
    TextBereich[TXTTEXTFELD].Aktiv = false;
    TextBereich[TXTTEXTFELD].rcText.left  = 9;
    TextBereich[TXTTEXTFELD].rcText.top	= MAXY-17;
    TextBereich[TXTTEXTFELD].rcText.right = MAXX-200;
    TextBereich[TXTTEXTFELD].rcText.bottom= MAXY-2;

    TextBereich[TXTFPS].Aktiv = false;
    TextBereich[TXTFPS].rcText.left  = MAXX-40;
    TextBereich[TXTFPS].rcText.top   = 3;
    TextBereich[TXTFPS].rcText.right = TextBereich[TXTFPS].rcText.left+2*S1XPIXEL;
    TextBereich[TXTFPS].rcText.bottom= TextBereich[TXTFPS].rcText.top +  S1YPIXEL;

    TextBereich[TXTTAGESZEIT].Aktiv = true;
    TextBereich[TXTTAGESZEIT].rcText.left  = MAXX-110;
    TextBereich[TXTTAGESZEIT].rcText.top	= MAXY-20;
    TextBereich[TXTTAGESZEIT].rcText.right = TextBereich[TXTTAGESZEIT].rcText.left+5*S2XPIXEL;
    TextBereich[TXTTAGESZEIT].rcText.bottom= TextBereich[TXTTAGESZEIT].rcText.top +  S2YPIXEL;

    TextBereich[TXTPAPIER].Aktiv = false;
    TextBereich[TXTPAPIER].rcText.left  = 150;
    TextBereich[TXTPAPIER].rcText.top	  = 100;
    TextBereich[TXTPAPIER].rcText.right = 530;
    TextBereich[TXTPAPIER].rcText.bottom= 500;

    TextBereich[TXTCHANCE].Aktiv = false;
    TextBereich[TXTCHANCE].rcText.left  = Bmp[RING].rcDes.left+5;
    TextBereich[TXTCHANCE].rcText.top	= Bmp[RING].rcDes.top+Bmp[RING].Hoehe+10;
    TextBereich[TXTCHANCE].rcText.right = TextBereich[TXTCHANCE].rcText.left+3*S2XPIXEL;
    TextBereich[TXTCHANCE].rcText.bottom= TextBereich[TXTCHANCE].rcText.top +  S2YPIXEL;

    Guy.Resource[RES_WATER] = 100;
    Guy.Resource[RES_FOOD]= 100;
    Guy.Resource[RES_HEALTH] = 100;

    for (let i=ROHAST; i<=ROHSCHLEUDER; i++) {
        Guy.Inventar[i]   = 0;
    }

    set_cursor(CUPFEIL);
    Gitter = false;
    MouseAktiv = true;
    PapierText = -1;
    HauptMenue = 0;
    TwoClicks = -1;
    Nacht	= false;
    Frage = -1;
    LastBild = 60;
    Bild = 0;
    //Zeit = Date.now() / 1000;
    Zeit = performance.now() / 1000;
    Spielbeenden = false;
    MousePosition.x = MAXX /2;
    MousePosition.y = MAXY /2;
    Button0down = false;
    Button1down = false;
    SchatzPos.x = -1;
    SchatzPos.y = -1;
    SchatzGef	= false;
}
