const [WebSocket] = ['ws'].map(i => require(i));

const wss = new WebSocket.Server({noServer: true});

wss.on('connection', function connection(ws, request/*, client*/) {
    // 'x-forwarded-for' in request.headers ?  //NGINX代理
    //     req.headers['x-forwarded-for'].split(/\s*,\s*/)[0] :
    // const ip = request.socket.remoteAddress;
    // console.log(ip);

    ws.on('message', function incoming(message) {
        console.log('接收到客户端消息:', message);
    });
    ws.send('向客户端发送数据');

    ws.on('pong', heartbeat);
});

setInterval(function ping() {
    let length = 0;
    wss.clients.forEach(function each(ws) {
        length++;
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping(null);
    });
}, 30000);  //第一个30秒赋值false,最晚一分钟内销毁ws
function heartbeat() {
    this.isAlive = true;
}

// function noop() {
// }

//广播
function broadcast(self) {
    wss.clients.forEach(function each(client) {
        if (client === self) return;    //除了客户端self的广播
        if (client.readyState === WebSocket.OPEN) {
            client.send('这是一条广播消息');
        }
    });
}

module.exports = wss;