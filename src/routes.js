
require('dotenv').config();
const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const db = process.env.CLEARDB_DATABASE_URL;

// Route þegar notandi kemur á forsíðu
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/maelingar', (req, res) => {
  const connection = mysql.createConnection(db);

  connection.connect();

  connection.on('error', (err) => {
    throw err;
  });

  connection.query('SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id', (error, results) => {
    if (error) throw error;

    connection.destroy();

    const obj = {
      transmitters: results,
      transmitter: [],
      measurements: [],
    };

    res.render('maelingar', obj);
  });
});

router.post('/maelingar', (req, res) => {
  const connection = mysql.createConnection(db);

  connection.connect();

  connection.on('error', (err) => {
    throw err;
  });

  const input = req.body.transmitter;

  connection.query('SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling WHERE sendir = ? GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id; SELECT stadarlysing, id, Punktur.breidd AS breidd, Punktur.lengd AS lengd, svidstyrkur, fjarlaegd, stefna, fravikshlutfall FROM Punktur, Maeling WHERE punktur = Punktur.id AND sendir = ?; SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id', [input, input], (error, results) => {
    if (error) throw error;

    connection.destroy();

    const obj = {
      transmitter: results[0],
      measurements: results[1],
      transmitters: results[2],
    };

    res.render('maelingar', obj);
  });
});

router.get('/leidnikort', (req, res) => {
  res.render('leidnikort');
});

module.exports = router;
