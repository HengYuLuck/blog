const [url] = ['url'].map(e => require(e));
const [GET, POST] = ['./server_action_get', './server_action_post'].map(e => require(e));
const map = {GET, POST};

module.exports = function (req, res) {
    const path = url.parse(req.url).pathname;

    if (req.method in map && path in map[req.method]) {
        /* 调用保存在map中对应路由的函数 */
        map[req.method][path](path, req, res)
    } else {
        /* 404|500 */
        if (req.method === 'GET') {
            res.writeHead(404, {
                'content-type': 'text/html;charset=utf8'
            });
            res.end('<a href="/">跳转回主页</a>');
        } else {
            res.writeHead(500);
            res.end();
        }
    }
};