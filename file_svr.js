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
    if(relativePath===''){
        //访问网站根目录,给出文件类别,手动拼接html返回
        let headHTML = `
<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>首页</title>
</head>
<body>
    <h1>首页</h1>
        `;
        let endHTML = `
</body>
</html>
        `;
        fs.readdir(BASE_DIR, function(err, files){
            if(err){
                res.send('500 ERROR');
                return;
            }
            let bodyHTML = files.map(x=>{
                let directory = x.indexOf('.')===-1?'/':'';//简单粗暴的将没有.的都算作目录处理,不正确.
                return `<div><a href="${x}${directory}">${x}${directory}</a></div>`;
            }).join('\n');
            res.write(headHTML);
            res.write(bodyHTML);
            res.end(endHTML);
        });
        return;
    }
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