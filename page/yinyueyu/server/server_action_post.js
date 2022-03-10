const POST = {};

const rootPath = __mainPath + config.resPath.post;
fn.branchDirectory(rootPath, filePath => {
    if (filePath.substr(filePath.lastIndexOf('.')) !== '.js') return;
    const router = filePath.slice(rootPath.length, -3);

    const postFn = require(filePath);

    const head = {};
    head['Access-Control-Allow-Origin'] = config["head-Access-Control-Allow-Origin"];
    head["Access-Control-Allow-Methods"] = "POST";

    function post1(path, req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            postFn(path, data, req, res).then(resData => {
                if (resData.error) {
                    res.writeHead(resData.error, head);
                    res.end(resData.data);
                } else {
                    res.writeHead(200, head);
                    res.end(resData);
                }
            }).catch(e => {
                console.error(e);
                res.writeHead(500, head);
                res.end(e.toString());
            });
        });
    }

    function post2(path, req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                const resData = postFn(path, data, req, res);
                if (resData.error) {
                    res.writeHead(resData.error, head);
                    res.end(resData.data);
                } else {
                    res.writeHead(200, head);
                    res.end(resData);
                }
            } catch (e) {
                console.error(e);
                res.writeHead(500, head);
                res.end(e.toString());
            }
        });
    }

    if (Object.prototype.toString.call(postFn) === '[object AsyncFunction]') {
        POST[router] = post1;
    } else {
        POST[router] = post2;
    }
});

module.exports = POST;