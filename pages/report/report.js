const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        isPageLoad: true,
        srcollLoading: false,
        reportTab: 1,
        reportDate: new Date().Format('yyyyMMdd'),
        reportDateFormat: new Date().Format('yyyy-MM-dd')
    },
    onLoad: function(options) {
        app.checkLogin()
        this.getReport(this.reportParmas())
    },
    reportParmas(searchDate) {
        return {
            beginDate: this.data.searchDate || new Date().Format('yyyyMMdd'),
            endDate: this.data.searchDate || new Date().Format('yyyyMMdd')
        }
    },
    getReport: function(parmas, role) {
        let login = wx.getStorageSync("login")
        this.setData({
            srcollLoading: true
        })
        // 0总部 1门店 2员工 3店长
        let report
        switch (role || login.role) {
            case 0:
                //获取门店
                report = [api.trade(parmas), api.tradeMerchant(parmas), api.merchantList({})]
                Promise.all(report).then(res => {
                    console.log(res)
                    let store = res[2].merchantList
                    store.unshift({
                        merchantName: '全部门店'
                    })
                    this.setData({
                        isPageLoad: false,
                        trade: res[0].statistics,
                        department: res[1],
                        srcollLoading:false,
                        store: store,
                        selStore: 0,
                    })
                })
                break
            case 1:
                console.log("门店报表")
                Promise.all([api.trade(parmas), api.tradeOperator(parmas)]).then(res => {
                    console.log(res)
                    this.setData({
                        // isPageLoad: false,
                        // trade: res[0].statistics,
                        // department: res[1],
                        srcollLoading: false,
                        // store: store,
                        // selStore: 0,
                    })
                })
                break
            case 2:

                break
            case 3:

                break
        }

    },
    stepDate: function(e) {
        let that = this
        let reportDate = that.data.reportDate
        const currDate = new Date(reportDate)
        const ms = base.dayValue
        let _prportDate = null
        const tadayMs = new Date().getTime()
        let disNext = that.data.disNext
        let activeDate = null
        if (e.target.id === 'next') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() + ms
            // reportDate = base.formatDate(activeDate, 'yyyy-MM-dd')
            this.getReport(reportDate)
            this.nextView(activeDate)
        } else if (e.target.id === 'prev') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() - ms
            reportDate = base.formatDate(activeDate, 'yyyy-MM-dd')
            this.getReport(reportDate)
            this.nextView(activeDate)
        }
        that.setData({
            reportDate: reportDate
        })
    },
    toggleReport: function(e) {
        let that = this
        let event = e.target.dataset
        let reportDate = that.data.reportDate


        if (event.index === 0) {
            that.getReport(that.data.taday)
        }
        let rDate = null
        switch (event.index) {
            case 0:
                that.getReport(that.data.yestaday)
                rDate = that.data.yestaday
                that.setData({
                    reportDate: that.data.yestaday,
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: false
                })
                break
            case 1:
                that.getReport(that.data.taday)
                that.setData({
                    reportDate: that.data.taday,
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: true
                })
                break
            case 2:
                wx.navigateTo({
                    url: '/pages/reportDate/reportDate',
                })
                break
        }
        that.setData({
            reportTab: e.target.dataset.index
        })
    },
    moreDepartment() {
        let parmas = this.reportParmas()
        parmas.pageNumber = this.data.department.pageNumber + 1
        api.tradeMerchant(parmas)
            .then(res => {
                console.log(res)
                let department = this.data.department
                department.statisticsList = department.statisticsList.concat(res.statisticsList)
                department.pageNumber = res.pageNumber

                this.setData({
                    department: department
                })
            })
    },
    storeChange: function(e) {
        console.log(e)
        let parmas = this.reportParmas()
        parmas.merchantCode = this.data.store[e.detail.value].merchantCode
        console.log(parmas)
        this.getReport(parmas, 1)
        this.setData({
            selStore: e.detail.value
        })
    },
    onReady: function() {

    },
    onShow: function() {

    },

    onHide: function() {

    },

    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    }
})