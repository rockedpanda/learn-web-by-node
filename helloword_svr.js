const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req);
    console.log(res);
    res.end('hello world');
});
/* server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
}); */
server.listen(8000);