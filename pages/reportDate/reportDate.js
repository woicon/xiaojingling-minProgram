// pages/reportDate/reportDate.js
const app = getApp()
var dateTimePicker = require('../../libs/dateTimePicker/dateTimePicker.js')
const base = require('../../utils/util.js')
Page({
    data: {
        searchDate: null,
        searchCouponDate: null,
        tradeDateValue: null,
        couponDateValue: null,
    },
    onLoad(options) {
        this.dateRang()
        this.setData({
            type: options.type
        })
    },
    withData(num) {
        return num < 10 ? `0${num}` : '' + num
    },
    getLoopArray(start, end) {
        var start = start || 0,
            end = end || 1,
            array = []
        for (var i = start; i <= end; i++) {
            array.push(this.withData(i));
        }
        return array
    },
    initRange(p, s, d) {
        let dateArray = [],
            days = [],
            num = d || 89
        for (var i = 0; i <= num; i++) {
            let d = base.formatDate(new Date().getTime() - base.dayValue * i, 'yyyy年MM月dd日'),
                day = i == 0 ? `今天` : d
            days.push(day)
        }
        dateArray[0] = days
        dateArray[1] = this.getLoopArray(0, p)
        dateArray[2] = this.getLoopArray(0, s)
        console.log(dateArray)
        return dateArray
    },

    dateRang() {
        let nowDate = new Date(),
            startRange = this.initRange(23, 59),
            endRange = this.initRange(nowDate.getHours(), nowDate.getMinutes()),
            tadays = base.formatDate(new Date().getTime(), 'yyyy年MM月dd日'),
            startRangeValue = [startRange[0].length, startRange[1].length, startRange[2].length],
            endRangeValue = [0, endRange[1].length, endRange[2].length]
        this.setData({
            startRange,
            endRange,
            startRangeValue,
            endRangeValue,
            tadays
        })
    },
    changeDateColumn(e) {
        console.log(e)
        const column = e.detail.column,
            value = e.detail.value,
            id = e.target.id,
            nowDate = new Date(),
            range = this.data[id],
            rangeValue = this.data[`${id}Value`]
        switch (column) {
            case 0:
                if (value == 0) {
                    range[1] = this.getLoopArray(0, nowDate.getHours())
                    range[2] = this.getLoopArray(0, nowDate.getMinutes())
                    rangeValue[1] = 0
                    rangeValue[2] = 0
                } else {
                    range[1] = this.getLoopArray(0, 23)
                    range[2] = this.getLoopArray(0, 59)
                }
                rangeValue[0] = value
                break
            case 1:
                if (value + 1 == range[1].length && this.data[`${id}Value`][0] == 0) {
                    range[2] = this.getLoopArray(0, nowDate.getMinutes())
                    rangeValue[2] = 0
                } else {
                    range[2] = this.getLoopArray(0, 59)
                }
                rangeValue[1] = value
                break
            case 2:
                rangeValue[2] = value
                break
        }
        console.log(range)
        this.setData({
            [id]: range,
            [`${id}Value`]: rangeValue
        })
    },

    dateValue(range, arr) {
        let time = `${range[1][arr[1]]}:${range[2][arr[2]]}`
        return range[0][arr[0]] == '今天' ? `${this.data.tadays} ${time}` : `${range[0][arr[0]]} ${time}`
    },
    dateString(ds, type) {
        let res = null,
            d = ds || '2019年12月22日 09:12:12'
        switch (type) {
            case 0:
                //统计报表参数
                res = d.replace(/年|月|日|:|/g, "").split(" ")
                res[1] = `${res[1]}00`
                console.log(res)
                break
            case 1:
                //优惠券参数
                res = `${d.replace(/年|月|日|:|\s/g, "")}00`
                break
            case 2:
                res = `${d.replace(/年|月/g, "-").replace(/日/g,"")}:00`
                break
            default:
                //默认 毫秒数
                let t = d.replace(/年|月/g, "/").replace(/日/, '')
                res = new Date(t).getTime()
                break
        }
        return res
    },
    changeDate(e) {
        let id = e.target.id,
            value = e.detail.value,
            tadays = this.data.tadays,
            selRange = this.data[id],
            selValue = this.dateValue(selRange, value),
            nowDate = new Date(),
            rangeAttr = id == 'startRange' ? 'endRange' : 'startRange',
            range = null,
            status = false
        switch (id) {
            case 'startRange':
                let day = Math.floor((new Date().getTime() - this.dateString(selValue)) / base.dayValue)
                range = this.initRange(nowDate.getHours(), nowDate.getMinutes(), day)
                if (this.data.endRangeText) {
                    let startTime = this.dateString(selValue),
                        endTime = this.dateString(this.data.endRangeText)
                    if (startTime > endTime) {
                        app.tip('开始时间不能大于结束时间')
                    } else {
                        status = true
                        this.setDate(selValue, this.data.endRangeText)
                    }
                }
                break
            case 'endRange':
                range = this.initRange(23, 59)
                let startTime = this.dateString(this.data.startRangeText),
                    endTime = this.dateString(selValue)
                if (startTime > endTime) {
                    app.tip('开始时间不能大于结束时间')
                } else {
                    status = true
                    this.setDate(this.data.startRangeText, selValue)
                }
                break
        }
        this.setData({
            [`${id}Value`]: value,
            [`${id}Text`]: selValue,
            [rangeAttr]: range,
            status
        })
    },
    setDate(start, end) {
        console.log("START::", start, "END:::", end)
        let type = this.data.type,
            data = null
        switch (type) {
            case 'coupon':
                data = {
                    beginTime: this.dateString(start, 1),
                    endTime: this.dateString(end, 1),
                }
                this.setData({
                    searchCouponDate: {
                        beginTime: this.dateString(start, 1),
                        endTime: this.dateString(end, 1),
                    },
                    couponDateValue: `${this.dateString(start,2)} 至 ${this.dateString(end,2)}`
                })
                break
            case 'trade':
                let s = this.dateString(start, 0),
                    e = this.dateString(end, 0)
                this.setData({
                    searchDate: {
                        beginDate: s[0],
                        endDate: e[0],
                        beginTime: s[1],
                        endTime: e[1]
                    },
                    tradeDateValue: `${this.dateString(start, 2)} 至 ${this.dateString(end, 2)}`
                })
                break
        }
    },
    goBack() {
        let searchDate = this.data.searchDate,
            tradeDateValue = this.data.tradeDateValue,
            couponDateValue = this.data.couponDateValue,
            searchCouponDate = this.data.searchCouponDate,
            pages = getCurrentPages(),
            prevPage = pages[pages.length - 2]
        prevPage.setData({
            searchDate,
            searchCouponDate,
            tradeDateValue,
            couponDateValue,
            couponPage:0,
            disNext: true,
            disPrv: true,
        })
        wx.navigateBack()
    }
})