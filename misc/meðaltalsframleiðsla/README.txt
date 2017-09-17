Höfundur: Valentin Oliver Loftsson
ágúst 2017

Þegar gögn Sæmundar heitins voru skoðuð hafði hann skráð margar endurteknar mælingar, 
þ.e. stundum mældi hann oftar en einu sinni sviðstyrk frá tilteknum sendi á sama staðnum 
(vegpunkti). Alls voru mælingarnar fyrst 23222 talsins þegar þeim hafði verið
safnað saman. En ákveðið var í samráði við Sæmund Þorsteinsson (leiðbeinanda undirritaðs)
að taka endurteknar mælingar saman og birta meðaltal þeirra ásamt frávikshlutfalli
(e. coefficient of variation). Hverri mælingu fylgir ákveðin dagsetning, og var ákveðið
að láta dagsetningu síðustu mælingar sem Sæmundur framkvæmdi fylgja hverju meðaltali.

Forritið Medaltalsframleidari.java var skrifað í þessum tilgangi. Það les inn skrána 
repeated.txt sem inniheldur allar endurteknar mælingar, sem var raðað fyrst 
eftir auðkenni sendis, fyrsta dálki, og síðan eftir vegpunkti, öðrum dálki.
Athuga skal að síðasta línan í þeirri skrá er tilviljunarkennd, þ.e.
ekki hluti af gögnunum, en nauðsynleg til að skila hárréttri niðurstöðu.
Endurteknu mælingarnar eru 8709 talsins. Forritið meðhöndlar gögnin og 
býr síðan til nýja skrá, newrecords.txt, sem inniheldur allar endurteknu mælingarnar 
eftir að þeim hefur verið breytt í einkvæmar mælingar. Niðurstaðan varð sú að
hægt var að fækka þeim í 3753 mælingar. Mælingarnar urðu því alls 
18266 [ 23222 - (8709 - 3753) = 18266 ].

Þýðing:

% javac Medaltalsframleidari.java

Keyrsla:

% java Medaltalsframleidari


Dæmi:

Sæmundur skráði þrjár mælingar á vegpunkti 100 frá sendinum á Egilsstöðum (ES).

mæling 1: 25,0 µV/m
mæling 2: 20,0 µV/m
mæling 3: 21,0 µV/m

meðalstyrkur: 22,0 µV/m
N = 3 (N = fjöldi mælinga)

staðalfrávik = SQRT( ( (mæling 1 - meðalstyrkur)^2 + (mæling 2 - meðalstyrkur)^2 
             + (mæling 3 - meðalstyrkur)^2 ) / (N - 1) )
             = SQRT( 7 ) = 2,6457...

frávikshlutfall = ( staðalfrávik / meðalstyrkur ) * (1 + ( 1 / (4N))) = 0,13028...
Þetta merkir að hver mæling víkur að jafnaði um 13% frá meðaltalinu.


Við margföldum með (1 + (1 / (4N))) til þess að laga ákveðna bjögun í mati á frávikinu 
vegna lítillar úrtaksstærðar. 

"When only a sample of data from a population is available, the population coefficient of variation 
can be estimated using the ratio of the sample standard deviation to the sample mean. 

"But this estimator, when applied to a small or moderately sized sample, tends to be too low: 
it is a biased estimator. For normally distributed data, an unbiased estimator for a sample of size n is:

CV = (1 + 1 / (4n)) * STDEV/MEAN "

Heimild: https://en.wikipedia.org/wiki/Coefficient_of_variation#Estimation


Þetta skjal er aðeins til upplýsingar, en forritið hefur þegar þjónað sínum tilgangi.