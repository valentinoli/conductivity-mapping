H�fundur: Valentin Oliver Loftsson
�g�st 2017

Lei�beiningar fyrir Excel-einingaforrit

ATH! Allar .dll og Excel-skr�r � �essu skr�asafni �urfa a� vera
� sama skr�asafninu svo Excel-einingarnar virki.


A� nota einingarnar sem S�mundur �skarsson forrita�i � Visual Basic:

1. Opni� Reikna.xlsm (Excel Macro-Enabled Workbook)
2. Visti� sem (Save As) Excel Workbook (Reikna.xlsx) 

Yfirskrifi� eldra skjal ef �a� er �egar til sta�ar:

Reikna.xlsx already exists.
Do you want to replace it?
--> Yes

�� �tti a� koma upp eftirfarandi vi�v�run:

The following features cannot be saved in macro-free workbooks
[...]
To continue saving as a macro-free workbook, click Yes
--> Yes

3. Hafi� Reikna.xlsx opi� � me�an form�lurnar eru nota�ar.

�essum skrefum �arf m�gulega a� fylgja aftur s��ar.

N� �ttir�u a� geta nota� einingarnar � annarri Excel-skr�, t.d.

=Reikna.xlsx!LeidniS1(...)

Athugi� a� vinnslut�mi forritanna getur veri� langur ef �au eru l�tin
reikna marga reiti � einu.

Lei�niform�lurnar taka sem fyrsta vi�fang, t��ni sendis � MHz (kHz / 1000)
og sem anna� vi�fang, �tgeisla� afl sendis � dBk.

LeidniS1(kHz / 1000, dBk, Fjarl�g� 1 (D1), Styrkur 1 (E1))
LeidniS2(kHz / 1000, dBk, Fjarl�g� 1 (D1), Lei�ni 1 (S1), Fjarl�g� 2, Styrkur 2)
LeidniS3(kHz / 1000, dBk, Fjarl�g� 1, Lei�ni 1, Fjarl�g� 2, Lei�ni 2, Fjarl�g� 3, Styrkur 3)
...

Ef �tkoman er anna�hvort 1000 e�a -1000, �� er styrkurinn anna�hvort ne�an e�a ofan marka
sem S�mundur �skarsson skilgreinir. Undirrita�ur �ekkir ekki n�kv�mlega hver skilgreiningin
er � �v� a� styrkm�ling lendi ofan/ne�an marka.


A� sko�a Visual Basic k��ann:

1. Opni� Reikna.xlsm (Excel Macro-Enabled Workbook)
2. Fari� � File -> Options -> Customize Ribbon
3. Haki� � Developer reitinn og loki�
4. Fari� � Developer -> Visual Basic


Undirrita�ur fann ekki margar source-skr�r fyrir DLL-skr�rnar,
sem kalla� er � �r Excel-einingunum, en greinilegt er a� ��r hafi
upprunalega veri� forrita�ar � Fortran.