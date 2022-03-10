module.exports = async function (path, data, req, res) {
    /* 前端转义'不能防止sql注入,后台需要验证数据 */
    const dataObj = JSON.parse(data);
    /* JSON.parse()不会执行function,暂时安全 */

    const arr = [dataObj['detail_id']];

    try {
        const del = await sql(`delete
                               from idea_detail
                               where id = ?`, arr);

        return JSON.stringify(del);
    } catch (e) {
        return {
            error: 500,
            data: JSON.stringify(e)
        }
    }
};