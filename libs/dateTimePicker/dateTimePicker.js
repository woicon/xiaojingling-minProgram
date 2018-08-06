function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
    var start = start || 0;
    var end = end || 1;
    var array = [];
    for (var i = start; i <= end; i++) {
        array.push(withData(i));
    }
    return array;
}
function getMonthDay(year, month) {
    var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
    switch (month) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            array = getLoopArray(1, 31)
            break;
        case '04':
        case '06':
        case '09':
        case '11':
            array = getLoopArray(1, 30)
            break;
        case '02':
            array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
            break;
        default:
            array = '月份格式不正确，请重新输入！'
    }
    return array
}
function getNewDateArry() {
    // 当前时间的处理
    var newDate = new Date();
    var year = withData(newDate.getFullYear()),
        mont = withData(newDate.getMonth() + 1),
        date = withData(newDate.getDate()),
        hour = withData(newDate.getHours()),
        minu = withData(newDate.getMinutes()),
        seco = withData(newDate.getSeconds())

    return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(startYear, endYear, date) {
    // 返回默认显示的数组和联动数组的声明
    var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
    var start = startYear || 1978;
    var end = endYear || 2100;
    // 默认开始显示数据
    var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
    console.log("def>>>>>>>>>>", defaultDate)
    // 处理联动列表数据
    /*年月日 时分秒*/
    dateTimeArray[0] = getLoopArray(start, end)
    dateTimeArray[1] = getLoopArray(1, 12)
    dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1])
    dateTimeArray[3] = getLoopArray(0, 23)
    dateTimeArray[4] = getLoopArray(0, 59)
    dateTimeArray[5] = getLoopArray(0, 59)
    dateTimeArray.forEach((current, index) => {
        dateTime.push(current.indexOf(defaultDate[index]))
    })
    // console.log(dateTimeArray)

    return {
        dateTimeArray: dateTimeArray,
        dateTime: dateTime
    }
}
function dateMonthPicker(s, e) {
    var startDay = '2018-02-08'
    var endDay = '2018-05-09'
    let st = str => str.split('-')
    let et = str => str.split('-')
    let sMonth = Number(st[1])

    let eMonth = Number(et[1])
    let num = str => {
        str.toString 
        return str[1] ? ts : '0' + str
    }

    let getCountDays = date => {
        let curDate = new Date(date)
        var curMonth = curDate.getMonth()
        curDate.setMonth(curMonth + 1)
        curDate.setDate(0)
        return curDate.getDate()
    }
    // let getCountDays = curMonth => {
    //     curDate.setMonth(curMonth)
    //     curDate.setDate(0)
    //     return curDate.getDate()
    // }
    // for (let i = sMonth; i <= eMonth; i++){
    //     console.log(getCountDays(num(i)))
    //     let day = 
    // }
    // var weekString = "日一二三四五六"
    // let weeks = ['日', '一', '二', '三', '四', '五', '六']

    // let ca = []

    // //每个月的第一天
    // let firstDay = new Date(year, month, 1)
    // let dayInMonth = daysInMonth(month, year)
    // // 每个月的最后一天
    // let lastDay = new Date(year, month, dayInMonth)
    // // 第一天星期几(0-6)
    // let weekday = firstDay.getDay()
    // // 最后一天星期几
    // let lastDayWeekDay = lastDay.getDay()
    // // 每一个都是从1号开始
    // let days = 1


    // var s = startDay.split('-')
    // var e = endDay.split('-')

    // var ss = Number(s[1])
    // var se = Number(e[1])
    // let t = []
    // for (var i = ss; i <= se; i++) {
    //     let ts = i.toString()
    //     let s = ts[1] ? ts : '0' + ts
    //     t.push(s)
    // }
    
    // for (let i of t) {
    //     month.push(getMonthDay(s[0], i.toString()))
    // }
    // console.log(month)
    let month = []
    return month
}
module.exports = {
    dateTimePicker: dateTimePicker,
    getMonthDay: getMonthDay
}