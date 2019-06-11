# NodeJS服务开发

## 样例1: 端口转发
转发TCP数据包到远程服务器

## 样例2: hello word HTTP服务
- 返回Hello World的服务
- 查看请求对象
- 查看返回对象
- 文档: https://npm.taobao.org/mirrors/node/latest/docs/api/http.html

## 样例3: 静态资源网站
- 实现文件发送
- 实现index.html默认处理
- 测试 /sub/ /sub2/
- 未实现
    - mime
    - 响应头
    - 文件大小
    - 304相同文件判定
    - cookie session
    - 上传和数据存储
    - POST协议区分