// pages/reportDate/reportDate.js
const app = getApp()
var dateTimePicker = require('../../libs/dateTimePicker/dateTimePicker.js')
const base = require('../../utils/util.js')
Page({
    data: {
        // beginTime: '请选择',
        // endTime: '请选择',
        pickerMode: "date",
        warn: ['90天', "48小时"],
        pickerViewShow: true,
        tabCurr: 0,
        dateTimeArray: null,
        dateTime: null,
        startYear: 2018,
        endYear: 2018,
        disPicker: true,
        reportTime: null,
        dayVal: 24 * 60 * 60 * 1000
    },

    onLoad(options) {
        let that = this
        let taday = new Date()
        const dayVal = this.data.dayVal
        //const endDate = taday.Format('yyyy-MM-dd')
        //const endD = new Date(taday.getTime() - dayVal * 2)
        const endD = new Date(taday.getTime())
        const endDate = new Date(endD.Format('yyyy-MM-dd')).Format('yyyy-MM-dd')
        const startDate = new Date(endD - (24 * 60 * 60 * 1000 * 90)).Format('yyyy-MM-dd')
        console.log(startDate + '<><：：：：日期选择范围：：：：><>' + endDate)
        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
        var now = new Date()
        //var now_new = Date.parse(now.toDateString())  //typescript转换写法
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj.dateTimeArray.pop()
        var lastTime = obj.dateTime.pop()
        //处理48小时
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        let st = new Date(now.getTime() - 1000 * 60 * 60 * 24).Format('yyyy-MM-dd')
        let et = new Date().Format('yyyy-MM-dd')
        let newYear = [st, et]
        obj.dateTimeArray.splice(0, 3, newYear)
        let points = obj.dateTimeArray[1]
        let seconds = obj.dateTimeArray[2]
        let dateTimeArray = obj.dateTimeArray
        let m = now.getHours()
        let S = now.getMinutes()
        let mArr = []
        let sArr = []
        for (let i = 0; i <= m; i++) {
            //console.log(i)
            const n = i.toString()
            mArr.push(n[1] ? n : '0' + n)
        }
        for (let i = 0; i <= S; i++) {
            //console.log(i)
            const n = i.toString()
            sArr.push(n[1] ? n : '0' + n)
        }
        let dateEndArray = []
        dateEndArray[0] = dateTimeArray[0]
        dateEndArray[1] = mArr
        dateEndArray[2] = sArr
        console.log(dateEndArray)
        wx.setStorageSync("dateEndArray", dateEndArray)
        wx.setStorageSync("dateStartArray", dateTimeArray)
        let dateTime = [0, 0, 0]
        let dateTimeS = [dateEndArray[0].length - 1, dateEndArray[1].length - 1, dateEndArray[2].length - 1]
        wx.setStorageSync("endTimes", dateTimeS)
        this.setData({
            stTime: dateTime,
            etTime: dateTimeS,
            dateTimeArray: dateTimeArray,
            endDate: endDate,
            startDate: startDate,
            dateEndArray: dateEndArray,
            dateStartArray: dateTimeArray,
            startTime: '',
        })
    },
    initDate() {

    },
    toggleTab: function(e) {
        console.log(e)
        let that = this
        const tabIndex = e.target.dataset.index
        const pickerMode = tabIndex === 0 ? 'date' : 'time'
        that.setData({
            pickerMode: pickerMode,
            tabCurr: tabIndex,
            reportTime: null
        })
    },

    changeStartDate: function(e) {
        let that = this
        this.setData({
            beginTime: e.detail.value,
            disPicker: false
        })
    },

    changeEndDate: function(e) {
        this.setData({
            endTime: e.detail.value,
            reportTime: {
                beginDate: base.formatDate(this.data.beginTime, 'yyyyMMdd'),
                endDate: base.formatDate(e.detail.value, 'yyyyMMdd')
            },
            searchDates: this.data.beginTime + ' 至 ' + e.detail.value
        })
    },
    tapEnd: function(e) {
        if (!this.data.beginTime) {
            wx.showToast({
                title: '请先选择开始时间',
                icon: "none"
            })
        }
        console.log(e)
    },
    changeDateTimeColumn: function(e) {

        let detail = e.detail
        console.log(e)
        console.log("changeDateTime=>", detail)
        if (detail.column == 0) {
            if (detail.value == 1) {
                this.setData({
                    dateTimeArray: wx.getStorageSync("dateEndArray")
                })
            } else if (detail.value == 0) {
                this.setData({
                    dateTimeArray: wx.getStorageSync("dateStartArray")
                })
            }
        }
        switch (e.target.id) {
            case 'startTime':
                let stTime = this.data.stTime
                stTime[e.detail.column] = e.detail.value
                this.setData({
                    stTime: stTime
                })
                console.log(
                    this.data.stTime, "::::====::::", this.data.etTime,
                )
                break
            case 'endTime':
                let etTime = this.data.etTime
                etTime[e.detail.column] = e.detail.value
                let endDateArr = this.data.dateEndArray
                if (detail.column == 1 && detail.value < endDateArr[1].length) {
                    endDateArr[2] = this.data.dateStartArray[2]
                    this.setData({
                        dateEndArray: endDateArr
                    })
                } else if (detail.column == 1 && detail.value == endDateArr[1].length) {
                    console.log("ss")
                    let endDateArrs = wx.getStorageSync("dateEndArray")
                    endDateArr[2] = endDateArrs[2]
                    this.setData({
                        dateEndArray: endDateArr
                    })
                }
                this.setData({
                    etTime: etTime
                }) 
                break
        }

    },
    changeDateTime(e) {
        console.log(e)
        let dateTimeArray = this.data.dateTimeArray,
            dateStartArray = this.data.dateStartArray,
            dateEndArray = this.data.dateEndArray
        let stTime = this.data.stTime
        let etTime = this.data.etTime
        switch (e.target.id) {
            case 'startTime':
                this.setData({
                    sTime: `${dateStartArray[0][stTime[0]]} ${dateStartArray[1][stTime[1]]}:${dateStartArray[2][stTime[2]]}:00`
                })
                break
            case 'endTime':
                let esTime = `${dateEndArray[0][etTime[0]]} ${dateEndArray[1][etTime[1]]}:${dateEndArray[2][etTime[2]]}:00`
                let endTime = new Date(esTime).getTime()
                let startTime = new Date(this.data.sTime).getTime()
                this.setData({
                    eTime: esTime
                })
                if (endTime < startTime) {
                    wx.showToast({
                        title: "开始时间不能大于结束时间",
                        icon: "none"
                    })
                    this.setData({
                        reportTime: null
                    })
                } else {
                    let reportTime = {
                        beginTime: `${dateStartArray[1][stTime[1]]}${dateStartArray[2][stTime[2]]}00`,
                        beginDate: base.formatDate(dateStartArray[0][stTime[0]], 'yyyyMMdd'),
                        endTime: `${dateEndArray[1][etTime[1]]}${dateEndArray[2][etTime[2]]}00`,
                        endDate: base.formatDate(dateEndArray[0][etTime[0]], 'yyyyMMdd')
                    }
                    this.setData({
                        reportTime: reportTime,
                        searchDates: `${dateStartArray[0][stTime[0]]} ${dateStartArray[1][stTime[1]]}:${dateStartArray[2][stTime[2]]}:00至${dateEndArray[0][etTime[0]]} ${dateEndArray[1][etTime[1]]}:${dateEndArray[2][etTime[2]]}:00`,
                    })
                }
                break
        }
    },
    endTimes() {
        this.setData({
            dateTimeArray: wx.getStorageSync("dateEndArray")
        })
    },
    goBack() {
        let reportTime = this.data.reportTime
        let searchDates = this.data.searchDates
        var pages = getCurrentPages()
        //var currPage = pages[pages.length - 1] //当前页面
        var prevPage = pages[pages.length - 2] //上一个页面
        console.log(prevPage)
        if (reportTime instanceof Object) {
            prevPage.setData({
                searchDate: reportTime,
                searchDates: searchDates,
                disNext: true,
                disPrv: true,
            })
            wx.navigateBack()
        }
    }
})