//Content-Type
const TYPE1 = {
    'html': 'text/html; charset=UTF-8',
    'css': 'text/css; charset=UTF-8',
    'js': 'text/javascript; charset=UTF-8',
    'txt': 'text/plain; charset=UTF-8',
    'xml': 'text/xml; charset=UTF-8',

    'ttc': 'application/x-font-ttf',
    'ttf': 'application/x-font-ttf',
    'woff': 'application/font-woff',
    'woff2': 'application/font-woff2',

    'swf': 'application/x-shockwave-flash',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf': 'application/pdf',
    'json': 'application/json',

    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'tiff': 'image/tiff',

    'hdr': 'binary/octet-stream',
    'glb': 'binary/octet-stream',
};
const TYPE2 = {
    //media
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'mp3': 'audio/mp3',
    'mp4': 'video/mp4',
    'ogg': 'video/ogg'
};

const TYPE3 = {
    'djs': 'text/javascript; charset=UTF-8'/*,
    'dht': 'text/html; charset=UTF-8',
    'dcs': 'text/css; charset=UTF-8'*/
};

module.exports = {
    TYPE1,
    TYPE2,
    TYPE3
};