const [fs, http, https, url] = ['fs', 'http', 'https', 'url'].map(e => require(e));
const server_action = require('./server_action.js');

function log() {
    console.log(`服务器已启动,浏览器访问${(config.public_address || config.https.port)}`);
}

const SSL = {
    key: fs.readFileSync(__mainPath + config.https.SSL.key_path),
    cert: fs.readFileSync(__mainPath + config.https.SSL.cert_path),
};

module.exports = {
    http: () => {
        /* 创建http服务器 */
        http.createServer(server_action).listen(config.http.port, config.http.host, log);
    },

    https: () => {
        /* http重定向 */
        http.createServer((req, res) => {
            res.writeHead(307, {
                Location: 'https://' + (config.public_address || config.https.port)
            });
            res.end();
        }).listen(config.http.port, config.http.host);

        /* 创建https服务器 */
        https.createServer(SSL, server_action).listen(config.https.port, config.https.host, log);
    },

    /* websocket守卫 */
    websocketUpGrader: (isHttps) => {
        const server = isHttps ? https.createServer(SSL) : http.createServer();

        const webSocketMap = {};
        const webSocketRootPath = __mainPath + config.resPath.websocket;
        fn.branchDirectory(webSocketRootPath, filePath => {
            if (filePath.substring(filePath.lastIndexOf('.')) !== '.js') return;
            const routerPath = filePath.substring(webSocketRootPath.length, filePath.lastIndexOf('.'));
            webSocketMap[routerPath] = require(filePath);
        });

        /* websocket链接验证 */
        server.on('upgrade', function upgrade(request, socket, head) {
            const pathname = url.parse(request.url).pathname;

            if (pathname in webSocketMap && request.headers) {
                webSocketMap[pathname].handleUpgrade(request, socket, head, function done(ws) {
                    webSocketMap[pathname].emit('connection', ws, request/*, client*/);
                });
            } else {
                console.log('err');
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy()
            }
        });

        server.listen(config.websocket.port, config.websocket.host, () => {
            console.log('websocket已启动' + config.websocket.host + ':' + config.websocket.port);
        });
    }
};