Grófar leiðbeiningar fyrir gagnagrunnsuppsetningu, notkun og viðhald
Höfundur: Valentin Oliver Loftsson
ágúst 2017

* Meðhöndlun á gagnagrunninum krefst lágmarksþekkingar á SQL fyrirspurnarmálinu.

* Vefforritið (jardleidni.herokuapp.com) notast við MySQL gagnasafnskerfið. 
  Til þess að fá aðgang að gagnagrunninum þarf að hlaða MySQL hugbúnaðinum niður ( https://mysql.com/downloads/ ). 
  Gagnagrunnurinn er hýstur hjá ClearDB sem býður upp á takmarkaða ókeypis gagnagrunnshýsingu (5 MB), 
  en hún hefur nægt verkefninu hingað til (sjá https://elements.heroku.com/addons/cleardb ).
  
  Upplýsingar um ClearDB gagnagrunninn er að finna á Heroku-aðganginum undir 
  Resources -> Add-ons -> ClearDB MySQL :: Database.
  
  Gagnagrunnsslóðina (sem inniheldur notandanafn og lykilorð gagnagrunnsins) 
  er að finna inni á Heroku-aðganginum undir 
  Settings -> Config Variables -> Reveal Config Vars -> DATABASE_URL.
  Gætið þess að breyta ekki DATABASE_URL slóðinni inni á Heroku, 
  nema tilgangurinn sé skýr og ásetningurinn meðvitaður.
  
  Gagnagrunnsslóðin byggist upp á eftirfarandi hátt:
  
  mysql://username:password@host/databaseName?option1&option2...
  
  Ath. Sjálfsagt er hægt að setja gagnagrunninn upp á tölvu staðbundið til prófunar, en til þess
  að vefurinn virki, þarf hann að tengjast gagnagrunninum á ClearDB (þ.e. á "sívökulum" vefþjóni).

* Undirritaður mælir með notkun MySQL Workbench. Það er þægilegt og einfalt, en auðvitað er líka
  hægt að nota skipanalínu til að gefa skipanir. Í MySQL Workbench þarf að gefa upp notandanafn og 
  lykilorð til að tengjast gagnagrunninum hjá ClearDB.
  
* Til að bæta við gögnum eða gera smávægilegar breytingar á þeim má ávallt keyra einfaldar UPDATE, 
  DELETE eða INSERT skipanir. Þetta má til dæmis gera með því að skrifa skipanir í .sql skrá.
  Til dæmis gæti innihald .sql skrárinnar verið eitthvað á þessa leið (sjá mysql_update.sql):
  
  START TRANSACTION;  
  UPDATE table_reference SET col_name1=expr1 [, col_name2=expr2] ... [WHERE where_condition]
  ...
  COMMIT;
  
  Síðan mætti keyra skipanirnar í MySQL Workbench: File -> Run SQL Script...

* Excel-skráin gogn.xls inniheldur öll gögnin sem SQL gagnagrunnurinn byggir á. 
  Fyrstu þrjár síðurnar (sendar, punktar og maelingar), svara til hinna þriggja
  vensla/tafla SQL gagnagrunnsins. Ef þessi skrá er uppfærð og gerðar eru viðamiklar breytingar á henni
  - sem eru þess eðlis að flókið eða ómögulegt væri að skrifa SQL skipanir til að uppfæra SQL gagnagrunninn - 
  þá stendur eftirfarandi leið til boða. Upphaflega notaði undirritaður þessa leið til að 
  flytja gagnagrunninn úr SQLite yfir í MySQL.
  
  1. Setjið sqlite3 og python upp.
  
  2. Vistið síðurnar þrjár í Excel-skránni sem þrjár mismunandi CSV-skrár (e. Comma-separated value file), 
     maelingar.csv, sendar.csv og punktar.csv. Þetta er gert með því að velja eina síðu í Excel-skránni
     fara síðan í File -> Save As... -> Save as type: CSV (Comma delimited). 
     Geymið skrárnar í \sqlite skráasafninu.
     
     ATH! Áður en vistað er skal tryggja að dagsetningar séu á forminu YYYY-MM-DD
  
  3. Opnið skipanalínu í \sqlite skráasafninu. Keyrið python-forritið buildsqlite.py með eftirfarandi skipun:
  
     % python buildsqlite.py
     
     Þá verður til SQLite gagnagrunnsskrá (sqlite3_gagnasafn.db) úr CSV-skránum.
     
  4. Sturtið gagnagrunnsskránni í .sql skrá:
     
     % sqlite3 sqlite3_gagnasafn.db .dump > gagnasafn.sql
     
     Þá verður til SQL-skrá (gagnasafn.sql) sem inniheldur skipanir fyrir SQLite 
     sem framleiðir gagnagrunninn frá grunni.
  
  5. Takið afrit af skránni og nefnið afritið mysql_gagnasafn.sql og flytjið í \mysql skráasafnið
  
  5. Þar sem MySQL fylgir ekki alveg nákvæmlega sama staðli og SQLite, þá viljum við breyta skipununum
     í skránni (mysql_gagnasafn.sql) þannig að MySQL gagnasafnskerfið skilji þær.
  
     Gerum eftirfarandi breytingar á skránni:
     
     a. Fjarlægjum fyrstu línuna sem segir: "PRAGMA foreign_keys ..."
     b. Breytum "BEGIN TRANSACTION" í "START TRANSACTION"
     c. Bætum eftirfarandi línum beint á eftir "START TRANSACTION". 
        Ath. þær þurfa að vera í þessari röð, annars brotna vísanir.
        
        DROP TABLE IF EXISTS Maeling;
        DROP TABLE IF EXISTS Punktur;
        DROP TABLE IF EXISTS Sendir;
        
     d. Framkvæmum nokkrar Replace All aðgerðir (CTRL+H)
        i.   Replace All "Sendir"  -> Sendir
        ii.  Replace All "Punktur" -> Punktur
        iii. Replace All "Maeling" -> Maeling
        iv.  Replace All '' -> NULL
        
  6. MySQL ætti nú að skilja SQL-skipanirnar. Prófið að keyra í MySQL Workbench með File -> Run SQL Script...
     Workbench lætur vita ef einhverjar villur leynast í skránni.
     
     
     