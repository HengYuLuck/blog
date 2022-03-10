const [fs, zlib] = ['fs', 'zlib'].map(i => require(i));
const {TYPE1, TYPE2, TYPE3} = require('./server_action_get_types');

/* GET对象中保存所有get路由及对应函数 */
const GET = {
    '/': redirectTo('/index.html')
};

/* 重定向 */
function redirectTo(path) {
    return function (n, req, res) {
        resType1(path, req, res);
    }
}

/* 变量保存所有type1类型的文件 */
const filesData = {};

/* 遍历get目录 */
const rootPath = __mainPath + config.resPath.get;
fn.branchDirectory(rootPath, filePath => {
    /* 文件路由 */
    const ext = filePath.substr(filePath.lastIndexOf('.') + 1);
    const routerPath = filePath.substring(rootPath.length);

    if (ext in TYPE1) {
        /* 压缩文件并排序 */
        const fileStr = fs.readFileSync(filePath);
        const fileCacheArr = [
            {
                type: 'br',
                buffer: zlib.brotliCompressSync(fileStr)
            },
            {
                type: 'gzip',
                buffer: zlib.gzipSync(fileStr)
            },
            {
                type: 'file',
                buffer: fileStr
            }/*,{
                type: 'deflate',   //ie不支持deflate,对应请求头却显示支持导致错误
                buffer: zlib.deflateSync(fileStr)
            },*/
        ];
        fileCacheArr.sort((a, b) => a.buffer.length - b.buffer.length);

        filesData[routerPath] = {
            Etag: new Date(fs.statSync(filePath).mtime).getTime().toString(36),
            'Content-Type': TYPE1[ext],
            fileCacheArr
        };
        GET[routerPath] = resType1;
    } else if (ext in TYPE2) {
        filesData[routerPath] = {
            // Etag: new Date(fs.statSync(filePath).mtime).getTime().toString(36),
            'Content-Type': TYPE2[ext]
        };
        GET[routerPath] = resType2;
    } else if (ext in TYPE3) {

    }
});

/* 静态文件:响应type1类型的静态文件html,css,js,img... */
const acceptEncodingTest = {
    // deflate: /\bdeflate\b/,  // ie不支持该类型压缩,请求头却显示支持,导致错误
    gzip: /\bgzip\b/,
    br: /\bbr\b/
};

/* 响应filesData中缓存的文件 */
function resType1(path, req, res) {
    let code, head, body;

    if (path in filesData) {
        if (req.headers['if-none-match'] && req.headers['if-none-match'] === filesData[path].Etag) {
            code = 304;
            head = null;
            body = '';
        } else {
            /**
             * //如果图片使用webp压缩,取消这里的注释
             *   let accept = req.headers['accept'] || '';
             *   const isSupportWebP = /image\/webp/gi.test(accept);
             *   if (isSupportWebP && path + '.webp' in filesData) {
             *       path += '.webp';
             *   }
             */

            code = 200;
            head = {
                'Content-Type': filesData[path]['Content-Type'],
                'Etag': filesData[path].Etag
            };

            const arr = filesData[path].fileCacheArr;
            const acceptEncoding = req.headers['accept-encoding'] ? req.headers['accept-encoding'] : '';
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].type in acceptEncodingTest && acceptEncodingTest[arr[i].type].test(acceptEncoding)) {
                    head['Content-Encoding'] = arr[i].type;
                    body = arr[i].buffer;
                    break;
                }
                if (arr[i].type === 'file') {
                    body = arr[i].buffer;
                    break;
                }
            }
        }
    } else {
        code = 500;
        head = {
            'content-type': 'text/html;charset=utf8'
        };
        body = '启动中...刷新重试';
    }

    res.writeHead(code, head);
    res.end(body);
}

/* 响应媒体流文件 */
function resType2(path, req, res) {
    const filePath = rootPath + path;
    fs.stat(filePath, function (err, stats) {
        if (err) {
            res.writeHead(404);
            res.end('无法读取该视频文件fs.stat(filePath,function(err,stats){})');
            return
        }

        const range = req.headers['range'];     //客户端请求的视频区间
        const total = stats.size;   //文件总大小
        let start, end;
        if (!range) {
            [start, end] = [0, stats.size - 1];
        } else {
            let r = range.match(/=(\d+)-(\d+)?/);
            [start, end] = [parseInt(r[1]), parseInt(r[2] || stats.size - 1)];
        }
        const stream = fs.createReadStream(filePath, {start: start, end: end});
        stream
            .on("open", function () {
                res.writeHead(206, {
                    "Accept-Ranges": "bytes",
                    "Content-Range": `bytes ${start}-${end}/${total}`,
                    "Content-Length": end === start ? 0 : end - start + 1,
                    "Content-Type": filesData[path]['Content-Type']
                });
                stream.pipe(res);
            })
            // .on("error", function (err) {
            //     reject(err);
            // });
            .on('end', function () {
                res.end();
            })
    });
}

function resType3(path, req, res) {

}

module.exports = GET;