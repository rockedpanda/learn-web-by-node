const http = require('http');
const fs = require('fs');
const path = require('path');

let BASE_DIR = './public/';

function readFile(relativePath){//演示代码,暂时使用同步判定.
    let localPath = path.join(BASE_DIR, relativePath);
    if(!fs.existsSync(localPath)){
        return false;
    }
    let stat = fs.statSync(localPath);
    if(stat.isFile()){
        return fs.createReadStream(localPath);
    }
    return false;
}

const server = http.createServer((req, res) => {
    let relativePath = req.url.substring(1);
    if (req.url.endsWith('/')){
        relativePath = relativePath+'index.html';
    }
    let fileStream = readFile(relativePath);
    if(!fileStream){
        res.statusCode = 404;
        res.end('File Not Fount');
        return;
    }
    res.statusCode = 200;
    fileStream.pipe(res);
    //另外一种方式是读取文件内容到内存,然后res.send(内存内容);无法处理大文件,不使用.
});
/* server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
}); */
server.listen(8000);