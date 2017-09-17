'use strict';

require('dotenv').config();
var express = require('express');

var router = express.Router();
var mysql = require('mysql');

var db = process.env.CLEARDB_DATABASE_URL;

// Route þegar notandi kemur á forsíðu
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/maelingar', function (req, res) {
  var connection = mysql.createConnection(db);

  connection.connect();

  connection.on('error', function (err) {
    throw err;
  });

  connection.query('SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id', function (error, results) {
    if (error) throw error;

    connection.destroy();

    var obj = {
      transmitters: results,
      transmitter: [],
      measurements: []
    };

    res.render('maelingar', obj);
  });
});

router.post('/maelingar', function (req, res) {
  var connection = mysql.createConnection(db);

  connection.connect();

  connection.on('error', function (err) {
    throw err;
  });

  var input = req.body.transmitter;

  connection.query('SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling WHERE sendir = ? GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id; SELECT stadarlysing, id, Punktur.breidd AS breidd, Punktur.lengd AS lengd, svidstyrkur, fjarlaegd, stefna, fravikshlutfall FROM Punktur, Maeling WHERE punktur = Punktur.id AND sendir = ?; SELECT id, stadur, breidd, lengd, tidni, dBk, W, fjoldi FROM Sendir, ( SELECT sendir, COUNT(*) AS fjoldi FROM Maeling GROUP BY sendir ) AS N WHERE N.sendir = Sendir.id', [input, input], function (error, results) {
    if (error) throw error;

    connection.destroy();

    var obj = {
      transmitter: results[0],
      measurements: results[1],
      transmitters: results[2]
    };

    res.render('maelingar', obj);
  });
});

router.get('/leidnikort', function (req, res) {
  res.render('leidnikort');
});

module.exports = router;