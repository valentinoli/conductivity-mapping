H�fundur: Valentin Oliver Loftsson
�g�st 2017

Skr�in vegpunktaprof.txt inniheldur vegpunkta/m�lipunkta allra m�linga
(l�nur 1-18266) og �ar � eftir koma vegpunktar sem skr��ir voru
� vegpunktaskr�nni sem S�mundur �skarsson skildi eftir sig (l�nur 18267+),
en upprunalegu skr�na m� finna � M�lipunktar.xls.

Forriti� vegpunktaprof.cpp skrifar �t au�kenni �eirra vegpunkta � vegpunktaprof.txt 
(l�nur 1-18266) sem ekki finnast � vegpunktaskr�nni (l�nur 18267+).

Forriti� var skrifa� � �eim tilgangi a� finna �samr�mi � g�gnunum og lagf�ra �a� 
til a� tryggja samsv�run � gagnagrunninum, a� allar m�lingar hef�u m�lipunkt
sem �tti s�r samsv�run � vegpunktaskr�nni. 

���ing:

% g++ vegpunktaprof.cpp -o vegpunktaprof

Keyrsla:

% vegpunktaprof < vegpunktaprof.txt

Keyrsla me� vegpunktaprof.txt birtir �� vegpunkta sem ekki fundust � upprunalegu
vegpunktaskr� S�mundar. 
Keyrsla me� vegpunktaprof_med_uppfaerdri_skra.txt birtir enga vegpunkta, �.e. allar
vegpunktar allra m�linga eiga s�r samsv�run � uppf�r�u vegpunktaskr�nni.
H�r m� �ess geta a� nokkrir punktar � vegpunktaskr�nni eiga s�r ekki samsv�run � 
m�lingaskr�, en tali� var tilefnislaust a� fjarl�gja ��.

�etta skjal er a�eins til uppl�singar, en forriti� hefur �egar �j�na� s�num tilgangi.