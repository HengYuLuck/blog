module.exports = async function (path, data, req, res) {
    const ideas = await sql('SELECT * FROM idea limit 0,10');
    let sqlStr = ' where';
    for (let i = 0; i < ideas.length; i++) {
        if (ideas[i]['detail_id'])
            sqlStr += ' id=\'' + ideas[i]['detail_id'] + '\' or'
    }
    sqlStr = sqlStr.slice(0, -3);
    sqlStr === ' where' ? sqlStr = '' : 0;

    const details = await sql('select * from idea_detail' + sqlStr);
    for (let j = 0; j < details.length; j++) {
        for (let i = 0; i < ideas.length; i++) {
            if (details[j].id === ideas[i]['detail_id']) {
                ideas[i].detail = details[j].detail;
            }
        }
    }

    return JSON.stringify(ideas);
};