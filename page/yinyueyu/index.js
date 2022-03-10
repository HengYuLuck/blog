/* 进程根路径 */
global['__mainPath'] = __dirname;

/* 捕获错误不退出进程; */
process.on('uncaughtException', (err) => {
    // console.error(err);
    console.error(err.stack);
});

/* 通用全局变量 */
require('./common/global.js');

/* 运行http代理 */
const server = require('./server/server.js');
server.https();
server.websocketUpGrader(true);