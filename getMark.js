const dal = require("wtr-dal");

async function getMark(userData) {
    let depthDel = [];
    if (userData.oneDay === false)
        depthDel.push(1);
    if (userData.threeDay === false)
        depthDel.push(3);
    if (userData.fiveDay === false)
        depthDel.push(5);

    let sourceDel = [];
    if (userData.yandex === false)
        sourceDel.push(0);
    if (userData.gismeteo === false)
        sourceDel.push(1);
    if (userData.accuWeather === false)
        sourceDel.push(2);

    const masDSL = await dal.getDepthSourceLocation();
    for (let i = 0; i < masDSL.length; i++)
        for (let j = 0; j < depthDel; j++)
            if (masDSL[i].depth === depthDel[j])
                masDSL.splice(i, 1);

    for (let i = 0; i < masDSL.length; i++)
        for (let j = 0; j < sourceDel; j++)
            if (masDSL[i].id_source === sourceDel[j])
                masDSL.splice(i, 1);

    console.log(masDSL)
}

module.exports.getMark = getMark;