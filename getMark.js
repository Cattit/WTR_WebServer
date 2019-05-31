const dal = require("wtr-dal");

async function getMark(body) {

    let depthDel = [];  // глубины, которе не выбрали
    if (body.depths.indexOf('1') === -1)
        depthDel.push(1);
    if (body.depths.indexOf('3') === -1)
        depthDel.push(3);
    if (body.depths.indexOf('5') === -1)
        depthDel.push(5);

    let sourceDel = []; // сервисы, которые не выбрали
    if (body.sources.indexOf('yandex') === -1)
        sourceDel.push(0);
    if (body.sources.indexOf('gismeteo') === -1)
        sourceDel.push(1);
    if (body.sources.indexOf('accuWeather') === -1)
        sourceDel.push(2);

    const masDSL = await dal.getDepthSourceLocName();
    for (let i = 0; i < masDSL.length; i++) // удаляем невыбранные глубины
        for (let j = 0; j < depthDel.length; j++)
            if (masDSL[i].depth === depthDel[j]) {
                masDSL.splice(i, 1);
                j = -1;
                if (i >= masDSL.length)
                    break
            }

    for (let i = 0; i < masDSL.length; i++) // удаляем невыбранные сервисы
        for (let j = 0; j < sourceDel.length; j++)
            if (masDSL[i].id_source === sourceDel[j]) {
                masDSL.splice(i, 1);
                j = -1;
                if (i >= masDSL.length)
                    break
            }

    let dateStart = new Date(body.dateStart)
    let dateEnd = new Date(body.dateEnd)
    // если оценка готова: один день либо полный месяц
    if (dateStart.getFullYear() === dateEnd.getFullYear() && dateStart.getMonth() === dateEnd.getMonth() && (dateStart.getDate() === dateEnd.getDate() || (dateStart.getDate() === 1 && dateEnd.getDate() === new Date(dateEnd.getFullYear(), dateEnd.getMonth() + 1, 0).getDate())))
        for (let i = 0; i < masDSL.length; i++) {
            let mark = await dal.getRaiting(masDSL[i].id_source, masDSL[i].depth, dateStart, masDSL[i].id_location, dateEnd)
            masDSL[i].mark = Math.round(mark * 100) / 100;
        }
    else   // если выбран период, для которого нет готовой оценки
        for (let i = 0; i < masDSL.length; i++) {
            let mark = await dal.getRaitingAvgDaily(masDSL[i].id_source, masDSL[i].depth, dateStart, masDSL[i].id_location, dateEnd)
            masDSL[i].mark = Math.round(mark * 100) / 100;
        }
    //console.log(masDSL)
    return masDSL
}
module.exports.getMark = getMark;