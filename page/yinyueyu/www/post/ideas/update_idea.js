module.exports = async function (path, data, req, res) {
    /* 前端转义'不能防止sql注入,后台需要验证数据 */
    const dataObj = JSON.parse(data);
    /* JSON.parse()不会执行function,暂时安全 */

    const arr = [dataObj.define, dataObj.detail, dataObj.name];
    try {
        const sqlStr = `UPDATE idea,idea_detail
                        SET idea.define        = ?,
                            idea_detail.detail = ?
                        WHERE name = ?
                          and idea.detail_id = idea_detail.id`;
        const updateIdea = await sql(sqlStr, arr);
        return JSON.stringify(updateIdea);
    } catch (e) {
        return {
            error: 500,
            data: JSON.stringify(e)
        }
    }
};