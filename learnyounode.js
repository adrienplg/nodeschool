var logProcess = function(){
  console.log(process.argv);
};
// logProcess();
// console.log(process.cwd());

var sumArgs = function(){
  var args = process.argv;
  var total = 0;
  for (var i = 2; i < args.length; i++) {
    total = total + Number(args[i]);
  }
  console.log(total);
};
// sumArgs();

// fs module from Node core library, load this module into the variable 'fs'
var fs = require("fs");

var numberNewLinesSync = function(){
  var file = process.argv[2];
  // Buffer objects are Node's way of efficiently representing arbitrary arrays
  // of data, whether it be ascii, binary or some other format.
  // Calling here the synchronous method (discouraged)
  var buffer = fs.readFileSync(file);
  var str = buffer.toString();
  var splitStr = str.split('\n');
  console.log(splitStr.length - 1);
};
// numberNewLinesSync();

var numberNewLinesAync = function(){
  var file = process.argv[2];
  // Buffer objects are Node's way of efficiently representing arbitrary arrays
  // of data, whether it be ascii, binary or some other format.
  // Calling here the synchronous method (discouraged)
  fs.readFile(file, function (err, data) {
      if (err) throw err;
      var str = data.toString();
      var splitStr = str.split('\n');
      console.log(splitStr.length - 1);
  });
};
// numberNewLinesAync();

// This does the same thing than numberNewLinesAync but shows how to pass the
// callback function as a variable
var numberNewLinesAync2 = function(){
  var file = process.argv[2];
  var callback = function (err, data) {
    if (err) throw err;
    var str = data.toString();
    var splitStr = str.split('\n');
    console.log(splitStr.length - 1);
  };
  fs.readFile(file, callback);
};
// numberNewLinesAync2();

var path = require('path');
var filteredLs = function(){
  var dir = process.argv[2];
  var ext = process.argv[3];
  fs.readdir(dir, function(err, list){
    if (err) throw err;
    for (var i = 0; i < list.length; i++) {
      var file = list[i];
      if (path.extname(file) == '.' + ext) {
        console.log(file);
      }
    }
  })
};
// filteredLs();

var mymodule = require('./mymodule');

var moduleFilteredLs = function(){
  var dir = process.argv[2];
  var ext = process.argv[3];
  mymodule(dir, ext, function(err, data){
    if (err) throw err;
    // for (var i = 0; i < data.length; i++) {
    //   console.log(data[i]);
    // }
    // Does the same thing that previously commented block
    data.forEach(function (file) {
      console.log(file);
    })
  });
};

moduleFilteredLs();
