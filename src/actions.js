function AkIntro()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            //Intro Route herstellen
            Guy.Aktiv = true;
            RoutePunkt = -1;
            Steps		= 0;
            Step		= 0;
            RouteStart.x = Guy.Pos.x;
            RouteStart.y = Guy.Pos.y;
            RouteZiel.y  = Guy.Pos.y;
            for (let x=Guy.Pos.x; x<MAXXKACH; x++) //Zielkoordinate für Introroute finden
            {
                if (Scape[x][Guy.Pos.y].Art !== 1) break;
                RouteZiel.x = x-1;
            }
            FindTheWay();
            break;
        case 2:
            Guy.PosScreen.y -= 10;
            Guy.Aktiv   = true;
            Guy.Zustand = GUYSCHIFFDOWN;
            play_sound(sfx_splash,100);
            play_sound(sfx_crash,100);
            break;
        case 3:
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = WRACK;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[WRACK].rcDes.left;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[WRACK].rcDes.top;

            ChangeBootsFahrt();
            Guy.Pos.x += 2;
            Guy.PosScreen.y += 10;
            Guy.Zustand = GUYSCHWIMMEN;
            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y) /2));
            break;
        case 4:
            stop_sound(sfx_swim); //Sound hier sofort stoppen
            Guy.Zustand = GUYLINKS;
            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));
            break;
        case 5:
            Guy.PosAlt = Guy.PosScreen;
            game_state = STATE_INGAME;
            Guy.Aktion = AKNICHTS;
            PapierText = DrawText(messages.INTROTEXT,TXTPAPIER,1);
            SaveGame();
            break;
    }
}

function AkNeubeginnen()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            let Erg = GetKachel(Guy.PosAlt.x,Guy.PosAlt.y);
            if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            //Nur bis zur Mitte der aktuellen Kacheln laufen
            else if (RoutePunkt%2 === 0) ShortRoute(RouteKoor[RoutePunkt].x, RouteKoor[RoutePunkt].y);
            else ShortRoute(RouteKoor[RoutePunkt+1].x, RouteKoor[RoutePunkt+1].y);
            TwoClicks = -1; //Keine Ahnung warum ich das hier machen muss
            break;
        case 2:
            Guy.Aktiv = true;
            if (BootsFahrt) Guy.Zustand = GUYBOOTWARTEN;
            else Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.NEUBEGINNEN,TXTPAPIER,1);
            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
            else Guy.Zustand = GUYLINKS;
            if (Frage === 1)
            {
                NeuesSpiel(true);
                return;
            }
            Frage = -1;
            break;
    }
}

function AkTagNeubeginnen()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            let Erg = GetKachel(Guy.PosAlt.x,Guy.PosAlt.y);
            if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            //Nur bis zur Mitte der aktuellen Kacheln laufen
            else if (RoutePunkt%2 === 0) ShortRoute(RouteKoor[RoutePunkt].x, RouteKoor[RoutePunkt].y);
            else ShortRoute(RouteKoor[RoutePunkt+1].x, RouteKoor[RoutePunkt+1].y);
            TwoClicks = -1; //Keine Ahnung warum ich das hier machen muss
            break;
        case 2:
            Guy.Aktiv = true;
            if (BootsFahrt) Guy.Zustand = GUYBOOTWARTEN;
            else Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.TAGNEU,TXTPAPIER,1);
            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
            else Guy.Zustand = GUYLINKS;
            if (Frage === 1)
            {
                NeuesSpiel(false);
                return;
            }
            Frage = -1;
            break;
    }
}

function AkSpielverlassen()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            let Erg = GetKachel(Guy.PosAlt.x,Guy.PosAlt.y);
            if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            //Nur bis zur Mitte der aktuellen Kacheln laufen
            else if (RoutePunkt%2 === 0) ShortRoute(RouteKoor[RoutePunkt].x, RouteKoor[RoutePunkt].y);
            else ShortRoute(RouteKoor[RoutePunkt+1].x, RouteKoor[RoutePunkt+1].y);
            TwoClicks = -1; //Keine Ahnung warum ich das hier machen muss
            break;
        case 2:
            Guy.Aktiv = true;
            if (BootsFahrt) Guy.Zustand = GUYBOOTWARTEN;
            else Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.SPIELVERLASSEN,TXTPAPIER,1);
            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
            else Guy.Zustand = GUYLINKS;
            if (Frage === 1)
            {
                if (Guy.Resource[RES_HEALTH] > 10) SaveGame();
                game_state = STATE_OUTRO;
            }
            Frage = -1;
            break;
    }
}

function AkTod()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            Guy.Aktiv = true;
            if (BootsFahrt) Guy.Zustand = GUYBOOTWARTEN;
            else Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.TOD,TXTPAPIER,1);
            break;
        case 2:
            if (!BootsFahrt)
            {
                Guy.Aktiv = true;
                Guy.Zustand = GUYHINLEGEN;
            }
            break;
        case 3:
            Guy.Aktiv = true;
            Nacht = false;
            Fade(100,100,100);
            if (BootsFahrt) Guy.Zustand = GUYBOOTTOD;
            else Guy.Zustand = GUYTOD;
            break;
        case 4:
            Guy.Aktiv = true;
            Nacht = true;
            Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.TAGNEU,TXTPAPIER,1);
            break;
        case 5:
            Nacht = false;
            if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
            else Guy.Zustand = GUYLINKS;
            Guy.Aktion = AKNICHTS;
            if (Frage === 2)
            {
                game_state = STATE_OUTRO;
            }
            else  NeuesSpiel(false);
            Frage = -1;
            break;
    }
}

function AkAbbruch()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x = Guy.PosScreen.x;
            Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y = Guy.PosScreen.y;

            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));
            break;
        case 2:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkDestroy()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite+4,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe);
            break;
        case 2: case 4:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYFAELLEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,5);
        break;
        case 3: case 5:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYSCHLAGEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,5);
        break;
        case 6:
            if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === SOS) Chance -= 0.1;
            //Um sich kurz das Objekt zu merken
            let i = Scape[Guy.Pos.x][Guy.Pos.y].Objekt;
            if ((i>= HAUS1) && (i<=HAUS3)) Scape[Guy.Pos.x][Guy.Pos.y].Objekt = BAUMGROSS;
            else
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Objekt   =-1;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x	 = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y	 = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].Phase    =-1;
            }
            Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = 0;
            if (i === ROHR) FillRohr();
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 7:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkSuchen()
{
    let Ziel = vec2();

    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    while(1)
    {
        Ziel.x = Scape[Guy.Pos.x][Guy.Pos.y].xScreen+rand()%KXPIXEL;
        Ziel.y = Scape[Guy.Pos.x][Guy.Pos.y].yScreen+rand()%KYPIXEL;
        let Erg = GetKachel(Ziel.x,Ziel.y);
        if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) break; //Wenn das gefundene Ziel in der Kachel, dann fertig
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1: case 3: case 5: case 7:
        if (BootsFahrt)
        {
            if (Guy.AkNummer === 1)
            {
                Guy.Aktiv   = true;
                Guy.PosScreen.y -= 2;
                Guy.Zustand = GUYTAUCHEN1;
                play_sound(sfx_splash,100);
            }
        }
        else ShortRoute(Ziel.x,Ziel.y);
        break;
        case 2: case 4: case 6: case 8:
        Guy.Aktiv   = true;
        if (BootsFahrt)
        {
            if (Guy.AkNummer === 2)
            {
                Guy.PosScreen.y += 5;
            }
            Guy.Zustand = GUYTAUCHEN2;
        }
        else            Guy.Zustand = GUYSUCHEN;
        AddTime(0,4);
        break;
        case 9:
            if (BootsFahrt)
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYTAUCHEN3;
                play_sound(sfx_splash,100);
            }
            break;
        case 10:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 11:
            Guy.Aktiv	= true;
            if (BootsFahrt) Guy.Zustand = GUYBOOTLINKS;
            //Auf Strand und Fluss
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Art === 2) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= FLUSS1) &&
                    (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= SCHLEUSE6)))
            {

                if (Guy.Inventar[ROHSTEIN] < 10)
                {
                    PapierText = DrawText(messages.ROHSTEINGEFUNDEN,TXTPAPIER,1);
                    Guy.Inventar[ROHSTEIN] += 3;
                    if (Guy.Inventar[ROHSTEIN] > 10) Guy.Inventar[ROHSTEIN] = 10;
                }
                else PapierText = DrawText(messages.ROHSTEINZUVIEL,TXTPAPIER,1);

            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === BUSCH)
            {
                let i = rand()%2;
                switch(i)
                {
                    case 0:
                        if (Guy.Inventar[ROHAST] < 10)
                        {
                            PapierText = DrawText(messages.ROHASTGEFUNDEN,TXTPAPIER,1);
                            Guy.Inventar[ROHAST]++;
                        }
                        else PapierText = DrawText(messages.ROHASTZUVIEL,TXTPAPIER,1);
                        break;
                    case 1:
                        if (Guy.Inventar[ROHBLATT] < 10)
                        {
                            PapierText = DrawText(messages.ROHBLATTGEFUNDEN,TXTPAPIER,1);
                            Guy.Inventar[ROHBLATT]++;
                        }
                        else PapierText = DrawText(messages.ROHBLATTZUVIEL,TXTPAPIER,1);
                        break;
                }
            }
            else if (((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUMGROSS)) ||
                ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= HAUS1) &&
                    (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= HAUS3)))
            {
                let i = rand()%3;
                switch(i)
                {
                    case 0:
                        if (Guy.Inventar[ROHAST] < 10)
                        {
                            PapierText = DrawText(messages.ROHASTGEFUNDEN,TXTPAPIER,1);
                            Guy.Inventar[ROHAST]++;
                        }
                        else PapierText = DrawText(messages.ROHASTZUVIEL,TXTPAPIER,1);
                        break;
                    case 1:
                        if (Guy.Inventar[ROHBLATT] < 10)
                        {
                            PapierText = DrawText(messages.ROHBLATTGEFUNDEN,TXTPAPIER,1);
                            Guy.Inventar[ROHBLATT]++;
                        }
                        else PapierText = DrawText(messages.ROHBLATTZUVIEL,TXTPAPIER,1);
                        break;
                    case 2:
                        if (Guy.Inventar[ROHLIANE] < 10)
                        {
                            PapierText = DrawText(messages.ROHLIANEGEFUNDEN,TXTPAPIER,1);
                            Guy.Inventar[ROHLIANE]++;
                        }
                        else PapierText = DrawText(messages.ROHLIANEZUVIEL,TXTPAPIER,1);
                        break;
                }
            }
            else if (BootsFahrt)
            {
                if  (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === WRACK)
                {
                    if (Guy.Inventar[ROHFERNROHR] === 0)
                    {
                        PapierText = DrawText(messages.FERNROHRGEFUNDEN,TXTPAPIER,1);
                        Guy.Inventar[ROHFERNROHR] = 1;
                        Bmp[BUTTAUSSCHAU].Phase = 0;
                        Guy.Inventar[ROHHAMMER]   = 1;
                        Bmp[BUTTHAUS1].Phase = 0;
                        Bmp[BUTTHAUS2].Phase = 0;
                        Bmp[BUTTHAUS3].Phase = 0;
                    }
                    else PapierText = DrawText(messages.NICHTSGEFUNDEN2,TXTPAPIER,1);
                }
                else if  (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === WRACK2)
                {
                    if (Guy.Inventar[ROHKARTE] === 0)
                    {
                        PapierText = DrawText(messages.KARTEGEFUNDEN,TXTPAPIER,1);
                        Guy.Inventar[ROHKARTE] = 1;
                        Bmp[BUTTSCHATZKARTE].Phase = 0;
                        Guy.Inventar[ROHSCHAUFEL]   = 1;
                        Bmp[BUTTSCHATZ].Phase = 0;
                    }
                    else PapierText = DrawText(messages.NICHTSGEFUNDEN2,TXTPAPIER,1);
                }
                else PapierText = DrawText(messages.NICHTSGEFUNDEN2,TXTPAPIER,1);
            }
            else
            {
                PapierText = DrawText(messages.NICHTSGEFUNDEN,TXTPAPIER,1);
            }
            break;
        case 12:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkEssen()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe+2);
            break;
        case 2: case 3:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYESSEN;
        AddResource(RES_FOOD,15);
        AddTime(0,2);
        break;
        case 4:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 5:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkSchleuder()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2-14,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe+9);
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYSCHLEUDER;
            Guy.PosScreen.x += 5;
            AddTime(0,2);
            play_sound(sfx_slingshot,100);
            break;
        case 3:
            Guy.PosScreen.x -= 5;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2+6,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe+2);
            break;
        case 4:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYSUCHEN;
            AddResource(RES_FOOD,5);
            AddTime(0,20);
            break;
        case 5:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 6:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkTrinken()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Guy.PosScreen.x-4,
                Guy.PosScreen.y-2);
            break;
        case 2: case 3:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYTRINKEN;
        AddResource(RES_WATER,30);
        AddTime(0,3);
        break;
        case 4:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 5:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkFaellen()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2+9,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe+3);
            break;
        case 2: case 3: case 4: case 5: case 6:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYFAELLEN;
        AddResource(RES_WATER,-2);
        AddResource(RES_FOOD,-2);
        AddTime(0,10);
        break;
        case 7:
            Guy.Aktiv = true;
            Guy.Zustand = GUYWARTEN;
            let i = Scape[Guy.Pos.x][Guy.Pos.y].Objekt+(BAUM1DOWN-BAUM1);
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = i;
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x -= 17;
            play_sound(sfx_treefall,100);
            break;
        case 8:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 9:
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = -1;
            Guy.Inventar[ROHSTAMM]++;
            if (Guy.Inventar[ROHSTAMM] > 10) Guy.Inventar[ROHSTAMM] = 10;
            Guy.Inventar[ROHAST] += 5;
            if (Guy.Inventar[ROHAST] > 10) Guy.Inventar[ROHAST] = 10;
            Guy.Inventar[ROHBLATT] += 5;
            if (Guy.Inventar[ROHBLATT] > 10) Guy.Inventar[ROHBLATT] = 10;
            Guy.Inventar[ROHLIANE] += 2;
            if (Guy.Inventar[ROHLIANE] > 10) Guy.Inventar[ROHLIANE] = 10;
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkAngeln()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            switch (Scape[Guy.Pos.x][Guy.Pos.y].Objekt)
            {
                case FLUSS1:
                    ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+35,
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+26);
                    break;
                case FLUSS2:
                    ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+19,
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+26);
                    break;
                case FLUSS3:
                    ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+22,
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+20);
                    break;
                case FLUSS4:
                    ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+34,
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+23);
                    break;
                case FLUSS6: case FLUSS7: case MUENDUNG2: case QUELLE2: case SCHLEUSE2: case SCHLEUSE3:
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+34,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+33);
                break;
                case FLUSS5: case FLUSS9: case MUENDUNG1: case QUELLE1: case SCHLEUSE1: case SCHLEUSE5:
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+20,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+33);
                break;
                case FLUSS8: case MUENDUNG4: case QUELLE3:  case SCHLEUSE4:
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+22,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+26);
                break;
                case FLUSS10: case MUENDUNG3: case QUELLE4: case SCHLEUSE6:
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+32,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+26);
                break;
            }
            break;
        case 2:
            Guy.Aktiv   = true;
            play_sound(sfx_fishingrod,100);
            if (BootsFahrt)
            {
                Guy.PosScreen.y -= 2;
                Guy.Zustand = GUYBOOTANGELN1;
            }
            switch (Scape[Guy.Pos.x][Guy.Pos.y].Objekt)
            {
                case FLUSS1: case FLUSS6: case FLUSS7: case MUENDUNG2: case QUELLE2: case SCHLEUSE2: case SCHLEUSE3:
                Guy.Zustand = GUYANGELN1LINKS;
                break;
                case FLUSS2: case FLUSS5: case FLUSS9: case MUENDUNG1: case QUELLE1: case SCHLEUSE1: case SCHLEUSE5:
                Guy.Zustand = GUYANGELN1OBEN;
                break;
                case FLUSS3: case FLUSS8: case MUENDUNG4: case QUELLE3:  case SCHLEUSE4:
                Guy.Zustand = GUYANGELN1RECHTS;
                break;
                case FLUSS4: case FLUSS10: case MUENDUNG3: case QUELLE4: case SCHLEUSE6:
                Guy.Zustand = GUYANGELN1UNTEN;
                break;
            }
            break;
        case 3: case 4: case 5: case 6:
        Guy.Aktiv   = true;
        if (BootsFahrt)	Guy.Zustand = GUYBOOTANGELN2;

        switch (Scape[Guy.Pos.x][Guy.Pos.y].Objekt)
        {
            case FLUSS1: case FLUSS6: case FLUSS7: case MUENDUNG2: case QUELLE2: case SCHLEUSE2: case SCHLEUSE3:
            Guy.Zustand = GUYANGELN2LINKS;
            break;
            case FLUSS2: case FLUSS5: case FLUSS9: case MUENDUNG1: case QUELLE1: case SCHLEUSE1: case SCHLEUSE5:
            Guy.Zustand = GUYANGELN2OBEN;
            break;
            case FLUSS3: case FLUSS8: case MUENDUNG4: case QUELLE3: case SCHLEUSE4:
            Guy.Zustand = GUYANGELN2RECHTS;
            break;
            case FLUSS4: case FLUSS10: case MUENDUNG3: case QUELLE4: case SCHLEUSE6:
            Guy.Zustand = GUYANGELN2UNTEN;
            break;
        }
        Guy.Resource[RES_HEALTH] += 2;
        AddTime(0,20);
        break;
        case 7:
            Guy.Aktiv   = true;
            if (BootsFahrt)	Guy.Zustand = GUYBOOTANGELN3;

            switch (Scape[Guy.Pos.x][Guy.Pos.y].Objekt)
            {
                case FLUSS1: case FLUSS6: case FLUSS7: case MUENDUNG2: case QUELLE2: case SCHLEUSE2: case SCHLEUSE3:
                Guy.Zustand = GUYANGELN3LINKS;
                break;
                case FLUSS2: case FLUSS5: case FLUSS9: case MUENDUNG1: case QUELLE1: case SCHLEUSE1: case SCHLEUSE5:
                Guy.Zustand = GUYANGELN3OBEN;
                break;
                case FLUSS3: case FLUSS8: case MUENDUNG4: case QUELLE3: case SCHLEUSE4:
                Guy.Zustand = GUYANGELN3RECHTS;
                break;
                case FLUSS4: case FLUSS10: case MUENDUNG3: case QUELLE4: case SCHLEUSE6:
                Guy.Zustand = GUYANGELN3UNTEN;
                break;
            }
            break;
        case 8:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 9:
            Guy.Resource[RES_FOOD] += 20;
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkAnzuenden()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2-10,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y
                +Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe+1);
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYANZUENDEN;
            Guy.PosScreen.x += 5;
            AddTime(0,1);
            break;
        case 3:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYWARTEN;
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = FEUER;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[FEUER].rcDes.left;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[FEUER].rcDes.top;
            Chance += 2+2*Scape[Guy.Pos.x][Guy.Pos.y].Hoehe;
            AddTime(0,2);
            Guy.PosScreen.x -= 5;
            break;
        case 4:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 5:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkAusschau()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYAUSSCHAU;
            AddTime(0,40);
            Chance += 1 + Scape[Guy.Pos.x][Guy.Pos.y].Hoehe;
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYWARTEN;
            AddTime(0,40);
            break;
        case 3:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYAUSSCHAU;
            AddTime(0,40);
            break;
        case 4:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 5:
            Chance -= 1 + Scape[Guy.Pos.x][Guy.Pos.y].Hoehe;
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkSchatz()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;
    }
    Guy.AkNummer++;

    switch(Guy.AkNummer)
    {
        case 1:
            Guy.PosScreen.x -= 5;
            Guy.PosScreen.y += 1;
            Guy.Aktiv   = true;
            Guy.Zustand = GUYSCHAUFELN;
            break;
        case 2:
            AddTime(0,20);
            AddResource(RES_WATER,-10);
            AddResource(RES_FOOD,-10);
            Guy.PosScreen.x += 5;
            Guy.PosScreen.y -= 1;
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            if (((Guy.Pos.x === SchatzPos.x) && (Guy.Pos.y === SchatzPos.y)) &&
                (!SchatzGef))
            {
                PapierText = DrawText(messages.SCHATZGEFUNDEN,TXTPAPIER,1);
                Guy.Inventar[ROHSTREICHHOLZ] = 1;
                Bmp[BUTTANZUENDEN].Phase = 0;
                SchatzGef	= true;
            }
            else PapierText = DrawText(messages.KEINSCHATZ,TXTPAPIER,1);
            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkFeld()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[FELD].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = FELD;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[FELD].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[FELD].rcDes.top;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[FELD].Anzahl;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+22,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+23);
            break;
        case 4:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 4;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+25,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+21);
            AddResource(RES_WATER,-2);
            AddResource(RES_FOOD,-2);
            AddTime(0,30);
            break;
        case 7:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 5;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+28,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+19);
            AddResource(RES_WATER,-2);
            AddResource(RES_FOOD,-2);
            AddTime(0,30);
            break;
        case 10:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 6;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+31,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+17);
            AddResource(RES_WATER,-2);
            AddResource(RES_FOOD,-2);
            AddTime(0,30);
            break;
        case 13:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 7;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+34,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+15);
            AddResource(RES_WATER,-2);
            AddResource(RES_FOOD,-2);
            AddTime(0,30);
            break;
        case 16:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 8;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+36,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+13);
            AddResource(RES_WATER,-2);
            AddResource(RES_FOOD,-2);
            AddTime(0,30);
            break;
        case 2: case 3: case 5: case 6: case 8: case 9: case 11: case 12: case 14: case 15: case 17: case 18:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYFELD;
        break;
        case 19:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = FELD;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[FELD].rcDes.left;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[FELD].rcDes.top;
            break;
        case 20:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[FELD].First)
            {
                PapierText = DrawText(messages.FELDHILFE,TXTPAPIER,1);
                Bmp[FELD].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkTagEnde()
{
    let Erg;

    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            Fade(100,90,90);
            Stunden = 12;
            Minuten = 0;
            TwoClicks = -1; //Keine Ahnung warum ich das hier machen mu�
            Bmp[BUTTSTOP].Phase = -1;
            if ((Guy.Zustand === GUYSCHLAFZELT) || (Guy.Zustand === GUYSCHLAFEN) ||
                (Guy.Zustand === GUYSCHLAFHAUS) || (BootsFahrt)) break;
            Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.x = Guy.PosScreen.x;
            Scape[Guy.Pos.x][Guy.Pos.y].GPosAlt.y = Guy.PosScreen.y;
            Erg = GetKachel(Guy.PosAlt.x,Guy.PosAlt.y);
            if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            else if (RoutePunkt%2 === 0) ShortRoute(RouteKoor[RoutePunkt].x, RouteKoor[RoutePunkt].y); //Nur bis zur Mitte der aktuellen Kacheln laufen
            else ShortRoute(RouteKoor[RoutePunkt+1].x, RouteKoor[RoutePunkt+1].y);
            break;
        case 2:
            Fade(95,80,80);
            Stunden = 12;
            Minuten = 0;
            if ((Guy.Zustand === GUYSCHLAFZELT) || (Guy.Zustand === GUYSCHLAFEN) ||
                (Guy.Zustand === GUYSCHLAFHAUS) || (BootsFahrt)) break;
            //Wohnbare Objekte in der Umgebung suchen
            Erg = vec2();
            Erg.x = -1;
            Erg.y = -1;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) || (Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3))
            {
                Erg.x = Guy.Pos.x;
                Erg.y = Guy.Pos.y;
            }
            else if (Scape[Guy.Pos.x-1][Guy.Pos.y].Objekt === HAUS3)
            {
                Erg.x = Guy.Pos.x-1;
                Erg.y = Guy.Pos.y;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Objekt === HAUS3)
            {
                Erg.x = Guy.Pos.x;
                Erg.y = Guy.Pos.y-1;
            }
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Objekt === HAUS3)
            {
                Erg.x = Guy.Pos.x+1;
                Erg.y = Guy.Pos.y;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Objekt === HAUS3)
            {
                Erg.x = Guy.Pos.x;
                Erg.y = Guy.Pos.y+1;
            }
            else if (Scape[Guy.Pos.x-1][Guy.Pos.y].Objekt === ZELT)
            {
                Erg.x = Guy.Pos.x-1;
                Erg.y = Guy.Pos.y;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Objekt === ZELT)
            {
                Erg.x = Guy.Pos.x;
                Erg.y = Guy.Pos.y-1;
            }
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Objekt === ZELT)
            {
                Erg.x = Guy.Pos.x+1;
                Erg.y = Guy.Pos.y;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Objekt === ZELT)
            {
                Erg.x = Guy.Pos.x;
                Erg.y = Guy.Pos.y+1;
            }
            if ((Erg.x !== -1) && (Erg.y !== -1))
            {
                Guy.Pos.x = Erg.x;
                Guy.Pos.y = Erg.y;
                if ((Scape[Erg.x][Erg.y].Objekt === ZELT) &&
                    (Scape[Erg.x][Erg.y].Phase < Bmp[Scape[Erg.x][Erg.y].Objekt].Anzahl))
                    ShortRoute(Scape[Erg.x][Erg.y].xScreen+Scape[Erg.x][Erg.y].ObPos.x+3,
                        Scape[Erg.x][Erg.y].yScreen+Scape[Erg.x][Erg.y].ObPos.y+20);
                else if ((Scape[Erg.x][Erg.y].Objekt === HAUS3) &&
                    (Scape[Erg.x][Erg.y].Phase < Bmp[Scape[Erg.x][Erg.y].Objekt].Anzahl))
                    ShortRoute(Scape[Erg.x][Erg.y].xScreen+Scape[Erg.x][Erg.y].ObPos.x+
                        Bmp[BAUMGROSS].Breite/2,
                        Scape[Erg.x][Erg.y].yScreen+Scape[Erg.x][Erg.y].ObPos.y+
                        Bmp[BAUMGROSS].Hoehe+1);
            }
            break;
        case 3:
            Fade(90,70,70);
            Stunden = 12;
            Minuten = 0;
            if ((Guy.Zustand === GUYSCHLAFZELT) || (Guy.Zustand === GUYSCHLAFEN) ||
                (Guy.Zustand === GUYSCHLAFHAUS) || (BootsFahrt)) break;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYKLETTERN1;
            }
            break;
        case 4:
            Fade(70,60,60);
            Stunden = 12;
            Minuten = 0;
            if ((Guy.Zustand === GUYSCHLAFZELT) || (Guy.Zustand === GUYSCHLAFEN) ||
                (Guy.Zustand === GUYSCHLAFHAUS) || (BootsFahrt)) break;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase <  Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYGEHINZELT;
            }
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYGEHINHAUS;
            }
            else
            {
                Guy.PosScreen.x += 3;
                Guy.Aktiv   = true;
                Guy.Zustand = GUYHINLEGEN;
            }
            break;
        case 5:
            Fade(55,50,55);
            Stunden = 12;
            Minuten = 0;
            if (BootsFahrt) break;
            Guy.Aktiv   = true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                if (Guy.Zustand !== GUYSCHLAFZELT) Guy.PosScreen.x += 4;
                Guy.Zustand = GUYSCHLAFZELT;
            }
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                if (Guy.Zustand !== GUYSCHLAFHAUS) Guy.PosScreen.x += 14;
                Guy.Zustand = GUYSCHLAFHAUS;
            }
            else Guy.Zustand = GUYSCHLAFEN;
            break;
        case 6:
            Fade(25,25,35);
            Stunden = 12;
            Minuten = 0;
            if (BootsFahrt) break;
            Guy.Aktiv   = true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFZELT;
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFHAUS;
            else Guy.Zustand = GUYSCHLAFEN;
            break;
        case 7:
            Fade(0,0,0); // Nicht verwirren lassen, da das Bild in Zeige() schwarz übermalt wird
            Nacht	= true;
            Stunden = 12;
            Minuten = 0;
            play_sound(sfx_wolf,100);
            //Falsche Objekte Löschen
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt >= BAUM1DOWN) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Objekt <= BAUM4DOWN))
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Objekt = -1;
                Guy.Inventar[ROHSTAMM]++;
                if (Guy.Inventar[ROHSTAMM] > 10) Guy.Inventar[ROHSTAMM] = 10;
            }

            //Je nach Schlafort Zustand verändern
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                AddResource(RES_HEALTH,-5);
                if (Guy.Resource[RES_HEALTH] <= 0)
                {
                    Guy.Aktiv = true;
                    PapierText = DrawText(messages.TAGENDE5,TXTPAPIER,1);
                    Guy.AkNummer = 2;
                    Guy.Aktion = AKTOD;
                    Stunden = 0;
                    Minuten = 0;
                }
                else
                {
                    Guy.Aktiv = true;
                    PapierText = DrawText(messages.TAGENDE2,TXTPAPIER,1);
                }
            }
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                AddResource(RES_HEALTH,+20);
                Guy.Aktiv = true;
                PapierText = DrawText(messages.TAGENDE4,TXTPAPIER,1);
            }
            else if (BootsFahrt)
            {
                Guy.Aktiv = true;
                Guy.Zustand = GUYBOOTWARTEN;
                PapierText = DrawText(messages.TAGENDE3,TXTPAPIER,1);
                Guy.AkNummer = 2;
                Guy.Aktion = AKTOD;
                Stunden = 0;
                Minuten = 0;
            }
            else
            {
                AddResource(RES_HEALTH,-20);
                if (Guy.Resource[RES_HEALTH] <= 0)
                {
                    Guy.Aktiv = true;
                    PapierText = DrawText(messages.TAGENDE5,TXTPAPIER,1);
                    Guy.AkNummer = 2;
                    Guy.Aktion = AKTOD;
                    Stunden = 0;
                    Minuten = 0;
                }
                else
                {
                    Guy.Aktiv = true;
                    PapierText = DrawText(messages.TAGENDE1,TXTPAPIER,1);
                }
            }
            break;
        case 8:
            Fade(20,20,30);
            Nacht	= false;
            Tag++;
            Stunden = 0;
            Minuten = 0;
            //if (BootsFahrt) NeuesSpiel(true); //Später hier tot!!

            Guy.Aktiv   = true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFZELT;
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFHAUS;
            else Guy.Zustand = GUYSCHLAFEN;
            break;
        case 9:
            Fade(40,40,40);
            Stunden = 0;
            Minuten = 0;

            Stunden = 0; Minuten = 0;
            Guy.Aktiv = true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFZELT;
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                Guy.Zustand = GUYSCHLAFHAUS;
            else Guy.Zustand = GUYSCHLAFEN;
            break;
        case 10:
            Fade(70,60,60);
            Stunden = 0;
            Minuten = 0;
            stop_sound(sfx_snore);
            Guy.Aktiv = true;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.PosScreen.x -= 14;
                Guy.Zustand = GUYGEHAUSHAUS;
            }
            else Guy.Zustand = GUYAUFSTEHEN;
            break;
        case 11:
            Fade(90,80,80);
            Stunden = 0;
            Minuten = 0;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv = true;
                Guy.Zustand = GUYKLETTERN2;
            }
            break;
        case 12:
            Fade(100,100,100);
            Stunden = 0;
            Minuten = 0;
            Guy.Zustand = GUYLINKS;
            Guy.Aktion = AKNICHTS;
            if (Guy.Resource[RES_HEALTH] > 10) SaveGame();
            break;
    }
}

function AkGerettet()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            let Erg = GetKachel(Guy.PosAlt.x,Guy.PosAlt.y);
            if ((Erg.x === Guy.Pos.x) && (Erg.y === Guy.Pos.y)) ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            else if (RoutePunkt%2 === 0) ShortRoute(RouteKoor[RoutePunkt].x, RouteKoor[RoutePunkt].y); //Nur bis zur Mitte der aktuellen Kacheln laufen
            else ShortRoute(RouteKoor[RoutePunkt+1].x, RouteKoor[RoutePunkt+1].y);
            TwoClicks = -1; //Keine Ahnung warum ich das hier machen mu�
            break;
        case 2:
            Guy.Aktiv = true;
            Guy.Zustand = GUYWARTEN;
            PapierText = DrawText(messages.GERETTET,TXTPAPIER,1);
            break;
        case 3:
            if (Frage === 2)
            {
                Guy.Aktion = AKNICHTS;
                Frage = -1;
                break;
            }
            game_state = STATE_RESCUED;
            Frage = -1;
            break;
        case 4:
            // Route herstellen
            Guy.Aktiv = true;
            Guy.Zustand = GUYLINKS;
            RoutePunkt = -1;
            Steps		= 0;
            Step		= 0;
            RouteStart.x = Guy.Pos.x;
            RouteStart.y = Guy.Pos.y;
            RouteZiel.y  = Guy.Pos.y;
            for (let x=MAXXKACH-1; x>1; x--)//Position des Rettungsschiffs festlegen
            {
                if (Scape[x][Guy.Pos.y].Art !== 1) break;
                RouteZiel.x = x+1;
            }
            //Schiff hinbauen
            Scape[RouteZiel.x][RouteZiel.y].Phase = 0;
            Scape[RouteZiel.x][RouteZiel.y].Objekt = GUYSCHIFF;
            Scape[RouteZiel.x][RouteZiel.y].ObPos.x = 10;
            Scape[RouteZiel.x][RouteZiel.y].ObPos.y = 10;
            RouteZiel.x -= 2;
            FindTheWay();
            Guy.Zustand = GUYLINKS;
            break;
        case 5:
            Guy.Zustand = GUYLINKS;
            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));
            break;
        case 6:
            Guy.Pos.x += 2;
            Guy.Zustand = GUYSCHWIMMEN;
            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));
            break;
        case 7:
            Guy.PosScreen.y -= 10;
            if (!BootsFahrt) ChangeBootsFahrt();
            Guy.Aktiv = true;
            Guy.Zustand = GUYSCHIFF;
            RoutePunkt = -1;
            Steps		= 0;
            Step		= 0;
            RouteStart.x = Guy.Pos.x;
            RouteStart.y = Guy.Pos.y;
            RouteZiel.y  = Guy.Pos.y;
            RouteZiel.x = MAXXKACH-2;
            FindTheWay();
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[MEERWELLEN].rcDes.left;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[MEERWELLEN].rcDes.top;
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = MEERWELLEN;
            break;
        case 8:
            Guy.Aktiv = true;
            Guy.Zustand = GUYSCHIFF;
            break;
        case 9:
            Guy.Aktion = AKNICHTS;
            Guy.Zustand = GUYLINKS;
            game_state = STATE_OUTRO;
            break;
    }
}

function AkZelt()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = ZELT;
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[ZELT].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[ZELT].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[ZELT].rcDes.top;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+22,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+12);
            break;
        case 2: case 3: case 12: case 13:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYBINDENUNTEN;
        AddResource(RES_WATER,-2);
        AddResource(RES_FOOD,-2);
        AddTime(0,15);
        break;
        case 4:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 2;
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+31,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            break;
        case 5:
            ShortRoute(Guy.PosAlt.x,
                Guy.PosAlt.y);
            break;
        case 6:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+3,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);

            break;
        case 7: case 8:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYBINDENOBEN;
        AddResource(RES_WATER,-2);
        AddResource(RES_FOOD,-2);
        AddTime(0,15);
        break;
        case 9:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 3;
            ShortRoute(Guy.PosAlt.x,
                Guy.PosAlt.y);
            break;
        case 10:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+31,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            break;
        case 11:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+22,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+12);
            break;
        case 14:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+31,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            break;
        case 15:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 16:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[ZELT].First)
            {
                PapierText = DrawText(messages.ZELTHILFE,TXTPAPIER,1);
                Bmp[ZELT].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkBoot()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = BOOT;
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[BOOT].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[BOOT].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[BOOT].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[BOOT].rcDes.top;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+30,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+21);
            break;
        case 2:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+29,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            break;
        case 3:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+28,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+19);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[BOOT].Anzahl+1);
            break;
        case 4: case 5: case 6: case 8: case 9: case 10: case 12: case 13: case 14:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYSCHLAGEN;
        AddResource(RES_WATER,-2);
        AddResource(RES_FOOD,-2);
        AddTime(0,15);
        break;
        case 7:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+22,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+16);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[BOOT].Anzahl+2);
            break;
        case 11:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+14,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+11);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[BOOT].Anzahl+3);
            break;
        case 15:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 16:
            if (Scape[Guy.Pos.x-1][Guy.Pos.y].Art === 1)
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = 10;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Art === 1)
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 1;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = 25;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = 10;
            }
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Art === 1)
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = 30;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = 27;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Art === 1)
            {
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 1;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = 0;
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = 28;
            }
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[BOOT].First)
            {
                PapierText = DrawText(messages.BOOTHILFE,TXTPAPIER,1);
                Bmp[BOOT].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkRohr()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = ROHR;
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[ROHR].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[ROHR].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[ROHR].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[ROHR].rcDes.top;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+30,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+21);
            break;
        case 2:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+29,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            break;
        case 3:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+28,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+15);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[ROHR].Anzahl+1);
            break;
        case 4: case 5: case 6: case 11: case 12: case 13:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYSCHLAGEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,5);
        break;
        case 7: case 8: case 9: case 14: case 15: case 16:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYFAELLEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,5);
        break;
        case 10:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+17,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+13);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[ROHR].Anzahl+2);
            break;
        case 17:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 18:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            FillRohr();
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[ROHR].First)
            {
                PapierText = DrawText(messages.ROHRHILFE,TXTPAPIER,1);
                Bmp[ROHR].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkSOS()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = SOS;
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[SOS].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[SOS].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[SOS].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[SOS].rcDes.top;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+4,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+13);
            break;
        case 4:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+12,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+17);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[SOS].Anzahl+1);
            break;
        case 7:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+12,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+9);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[SOS].Anzahl+2);
            break;
        case 10:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+19,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+12);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[SOS].Anzahl+3);
            break;
        case 13:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+21,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+5);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[SOS].Anzahl+4);
            break;
        case 16:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+28,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+8);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[SOS].Anzahl+5);
            break;
        case 2: case 5: case 8: case 11: case 14: case 17:
        Guy.Aktiv   = true;
        Guy.PosScreen.x += 4;
        Guy.Zustand = GUYHINLEGEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,1);
        break;
        case 3: case 6: case 9: case 12: case 15: case 18:
        Guy.Aktiv   = true;
        Guy.PosScreen.x -= 4;
        Guy.Zustand = GUYAUFSTEHEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,1);
        break;
        case 19:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 20:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Art === 0) || (Scape[Guy.Pos.x][Guy.Pos.y].Art === 4))
                Chance += 1;
            else Chance += 2; //Dürfte nur noch der Strand übrig sein
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[SOS].First)
            {
                PapierText = DrawText(messages.SOSHILFE,TXTPAPIER,1);
                Bmp[SOS].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkFeuerstelle()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = FEUERSTELLE;
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[FEUERSTELLE].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[FEUERSTELLE].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Bmp[FEUERSTELLE].rcDes.left;
        Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Bmp[FEUERSTELLE].rcDes.top;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+4,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+16);
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.PosScreen.x += 4;
            Guy.Zustand = GUYHINLEGEN;
            AddResource(RES_WATER,-1);
            AddResource(RES_FOOD,-1);
            AddTime(0,1);
            break;
        case 3:
            Guy.Aktiv   = true;
            Guy.PosScreen.x -= 4;
            Guy.Zustand = GUYAUFSTEHEN;
            AddResource(RES_WATER,-1);
            AddResource(RES_FOOD,-1);
            AddTime(0,1);
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[FEUERSTELLE].Anzahl+1);
            break;
        case 4:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+15);
            break;
        case 5: case 6: case 7:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYBINDENOBEN;
        AddResource(RES_WATER,-1);
        AddResource(RES_FOOD,-1);
        AddTime(0,1);
        if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer !== 5)
            Scape[Guy.Pos.x][Guy.Pos.y].Phase =
                (Bmp[FEUERSTELLE].Anzahl+Scape[Guy.Pos.x][Guy.Pos.y].AkNummer-4);
        break;
        case 8:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 9:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[FEUERSTELLE].First)
            {
                PapierText = DrawText(messages.FEUERSTELLEHILFE,TXTPAPIER,1);
                Bmp[FEUERSTELLE].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkHaus1()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[HAUS1].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[HAUS1].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = HAUS1;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+
                Bmp[BAUMGROSS].Breite/2-3,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+
                Bmp[BAUMGROSS].Hoehe+1);
            break;
        case 2: case 3: case 4: case 5:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER;
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 6: case 7: case 8: case 9:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS1].Anzahl+1);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 10: case 11: case 12: case 13:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS1].Anzahl+2);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 14: case 15: case 16: case 17:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS1].Anzahl+3);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 18:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 19:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkHaus2()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[HAUS2].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[HAUS2].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = HAUS2;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+
                Bmp[BAUMGROSS].Breite/2,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+
                Bmp[BAUMGROSS].Hoehe+1);
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYKLETTERN1;
            AddResource(RES_FOOD,-1);
            AddResource(RES_WATER,-1);
            AddTime(0,1);
            break;
        case 3: case 4: case 5: case 6:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 7: case 8: case 9: case 10:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS2].Anzahl+1);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 11: case 12: case 13: case 14:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS2].Anzahl+2);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 15: case 16: case 17: case 18:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS2].Anzahl+3);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 19:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYKLETTERN2;
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS2].Anzahl+4);
            AddResource(RES_FOOD,-1);
            AddResource(RES_WATER,-1);
            AddTime(0,1);
            break;
        case 20:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 21:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkHaus3()
{
    if (Scape[Guy.Pos.x][Guy.Pos.y].AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
        for (let i=0; i<BILDANZ; i++)
            Scape[Guy.Pos.x][Guy.Pos.y].Rohstoff[i] = Bmp[HAUS3].Rohstoff[i];
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = Bmp[HAUS3].Anzahl;
        Scape[Guy.Pos.x][Guy.Pos.y].Objekt = HAUS3;
    }
    Scape[Guy.Pos.x][Guy.Pos.y].AkNummer++;
    if (!CheckRohstoff())
    {
        Scape[Guy.Pos.x][Guy.Pos.y].AkNummer--;
        return;
    }
    switch(Scape[Guy.Pos.x][Guy.Pos.y].AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+
                Bmp[BAUMGROSS].Breite/2,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+
                Bmp[BAUMGROSS].Hoehe+1);
            break;
        case 2:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYKLETTERN1;
            AddResource(RES_FOOD,-1);
            AddResource(RES_WATER,-1);
            AddTime(0,1);
            break;
        case 3: case 4: case 5: case 6:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 7: case 8: case 9: case 10:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS3].Anzahl+1);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 11: case 12: case 13: case 14:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS3].Anzahl+2);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 15: case 16: case 17: case 18:
        Guy.Aktiv   = true;
        Guy.Zustand = GUYHAMMER2;
        Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS3].Anzahl+3);
        AddResource(RES_FOOD,-0.5);
        AddResource(RES_WATER,-0.5);
        AddTime(0,1);
        break;
        case 19:
            Guy.Aktiv   = true;
            Guy.Zustand = GUYKLETTERN2;
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = (Bmp[HAUS3].Anzahl+4);
            AddResource(RES_FOOD,-1);
            AddResource(RES_WATER,-1);
            AddTime(0,1);
            break;
        case 20:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            break;
        case 21:
            Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            Bmp[BUTTSTOP].Phase = -1;
            if (Bmp[HAUS3].First)
            {
                PapierText = DrawText(messages.HAUS3HILFE,TXTPAPIER,1);
                Bmp[HAUS3].First = false;
            }
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkSchlafen()
{
    if (Guy.AkNummer === 0)
    {
        Guy.PosAlt = Guy.PosScreen;	//Die Originalposition merken
    }
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+3,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+20);
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
                ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+
                    Bmp[BAUMGROSS].Breite/2+1,
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+
                    Bmp[BAUMGROSS].Hoehe+1);
            break;
        case 2:
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYKLETTERN1;
                AddResource(RES_FOOD,-1);
                AddResource(RES_WATER,-1);
            }
            break;
        case 3:
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase <  Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYGEHINZELT;
            }
            else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase <  Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYGEHINHAUS;
            }
            else
            {
                Guy.PosScreen.x += 3;
                Guy.Aktiv   = true;
                Guy.Zustand = GUYHINLEGEN;
            }
            break;
        case 4: case 5:
        Guy.Aktiv   = true;
        if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === ZELT) &&
            (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
        {
            if (Guy.AkNummer === 4) Guy.PosScreen.x += 4;
            Guy.Zustand = GUYSCHLAFZELT;
        }
        else if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
            (Scape[Guy.Pos.x][Guy.Pos.y].Phase < Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
        {
            if (Guy.AkNummer === 4) Guy.PosScreen.x += 14;
            Guy.Zustand = GUYSCHLAFHAUS;
        }
        else Guy.Zustand = GUYSCHLAFEN;
        AddResource(RES_HEALTH,5);
        AddTime(0,30);
        break;
        case 6:
            Guy.Aktiv   = true;
            stop_sound(sfx_snore);
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase <  Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.PosScreen.x -= 14;
                Guy.Zustand = GUYGEHAUSHAUS;
            }
            else Guy.Zustand = GUYAUFSTEHEN;
            break;
        case 7:
            if ((Scape[Guy.Pos.x][Guy.Pos.y].Objekt === HAUS3) &&
                (Scape[Guy.Pos.x][Guy.Pos.y].Phase <  Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Anzahl))
            {
                Guy.Aktiv   = true;
                Guy.Zustand = GUYKLETTERN2;
                AddResource(RES_FOOD,-1);
                AddResource(RES_WATER,-1);
            }
            break;
        case 8:
            ShortRoute(Guy.PosAlt.x,Guy.PosAlt.y);
            Guy.Aktion = AKNICHTS;
            break;
    }
}

function AkAblegen()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            ShortRoute(Scape[Guy.Pos.x][Guy.Pos.y].xScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x+14,
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen+Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y+11);
            break;
        case 2:
            ChangeBootsFahrt();
            Guy.PosScreen.x = Scape[Guy.Pos.x][Guy.Pos.y].xScreen+
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x +
                Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2;
            Guy.PosScreen.y = Scape[Guy.Pos.x][Guy.Pos.y].yScreen +
                Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y +
                Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe/2;
            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = -1;
            if      (Scape[Guy.Pos.x-1][Guy.Pos.y].Art === 1) Guy.Pos.x--;
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Art === 1) Guy.Pos.y--;
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Art === 1) Guy.Pos.x++;
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Art === 1) Guy.Pos.y++;
            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));

            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            Guy.PosAlt.x = Guy.PosScreen.x;
            Guy.PosAlt.y = Guy.PosScreen.y;
            break;
    }
}

function AkAnlegen()
{
    Guy.AkNummer++;
    switch(Guy.AkNummer)
    {
        case 1:
            if (Scape[Guy.Pos.x-1][Guy.Pos.y].Art !== 1)
            {
                ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                    Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].x) /2),
                    ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].y +
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y) /2));
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Art !== 1)
            {
                ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].x +
                    Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                    ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].y) /2));
            }
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Art !== 1)
            {
                ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x +
                    Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].x) /2),
                    ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].y +
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Art !== 1)
            {
                ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].x +
                    Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x) /2),
                    ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y +
                        Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].y) /2));
            }
            break;
        case 2:
            if      (Scape[Guy.Pos.x-1][Guy.Pos.y].Art !== 1)
            {
                Guy.Pos.x--;
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y-1].Art !== 1)
            {
                Guy.Pos.y--;
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 1;
            }
            else if (Scape[Guy.Pos.x+1][Guy.Pos.y].Art !== 1)
            {
                Guy.Pos.x++;
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 0;
            }
            else if (Scape[Guy.Pos.x][Guy.Pos.y+1].Art !== 1)
            {
                Guy.Pos.y++;
                Scape[Guy.Pos.x][Guy.Pos.y].Phase = 1;
            }

            Scape[Guy.Pos.x][Guy.Pos.y].Objekt = BOOT;
            Scape[Guy.Pos.x][Guy.Pos.y].AkNummer = Bmp[BOOT].AkAnzahl;

            ChangeBootsFahrt();
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.x = Guy.PosScreen.x -
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen -
                Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Breite/2;
            Scape[Guy.Pos.x][Guy.Pos.y].ObPos.y = Guy.PosScreen.y -
                Scape[Guy.Pos.x][Guy.Pos.y].yScreen -
                Bmp[Scape[Guy.Pos.x][Guy.Pos.y].Objekt].Hoehe/2;

            ShortRoute(((Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][0].x +
                Scape[Guy.Pos.x][Guy.Pos.y].xScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][2].x) /2),
                ((Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][1].y +
                    Scape[Guy.Pos.x][Guy.Pos.y].yScreen+EckKoor[Scape[Guy.Pos.x][Guy.Pos.y].Typ][3].y) /2));

            break;
        case 3:
            Guy.Aktion = AKNICHTS;
            Guy.PosAlt.x = Guy.PosScreen.x;
            Guy.PosAlt.y = Guy.PosScreen.y;
            break;
    }
}