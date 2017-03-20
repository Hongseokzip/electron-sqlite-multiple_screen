const VIEWER_MODULE_URI = 'file://' + __dirname + '/../viewer/viewer.html'

var $ = require('jQuery');
const electron = require('electron');
const {BrowserWindow} = electron.remote;
var sqlite3 = require('sqlite3').verbose();

let db;
let win;

$(() => {
    onStart();

    runShowBrowerWindowOnMainExample();
    runGetExternalDisplaysExample();
    runLoadingFromDBExample();
});

window.onbeforeunload = () => {
    onStop();
}

function onStart() {
    db = new sqlite3.Database(':memory:');
}

function onStop() {
    db.close();
    win.close();
}

function runLoadingFromDBExample() {

    db.serialize(function() {
      db.run("CREATE TABLE lorem (info TEXT)");

      var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
      }

      stmt.finalize();

      var ul_database = $('#database');

      db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        var li_item = $('<li></li>').text("" + row.id + ": " + row.info);
        ul_database.append(li_item);
      });
    });
}

function runShowBrowerWindowOnMainExample() {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({width, height});
    win.loadURL(VIEWER_MODULE_URI);
}

function runGetExternalDisplaysExample() {
    let displays = electron.screen.getAllDisplays();
    let externalDisplays = displays.filter((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    console.log(externalDisplays);
}
