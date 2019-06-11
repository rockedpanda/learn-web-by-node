/**
 * 端口转发的简单实现
 * 将本地某一端口的tcp请求转发到远程服务器的某一端口上
 * 
 * 使用方式: node port.js srcport destserver destport
 * node port.js 本地端口号 远程服务器ip 远程端口号
 */
var net = require('net');

function proxyPort(srcport, destServer, destport) {
  var server = net.createServer(function (c) { //'connection' listener

    var client = net.connect({ port: destport, host: destServer }, function () { //'connect' listener
      console.log('ok....');
      c.on('data', function (data) {
        console.log(data.length);
        client.write(data);
      });
    });

    client.on('data', function (data) {
      c.write(data);
    });

    client.on('error', function (err) {
      console.log("dest=" + err);
      c.destroy();
    });

    c.on('error', function (err) {
      console.log("src" + err);
      client.destroy();
    });


    client.on('end', function () {
      console.log('dest disconnected ');
    });

    c.on('end', function () {
      console.log('src disconnected');
    });

  });
  server.listen(srcport, function () { //'listening' listener
    console.log('server bound' + srcport);
  });
}

var params = process.argv;
if (params.length != 5) {
  console.log("node port.js srcport destserver destport ");
  return;
}

proxyPort(params[2], params[3], params[4]);

console.log(process.argv);