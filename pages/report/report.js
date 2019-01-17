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
        disNext: true,
        navBar: null,
        currentCheck:0,
        currentCat: 2,
    },
    onLoad(options) {
        app.checkLogin()
        const nowDate = new Date()
        wx.setNavigationBarTitle({
            title: '收款报表',
        })
        try {
            let role = app.commonParams('role')
            this.setData({
                reportDate: new Date().Format('yyyyMMdd'),
                taday: base.formatDate(nowDate, 'yyyy-MM-dd'),
                yestaday: base.formatDate(nowDate.getTime() - base.dayValue, 'yyyy-MM-dd'),
                reportDateFormat: new Date().Format('yyyy-MM-dd'),
                role: role, //role  0总部 1门店 2员工 3店长
                navBar: role === 0 ? ['营业统计', '会员统计'] : ['营业统计', '会员统计', '核销统计'],
                ...app.systemInfo
            })
        } catch (error) {
            console.log(error)
        }
    },
    reportparams(date) {

        return this.data.searchDate ? this.data.searchDate : {
            beginDate: date,
            endDate: date
        }
    },
    getReport(reportDate, role) {
        let login = wx.getStorageSync("login")
        let params = this.reportparams(reportDate)
        this.setData({
            srcollLoading: true
        })
        //0总部 1门店 2员工 3店长
        let roles = role || app.commonParams('role')
        switch (roles) {
            case 0:
                console.log("总部:::::")
                //获取门店
                let report = [api.trade(params), api.tradeMerchant(params), api.merchantList({}), api.recharge(params), api.newMemberCount(params)]
                Promise.all(report).then(res => {
                    console.log(res)
                    let store = res[2].merchantList
                    let recharge = res[3].rechargeStatistics
                    store.unshift({
                        merchantName: '全部门店'
                    })
                    this.setData({
                        isPageLoad: false,
                        trade: res[0].statistics,
                        department: res[1],
                        srcollLoading: false,
                        store: store,
                        recharge: recharge,
                        selStore: 0,
                    })
                })
                break
            case 1:
                console.log("门店:::::")
                params.merchantCode = wx.getStorageSync("storeCode") || app.commonParams('merchantCode')
                Promise.all([api.trade(params), api.tradeOperator(params), api.recharge(params), api.newMemberCount(params)]).then(res => {
                    console.log(res)
                    var cashier = (res[1].code != 'FAILED') ? res[1] : null
                    var trade = (res[0].code != 'FAILED') ? res[0].statistics : null
                    let recharge = res[2].rechargeStatistics

                    this.setData({
                        isPageLoad: false,
                        trade: trade,
                        cashier: cashier,
                        srcollLoading: false,
                        recharge: recharge,
                        memberCount: res[3].count,
                        department: null
                    })
                })
                break
            case 2:
                console.log("员工:::::::")
                params.merchantCode = app.commonParams('merchantCode')
                params.operatorId = app.commonParams('operatorId')
                api.tradeOperator(params).then(res => {
                    this.setData({
                        isPageLoad: false,
                        cashier: res,
                        srcollLoading: false,
                    })
                })
                break
            case 3:
                console.log("店长角色:::::")
                params.merchantCode = app.commonParams('merchantCode')
                Promise.all([api.trade(params), api.tradeOperator(params), api.recharge(params), api.newMemberCount(params)]).then(res => {
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
    stepDate(e) {
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
        if (e.target.id) {
            this.setData({
                reportDate: reportDate,
                reportDateFormat: reportDateFormat
            })
        }
    },
    nextView(csTime) {
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
        this.setData({
            disNext: disNext,
            reportTab: reportTab
        })
    },
    toggleReport(e) {
        let event = e.target.dataset
        let reportDate = this.data.reportDateFormat
        switch (event.index) {
            case 0:
                this.setData({
                    reportDateFormat: this.data.yestaday,
                    reportDate: base.formatDate(this.data.yestaday, 'yyyyMMdd'),
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: false
                })
                this.getReport(base.formatDate(this.data.yestaday, 'yyyyMMdd'))
                break
            case 1:
                this.setData({
                    reportDateFormat: this.data.taday,
                    reportDate: base.formatDate(this.data.taday, 'yyyyMMdd'),
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: true
                })
                this.getReport(base.formatDate(this.data.taday, 'yyyyMMdd'))
                break
            case 2:
                wx.navigateTo({
                    url: '/pages/reportDate/reportDate',
                })
                break
        }
        this.setData({
            reportTab: e.target.dataset.index
        })
    },
    moreDepartment() {
        let params = this.reportparams(this.data.reportDate)
        params.pageNumber = this.data.department.pageNumber + 1
        api.tradeMerchant(params)
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
        let cashier = this.data.cashier
        let params = this.reportparams(this.data.reportDate)
        params.merchantCode = app.commonParams("merchantCode")
        params.pageNumber = cashier.pageNumber + 1
        api.tradeOperator(params)
            .then(res => {
                console.log(res)
                if (res.code != 'FAILED') {
                    cashier.statisticsList = cashier.statisticsList.concat(res.statisticsList)
                    cashier.pageNumber = params.pageNumber

                } else {
                    cashier.pageNumber = params.pageNumber
                }
                this.setData({
                    cashier: cashier
                })
            })
    },
    storeChange(e) {
        if (e.detail.value == 0) {
            this.getReport(this.data.reportDate)
            wx.removeStorageSync("storeCode")
            wx.setNavigationBarTitle({
                title: app.commonParams("merchantName"),
            })
        } else {
            //let params = this.data.searchDate || this.reportparams(this.data.reportDate)
            console.log("merchantCode::::", this.data.store[e.detail.value])
            //params.merchantCode = this.data.store[e.detail.value].merchantCode
            wx.setStorageSync("storeCode", this.data.store[e.detail.value].merchantCode)
            this.getReport(this.data.reportDate, 1)
            wx.setNavigationBarTitle({
                title: this.data.store[e.detail.value].merchantName,
            })
        }
        this.setData({
            selStore: e.detail.value
        })
    },
    toggleCat(e) {
        let currentCat = e.target.id
        this.setData({
            currentCat: e.target.id
        })
        this.initPage()
    },
    // 充值统计
    recharge() {
        //let params = this.reportparams()
        return api.recharge(this.reportparams())
    },
    // 会员新增数量
    newMemberCount() {
        return api.newMemberCount(this.reportparams())
    },
    //核销优惠券记录
    couponConsumeRecordList(date) {
        return api.couponConsumeRecordList(this.reportparams(this.data.searchDate || this.data.reportDate))
    },
    //查询核券数量
    couponConsumeCount() {
        return api.couponConsumeCount({})
    },

    //核销优惠券记录
    couponConsumeList() {
        return api.couponConsumeList({})
    },

    //员工列表
    employeeList() {
        return api.employeeList({})
    },
    initCouponCheck() {
        let init = [
            this.couponConsumeCount(),
            this.couponConsumeList(),
            this.employeeList(),
            this.couponConsumeRecordList()
        ]
        Promise.all(init).then(res => {
            console.log(res)
            this.setData({
                isPageLoad:false,
                couponList: res[1].couponList,
                todayCount: res[0].todayCount,
                yesterdayCount: res[0].yesterdayCount,
                employeeList: res[2].employeeList,
                recordList: res[3].recordList
            })
        })
    },
    changeCoupon(e) {

    },
    changeEmployee(e) {

    },
    //核券时间切换
    toggleCheckTab(e){
        this.setData({
            currentCheck:e.target.dataset.id
        })
        this.initCouponCheck()
    },
    //优惠券查询
    initPage(){
        if (this.data.currentCat == 2) {
            this.initCouponCheck()
        } else {
            this.getReport(this.data.searchDate || this.data.reportDate)
        }
    },
    onShow() {
        console.log("onshow")
        this.initPage()
    }
})