const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        isPageLoad: true,
        srcollLoading: false,
        reportTab: 1,
        reportDate: null,
        reportDateFormat: null,
        disNext: true
    },
    onLoad: function(options) {
        app.checkLogin()
        const nowDate = new Date()
        this.setData({
            reportDate: new Date().Format('yyyyMMdd'),
            taday: base.formatDate(nowDate, 'yyyy-MM-dd'),
            yestaday: base.formatDate(nowDate.getTime() - base.dayValue, 'yyyy-MM-dd'),
            reportDateFormat: new Date().Format('yyyy-MM-dd'),
            role: app.commonParmas('role')
        })
    },
    reportParmas(date) {
        return this.data.searchDate ? this.data.searchDate : {
            beginDate: date,
            endDate: date
        }
    },
    getReport(reportDate, role) {
        let login = wx.getStorageSync("login")
        let parmas = this.reportParmas(reportDate)
        this.setData({
            srcollLoading: true
        })
        //0总部 1门店 2员工 3店长
        let roles = role || app.commonParmas('role')
        switch (roles) {
            case 0:
                console.log("总部:::::")
                //获取门店
                let report = [api.trade(parmas), api.tradeMerchant(parmas), api.merchantList({})]
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
                        srcollLoading: false,
                        store: store,
                        selStore: 0,
                    })
                })
                break
            case 1:
                console.log("门店角色:::::")
                parmas.merchantCode = app.commonParmas('merchantCode')
                Promise.all([api.trade(parmas), api.tradeOperator(parmas)]).then(res => {
                    console.log(res)
                    if (res[1].code != 'FAILED') {
                        var cashier = res[1]
                    }
                    if (res[0].code != 'FAILED') {
                        var trade = res[0].statistics
                    }
                    this.setData({
                        isPageLoad: false,
                        trade: trade,
                        cashier: cashier,
                        srcollLoading: false,
                        department: null
                    })
                })
                break
            case 2:
                console.log("员工角色:::::::")
                parmas.merchantCode = app.commonParmas('merchantCode')
                parmas.operatorId = app.commonParmas('operatorId')
                api.tradeOperator(parmas).then(res => {
                    this.setData({
                        isPageLoad: false,
                        cashier: res,
                        srcollLoading: false,
                    })
                })
                break
            case 3:
                console.log("店长角色:::::")
                parmas.merchantCode = app.commonParmas('merchantCode')
                Promise.all([api.trade(parmas), api.tradeOperator(parmas)]).then(res => {
                    console.log(res)
                    if (res[1].code != 'FAILED') {
                        var cashier = res[1]
                    }
                    if (res[0].code != 'FAILED') {
                        var trade = res[0].statistics
                    }
                    this.setData({
                        isPageLoad: false,
                        trade: trade,
                        cashier: cashier,
                        srcollLoading: false,
                        department: null
                    })
                })
                break
        }
    },
    stepDate: function(e) {
        console.log(e)
        let that = this
        let reportDate = this.data.reportDateFormat
        const currDate = new Date(reportDate)
        const ms = base.dayValue
        let _prportDate = null
        const tadayMs = new Date().getTime()
        let disNext = this.data.disNext
        let activeDate = null
        let reportDateFormat = null
        if (e.target.id === 'next') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() + ms
            reportDate = base.formatDate(activeDate, 'yyyyMMdd')
            reportDateFormat = base.formatDate(activeDate, "yyyy-MM-dd")
            console.log(activeDate)
            this.getReport(reportDate)
            this.nextView(activeDate)
        } else if (e.target.id === 'prev') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() - ms
            reportDate = base.formatDate(activeDate, 'yyyyMMdd')
            reportDateFormat = base.formatDate(activeDate, "yyyy-MM-dd")
            this.getReport(reportDate)
            this.nextView(activeDate)
        }
        this.setData({
            reportDate: reportDate,
            reportDateFormat: reportDateFormat
        })
    },
    nextView: function(csTime) {
        let nowTime = new Date().getTime()
        const dayValue = base.dayValue
        let disNext = new Date().Format('yyyy-MM-dd') == new Date(csTime).Format('yyyy-MM-dd') ? true : false
        let reportTab = null
        if (nowTime > csTime) {
            reportTab = 2
        }
        if (new Date(nowTime - dayValue).Format('yyyy-MM-dd') == new Date(csTime).Format('yyyy-MM-dd')) {
            reportTab = 0
        }
        if (disNext) {
            reportTab = 1
        }
        // console.log(new Date(nowTime - dayValue).Format('yyyy-MM-dd') + "<><><" + new Date(csTime).Format('yyyy-MM-dd'))
        this.setData({
            disNext: disNext,
            reportTab: reportTab
        })
    },
    toggleReport: function(e) {
        let that = this
        let event = e.target.dataset
        let reportDate = this.data.reportDateFormat
        switch (event.index) {
            case 0:
                that.setData({
                    reportDateFormat: that.data.yestaday,
                    reportDate: base.formatDate(that.data.yestaday, 'yyyyMMdd'),
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: false
                })
                that.getReport(base.formatDate(that.data.yestaday, 'yyyyMMdd'))
                break
            case 1:
                that.setData({
                    reportDateFormat: that.data.taday,
                    reportDate: base.formatDate(that.data.taday, 'yyyyMMdd'),
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: true
                })
                that.getReport(base.formatDate(that.data.taday, 'yyyyMMdd'))
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
    moreCashier() {

    },
    storeChange: function(e) {
        console.log(e)
        if (e.detail.value == 0) {
            this.getReport(this.data.reportDate)
            wx.setNavigationBarTitle({
                title: app.commonParmas("merchantName"),
            })
        } else {
            let parmas = this.data.searchDate || this.reportParmas(this.data.reportDate)
            parmas.merchantCode = this.data.store[e.detail.value].merchantCode
            this.getReport(this.data.reportDate, 1)
            wx.setNavigationBarTitle({
                title: this.data.store[e.detail.value].merchantName,
            })
        }
        this.setData({
            selStore: e.detail.value
        })

    },
    onReady: function() {

    },
    onShow() {
        this.getReport(this.data.searchDate || this.data.reportDate)
    }
})