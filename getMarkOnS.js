const dal = require("wtr-dal");

let dateStart
let dateEnd

async function getMarkOfSource(id_source, depth, id_location) {

    if (id_source === 2 && depth == 5)
        return '-'

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

    let mas = []
    for (let i = 0, k = 0; i < location.length; i++)
        for (let j = 0; j < body.depths.length; j++) {
            mas[k] = new Object()
            mas[k].id_location = location[i].id
            mas[k].name_location = location[i].name
            mas[k].depth = body.depths[j]
            mas[k].mark = []
            k++
        }
    console.log(mas[0].mark.length)
    if (body.sources.indexOf('AccuWeather') !== -1)
        for (let i = 0; i < mas.length; i++)
            mas[i].mark[mas[i].mark.length] = await getMarkOfSource(2, mas[i].depth, mas[i].id_location)

    if (body.sources.indexOf('Gismeteo') !== -1)
        for (let i = 0; i < mas.length; i++)
            mas[i].mark[mas[i].mark.length] = await getMarkOfSource(1, mas[i].depth, mas[i].id_location)

    if (body.sources.indexOf('Yandex') !== -1)
        for (let i = 0; i < mas.length; i++)
            mas[i].mark[mas[i].mark.length] = await getMarkOfSource(0, mas[i].depth, mas[i].id_location)

    console.log(mas)
    return mas
}
module.exports.getMark = getMark;