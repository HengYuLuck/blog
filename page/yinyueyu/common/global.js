const [fs] = ['fs'].map(i => require(i));

/* mysql */
global['sql'] = require('./mysql.js');

/* server相关配置 */
global['config'] = require('../config.js');

global['fn'] = {
    /* 遍历目录 */
    branchDirectory: function (directoryPath, fileFn = new Function(), directoryFn = new Function(), callbackFn = new Function()) {
        const files = fs.readdirSync(directoryPath);

        for (let filename of files) {
            const path = directoryPath + '/' + filename;
            const stats = fs.statSync(path);

            if (stats.isDirectory()) {
                directoryFn(path, stats, filename);
                this.branchDirectory(path, fileFn, directoryFn)
            } else {
                fileFn(path, stats, filename);
            }
        }

        callbackFn();
    }
};

module.exports = process;