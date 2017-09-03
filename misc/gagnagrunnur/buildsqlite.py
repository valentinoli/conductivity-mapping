# Höfundur: Valentin Oliver Loftsson
# júní 2017
# Þýtt og keyrt á skipanalínu með
# % python buildsqlite.py
# Forritið býr til sqlite3 gagnagrunn
# með því að lesa þrjár CSV skrár:
# sendar.csv, maelingar.csv, punktar.csv
# Skrárnar þurfa að vera staðsettar í sama
# skráarsafni og forritið.

import sys
import os
import argparse
import sqlite3
import csv
from os.path import isfile
database = "sqlite3_gagnasafn.db"
dir = os.path.dirname(os.path.realpath(__file__))

def createDB():	
	if os.path.isfile(database):
		print("There is already a database with the name: " + database)
	else:
		try:
			conn = sqlite3.connect(database)
			c = conn.cursor()
			c.executescript("""
				CREATE TABLE Sendir (
					id VARCHAR(3) PRIMARY KEY, 
					stadur VARCHAR(30), 
					breidd FLOAT, 
					lengd FLOAT, 
					tidni FLOAT, 
					dBk FLOAT, 
					W FLOAT
				);
				CREATE TABLE Punktur (
					id INTEGER PRIMARY KEY, 
					stadarlysing VARCHAR(50), 
					breidd FLOAT, 
					lengd FLOAT
				);
				CREATE TABLE Maeling (
					sendir VARCHAR(3) NOT NULL, 
					punktur INTEGER NOT NULL, 
					dagsetning DATE, 
					svidstyrkur FLOAT NOT NULL, 
					fjarlaegd FLOAT, 
					stefna FLOAT,
					fravikshlutfall FLOAT,
          fjarlaegd1 FLOAT,
          leidni1 FLOAT,
          fjarlaegd2 FLOAT,
          leidni2 FLOAT,
          fjarlaegd3 FLOAT,
          leidni3 FLOAT,
          fjarlaegd4 FLOAT,
          leidni4 FLOAT,
					CONSTRAINT fk1 FOREIGN KEY (sendir)
            REFERENCES Sendir(id)
						ON UPDATE CASCADE
						ON DELETE RESTRICT,
					CONSTRAINT fk2 FOREIGN KEY (punktur)
            REFERENCES Punktur(id)
						ON UPDATE CASCADE
						ON DELETE RESTRICT
				);
			""")
			
			sendir(c)
			punktur(c)
			maeling(c)
			
			conn.commit()
			conn.close()
			print("Database created successfully")
		except conn.Error:
			conn.rollback()
			conn.close()
			print("Database created unsuccessfully")
	
def sendir(c):
	
	csvfile = dir + "/sendar.csv"
	with open(csvfile,'r') as f:
		dr = csv.reader(f)
		next(dr, None)
		for row in dr:
			c.execute("INSERT INTO Sendir VALUES (?,?,?,?,?,?,?) ", row)
	
	print("Transmitters inserted successfully")
		
def punktur(c):
	
	csvfile = dir + "/punktar.csv"
	with open(csvfile,'r') as f:
		dr = csv.reader(f)
		next(dr, None)
		for row in dr:
			c.execute("INSERT INTO Punktur VALUES (?,?,?,?) ", row)

	print("Points of measurement inserted successfully")
	
def maeling(c):
		
	csvfile = dir + "/maelingar.csv"
	with open(csvfile,'r') as f:
		dr = csv.reader(f)
		next(dr, None)
		for row in dr:
			c.execute("INSERT INTO Maeling VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ", row)

		print("Measurements inserted successfully")
		
def main():
	createDB()

if __name__ == "__main__": main()