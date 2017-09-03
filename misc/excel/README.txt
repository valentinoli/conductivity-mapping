Höfundur: Valentin Oliver Loftsson
ágúst 2017

Leiðbeiningar fyrir Excel-einingaforrit

ATH! Allar .dll og Excel-skrár í þessu skráasafni þurfa að vera
í sama skráasafninu svo Excel-einingarnar virki.


Að nota einingarnar sem Sæmundur Óskarsson forritaði í Visual Basic:

1. Opnið Reikna.xlsm (Excel Macro-Enabled Workbook)
2. Vistið sem (Save As) Excel Workbook (Reikna.xlsx) 

Yfirskrifið eldra skjal ef það er þegar til staðar:

Reikna.xlsx already exists.
Do you want to replace it?
--> Yes

Þá ætti að koma upp eftirfarandi viðvörun:

The following features cannot be saved in macro-free workbooks
[...]
To continue saving as a macro-free workbook, click Yes
--> Yes

3. Hafið Reikna.xlsx opið á meðan formúlurnar eru notaðar.

Þessum skrefum þarf mögulega að fylgja aftur síðar.

Nú ættirðu að geta notað einingarnar í annarri Excel-skrá, t.d.

=Reikna.xlsx!LeidniS1(...)

Athugið að vinnslutími forritanna getur verið langur ef þau eru látin
reikna marga reiti í einu.

Leiðniformúlurnar taka sem fyrsta viðfang, tíðni sendis í MHz (kHz / 1000)
og sem annað viðfang, útgeislað afl sendis í dBk.

LeidniS1(kHz / 1000, dBk, Fjarlægð 1 (D1), Styrkur 1 (E1))
LeidniS2(kHz / 1000, dBk, Fjarlægð 1 (D1), Leiðni 1 (S1), Fjarlægð 2, Styrkur 2)
LeidniS3(kHz / 1000, dBk, Fjarlægð 1, Leiðni 1, Fjarlægð 2, Leiðni 2, Fjarlægð 3, Styrkur 3)
...

Ef útkoman er annaðhvort 1000 eða -1000, þá er styrkurinn annaðhvort neðan eða ofan marka
sem Sæmundur Óskarsson skilgreinir. Undirritaður þekkir ekki nákvæmlega hver skilgreiningin
er á því að styrkmæling lendi ofan/neðan marka.


Að skoða Visual Basic kóðann:

1. Opnið Reikna.xlsm (Excel Macro-Enabled Workbook)
2. Farið í File -> Options -> Customize Ribbon
3. Hakið í Developer reitinn og lokið
4. Farið í Developer -> Visual Basic


Undirritaður fann ekki margar source-skrár fyrir DLL-skrárnar,
sem kallað er í úr Excel-einingunum, en greinilegt er að þær hafi
upprunalega verið forritaðar í Fortran.