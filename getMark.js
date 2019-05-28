const dal = require("wtr-dal");

async function getMark(userData) {  
    let depthDel = [];  // глубины, которе не выбрали
    if (userData.oneDay === false)
        depthDel.push(1);
    if (userData.threeDay === false)
        depthDel.push(3);
    if (userData.fiveDay === false)
        depthDel.push(5);

    let sourceDel = []; // сервисы, которые не выбрали
    if (userData.yandex === false)
        sourceDel.push(0);
    if (userData.gismeteo === false)
        sourceDel.push(1);
    if (userData.accuWeather === false)
        sourceDel.push(2);

    const masDSL = await dal.getDepthSourceLocation();
    for (let i = 0; i < masDSL.length; i++) // удаляем невыбранные глубины
        for (let j = 0; j < depthDel.length; j++)
            if (masDSL[i].depth === depthDel[j]){
                masDSL.splice(i, 1);
                j = -1;
                if(i >= masDSL.length)
                    break
            }

    for (let i = 0; i < masDSL.length; i++) // удаляем невыбранные сервисы
        for (let j = 0; j < sourceDel.length; j++)
            if (masDSL[i].id_source === sourceDel[j]){
                masDSL.splice(i, 1);
                j = -1;
                if(i >= masDSL.length)
                    break
            }

    let dateStart = new Date (userData.dateStart)
    let dateEnd = new Date (userData.dateEnd)
    // если оценка готова: один день либо полный месяц
    if(dateStart.getFullYear() === dateEnd.getFullYear() && dateStart.getMonth() === dateEnd.getMonth() && (dateStart.getDate() === dateEnd.getDate() || (dateStart.getDate() === 1 && dateEnd.getDate() === new Date (dateEnd.getFullYear(), dateEnd.getMonth() + 1, 0).getDate())))
        for(let i = 0; i<masDSL.length; i++)
        masDSL[i].mark = await dal.getRaiting(masDSL[i].id_source, masDSL[i].depth, dateStart, masDSL[i].id_location, dateEnd)     

    else   // если выбран период, для которого нет готовой оценки
        for(let i = 0; i<masDSL.length; i++)
            masDSL[i].mark = await dal.getRaitingAvgDaily(masDSL[i].id_source, masDSL[i].depth, dateStart, masDSL[i].id_location, dateEnd)

    return masDSL
}
module.exports.getMark = getMark;