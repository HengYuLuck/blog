module.exports = async function (path, data, req, res) {
    /* 前端转义'不能防止sql注入,后台需要验证数据 */
    const dataObj = JSON.parse(data);
    /* JSON.parse()不会执行function,暂时安全 */

    const arr = [dataObj.name, dataObj['define'] || '', dataObj['tags'] || ''];

    try {
        const a = [];
        a.push(await sql(`insert into idea_detail (id, detail)
                          VALUES (null, '')`).then(async idea_detailRow => {
            a.push(await sql(`insert into idea (detail_id, name, define, tags)
                              values (?, ?, ?, ?)`, [idea_detailRow.insertId, ...arr]));
        }));

        return JSON.stringify(a);
    } catch (e) {
        return {
            error: 500,
            data: JSON.stringify(e)
        }
    }
};