'use strict';

/* global google:true transmitter:true transmitters:true measurements:true */
var map = void 0;
var cvRemarkElement = void 0;
var cvRemark = void 0;
var currentTrmMarker = void 0;
var polyline = null;
var transmitterView = true;
var lastSelectedRow = void 0;
var maxStrength = 0;

var locMarkers = [];
var trmMarkers = [];
var REGEXP = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Mobile|Kindle|Silk|Opera Mini/i;
var MOBILE = REGEXP.test(navigator.userAgent);

var ICONS = {
  transmitter: {
    icon: 'img/transmitter.png',
    size: 32
  },
  selectedTransmitter: {
    icon: 'img/selectedTransmitter.png',
    size: 32
  },
  location: {
    icon: 'img/location.png',
    size: 12
  },
  selectedLocation: {
    icon: 'img/selectedLocation.png',
    size: 12
  }
};

var INFO_PARAGRAPH = document.querySelector('.info > p');

// Bætir við nýjum merkimiða með gefnum upplýsingum og eiginleikum
function addMarker(feature) {
  var size = ICONS[feature.type].size;
  return new google.maps.Marker({
    position: feature.position,
    title: feature.title,
    optimized: false,
    icon: {
      url: ICONS[feature.type].icon,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(size / 2, size + 4),
      labelOrigin: new google.maps.Point(size / 2, size + 12)
    },
    label: null,
    color: feature.color || undefined,
    line: feature.line || undefined,
    selected: feature.selected || false,
    map: map
  });
}

// Býr til línu frá merkimiða að sendi
function createPolyline(coord, color) {
  return new google.maps.Polyline({
    path: coord,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 1.75
  });
}

// Skiptir punkti fyrir kommu sem aukastafatákni í upplýsingum um mælingu
function decimalSeparatorReplaceLoc(loc) {
  var location = loc;
  location.svidstyrkur = location.svidstyrkur.toString().replace('.', ',');
  location.fjarlaegd = location.fjarlaegd.toString().replace('.', ',');
  location.stefna = location.stefna.toString().replace('.', ',');
  if (location.fravikshlutfall) {
    location.fravikshlutfall = location.fravikshlutfall.toString().replace('.', ',');
  }
  return location;
}

// Skiptir punkti fyrir kommu sem aukastafatákni í upplýsingum um sendi
function decimalSeparatorReplaceTrm(trm) {
  var transmitter = trm;
  transmitter.tidni = transmitter.tidni.toString().replace('.', ',');
  if (transmitter.dBk) {
    transmitter.dBk = transmitter.dBk.toString().replace('.', ',');
  }
  if (transmitter.W) {
    transmitter.W = transmitter.W.toString().replace('.', ',');
  }
  return transmitter;
}

// Knýr fram post-beiðni til vefþjóns með upplýsingum um valinn sendi
function post(params) {
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', './maelingar');

  Object.keys(params).forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      var hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);
      form.appendChild(hiddenField);
    }
  });
  document.body.appendChild(form);
  form.submit();
}

// Raðar töflu eftir dálki
function sortTable(table, col, reverse) {
  var tb = table.tBodies[0];
  var tr = Array.prototype.slice.call(tb.rows, 0);
  var rev = -(+reverse || -1);
  if (isNaN(tr[0].cells[col].innerHTML) && col === 0) {
    // athugað hvort raða þurfi eftir fyrsta dálki í sendatöflu (texti)
    tr.sort(function (a, b) {
      return rev * a.cells[col].textContent.localeCompare(b.cells[col].textContent);
    });
  } else {
    // annars innihalda dálkarnir talnagildi
    tr.sort(function (a, b) {
      return rev * (parseFloat(a.cells[col].textContent || '-1') - parseFloat(b.cells[col].textContent || '-1'));
    });
  }
  // Bæta röðum við töflu í réttri röð
  for (var i = 0; i < tr.length; i++) {
    tb.appendChild(tr[i]);
  }
}

// Gerir töflu raðanlega eftir dálkum
function makeSortable(table) {
  var th = table.tHead;
  th = th.rows[0].cells;
  if (!th) {
    return;
  }

  var _loop = function _loop(j) {
    var dir = 1;
    th[j].addEventListener('click', function () {
      sortTable(table, j, dir = 1 - dir);
    });
  };

  for (var j = th.length - 1; j >= 0; j -= 1) {
    _loop(j);
  }
}

// Setur atburðarhandföng fyrir töfluhausa neðri taflanna
function tableHeaderListeners() {
  var headers = document.querySelectorAll('.table-hover > thead > tr > th');

  var _loop2 = function _loop2(i) {
    headers[i].addEventListener('click', function () {
      for (var j = 0; j < headers.length; j += 1) {
        headers[j].classList.remove('selected');
      }
      headers[i].classList.toggle('selected');
    });
  };

  for (var i = 0; i < headers.length; i++) {
    _loop2(i);
  }
}

// Setur mælingarmerkmiða sem ræðst af viðfanginu icon
function setLocIcon(marker, icon) {
  var m = marker;
  var size = ICONS[icon].size;
  m.setIcon({
    url: ICONS[icon].icon,
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(size / 2, size + 4)
  });

  // forðumst að staðsetja miðann (label) á strikinu
  if (m.position.lat() > transmitter[0].breidd) {
    m.icon.labelOrigin = new google.maps.Point(size / 2, -12);
  } else {
    m.icon.labelOrigin = new google.maps.Point(size / 2, size + 12);
  }
}

// Rofi fyrir mælingarmerkimiða
function toggleMarker(marker, i) {
  var m = marker;
  // ef merkimiði var valinn er hann það ekki lengur
  // ... annars verður hann valinn
  if (m.selected) {
    m.line.setMap(null);
    m.setLabel(null);
    setLocIcon(m, 'location');
  } else {
    m.line.setMap(map);
    m.setLabel({
      color: '#555',
      fontFamily: 'sans-serif, serif',
      fontWeight: '600',
      fontSize: '11px',
      text: '' + measurements[i].id
    });
    setLocIcon(m, 'selectedLocation');
  }
  m.selected = !m.selected;
}

// Setur valinn sendi á kortið og býr til merkimiða
function addTransmitter() {
  var transm = transmitter[0];
  var trm = decimalSeparatorReplaceTrm(transm);

  var title = void 0;
  if (!trm.dBk) {
    title = trm.stadur + ' [' + trm.id + ']\nT\xED\xF0ni: ' + trm.tidni + ' kHz\nM\xE6lingar: ' + trm.fjoldi;
  } else {
    title = trm.stadur + ' [' + trm.id + ']\nT\xED\xF0ni: ' + trm.tidni + ' kHz\nAfl: ' + trm.dBk + ' dBk | ' + trm.W + ' W\nM\xE6lingar: ' + trm.fjoldi;
  }

  var transmitterFeatures = {
    position: new google.maps.LatLng(trm.breidd, trm.lengd),
    type: 'transmitter',
    title: title
  };

  currentTrmMarker = addMarker(transmitterFeatures);

  var size = ICONS.transmitter.size;
  currentTrmMarker.icon.labelOrigin = new google.maps.Point(size / 2, -12);

  currentTrmMarker.setLabel({
    color: '#555',
    fontFamily: 'sans-serif, serif',
    fontWeight: '600',
    fontSize: '11px',
    text: trm.stadur
  });
}

// Setur atburðarhandfang fyrir músarsmell á sendamerkimiða
function addTrmClickListener(marker, i) {
  google.maps.event.addListener(marker, 'click', function () {
    // Generate a post request, retrieving appropriate data from database
    post({ transmitter: transmitters[i].id });
  });
}

// Setur atburðarhandfang fyrir 'mouseover' á sendamerkimiða
function addTrmMouseoverListener(marker, i) {
  google.maps.event.addListener(marker, 'mouseover', function () {
    var size = ICONS.selectedTransmitter.size;
    marker.setIcon({
      url: ICONS.selectedTransmitter.icon,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(size / 2, size + 4),
      labelOrigin: new google.maps.Point(size / 2, size + 12)
    });
    marker.setLabel({
      color: '#555',
      fontFamily: 'sans-serif, serif',
      fontWeight: '600',
      fontSize: '11px',
      text: transmitters[i].stadur
    });
  });
}

// Setur atburðarhandfang fyrir 'mouseout' á sendamerkimiða
function addTrmMouseoutListener(marker) {
  google.maps.event.addListener(marker, 'mouseout', function () {
    var size = ICONS.transmitter.size;
    marker.setIcon({
      url: ICONS.transmitter.icon,
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(size / 2, size + 4)
    });
    marker.setLabel(null);
  });
}

// Setur senda á kortið, merkimiða og atburðarhandföng fyrir þá
function addTransmitters() {
  var marker = void 0;
  for (var i = 0; i < transmitters.length; i++) {
    var trm = transmitters[i];
    var _transmitter = decimalSeparatorReplaceTrm(trm);

    var title = void 0;
    if (!_transmitter.dBk) {
      title = _transmitter.stadur + ' [' + _transmitter.id + ']\nT\xED\xF0ni: ' + _transmitter.tidni + ' kHz\nM\xE6lingar: ' + _transmitter.fjoldi;
    } else {
      title = _transmitter.stadur + ' [' + _transmitter.id + ']\nT\xED\xF0ni: ' + _transmitter.tidni + ' kHz\nAfl: ' + _transmitter.dBk + ' dBk | ' + _transmitter.W + ' W\nM\xE6lingar: ' + _transmitter.fjoldi;
    }

    var transmitterFeatures = {
      position: new google.maps.LatLng(_transmitter.breidd, _transmitter.lengd),
      type: 'transmitter',
      title: title
    };

    marker = addMarker(transmitterFeatures);
    trmMarkers.push(marker);

    if (MOBILE) {
      marker.setLabel({
        color: '#555',
        fontFamily: 'sans-serif, serif',
        fontWeight: '600',
        fontSize: '9px',
        text: transmitters[i].stadur
      });
    }

    addTrmClickListener(marker, i);
    addTrmMouseoverListener(marker, i);
    addTrmMouseoutListener(marker);
  }
}

// Velur viðeigandi lit á polyline mælingar
// í hlutfalli við styrkinn
function generateLineColor(strength) {
  var color = '#';
  var red = Math.floor(254 - maxStrength * 1.2 + strength * 1.2).toString(16);
  if (red.length === 1) {
    color = color + '0';
  }
  color = '' + color + red;
  var green = Math.floor(strength).toString(16);
  if (green.length === 1) {
    color = color + '0';
  }
  color = '' + color + green + '00';
  return color;
}

// Setur atburðarhandfang fyrir músarsmell á mælingarmerkimiða
function addLocClickListener(marker, i) {
  google.maps.event.addListener(marker, 'click', function () {
    // Select appropriate row in table
    document.querySelector('tr.r' + i).classList.toggle('selected');
    // Toggle marker
    toggleMarker(marker, i);
  });
}

// Setur atburðarhandfang fyrir 'mouseover' á mælingarmerkimiða
function addLocMouseoverListener(marker, coordinates) {
  google.maps.event.addListener(marker, 'mouseover', function () {
    polyline = createPolyline(coordinates, marker.color);
    polyline.setMap(map);
    if (!marker.selected) setLocIcon(marker, 'selectedLocation');
  });
}

// Setur atburðarhandfang fyrir 'mouseout' á mælingarmerkimiða
function addLocMouseoutListener(marker) {
  google.maps.event.addListener(marker, 'mouseout', function () {
    if (polyline) {
      polyline.setMap(null);
      polyline = null;
    }
    if (!marker.selected) {
      setLocIcon(marker, 'location');
    }
  });
}

// Setur mælingar á kortið, merkimiða og atburðarhandföng fyrir þá
function addLocations() {
  var marker = void 0;
  // finnum hæstu mælinguna til að nota sem viðmið fyrir lit
  for (var i = 0; i < measurements.length; i++) {
    if (measurements[i].svidstyrkur > maxStrength) {
      maxStrength = measurements[i].svidstyrkur;
    }
  }

  for (var _i = 0; _i < measurements.length; _i++) {
    var loc = measurements[_i];

    var color = generateLineColor(loc.svidstyrkur);

    var location = decimalSeparatorReplaceLoc(loc);

    var title = '';
    if (location.stadarlysing) {
      title = '' + location.stadarlysing;
    }
    title = title + ' [' + location.id + ']\nStyrkur: ' + location.svidstyrkur + ' dB\u03BCV/m\nFjarl\xE6g\xF0: ' + location.fjarlaegd + ' km\nStefna: ' + location.stefna + '\xB0';
    if (location.fravikshlutfall) {
      title = title + '\nFr\xE1vikshlutfall: ' + location.fravikshlutfall;
    }

    var coordinates = [{ lat: location.breidd, lng: location.lengd }, { lat: transmitter[0].breidd, lng: transmitter[0].lengd }];

    var locationFeatures = {
      position: new google.maps.LatLng(location.breidd, location.lengd),
      type: 'location',
      title: title,
      color: color,
      line: createPolyline(coordinates, color),
      selected: false
    };

    marker = addMarker(locationFeatures);
    locMarkers.push(marker);

    addLocClickListener(marker, _i);
    addLocMouseoverListener(marker, coordinates);
    addLocMouseoutListener(marker);
  }
}

// Þegar shift er haldið niðri eru þær raðir valdar sem eru á milli
// gusíðustu raðar sem var valin og núverandi raðar
function toggleRowsBetweenIndices(indices) {
  var sort = function sort(a, b) {
    return a - b;
  };

  indices.sort(sort);
  var mrows = document.querySelectorAll('.table-measurements > table > tbody > tr');
  var markerIndex = void 0;
  for (var i = indices[0] + 1; i <= indices[1] - 1; i++) {
    mrows[i - 1].classList.toggle('selected');
    markerIndex = parseInt(mrows[i - 1].classList[0].substring(1), 10);
    toggleMarker(locMarkers[markerIndex], markerIndex);
  }
}

// Styðjum á rofa fyrir valda mælingu
function toggleRow(tr, i) {
  tr.classList.toggle('selected');
  toggleMarker(locMarkers[i], i);
  lastSelectedRow = tr;
}

// Atburðarhandfang fyrir raðir í mælingatöflu
function clickRow(i, e) {
  if (e.shiftKey) {
    toggleRowsBetweenIndices([lastSelectedRow.rowIndex, this.rowIndex]);
  }
  toggleRow(this, i);
}

/*  Bætir atburðarhandföngum við raðir sendatöflu og einnig mælingatöflu
 *  (ef einhver sendir er valinn)
 */
function rowListeners() {
  // Mælingatafla
  if (typeof transmitter !== 'undefined' && transmitter.length > 0) {
    var mrows = document.querySelectorAll('.table-measurements > table > tbody > tr');
    for (var i = 0; i < mrows.length; i++) {
      mrows[i].addEventListener('click', clickRow.bind(mrows[i], i));
    }
  }

  // Sendatafla
  var trows = document.querySelectorAll('.table-transmitters > table > tbody > tr');

  var _loop3 = function _loop3(_i2) {
    trows[_i2].addEventListener('click', function () {
      // framköllum post-beiðni til vefþjóns og veljum samsvarandi röð í töflu
      post({ transmitter: trows[_i2].className });
    });
  };

  for (var _i2 = 0; _i2 < trows.length; _i2++) {
    _loop3(_i2);
  }
}

/*
 *  Setur merkimiðana í fylkinu á kortið (map),
 *  ef kortið er gildislaust (null), þá er merkimiðinn ekki birtur
 */
function setMapOnAll(mapArg, markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(mapArg);
  }
}

// Fjarlægir alla merkimiða af kortinu en ekki úr fylkinu
function clearMarkers(markers) {
  setMapOnAll(null, markers);
}

// Birtir alla merkimiða í fylkinu
function showMarkers(markers) {
  setMapOnAll(map, markers);
}

// Tekur streng sem viðfang og skilar honum þannig að allir stafir hans séu lágstafir,
// nema mögulega upphafsstafurinn
function lowerCase(string) {
  return '' + string.charAt(0) + string.substring(1).toLowerCase();
}

// Skilar texta sem birta skal notanda þegar hann er að skoða sendana
function getTrmViewInfo() {
  return 'Veldu annan sendi af kortinu e\xF0a \xED t\xF6flunni fyrir ne\xF0an. Smelltu \xE1 \u201E' + lowerCase(transmitter[0].stadur) + '\u201C til a\xF0 fara til baka. Smelltu <a href=\'./gogn.zip\' download>h\xE9r<span class=\'glyphicon glyphicon-download-alt\' aria-hidden=\'true\'></span><span class="sr-only">hala ni\xF0ur</span></a> til a\xF0 s\xE6kja \xF6ll g\xF6gnin.';
}

// Skilar texta sem birta skal notanda þegar hann er að skoða mælingarnar
function getLocViewInfo() {
  return lowerCase(transmitter[0].stadur) + ': H\xE9r getur\xF0u sko\xF0a\xF0 styrkm\xE6lingar fr\xE1 \xFEessum sendi. Smelltu \xE1 \u201ESendar\u201C til a\xF0 sko\xF0a sendana aftur.';
}

// Skilar true ef element hefur klasann cls
function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/*
 *  Rofi fyrir valdar mælingar þegar skipt er um sýn.
 *  Finnum út hvaða merkimiðar eru valdir með því að finna
 *  þær raðir sem eru valdar.
 */
function toggleMarkers() {
  var selected = void 0;
  for (var i = 0; i < locMarkers.length; i++) {
    selected = hasClass(document.querySelector('tr.r' + i), 'selected');
    if (selected) {
      toggleMarker(locMarkers[i], i);
    }
  }
}

/*
 *  Skiptir út neðri töflunni undir kortinu. Ef skipt er yfir í sendasýn,
 *  þá er sendataflan birt í stað mælingatöflunnar, og öfugt.
 *  Einnig er athugasemdin um frávikshlutfallið aðeins birt í mælinga-sýn.
 */
function tableSwitch() {
  if (transmitterView) {
    document.querySelector('.table-transmitters').style.display = 'block';
    document.querySelector('.table-measurements').style.display = 'none';
    cvRemarkElement.innerHTML = '';
  } else {
    document.querySelector('.table-transmitters').style.display = 'none';
    document.querySelector('.table-measurements').style.display = 'block';
    cvRemarkElement.innerHTML = cvRemark;
  }
}

// Fylgist með því hvenær notandi er með shift takkann niðri
// og ef hann er niðri, þá er notandaval (user-selection) gert óvirkt
// á mælingatöflu
function shiftKeyListeners(selector) {
  // https://stackoverflow.com/questions/18645216/how-can-i-disable-text-selection-using-shift-without-disabling-all-text-selectio
  var table = document.querySelector(selector);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Shift') {
      table.classList.toggle('shift-select', true);
    }
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Shift') {
      table.classList.toggle('shift-select', false);
    }
  });
  table.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
  });
}

/*
 *  Býr til takka efst á kortinu sem notandi getur
 *  notað til að skipta á milli sendasýn og mælingasýn.
 *  Takki er ekki búinn til fyrr en einhver sendir hefur verið valinn.
 */
function mapViewControl(controlDiv) {
  // https://developers.google.com/maps/documentation/javascript/examples/control-custom

  var controlUI = document.createElement('div');
  controlUI.title = 'Smelltu til að skoða alla senda';

  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';

  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.innerHTML = 'Sendar';
  controlText.classList.add('control');

  controlText.style.color = 'rgb(25, 25, 25)';
  controlText.style.fontFamily = 'Poppins, Arial, sans-serif';
  controlText.style.fontSize = '14px';
  controlText.style.lineHeight = '31px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.style.width = '140px';

  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function () {
    /*
     *  Sýnum sendana ef notandi er ekki nú þegar að skoða þá. Hreinsum kortið,
     *  alla merkimiða, allar línur og valdar raðir í mælingatöflu, breytum
     *  texta og titli á stýritakka fyrir sýn, og birtum nýjar upplýsingar til notanda.
     *  ...annars sýnum við mælingar frá þeim sendi sem notandi hafði áður valið.
     *  Við hreinsum kortið eins og áður og birtum nýjar upplýsingar til notanda.
     */
    if (!transmitterView) {
      clearMarkers(locMarkers);
      showMarkers(trmMarkers);
      currentTrmMarker.setMap(null);
      controlText.innerHTML = lowerCase(transmitter[0].stadur);
      controlUI.title = 'Smelltu til að skoða mælingar';
      INFO_PARAGRAPH.innerHTML = getTrmViewInfo();
    } else {
      clearMarkers(trmMarkers);
      showMarkers(locMarkers);
      currentTrmMarker.setMap(map);
      controlText.innerHTML = 'Sendar';
      controlUI.title = 'Smelltu til að skoða alla senda';
      INFO_PARAGRAPH.innerHTML = getLocViewInfo();
    }

    toggleMarkers();

    // Sýn er breytt og því skiptum við töflunum fyrir neðan kortið út.
    transmitterView = !transmitterView;
    tableSwitch();
  });
}

// Kallað þegar skrárhluttrénu hefur verið hlaðið niður
function initMap() {
  // Valmyndarhlutur valinn í valmynd
  document.querySelector('.nav-container > ul > li:nth-child(2)').classList.add('selected');

  // mobile stillingar
  var zoom = void 0;
  if (!MOBILE) {
    zoom = 6;
  } else {
    zoom = 5;
  }

  // Kortastillingar
  var options = {
    zoom: zoom,
    center: new google.maps.LatLng(65, -18.8),
    scrollwheel: false,
    streetViewControl: false,
    scaleControl: true,
    fullscreenControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: ['roadmap', 'terrain']
    },
    styles: [{
      featureType: 'water',
      elementType: 'all',
      stylers: [{ hue: '#ddd' }, // #197
      { saturation: 0 }, { lightness: 0 }, { visibility: 'on' }]
    }, {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{ hue: '#fff' }, { saturation: 0 }, { lightness: 0 }, { visibility: 'on' }]
    }, {
      featureType: 'poi.park',
      elementType: 'all',
      stylers: [{ visibility: 'off' }]
    }, {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }, {
      featureType: 'road',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }, {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }, {
      featureType: 'road',
      elementType: 'all',
      stylers: [{ visibility: 'off' }]
    }]
  };

  // Búum til nýtt kort með miðju á miðpunkti Íslands
  map = new google.maps.Map(document.getElementById('map'), options);

  // Gerum mögulegt að raða sendatöflunni
  makeSortable(document.querySelector('.table-transmitters > table'));
  // Bætum atburðarhandföngum við töfluhausa neðri töflunnar
  tableHeaderListeners();
  // Bætum atburðarhandföngum við raðir neðri taflanna
  rowListeners();
  // Bætum öllum sendum við kortið
  addTransmitters();

  // gerum shift óvirkan í sendatöflu
  shiftKeyListeners('.table-transmitters > table');

  /*
   *  Ef einhver sendir hefur verið valinn, þá sýnum við mælingarnar frá honum,
   *  bætum mælistöðum og sendinum sjálfum við kortið, geymum athugasemd um
   *  frávikshlutfall (cvRemark), látum sendatöflu verða ósýnilega, birtum viðeigandi
   *  upplýsingar til notanda og gerum mögulegt að raða mælingatöflunni. Bætum
   *  einnig við sýnar-stýritakka og festum efst á kortið.
   */
  if (typeof transmitter !== 'undefined' && transmitter.length > 0) {
    transmitterView = false;
    addTransmitter();
    addLocations();
    clearMarkers(trmMarkers);
    cvRemarkElement = document.querySelector('p.cvRemark');
    cvRemark = cvRemarkElement.textContent;
    document.querySelector('.table-transmitters').style.display = 'none';
    document.querySelector('.table-transmitters > table > tbody > tr.' + transmitter[0].id).classList.toggle('selected');
    INFO_PARAGRAPH.innerHTML = getLocViewInfo();
    makeSortable(document.querySelector('.table-measurements > table'));
    var controlDiv = document.createElement('div');
    mapViewControl(controlDiv);
    if (!MOBILE) {
      controlDiv.classList.add('controlDiv');
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    } else {
      controlDiv.classList.add('controlDiv-mobile');
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
    }
    // gerum shift óvirkan í mælingatöflu
    shiftKeyListeners('.table-measurements > table');
  }
}