const http = require('http');
const fs = require('fs');
const path = require('path');
// const _ = require('./underscore.min.js');

let BASE_DIR = './public/';
// let indexTemplate = _.template(fs.readFileSync('./index.tpl.html', 'utf8'), { variable: 'data' });

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
    if(req.method === 'PUT'){
        putFile(req, res);
        return;
    }
    let relativePath = req.url.substring(1);
    if(relativePath.startsWith('api/list')){
        fs.readdir(BASE_DIR, function (err, files) {
            if (err) {
                res.send('500 ERROR');
                return;
            }
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({error_code:0,data:files}));
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


function putFile(req, res){
    let relativePath = req.url.substring(1);//不支持多级目录
    if (relativePath === '' || relativePath.split('/').pop().indexOf('.')===-1) {
        res.statusCode = 403;
        return res.end('非法操作');//如果路径为空或者上传文件没有扩展名,返回403
    }
    let localPath = path.join(BASE_DIR, relativePath);
    //旧文件直接覆盖
    req.pipe(fs.createWriteStream(localPath)).on('close',function(err){
        if(err){
            console.log(err);
            return res.end('上传失败');
        }
        return res.end('OK');
    });
}