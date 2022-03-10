module.exports = {
    public_address: '127.0.0.2',
    'head-Access-Control-Allow-Origin' : 'http://192.168.0.105:8081',

    http: {
        host: '127.0.0.2',
        port: 80,
    },

    https: {
        host: '127.0.0.2',
        port: 443,

        SSL: {
            // key: fs.readFileSync(),
            key_path: '/www/_httpsSSL/key.key',
            // cert:fs.readFileSync(),
            cert_path: '/www/_httpsSSL/pem.pem'
        },
    },

    websocket: {
        host: '127.0.0.2',
        port: 8080,
    },

    //资源目录
    resPath: {
        get: '/www/get',
        post: '/www/post',
        websocket: '/www/websocket'
    },

    mysqlConfig: {
        host: 'localhost',
        user: 'root',
        password: '123',
        database: 'mysql'
    }
};