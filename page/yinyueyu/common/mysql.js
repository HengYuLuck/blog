const mysql = require('mysql');

/**
 'create common_user user@localhost indentified by \'123456\'';              //创建用户
 'grant select, insert, update, delete on testdb.* to common_user@\'%\'';    //授予权限
 'grant all on *.* to dba@localhost';
 'revoke all on *.* from dba@localhost';                                     //删除权限
 'select * from mysql.user where user=\'common_user\'';                      //查询权限
 'show grants for zhangkh@localhost;';                                       //查询权限
 */

function sql(sql, placeholder = []) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(/*config.mysqlConfig || */{
            host: 'localhost',
            user: 'root',
            password: '123',
            database: 'zh'
        });

        connection.connect();
        connection.query(sql, placeholder, function (error, results/*, fields*/) {
            if (error) {
                console.error(sql/* + ':' + error*/);
                reject(error)
            }
            // log.info(sql);
            resolve(results);
            connection.end();
        });
    });
}

module.exports = sql;