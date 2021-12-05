const BMP_FILENAMES = {
	MISC                    :     "gfx/terrain.png",
	PANEL                   :     "gfx/gui.png",
	GUYANI                  :     "gfx/player.png",
	ANIMATION               :     "gfx/animations.png",
	BAUM                    :     "gfx/trees.png",
	CURSORBMP               :     "gfx/cursors.png",
	BUTTONS                 :     "gfx/buttons.png",
	SCHRIFT2                :     "gfx/font2.png",
	SCHRIFT1                :     "gfx/font1.png",
	TEXTFELD                :     "gfx/statusbar.png",
	PAPIER                  :     "gfx/paper.png",
	INVENTARBMP             :     "gfx/inventory.png",
	BAU                     :     "gfx/buildings.png",
	CREDITS                 :     "gfx/credits.png",
	LOGO                    :     "gfx/logo.png",
};
const KXPIXEL = 54; //Breite der Kacheln
const KYPIXEL = 44; //Hoehe der Kacheln
const S1XPIXEL = 20; //Breite der Schrift1
const S1YPIXEL = 20; //Höhe der Schrift1
const S1ABSTAND = 13; //Abstand zum nächsten Buchstaben
const S2XPIXEL = 10; //Breite der Schrift2
const S2YPIXEL = 15; //Höhe der Schrift2
const S2ABSTAND = 10; //Abstand zum nächsten Buchstaben
const MAXXKACH = 60;	//Anzahl der Kacheln
const MAXYKACH = 60;
const MAXSCAPEX = 3360;// Größe der Scapesurface
const MAXSCAPEY = 1700;
const MAXX = 800; //Bildschirmauflösung
const MAXY = 600;
const GIPFEL = 3; //Hoehe des Gipfels
const MAXFLUSS = 1000;//Maximale Flusslänge
const FLUSSANZAHL = 1; //Wieviele Flüsse? Mehr als 1 funktioniert seltsamerweise nicht mehr..
const SKARTEX = 370; //Schatzkartenbreite
const SKARTEY = 370; //Schatzkartenhöhe
const ROUND = Math.round; //Zahlen runden Macro
const floor = Math.floor;

const MEERWELLEN  = 0;
const FLUSS1	= MEERWELLEN+1;
const FLUSS2	= MEERWELLEN+2;
const FLUSS3	= MEERWELLEN+3;
const FLUSS4	= MEERWELLEN+4;
const FLUSS5	= MEERWELLEN+5;
const FLUSS6	= MEERWELLEN+6;
const FLUSS7	= MEERWELLEN+7;
const FLUSS8	= MEERWELLEN+8;
const FLUSS9	= MEERWELLEN+9;
const FLUSS10	= MEERWELLEN+10;
const MUENDUNG1 = MEERWELLEN+11;
const MUENDUNG2 = MEERWELLEN+12;
const MUENDUNG3 = MEERWELLEN+13;
const MUENDUNG4 = MEERWELLEN+14;
const QUELLE1	  = MEERWELLEN+15;
const QUELLE2	  = MEERWELLEN+16;		//Wenn hier was eingefügt wird, auch die FillRohr ändern!!
const QUELLE3	  = MEERWELLEN+17;
const QUELLE4	  = MEERWELLEN+18;
const SCHLEUSE1 = MEERWELLEN+19;
const SCHLEUSE2 = MEERWELLEN+20;
const SCHLEUSE3 = MEERWELLEN+21;
const SCHLEUSE4 = MEERWELLEN+22;
const SCHLEUSE5 = MEERWELLEN+23;
const SCHLEUSE6 = MEERWELLEN+24;
const BAUM1	   = 25;
const BAUM2	  = BAUM1+1;
const BAUM3	  = BAUM1+2;
const BAUM4	  = BAUM1+3;
const BUSCH	  = BAUM1+4;
const BAUM1DOWN = BAUM1+5;
const BAUM2DOWN = BAUM1+6;
const BAUM3DOWN = BAUM1+7;
const BAUM4DOWN = BAUM1+8;
const BAUMGROSS = BAUM1+9;
const FEUER	  = BAUM1+10;
const WRACK	  = BAUM1+11;
const WRACK2	=   BAUM1+12;
const FELD	   = 38;
const ZELT     =  FELD+1;
const BOOT	  = FELD+2;
const ROHR	 =  FELD+3;
const SOS		  = FELD+4;
const HAUS1	 =  FELD+5;
const HAUS2	 =  FELD+6;
const HAUS3	  = FELD+7;
const FEUERSTELLE = FELD+8;
const CUPFEIL	   = 47;
const CURICHTUNG = CUPFEIL+1;
const CUUHR	  = CUPFEIL+2;
const GUYLINKS   = 50;
const GUYOBEN	  = GUYLINKS+1;
const GUYRECHTS = GUYLINKS+2;
const GUYUNTEN  = GUYLINKS+3;
const GUYSUCHEN = GUYLINKS+4;
const GUYESSEN  = GUYLINKS+5;
const GUYTRINKEN= GUYLINKS+6;
const GUYFAELLEN= GUYLINKS+7;
const GUYWARTEN = GUYLINKS+8;
const GUYFELD   = GUYLINKS+9;
const GUYBINDENOBEN = GUYLINKS+10;
const GUYBINDENUNTEN = GUYLINKS+11;
const GUYSCHLAFEN	  = GUYLINKS+12;
const GUYSCHLAFZELT = GUYLINKS+13;
const GUYGEHINZELT  = GUYLINKS+14;
const GUYHINLEGEN   = GUYLINKS+15;
const GUYAUFSTEHEN  = GUYLINKS+16;
const GUYANGELN1LINKS = GUYLINKS+17;
const GUYANGELN1OBEN  = GUYLINKS+18;
const GUYANGELN1RECHTS = GUYLINKS+19;
const GUYANGELN1UNTEN = GUYLINKS+20;
const GUYANGELN2LINKS = GUYLINKS+21;
const GUYANGELN2OBEN  = GUYLINKS+22;
const GUYANGELN2RECHTS = GUYLINKS+23;
const GUYANGELN2UNTEN  = GUYLINKS+24;
const GUYANGELN3LINKS = GUYLINKS+25;
const GUYANGELN3OBEN  = GUYLINKS+26;
const GUYANGELN3RECHTS = GUYLINKS+27;
const GUYANGELN3UNTEN  = GUYLINKS+28;
const GUYSCHLAGEN    = GUYLINKS+29;
const GUYBOOTLINKS = GUYLINKS+30;
const GUYBOOTOBEN    = GUYLINKS+31;
const GUYBOOTRECHTS  = GUYLINKS+32;
const GUYBOOTUNTEN   = GUYLINKS+33;
const GUYBOOTANGELN1 = GUYLINKS+34;
const GUYBOOTANGELN2 = GUYLINKS+35;
const GUYBOOTANGELN3 = GUYLINKS+36;
const GUYTAUCHEN1	=	GUYLINKS+37;
const GUYTAUCHEN2	=	GUYLINKS+38;
const GUYTAUCHEN3	=	GUYLINKS+39;
const GUYHAMMER	= GUYLINKS+40;
const GUYKLETTERN1	= GUYLINKS+41;
const GUYKLETTERN2	= GUYLINKS+42;
const GUYHAMMER2  	= GUYLINKS+43;
const GUYGEHINHAUS	= GUYLINKS+44;
const GUYSCHLAFHAUS   = GUYLINKS+45;
const GUYGEHAUSHAUS	= GUYLINKS+46;
const GUYANZUENDEN	= GUYLINKS+47;
const GUYAUSSCHAU		= GUYLINKS+48;
const GUYSCHAUFELN	= GUYLINKS+49;
const GUYSCHIFF		= GUYLINKS+50;
const GUYSCHIFFDOWN	= GUYLINKS+51;
const GUYSCHWIMMEN	= GUYLINKS+52;
const GUYTOD		= GUYLINKS+53;
const GUYBOOTTOD	= GUYLINKS+54;
const GUYBOOTWARTEN	= GUYLINKS+55;
const GUYSCHLEUDER	= GUYLINKS+56;
const BUTTGITTER   = 107;
const BUTTANIMATION = BUTTGITTER+1;
const BUTTBEENDEN   = BUTTGITTER+2;
const BUTTNEU		  = BUTTGITTER+3;
const BUTTTAGNEU	  = BUTTGITTER+4;
const BUTTSOUND	  = BUTTGITTER+5;
const BUTTAKTION   = BUTTGITTER+6;
const BUTTBAUEN    = BUTTGITTER+7;
const BUTTINVENTAR = BUTTGITTER+8;
const BUTTWEITER   = BUTTGITTER+9;
const BUTTSTOP     = BUTTGITTER+10;
const BUTTABLEGEN  = BUTTGITTER+11;
const BUTTSUCHEN    = 119;
const BUTTESSEN     = BUTTSUCHEN+1;
const BUTTSCHLAFEN  = BUTTSUCHEN+2;
const BUTTFAELLEN   = BUTTSUCHEN+3;
const BUTTANGELN    = BUTTSUCHEN+4;
const BUTTANZUENDEN = BUTTSUCHEN+5;
const BUTTAUSSCHAU  = BUTTSUCHEN+6;
const BUTTSCHATZKARTE = BUTTSUCHEN+7;
const BUTTSCHATZ      = BUTTSUCHEN+8;
const BUTTSCHLEUDER   = BUTTSUCHEN+9;
const BUTTZELT   = 129;
const BUTTFELD   = BUTTZELT+1;
const BUTTBOOT   = BUTTZELT+2;
const BUTTROHR   = BUTTZELT+3;
const BUTTSOS	   = BUTTZELT+4;
const BUTTHAUS1  = BUTTZELT+5;
const BUTTHAUS2  = BUTTZELT+6;
const BUTTHAUS3  = BUTTZELT+7;
const BUTTFEUERST = BUTTZELT+8;
const BUTTFRAGEZ	= BUTTZELT+9;
const BUTTDESTROY = BUTTZELT+10;
const SAEULE1	   = 140;
const SAEULE2	   = SAEULE1+1;
const SAEULE3	   = SAEULE1+2;
const ROHAST	   = 143;
const ROHSTAMM   = ROHAST+1;
const ROHSTEIN   = ROHAST+2;
const ROHAXT     = ROHAST+3;
const ROHBLATT   = ROHAST+4;
const ROHEGGE	   = ROHAST+5;
const ROHLIANE   = ROHAST+6;
const ROHANGEL   = ROHAST+7;
const ROHHAMMER  = ROHAST+8;
const ROHFERNROHR = ROHAST+9;
const ROHSTREICHHOLZ = ROHAST+10;
const ROHSCHAUFEL = ROHAST+11;
const ROHKARTE	= ROHAST+12;
const ROHSCHLEUDER = ROHAST+13;
const ROEMISCH1  = 157;
const ROEMISCH2  = ROEMISCH1+1;
const INVPAPIER  = 159;
const RING	   = INVPAPIER+1;
const KREUZ	   = INVPAPIER+2;
const JA		 =   INVPAPIER+3;
const NEIN	   = INVPAPIER+4;
const SONNE	   = INVPAPIER+5;
const PROGRAMMIERUNG = 165;
const DIRKPLATE	 =   PROGRAMMIERUNG+1;
const MATTHIAS	 =   PROGRAMMIERUNG+2;
const TOBIAS		=   PROGRAMMIERUNG+3;
const SIGRID		  =  PROGRAMMIERUNG+4;
const SOUNDS		   = PROGRAMMIERUNG+5;
const PATHFINDING	   = PROGRAMMIERUNG+6;
const JOHN		   = PROGRAMMIERUNG+7;
const HEIKO		   = PROGRAMMIERUNG+8;
const GISELA		 =   PROGRAMMIERUNG+9;
const WEITEREHILFE   = PROGRAMMIERUNG+10;
const TESTSPIELER	   = PROGRAMMIERUNG+11;
const SCHWARZ		   = PROGRAMMIERUNG+12;
const MUSIK		   = PROGRAMMIERUNG+13;
const DPSOFTWARE	 =   PROGRAMMIERUNG+14;
const TRANSLATION	 =   PROGRAMMIERUNG+15;
const MARK	 =   PROGRAMMIERUNG+16;
const BILDANZ		  =  MARK+1; //Wieviele Bilder

//Sounds
const WAVNICHTS	 = 0;
const WAVSTURM	 = 1;
const WAVSCHWIMMEN    = WAVSTURM+1;
const WAVPLATSCH		= WAVSTURM+2;
const WAVFAELLEN		= WAVSTURM+3;
const WAVSCHLAGEN		= WAVSTURM+4;
const WAVSCHLEUDER	= WAVSTURM+5;
const WAVSCHAUFELN	= WAVSTURM+6;
const WAVHAMMER		= WAVSTURM+7;
const WAVCRASH		= WAVSTURM+8;
const WAVSCHNARCHEN	= WAVSTURM+9;
const WAVTRINKEN	= 	WAVSTURM+10;
const WAVKNISTERN	= 	WAVSTURM+11;
const WAVANGEL		= WAVSTURM+12;
const WAVWALD		 = 14;
const WAVFEUER		= WAVWALD+1;
const WAVBRANDUNG	= 	WAVWALD+2;
const WAVBAUMFAELLT	= WAVWALD+3;
const WAVFLUSS		= WAVWALD+4;
const WAVKLICK	 = 19;
const WAVKLICK2		= WAVKLICK+1;
const WAVLOGO		= 	WAVKLICK+2;
const WAVABSPANN	= 	WAVKLICK+3;
const WAVWOLF		= 	WAVKLICK+4;
const WAVERFINDUNG	= WAVKLICK+5;
const WAVANZ		= 	WAVERFINDUNG+1;	//Anzahl der Sounds

//Aktionen
const AKNICHTS	 = 0;
const AKSUCHEN	    = 1;
const AKESSEN 	    = 2;
const AKTRINKEN 	    = 3;
const AKFAELLEN 	    = 4;
const AKFELD  	    = 5;
const AKTAGENDE	 = 6;
const AKGERETTET      = 7;
const AKZELT		 = 8;
const AKSCHLAFEN	 = 9;
const AKABBRUCH	   = 10;
const AKANGELN	   = 11;
const AKBOOT		   = 12;
const AKABLEGEN	   = 13;
const AKANLEGEN      = 14;
const AKROHR		   = 15;
const AKDESTROY	   = 16;
const AKSOS		   = 17;
const AKHAUS1		   = 18;
const AKHAUS2		   = 19;
const AKHAUS3		   = 20;
const AKFEUERSTELLE  = 21;
const AKANZUENDEN    = 22;
const AKAUSSCHAU	   = 23;
const AKSCHATZ	   = 24;
const AKINTRO		   = 25;
const AKSCHLEUDER	   = 26;
const AKSPIELVERLASSEN = 27;
const AKNEUBEGINNEN  = 28;
const AKTOD		   = 29;
const AKTAGNEUBEGINNEN = 30;

//Menüs
const MEKEINS		 = 0;
const MEAKTION	 = 1;
const MEBAUEN	     = 2;
const MEINVENTAR	 = 3;

//Textfelder
const TXTTEXTFELD	 = 0;
const TXTFPS		 = 1;
const TXTTAGESZEIT = 2;
const TXTCHANCE	 = 3;
const	TXTPAPIER	 = 4; //Muss!!! als letztes stehen
const TEXTANZ		 = 5; //Wieviele Textbreiche

//Resourcen
const WASSER		 = 0;
const NAHRUNG		 = 1;
const GESUNDHEIT	 = 2;

//Spielzustände
const SZNICHTS	 = 0;
const SZINTRO		 = 1;
const SZSPIEL		 = 2;
const SZABSPANN	 = 3;
const SZGERETTET	 = 4;
const SZLOGO		 = 5;

const ZWEID = (x = 0, y = 0) => ({
	x, y,
});

//Die Eckkoordinaten der Kacheln (Achtung: mit überlappendem Rand)
const EckKoor = [
//		0				1				2				3				Ecke
	[ZWEID(-1,29),	ZWEID(26,15),	ZWEID(54,30),	ZWEID(27,44)],//0
	[ZWEID(-1,13),	ZWEID(26,15),	ZWEID(54,30),	ZWEID(27,28)],//1
	[ZWEID(-1,29),	ZWEID(26,15),	ZWEID(54,14),	ZWEID(27,28)],//2
	[ZWEID(-1,29),	ZWEID(26,-1),	ZWEID(54,14),	ZWEID(27,44)],//3
	[ZWEID(-1,13),	ZWEID(26,-1),	ZWEID(54,30),	ZWEID(27,44)],//4
	[ZWEID(-1,13),	ZWEID(26,15),	ZWEID(54,30),	ZWEID(27,44)],//5
	[ZWEID(-1,29),	ZWEID(26,15),	ZWEID(54,30),	ZWEID(27,28)],//6		Kacheltyp
	[ZWEID(-1,29),	ZWEID(26,15),	ZWEID(54,14),	ZWEID(27,44)],//7
	[ZWEID(-1,29),	ZWEID(26,-1),	ZWEID(54,30),	ZWEID(27,44)],//8
	[ZWEID(-1,13),	ZWEID(26,-1),	ZWEID(54,14),	ZWEID(27,44)],//9
	[ZWEID(-1,13),	ZWEID(26,-1),	ZWEID(54,30),	ZWEID(27,28)],//10
	[ZWEID(-1,13),	ZWEID(26,15),	ZWEID(54,14),	ZWEID(27,28)],//11
	[ZWEID(-1,29),	ZWEID(26,-1),	ZWEID(54,14),	ZWEID(27,28)],//12
];

const Vierecke = [ //0=Passt nicht 1=1runter 2=gleiche Hoehe 3=1hoch
//		  0	  1	  2	  3	  4	  5	  6	  7	  8	  9	 10	 11	 12
	[	[2,0,1,0,2,2,0,0,2,0,0,1,1],//0
		[2,1,0,2,0,0,0,2,2,0,1,1,0],//1
		/*0*/	[2,0,2,0,1,0,2,2,0,1,1,0,0],//2 Kante
		[2,2,0,1,0,2,2,0,0,1,0,0,1] //3
	],
	[	[0,2,0,0,0,0,2,0,0,0,2,0,0],
		[2,1,0,2,0,0,0,2,2,0,1,1,0],
		/*1*/	[0,2,0,0,0,2,0,0,0,0,0,2,0],
		[3,3,0,2,0,3,3,0,0,2,0,0,2]
	],
	[	[2,0,1,0,2,2,0,0,2,0,0,1,1],
		[0,0,2,0,0,0,2,0,0,0,0,0,2],
		/*2*/	[3,0,3,0,2,0,3,3,0,2,2,0,0],
		[0,0,2,0,0,0,0,2,0,0,0,2,0]
	],
	[	[0,0,0,2,0,0,0,2,0,2,0,0,0],
		[3,2,0,3,0,0,0,3,3,0,2,2,0],
		/*3*/	[0,0,0,2,0,0,0,0,2,0,0,0,2],
		[2,2,0,1,0,0,2,0,0,1,0,0,1]
	],
	[	[3,0,2,0,3,3,0,0,3,0,0,2,2],
		[0,0,0,0,2,2,0,0,0,2,0,0,0],
		/*4*/	[2,0,2,0,0,0,2,2,0,1,1,0,0],
		[0,0,0,0,2,0,0,0,2,0,2,0,0]
	],//  0	  1	  2	  3	  4	  5	  6	  7	  8	  9	 10	 11	 12
	[	[0,2,0,0,0,0,2,0,0,0,2,0,0],
		[2,1,0,2,0,0,0,2,2,0,1,1,0],
		/*5*/	[2,0,2,0,1,0,2,2,0,1,1,0,0],
		[0,0,0,0,2,0,0,0,2,0,2,0,0]
	],
	[	[2,0,1,0,2,2,0,0,2,0,0,1,1],
		[2,1,0,2,0,0,0,2,2,0,1,1,0],
		/*6*/	[0,2,0,0,0,2,0,0,0,0,0,2,0],
		[0,0,2,0,0,0,0,2,0,0,0,2,0]
	],
	[	[2,0,1,0,2,2,0,0,2,0,0,1,1],
		[0,0,2,0,0,0,2,0,0,0,0,0,2],
		/*7*/	[0,0,0,2,0,0,0,0,2,0,0,0,2],
		[2,2,0,1,0,2,2,0,0,1,0,0,1]
	],
	[	[0,0,0,2,0,0,0,2,0,2,0,0,0],
		[0,0,0,0,2,2,0,0,0,2,0,0,0],
		/*8*/	[2,0,2,0,1,0,2,2,0,1,1,0,0],
		[2,2,0,1,0,2,2,0,0,1,0,0,1]
	],
	[	[3,0,2,0,3,3,0,0,3,0,0,2,2],
		[3,2,0,3,0,0,0,3,3,0,2,2,0],
		/*9*/	[0,0,0,2,0,0,0,0,2,0,0,0,2],
		[0,0,0,0,2,0,0,0,2,0,2,0,0]
	],//  0	  1	  2	  3	  4	  5	  6	  7	  8	  9	 10	 11	 12
	[	[3,0,2,0,3,3,0,0,3,0,0,2,2],
		[0,0,0,0,2,2,0,0,0,2,0,0,0],
		/*10*/	[0,2,0,0,0,2,0,0,0,0,0,2,0],
		[3,3,0,2,0,3,3,0,0,2,0,0,2]
	],
	[	[0,2,0,0,0,0,2,0,0,0,2,0,0],
		[0,0,2,0,0,0,2,0,0,0,0,0,2],
		/*11*/	[3,0,3,0,2,0,3,3,0,2,2,0,0],
		[3,3,0,2,0,3,3,0,0,2,0,0,2]
	],
	[	[0,0,0,2,0,0,0,2,0,2,0,0,0],
		[3,2,0,3,0,0,0,3,3,0,2,2,0],
		/*12*/	[3,0,3,0,2,0,3,3,0,2,2,0,0],
		[0,0,2,0,0,0,0,2,0,0,0,2,0]
	],
];

//Bilder
const Misc		= "MISC";
const Panel		= "PANEL";
const GuyAni	= "GUYANI";
const Animation = "ANIMATION";
const Schrift1	= "SCHRIFT1";
const Schrift2	= "SCHRIFT2";
const TextFeld	= "TEXTFELD";
const Papier	= "PAPIER";
const Baum		= "BAUM";
const Cursorbmp = "CURSORBMP";
const Buttons	= "BUTTONS";
const Inventarbmp="INVENTARBMP";
const Bau		= "BAU";
const Credits	= "CREDITS";
const Logo		= "LOGO";

const messages_de = {
	GITTERAN                : "Gitternetz anschalten",
	GITTERAUS               : "Gitternetz ausschalten",
	MEAKTIONAUF             : "Oeffnet das Aktionsmenue",
	MEAKTIONZU              : "Schliesst das Aktionsmenue",
	BEGINNSUCHEN            : "Durchsuche die Umgebung",
	BEGINNFAELLEN           : "Baum faellen",
	SOSPAET                 : "Schon so spaet?",
	BEGINNESSEN             : "Essen und trinken",
	MEINVENTARAUF           : "Oeffnet das Inventar",
	MEINVENTARZU            : "Schliesst das Inventar",
	FREI                    : ".",
	AST                     : "Ast",
	STEIN                   : "Stein",
	ROHASTGEFUNDEN          : "Nach ewigem Suchen in der prallen Sonne habe ich einen Ast gefunden. Genau das, was mir noch gefehlt hat. Die Suche hat sich gelohnt.",
	ROHASTZUVIEL            : "Nachdem ich mich muehsam durch die Gegend gewuehlt habe, finde ich einen wunderschoenen Ast. " +
		"Allerdings schleppe ich schon so viele Aeste mit mir herum, dass ich ihn wieder wegwerfe.",
	ROHSTEINGEFUNDEN        : "In der tropischen Hitze habe ich mir in den letzen Minuten die naehere Umgebung genauer angeschaut. " +
		"Besonders aufgefallen sind mir diese wunderschoenen Steine. Diese drei kann ich gut gebrauchen und packe sie ein.",
	ROHSTEINZUVIEL          : "Jaa, ich habe etwas gefunden!! Einen Stein!! Mir reichen allerdings die, die ich schon in der Tasche habe, " +
		"und werfe ihn deshalb bis ins Meer (Hoffentlich habe ich nicht das mich rettende Schiff getroffen!).",
	NICHTSGEFUNDEN          : "Selbst nachdem ich die Gegend sehr genau unter die Lupe genommen habe, habe ich absolut nichts gefunden.",
	AXT                     : "Axt",
	KEINESSENTRINKEN        : "Hier gibt es weder etwas zu essen noch zu trinken.",
	BAUEAXT                 : "Mit viel Geschick habe ich einen Stein mit einem Ast verbunden und eine Axt erhalten. " +
		"Damit bin ich nun in der Lage, Holz zu bearbeiten, zum Beispiel Baeume faellen. /z Ich glaube, ich koennte mir noch etwas aus einem Ast und einem Stein bauen.",
	STEINPLUSASTNICHTS      : "Leider gibt es nichts mehr, was ich mit einem Stein und einem Stock bauen kann.",
	NICHTBASTELN            : "Aus diesen beiden Sachen kann ich mir nichts Sinnvolles bauen. Vielleicht sollte ich zwei andere Dinge probieren?",
	ROHBLATTGEFUNDEN        : "Mmh, das ist aber ein grosses Blatt. Das kann ich sicher noch gebrauchen, " +
		"ich werde es vorsichtshalber mitnehmen. Wer weiss, ob ich noch einmal so etwas Besonderes finde.",
	ROHBLATTZUVIEL          : "Schon wieder so ein seltenes Blatt. Sie scheinen doch relativ haeufig zu sein, deshalb werde ich es nicht mitnehmen.",
	BLATT                   : "Blatt",
	ROHSTAMMZUVIEL          : "Noch mehr Baumstaemme brauche ich im Moment nicht. ",
	MEBAUENAUF              : "Oeffnet das Baumenue",
	MEBAUENZU               : "Schliesst das Baumenue",
	BEGINNFELD              : "Feld anlegen",
	GEGENDNICHT             : "Diese Gegend ist leider nicht geeignet.",
	BAUEEGGE                : "Nachdem ich einen laenglichen Stein an einen Ast gebunden habe, sieht das ganze wie " +
		"eine Egge aus. Damit sollte es mir moeglich sein, ein Feld anzulegen, so dass ich nicht mehr nur auf diese laestigen Buesche angewiesen bin.",
	EGGE                    : "Egge",
	TAGENDE1                : "Tag /a ist nun zu Ende. Leider habe ich es nicht mehr bis zu einer angenehmen " +
		"Schlafstelle geschafft, deshalb muss ich heute nacht unter freien Himmel schlafen. " +
		"Die wilden Tiere lassen mir keine Ruhe, deshalb sinkt meine Gesundheit auf /b %. Meine Chance gerettet zu werden betraegt /c %.",
	GERETTET                : "Endlich ein Schiff!! Dank meiner intensiven Bemuehungen wurde ich entdeckt und nun " +
		"ankert das Schiff vor der Insel. Soll ich diese trostlose Insel verlassen? /d ",
	BEGINNZELT              : "Zelt bauen",
	ROHSTOFFNICHT           : "Ich habe leider nicht genug Rohstoffe, um den Bau fortzusetzen.",
	KEINBAUM                : "Hier steht leider kein Baum.",
	WEITER                  : "Vorgang fortsetzen",
	STOP                    : "Vorgang unterbrechen",
	TAGENDE2                : "Tag /a ist nun zu Ende. Zum Glueck bin ich rechtzeitig zu meinem Zelt gekommen, " +
		"so lassen mich wenigstens die Fledermaeuse in Ruhe. Allerdings beissen mich wilde Tiere in meine Fuesse, " +
		"deshalb sinkt meine Gesundheit auf /b %. Meine Chance gerettet zu werden betraegt /c %.",
	BEGINNSCHLAFEN          : "1 Stunde schlafen",
	WIESETEXT               : "Wiese",
	MEERTEXT                : "Meer",
	STRANDTEXT              : "Strand",

	TREIBSANDTEXT           : "Treibsand",
	FEUCHTEWIESETEXT        : "feuchte Wiese",
	BAUMTEXT                : "Baum",
	FELDTEXT                : "Feld",
	ZELTTEXT                : "Zelt",
	BUSCHTEXT               : "Busch",
	MIT                     : "mit",
	LIANE                   : "Liane ",
	ROHLIANEGEFUNDEN        : "Mit sehr viel Muehe habe ich es geschafft, eine Liane vom Baum abzureissen. " +
		"Mit Lianen kann man sehr viel anstellen, deshalb werde ich sie die naechste Zeit mit mir herumschleppen.",
	ROHLIANEZUVIEL          : "So nützlich sind Lianen dann doch wieder nicht, dass ich so viele davon mit mir herumtragen muss.",
	ANGEL                   : "Angel",
	BAUEANGEL               : "Dieser duenne, biegsame Ast und diese Liane lassen sich vorzueglich zu einer Angel verbinden. " +
		"Endlich muss ich nicht mehr vegetarisch leben und kann mir ein paar fette Forellen fischen.",
	BEGINNANGELN            : "Angeln",
	KEINWASSER              : "Wo soll ich denn hier angeln?",
	BOOTTEXT                : "Einbaum",
	BEGINNBOOT              : "Einbaum bauen",

	STAMM                   : "Baumstamm",
	BEGINNABLEGEN           : "An- und Ablegen",
	TAGENDE3                : "Tag /a ist nun zu Ende. Es ist stockdunkel, ich treibe ab und werde wohl sterben. Das wird mir eine Lehre sein. ",
	FLUSSTEXT               : "Fluss",
	BEGINNROHR              : "Bewaesserungsanlage bauen",
	ROHRTEXT                : "Bewaesserungsrohr",
	BEGINNDESTROY           : "Bauwerk abreissen",
	KEINBAUWERK             : "Hier ist leider kein Bauwerk, das ich abreissen kann.",
	BEGINNSOS               : "S.O.S. schreiben",
	SOSTEXT                 : "S.O.S.",
	BAUMZUGROSS             : "Der ist mir eine Nummer zu gross.",
	BEGINNHAUS1             : "Leiter fuer Baumhaus bauen",
	HAUS1TEXT               : "Baum und Leiter",
	HAMMER                  : "Hammer",
	BEGINNHAUS2             : "Plattform fuer Baumhaus bauen",
	HAUS2TEXT               : "Baum und Plattform",

	HAUS3TEXT               : "Baum und Baumhaus",
	BEGINNHAUS3             : "Baumhaus bauen",
	TAGENDE4                : "Tag /a ist nun zu Ende. Bin ich froh, dass ich mir dieses schoene Baumhaus gebaut habe. " +
		"So lassen mich die wilden Tiere in Frieden. Ich schlafe ausgezeichnet und meine Gesundheit steigt auf /b %. Meine Chance gerettet zu werden betraegt /c %.",
	BAUMZUKLEIN             : "Dieser Baum ist eine Nummer zu klein.",
	NICHTOHNELEITER         : "Ohne Leiter kann ich keine Plattform bauen.",
	NICHTOHNEPLATTFORM      : "Das Baumhaus kann ich nur auf einer Plattform bauen.",
	CHANCETEXT              : "Meine Chance heute gerettet zu werden",
	BAUMGROSSTEXT           : "grossem Baum",
	FEUERSTELLETEXT         : "Feuerstelle",
	BEGINNFEUERSTELLE       : "Holz fuer Feuerstelle aufstapeln",
	FEUERTEXT               : "Signalfeuer",
	BEGINNANZUENDEN         : "Feuerstelle anzuenden",
	KEINEFEUERST            : "Ich kann nur Feuerstellen anzuenden",
	BEGINNAUSSCHAU          : "Nach Rettung Ausschau halten",
	FERNROHR                : "Fernrohr",
	BEGINNSCHATZKARTE       : "Schatzkarte anschauen",

	SCHAUFEL                : "Schaufel",
	STREICHHOLZ             : "Streichhoelzer",
	BEGINNSCHATZ            : "Nach Schatz graben",
	SCHATZGEFUNDEN          : "Hurra!! Ich habe einen alten Piratenschatz gefunden. " +
		"Mit Hoffnung auf einen grossartigen Schatz oeffnete ich die alte modrige Kiste und entdeckte ... " +
		"nur eine Streichholzschachtel. Was solls, ich kann mir hier eh nichts kaufen.",
	KEINSCHATZ              : "Obwohl ich die ganze Gegend hier umgegraben habe, habe ich keinen Schatz gefunden. " +
		"Vielleicht sollte ich mir erst eine Schatzkarte anschauen.",
	WRACKTEXT               : "Schiffswrack",
	FERNROHRGEFUNDEN        : "Ich habe das gesamte Wrack abgesucht.Als ich in die Kapitaenskajute getaucht bin, " +
		"habe ich mein altes Fernrohr gefunden. Damit kann ich nach Schiffen Ausschau halten und meine Chance, " +
		"gerettet zu werden, steigt. /z Auf dem Weg nach draussen entdeckte ich noch den Hammer und einige Naegel " +
		"vom Schiffszimmermann. Damit kann ich mir eine stabilere Behausung bauen.",
	INTROTEXT               : "Jetzt habe ich den Schlamassel: Gestrandet auf einer einsamen Insel mitten im Pazifik. " +
		"Ich sollte mich schnellstens nach Suesswasser und Nahrung umsehen. Vielleicht kann ich mir auch ein paar Werkzeuge bauen.",
	NICHTSGEFUNDEN2         : "Ich habe den ganzen Grund abgesucht, aber nichts von Interesse gefunden.",
	KARTE                   : "Schatzkarte",
	KARTEGEFUNDEN           : "Ich tauchte durch das uralte Piratenschiff, allerdings ohne etwas zu finden, " +
		"bis ich ploetzlich das Skelett des Kapitains fand. In der Hand hielt er noch eine erstaunlich gut " +
		"erhaltene Schatzkarte. Nachdem ich sie an mich genommen hatte, nahm ich mir noch eine Schaufel mit. " +
		"Jetzt kann ich mir die Zeit mit einer Schatzsuche vertreiben. ",
	ANIMATIONAUS            : "Wasseranimationen ausschalten",
	ANIMATIONAN             : "Wasseranimationen anschalten",
	ASTPLUSLIANENICHTS      : "Mehr kann ich mir auch mit einer Liane und einem Ast nicht bauen.",
	SCHLEUDER               : "Steinschleuder",
	STEINPLUSLIANENICHTS    : "Mir faellt nichts mehr ein, was ich mir aus einer Liane und einem Stein bauen könnte.",

	BAUESCHLEUDER           : "Ich knotete eine Schlaufe in die Liane und jetzt kann man sie als Steinschleuder " +
		"missbrauchen. Einfach noch den Stein in die Schlaufe gelegt und ich kann auf Jagd gehen. " +
		"Da es am Tag auf dieser Insel nur Voegel zu geben scheint, sollte ich mich darauf beschraenken, " +
		"diese Tiere von den Baeumen zu schiessen.",
	KEINVOGEL               : "Hier sind keine Voegel.",
	BEGINNSCHLEUDER         : "Auf Vogeljagd gehen",
	NICHTAUFWASSERSCHLAFEN  : "In diesem kleinen Boot ist es zum Schlafen zu gefaehrlich.",
	WELLENZUHOCH            : "Die Wellen sind zu hoch, um etwas zu sehen.",
	GRABENBEDINGUNGEN       : "Ich kann nur auf flachen und freien Gegenden nach einem Schatz graben.",
	FELDBEDINGUNGEN         : "Felder kann ich nur auf flachen, feuchten und freien Wiesen anlegen.",
	ZELTBEDINGUNGEN         : "Zelte kann ich nur auf einer flachen und freien Gegend bauen.",
	BOOTBEDINGUNGEN         : "Boote kann ich nur auf einem freien Strandabschnitt bauen.",
	ROHRBEDINGUNGEN         : "Rohre kann ich nur auf flachen und freien Gegenden bauen.",
	SOSBEDINGUNGEN          : "SOS kann ich nur auf flachen und freien Gegenden schreiben.",
	FEUERSTELLENBEDINGUNGEN : "Feuerstellen kann ich nur in flachen und freien Landschaften anlegen.",
	BOOTHILFE               : "Ich habe nun mein erstes Boot gebaut. (Zum An- und Ablegen auf den 'Anker-Knopf' " +
		"klicken.) Anlegen kann ich nur, wenn auf dem Strand nichts im Weg ist. Auch sollte ich immer die Zeit im " +
		"Auge haben, da ich eine Nacht auf hoher See nicht ueberleben wuerde.",
	FELDHILFE               : "Mein erstes Feld ist fertig. Das Getreide wird von ganz allein wachsen und, "+
		"wenn es schoen gelb ist, kann ich es essen. ",
	FEUERSTELLEHILFE        : "Jetzt habe ich einen grossen Haufen Holz aufgebaut. Womit kann ihn anzuenden? " +
		"Das Feuer wuerde eine Weile brennen und meine Chance erhoehen, gerettet zu werden. " +
		"Je hoeher die Feuerstelle liegt, desto besser.",
	HAUS3HILFE              : "Meine Baumhaus ist endlich fertig. " +
		"Dort kann ich jederzeit ein Schlaefchen machen und mich erholen. Wenn ich dort uebernachten will, " +
		"sollte ich puenktlich um 18.00 Uhr, wenn es dunkel wird, in unmittelbarer Naehe sein.",

	ROHRHILFE               : "Jetzt besitze ich eine eigene Bewaesserungsanlage. Sie wird sich mit Wasser fuellen, " +
		"wenn ich sie in der Naehe eines Flusses gebaut habe. Damit werden die anliegenden Wiesen befeuchtet, " +
		"so dass ich auch dort Felder anlegen kann. Diese gehen natuerlich auch wieder ein, wenn ich das Rohr abreisse.",
	SOSHILFE                : "So, jetzt muessten mich vorbeifliegende Flugzeuge bemerken und Hilfe schicken. " +
		"Auf dem Strand ist das SOS besonders gut zu lesen.",
	ZELTHILFE               : "Endlich habe ich ein Dach ueber dem Kopf. Dort kann ich jederzeit ein Nickerchen machen. " +
		"Wenn ich es auch in der Nacht benutzen will, muss ich mich, wenn es dunkel wird (18.00 Uhr), in der Naehe befinden.",
	SPIELVERLASSEN          : "Willst du das Spiel wirklich verlassen? /z (Der Spielstand wird automatisch gespeichert) /d ",
	BEENDEN                 : "Spiel beenden",
	NEUBEGINNEN             : "Willst du das Spiel neu starten? /d ",
	NEU                     : "Spiel neu starten",
	TAGNEU                  : "Willst du den Tag noch einmal neu beginnen? /d ",
	TOD                     : "Ich fuehle mich ploetzlich ganz seltsam. Ich spuere, dass ich sterbe...",
	TAGENDE5                : "Tag /a ist nun zu Ende. Ich fuehle mich nicht besonders gut und werde die Nacht wohl nicht ueberleben. ",
	TAGNEU2                 : "Tag neu starten",
	SOUNDAN                 : "Sound anstellen",
	SOUNDAUS                : "Sound austellen",
	KEINSOUND               : "Leider kein Sound",
};

const messages_en = {
	GITTERAN                : "Turn grid on",
	GITTERAUS               : "Turn grid off",
	MEAKTIONAUF             : "Opens the Action Menu",
	MEAKTIONZU              : "Closes the Action Menu",
	BEGINNSUCHEN            : "Search the surroundings",
	BEGINNFAELLEN           : "Cut tree",
	SOSPAET                 : "It's that late?",
	BEGINNESSEN             : "Eat and drink",
	MEINVENTARAUF           : "Opens the Inventory",
	MEINVENTARZU            : "Closes the Inventory",
	FREI                    : ".",
	AST                     : "Branch",
	STEIN                   : "Stone",
	ROHASTGEFUNDEN          : "After searching forever in the blazing sun, I found a branch-- " +
		"exactly what I've been looking for. The search was worth it.",
	ROHASTZUVIEL            : "After digging around laboriously in the area, I found a beautiful " +
		"branch. I'm carrying around so many branches already that I end up throwing it away.",
	ROHSTEINGEFUNDEN        : "In the tropical heat I looked more closely at the surrounding area " +
		"these past few minutes. These beautiful stones caught my attention. I could use these " +
		"three quite well and take them along.",
	ROHSTEINZUVIEL          : "YESSS!! Another stone!! I have plenty of them already in my " +
		"pockets and decide to throw the extra stones into the sea (Hopefully I didn't hit a " +
		"rescue ship with them!).",
	NICHTSGEFUNDEN          : "After looking through the area very closely, I managed to find " +
		"absolutely nothing. ",
	AXT                     : "Ax",
	KEINESSENTRINKEN        : "There is neither anything to eat nor to drink here.",
	BAUEAXT                 : "With great skill, I combined a stone with a branch and made an " +
		"ax. With this, I'm now in a situation where I can prepare wood, for example:  chop down " +
		"trees. /z I bet I could build something else from a branch and a stone.",
	STEINPLUSASTNICHTS      : "Unfortunately, there's nothing else that I can build with a stone " +
		"and a branch.",
	NICHTBASTELN            : "I can't build anything sensible from these two things.  " +
		"Maybe I could try a couple of other things?",
	ROHBLATTGEFUNDEN        : "Hmmmm, that's a big leaf! I could use that, I bet:  I'd better " +
		"take it along just to be safe.  Who knows whether I'll ever come across something this " +
		"unusual again?",
	ROHBLATTZUVIEL          : "Yet another very rare leaf.  They show up quite frequently.  " +
		"Therefore, I won't bother taking it along.",
	BLATT                   : "Leaf",
	ROHSTAMMZUVIEL          : "I don't need any more tree trunks right now. ",
	MEBAUENAUF              : "Opens the Build Menu",
	MEBAUENZU               : "Closes the Build Menu",
	BEGINNFELD              : "Plow field",
	GEGENDNICHT             : "This area is not suitable, unfortunately.",
	BAUEEGGE                : "After tying an oblong stone to a branch, the whole thing looks " +
		"like a harrow or a hoe. With this, I should be able to cultivate a field so that I don't " +
		"have rely upon looking for these tedious bushes.",
	EGGE                    : "Hoe",
	TAGENDE1                : "Day /a is over. Unfortunately, I haven't been successful in " +
		"building a comfortable place to sleep.  Therefore, I have to sleep under the open sky " +
		"tonight.  These wild animals won't leave me alone and my health has dropped to /b %. " +
		"My chance of being rescued is /c %.",
	GERETTET                : "Finally, a ship!! Thanks to my intense efforts, I've been found " +
		"and the ship has now dropped anchor at the island.  Should I leave this desolate " +
		"island? /d ",
	BEGINNZELT              : "Build tent",
	ROHSTOFFNICHT           : "I don't have enough raw materials to build this.",
	KEINBAUM                : "There isn't a tree here.",
	WEITER                  : "Continue process",
	STOP                    : "Interrupt process",
	TAGENDE2                : "Day /a is over now. Fortunately, I reached my tent on time, and " +
		"the bats will leave my alone, at least. Unfortuantely, the wild animals are biting at " +
		"my feet and my health has fallen to /b %. The chance of being rescued is /c %.",
	BEGINNSCHLAFEN          : "Sleep 1 hour",
	WIESETEXT               : "Plain",
	MEERTEXT                : "Sea",
	STRANDTEXT              : "Beach",
	TREIBSANDTEXT           : "Quicksand",
	FEUCHTEWIESETEXT        : "Damp plain",
	BAUMTEXT                : "Tree",
	FELDTEXT                : "Field",
	ZELTTEXT                : "Tent",
	BUSCHTEXT               : "Bush",
	MIT                     : "with",
	LIANE                   : "Liana ",
	ROHLIANEGEFUNDEN        : "With a lot of effort, I've managed to tear off a liana from the " +
		"tree. You can use lianas for many things.  Therefore, I'll take it and carry it with me " +
		"right now..",
	ROHLIANEZUVIEL          : "Lianas aren't that useful now and I don't need to carry any more " +
		"of them.",
	ANGEL                   : "Rod",
	BAUEANGEL               : "This thin, flexible branch and this liana have been combined to " +
		"make an excellent fishing rod.  Finally, I don't have to live as a strict vegetarian " +
		"and can try catching a few fat trout.",
	BEGINNANGELN            : "Fish",
	KEINWASSER              : "How can I fish here?",
	BOOTTEXT                : "Dug-out",
	BEGINNBOOT              : "Build dug-out",
	STAMM                   : "Tree trunk",
	BEGINNABLEGEN           : "Go on/off board",
	TAGENDE3                : "Day /a is over now. It is pitch black.  I'm lost and will surely " +
		"die.  Let that be a lesson to me. ",
	FLUSSTEXT               : "River",
	BEGINNROHR              : "Build irrigation",
	ROHRTEXT                : "Irrigation pipe",
	BEGINNDESTROY           : "Tear down structure",
	KEINBAUWERK             : "There isn't any structure here to tear down.",
	BEGINNSOS               : "Write S.O.S.",
	SOSTEXT                 : "S.O.S.",
	BAUMZUGROSS             : "This tree is a bit too big.",
	BEGINNHAUS1             : "Build ladder for treehouse",
	HAUS1TEXT               : "Tree and ladder",
	HAMMER                  : "Hammer",
	BEGINNHAUS2             : "Build a platform for treehouse",
	HAUS2TEXT               : "Tree and platform",
	HAUS3TEXT               : "Tree and treehouse",
	BEGINNHAUS3             : "Build treehouse",
	TAGENDE4                : "Day /a is over now. I'm quite glad that I built this beautiful " +
		"treehouse. The wild animals are leaving me alone now.  I'm sleeping very well and my " +
		"health has risen to /b %. My chances of being saved are at /c %.",
	BAUMZUKLEIN             : "This tree is a bit too small.",
	NICHTOHNELEITER         : "Without a ladder, I can't build a platform.",
	NICHTOHNEPLATTFORM      : "I can only build a treehouse on a platform.",
	CHANCETEXT              : "My chances of being saved today",
	BAUMGROSSTEXT           : "Big tree",
	FEUERSTELLETEXT         : "Bonfire",
	BEGINNFEUERSTELLE       : "Pile up wood for bonfire",
	FEUERTEXT               : "Smoke signal",
	BEGINNANZUENDEN         : "Light bonfire",
	KEINEFEUERST            : "I can only light bonfires",
	BEGINNAUSSCHAU          : "Look for rescue ships",
	FERNROHR                : "Telescope",
	BEGINNSCHATZKARTE       : "Examine treasure map",
	SCHAUFEL                : "Shovel",
	STREICHHOLZ             : "Matches",
	BEGINNSCHATZ            : "Dig for treasure",
	SCHATZGEFUNDEN          : "Hurrah!! I've found an old pirate treasure.  With my hopes set on " +
		"a gigantic treasure, I opened the old, musty chest and found.... only a box of " +
		"matches.  Well, I can't buy anything here, anyhow.",
	KEINSCHATZ              : "Although I dug around the entire area, I didn't find any " +
		"treasure.  Perhaps I should first take a look at a treasure map.",
	WRACKTEXT               : "Shipwreck",
	FERNROHRGEFUNDEN        : "I searched the entire wreck.  After diving into the captain's " +
		"cabin, I found this old telescope.  With this, I can be on the lookout for passing " +
		"ships and the chances of being saved have risen. /z On the way out, I also found a " +
		"hammer and a few nails from the ship's carpenter.  With these, I could build a more " +
		"stable type of housing.",
	INTROTEXT               : "I'm in a mess now:  stranded on a lonely island out in the middle " +
		"of the Pacific.  I'd better look for some fresh water and food as soon as possible.  " +
		"Maybe I could build a few tools as well.",
	NICHTSGEFUNDEN2         : "I searched all over the ground, but I didn't find anything of " +
		"interest.",
	KARTE                   : "Treasure map",
	KARTEGEFUNDEN           : "After diving into the ancient pirate ship without finding a " +
		"single thing, suddenly I found the skeleton of the captain.  In his hand, he was " +
		"holding a surprisingly well-preserved treasure map.  After taking it, I found a shovel " +
		"and took that as well.  Now I can fill my idle time by searching for treasure! ",
	ANIMATIONAUS            : "Turn off water animation",
	ANIMATIONAN             : "Turn on water animation",
	ASTPLUSLIANENICHTS      : "I can't build anything else with a liana and a branch.",
	SCHLEUDER               : "Slingshot",
	STEINPLUSLIANENICHTS    : "I can't think of anything else that I could build with a liana " +
		"and a stone.",
	BAUESCHLEUDER           : "I made a knot and loop in the liana and now I can misuse it as a " +
		"slingshot.  Just put a stone in the loop and I'll be able to go off on a hunt.  It " +
		"seems as though there are only birds on this island in the daytime.  I should restrict " +
		"myself to shooting them while they're in the trees.",
	KEINVOGEL               : "There are no birds here.",
	BEGINNSCHLEUDER         : "Hunt for birds",
	NICHTAUFWASSERSCHLAFEN  : "It's too dangerous to go to sleep in this small boat.",
	WELLENZUHOCH            : "The waves are too high to see anything.",
	GRABENBEDINGUNGEN       : "I can only dig for treasure on an open and flat area.",
	FELDBEDINGUNGEN         : "I can only lay out fields on flat, damp, and open meadows.",
	ZELTBEDINGUNGEN         : "I can build tents only on flat and open areas.",
	BOOTBEDINGUNGEN         : "I can build boats only on an open beach.",
	ROHRBEDINGUNGEN         : "I can build pipes only on flat and open areas.",
	SOSBEDINGUNGEN          : "I can only write SOS on a flat and open area.",
	FEUERSTELLENBEDINGUNGEN : "I can only build bonfires on flat and open landscapes.",
	BOOTHILFE               : "I've built my first boat, a dug-out.  (To go on board or off " +
		"board, click on the 'Anchor' button.)  I can only go off board when nothing else is in " +
		"the way on the beach.  I should also keep my eye on the time, because I could never " +
		"survive a night on the high seas.",
	FELDHILFE               : "My first field is ready.  The grain will grow on its own and when " +
		"it turns yellow, I will be able to eat it. ",
	FEUERSTELLEHILFE        : "I've built this huge pile of wood for a bonfire, but how can I " +
		"light it?  The fire would burn for quite a while and would increase my chances of being " +
		"rescued.  The higher that the bonfire is located, the better.",
	HAUS3HILFE              : "My treehouse is finally finished.  I can go to sleep here at any " +
		"time and recover my health.  If I want to spend the night here, I should be in this " +
		"immediate area by 1800 hours (6 p.m.), before it gets dark.",
	ROHRHILFE               : "Now I own an irrigation system. They will fill up with water if I " +
		"have built it near the river.  The plains can be irrigated with water so that I can lay " +
		"out a field here.  These will disappear, of course, if I tear down the pipe.",
	SOSHILFE                : "Passing planes should be able to notice me now and could send for " +
		"help.  The SOS is especially easy to read on the beach.",
	ZELTHILFE               : "Finally, I have a roof over my head. I can go to sleep here at " +
		"any time. If I want to use this at night, I have to be in the immediate area when it " +
		"gets dark (1800 hours or 6 p.m.)",
	SPIELVERLASSEN          : "Do you really want to exit the game? /z (The game will be saved " +
		"automatically) /d ",
	BEENDEN                 : "End the game",
	NEUBEGINNEN             : "Do you want to start a new game? /d ",
	NEU                     : "Start new game",
	TAGNEU                  : "Would you like to begin the day over again? /d ",
	TOD                     : "Suddenly, I'm feeling very strange.  I think that I'm dying...",
	TAGENDE5                : "DDay /a is over now. I don't feel too well and probably won't " +
		"survive through the night. ",
	TAGNEU2                 : "Begin a new day",
	SOUNDAN                 : "Turn on sound",
	SOUNDAUS                : "Turn off sound",
	KEINSOUND               : "Sorry. No sound",
};

const TerrainInfoLabels = [
	"WIESETEXT", "MEERTEXT", "STRANDTEXT", "TREIBSANDTEXT",
	"FEUCHTEWIESETEXT", "BAUMTEXT", "FELDTEXT", "ZELTTEXT", "BUSCHTEXT"
];

let RECT = (left = 0, top = 0, right = 0, bottom = 0) => ({
	left, top, right, bottom,
	// copy: function() {
	// 	return RECT(this.left, this.top, this.right, this.bottom);
	// },
});

//Bereiche
//								links,		oben,		rechts,				unten
const    rcGesamt	    = RECT(0,			0,			MAXX,				MAXY);
const    rcSpielflaeche	= RECT(0,			0,			MAXX-195,			MAXY-20);
const    rcPanel		= RECT(MAXX-205,	0,			MAXX,				MAXY);
const    rcKarte		= RECT(MAXX-158,	23,			MAXX-158+MAXXKACH*2,23+MAXYKACH*2);
const    rcTextFeld1    = RECT(0,			MAXY-20,	MAXX-195,			MAXY);