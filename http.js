const http = require('http')
const bl   = require('bl')
const fs   = require('fs')

function getRequest() {
  var url = process.argv[2]
  http.get(url, function(response) {
    response.on('data', function(data){
        console.log(data.toString());
    })
  })
}
// getRequest();

// Correction (previous solutin works too)
// http.get(process.argv[2], function (response) {
//   response.setEncoding('utf8')
//   response.on('data', console.log)
//   response.on('error', console.error)
// }).on('error', console.error)






// Without using the bl (BufferList) module
var httpCollect = function () {
  var url = process.argv[2];
  http.get(url, function(response) {
    var result = [];
    response.on('error', console.error)
    response.on('data', function(data){
      result.push(data.toString());
    })
    response.on('end', function(){
      result = result.join('')
      console.log(result.length);
      console.log(result);
    })
  }).on('error', console.error)
}
// httpCollect();

// With the bl module
var httpCollectBl = function () {
  var url = process.argv[2];
  http.get(url, function(response) {
    response.pipe(bl(function (err, data) {
      if (err) {
        return console.error(err);
      }
      data = data.toString()
      console.log(data.length);
      console.log(data);
    }))
  })
}
// httpCollectBl()
var checkGetCompletion = function (getCompleted, results) {
  if (getCompleted == 3) {
    for (var i = 0; i < results.length; i++) {
      console.log(results[i]);
    }
  }
}









// jugglingAsync
var results = []
var count = 0

function printResults () {
  for (var i = 0; i < 3; i++) {
    console.log(results[i])
  }
}

function httpGet (index) {
  http.get(process.argv[2 + index], function (response) {
    response.pipe(bl(function (err, data) {
      if (err) {
        return console.error(err)
      }
      results[index] = data.toString()
      count++

      if (count === 3) {
        printResults()
      }
    }))
  })
}

function jugglingAsync () {
  for (var i = 0; i < 3; i++) {
    httpGet(i)
  }
}
// jugglingAsync()








var net = require('net')
var strftime = require('strftime')
// var listener = function (socket) {
//
// }

// Raw TCP server. There's no HTTP involved so we use the net module from Node
// core which has all the basic networking functions.
var tcpTimeServer = function () {
  var port = process.argv[2]
  // The socket object is a node duplex stream, it can both be read from and written to
  var server = net.createServer(function (socket) {
    var date = strftime('%Y-%m-%d %H:%M')
    // socket.write(date.toString() + '\n')
    // socket.end()
    socket.end(date.toString() + '\n')
  })
  server.listen(port)
}

// tcpTimeServer()









var httpServer = function () {
  var port = process.argv[2]
  var file = process.argv[3]
// The two arguments are objects representing the HTTP request and the
// corresponding response for this request. request is used to fetch
// properties, such as the header and query-string from the request while
// response is for sending data to the client, both headers and body.
  var server = http.createServer(function (request, response) {
  // Both request and response are also Node streams! Which means that you can
  // use the streaming abstractions to send and receive data if they suit your
  // use-case.
    // Create a stream representing the file to serve
    fileStream = fs.createReadStream(file)
    // Pipe the data from the file stream to the response stream
    fileStream.pipe(response)
  })
  server.listen(Number(port))
}

// httpServer()



var map = require('through2-map')

var httpUpperCaserer = function () {
  var port = process.argv[2]
  var server = http.createServer(function (request, response) {
    if (request.method !== 'POST') {
        return response.end('send me a POST\n')
      }
    request.pipe(map(function (chunk) {
     return chunk.toString().toUpperCase()
    })).pipe(response)
  })
  server.listen(port)
}

// httpUpperCaserer()






var url = require('url')

function parsetime (time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}

function unixtime (time) {
  return { unixtime: time.getTime() }
}

var httpJsonApiServer = function () {
  var port = process.argv[2]
  var server = http.createServer(function (req, res) {
    if (req.method !== 'GET') {
      return res.end('send me a GET\n')
    }
    var parsedUrl = url.parse(req.url, true)
    var reqTime = parsedUrl.query.iso
    var time = new Date(reqTime)
    var result

    if (parsedUrl.pathname === '/api/parsetime') {
      result = parsetime(time)
    } else if (parsedUrl.pathname === '/api/unixtime') {
      result = unixtime(time)
    }

    // Same thing with regexps
    // if (/^\/api\/parsetime/.test(req.url)) {
    //   result = parsetime(time)
    // } else if (/^\/api\/unixtime/.test(req.url)) {
    //   result = unixtime(time)
    // }

    if (result) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  server.listen(port)
}

httpJsonApiServer()
