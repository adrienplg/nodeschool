var fs = require('fs');
var path = require('path');

var filteredLs = function (dir, ext, callback) {
  fs.readdir(dir, function(err, list){
    if (err) {
      return callback(err);
    }
    // var data = [];
    // for (var i = 0; i < list.length; i++) {
    //   var file = list[i];
    //   if (path.extname(file) === '.' + ext) {
    //     data.push(file);
    //   }
    // }
    // Does the same thing as the previous block
    data = list.filter(function (file) {
      return path.extname(file) === '.' + ext
    })

    callback(null, data);
  })
};

module.exports = filteredLs;
