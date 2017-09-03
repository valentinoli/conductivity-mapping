# Jarðleiðniverkefnið
======
## Kortlagning á jarðleiðni Íslands
## Mapping of ground conductivity in Iceland

Valentin Oliver Loftsson

ágúst 2017

### Leiðbeiningar

* Sækið skrárnar af GitHub

* Sækið Node.js og NPM

https://nodejs.org/en/download/

https://www.npmjs.com/

* Opnið skipanaglugga (command prompt) í skráasafninu

* Sannreynið að þið hafið aðgang að Node.js og NPM

`% node -v` 

`% npm -v`

* Sækið pakkana frá NPM sem skilgreindir eru í package.json

´% npm install`

------------------------------

Nú má kveikja á vefþjóninum og opna síðuna í vafra með

`% gulp run`

eða bara

`% gulp`

Þetta kveikir á vefþjóninum og vafrasamstillingu samtímis.

Vafrasamstillingin fer í gang þegar breytingar verða á skrám í \dist.

Vafrasamstillingin er keyrð á staðgengilsþjóni á aðgangstengi (port) 4000.

Vefþjónninn sjálfur er keyrður á aðgangstengi 3000.

Opnið annan skipanaglugga og keyrið

`% gulp watch`

til að fylgjast með skrám í \src (upprunalegum skrám)
