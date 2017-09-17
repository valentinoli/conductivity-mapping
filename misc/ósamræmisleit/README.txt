Höfundur: Valentin Oliver Loftsson
ágúst 2017

Skráin vegpunktaprof.txt inniheldur vegpunkta/mælipunkta allra mælinga
(línur 1-18266) og þar á eftir koma vegpunktar sem skráðir voru
í vegpunktaskránni sem Sæmundur Óskarsson skildi eftir sig (línur 18267+),
en upprunalegu skrána má finna í Mælipunktar.xls.

Forritið vegpunktaprof.cpp skrifar út auðkenni þeirra vegpunkta í vegpunktaprof.txt 
(línur 1-18266) sem ekki finnast í vegpunktaskránni (línur 18267+).

Forritið var skrifað í þeim tilgangi að finna ósamræmi í gögnunum og lagfæra það 
til að tryggja samsvörun í gagnagrunninum, að allar mælingar hefðu mælipunkt
sem ætti sér samsvörun í vegpunktaskránni. 

Þýðing:

% g++ vegpunktaprof.cpp -o vegpunktaprof

Keyrsla:

% vegpunktaprof < vegpunktaprof.txt

Keyrsla með vegpunktaprof.txt birtir þá vegpunkta sem ekki fundust í upprunalegu
vegpunktaskrá Sæmundar. 
Keyrsla með vegpunktaprof_med_uppfaerdri_skra.txt birtir enga vegpunkta, þ.e. allar
vegpunktar allra mælinga eiga sér samsvörun í uppfærðu vegpunktaskránni.
Hér má þess geta að nokkrir punktar í vegpunktaskránni eiga sér ekki samsvörun í 
mælingaskrá, en talið var tilefnislaust að fjarlægja þá.

Þetta skjal er aðeins til upplýsingar, en forritið hefur þegar þjónað sínum tilgangi.