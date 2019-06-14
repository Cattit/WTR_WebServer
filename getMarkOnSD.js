const dal = require("wtr-dal");

let dateStart
let dateEnd

async function getMarkOfSource(id_source, depth, id_location) {
    let mark = 0

    // если оценка готова: один день либо полный месяц
    if (dateStart.getFullYear() === dateEnd.getFullYear() && dateStart.getMonth() === dateEnd.getMonth() && (dateStart.getDate() === dateEnd.getDate() || (dateStart.getDate() === 1 && dateEnd.getDate() === new Date(dateEnd.getFullYear(), dateEnd.getMonth() + 1, 0).getDate()))) {
        mark = await dal.getRaiting(id_source, depth, dateStart, id_location, dateEnd)
        mark = Math.round(mark * 100) / 100;
    }
    else {   // если выбран период, для которого нет готовой оценки
        mark = await dal.getRaitingAvgDaily(id_source, depth, dateStart, id_location, dateEnd)
        mark = Math.round(mark * 100) / 100;
    }

    return mark
}

async function getMark(body) {

    dateStart = new Date(body.dateStart)
    dateEnd = new Date(body.dateEnd)
    const location = await dal.getAllLocationNameId()   // города по алфавиту
    body.depths.map(d => d = + d);  // превращаем строку в числа

    let depthDel = [];  // глубины, которе не выбрали
    if (body.depths.indexOf('1') === -1)
        depthDel.push(1);
    if (body.depths.indexOf('3') === -1)
        depthDel.push(3);
    if (body.depths.indexOf('5') === -1)
        depthDel.push(5);

    let sourceDel = []; // сервисы, которые не выбрали
    if (body.sources.indexOf('Yandex') === -1)
        sourceDel.push(0);
    if (body.sources.indexOf('Gismeteo') === -1)
        sourceDel.push(1);
    if (body.sources.indexOf('AccuWeather') === -1)
        sourceDel.push(2);

    const masDS = await dal.getDepthSource();  // сервисы и глубины
    for (let i = 0; i < masDS.length; i++) // удаляем невыбранные глубины
        for (let j = 0; j < depthDel.length; j++)
            if (masDS[i].depth === depthDel[j]) {
                masDS.splice(i, 1);
                j = -1;
                if (i >= masDS.length)
                    break
            }

    for (let i = 0; i < masDS.length; i++) // удаляем невыбранные сервисы
        for (let j = 0; j < sourceDel.length; j++)
            if (masDS[i].id_source === sourceDel[j]) {
                masDS.splice(i, 1);
                j = -1;
                if (i >= masDS.length)
                    break
            }

    let mas = []
    for (let i = 0; i < location.length; i++) {
        mas[i] = new Object()
        mas[i].id_location = location[i].id
        mas[i].name_location = location[i].name
        mas[i].mark = []
        for (let j = 0; j < masDS.length; j++)
            mas[i].mark[j] = await getMarkOfSource(masDS[j].id_source, masDS[j].depth, mas[i].id_location)
    }

    let column = [] // заголовки таблицы
    for (let i = 0; i < masDS.length; i++)
        column.push(masDS[i].name + " " + String(masDS[i].depth))

    let data = new Object()
    data.mark = mas
    data.column = column
    console.log(data)
    return data
}
module.exports.getMark = getMark;