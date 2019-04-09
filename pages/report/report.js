const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        loading: true,
        srcollLoading: false,
        reportTab: 1,
        reportDate: null,
        reportDateFormat: null,
        disNext: true,
        navBar: null,
        currentCheck: 0,
        currentCat: 0,
        istolower: false,
        countState: true,
        istoupper: false,
        recordList: [],
        hasmore: true,
        couponPage: 0,
        r: ['0总部 ', '1门店 ', '2员工 ', '3店长']
    },
    onLoad(options) {
        app.checkLogin()
        const nowDate = new Date()
        try {
            let role = app.commonParams('role')
            this.setData({
                reportDate: this.lessDate('yyyyMMdd'),
                tradeDateValue: this.lessDate('yyyy-MM-dd'),
                taday: this.lessDate('yyyy-MM-dd'),
                yestaday: this.lessDate('yyyy-MM-dd'),
                couponDate: this.setCouponDate(7),
                couponDates: {
                    beginTime: this.lessDate('yyyy-MM-dd', 7),
                    endTime: this.lessDate('yyyy-MM-dd'),
                },
                role, //role  0总部 1门店 2员工 3店长
                navBar: role === 0 ? ['营业统计', '会员统计'] : ['营业统计', '会员统计', '核销统计'],
                headTitle: app.commonParams('merchantName'),
                ...app.systemInfo
            })
        } catch (error) {
            wx.redirectTo({
                url: '/pages/login/login',
            })
        }
    },
    lessDate(type, days) {
        const nowDate = new Date()
        return base.formatDate(nowDate.getTime() - base.dayValue * (days || 0), type)
    },
    toggleCount() {
        this.setData({
            countState: !this.data.countState
        })
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
            srcollLoading: true,
            tolowerEvent: ""
        })
        //0总部 1门店 2员工 3店长
        let roles = role || app.commonParams('role')
        console.log(params)
        switch (roles) {
            case 0:
                console.log("总部:::::")
                //获取门店
                let report = [api.trade(params), 
                api.tradeMerchant(params), 
                api.merchantList({}), 
                api.recharge(params), 
                api.newMemberCount(params), 
                api.terminal(params), 
                api.merchant(params)]
                Promise.all(report).then(res => {
                    console.log(res)
                    let store = res[2].merchantList
                    let recharge = res[3].rechargeStatistics
                    var terminal = (res[5].code != 'FAILED') ? res[5].statistics : null
                    store.unshift({
                        merchantName: '全部门店'
                    })
                    this.setData({
                        loading: false,
                        trade: res[0].statistics,
                        department: res[1],
                        srcollLoading: false,
                        store,
                        terminal,
                        recharge,
                        selStore: this.data.selStore || 0,
                    })
                })
                break
            case 1:
                console.log("门店:::::")
                params.merchantCode = wx.getStorageSync("selStoreCode") || app.commonParams('merchantCode')
                Promise.all([api.trade(params), 
                api.tradeOperator(params), 
                api.recharge(params), 
                api.newMemberCount(params), 
                api.terminal(params), 
                api.merchant(params)]).then(res => {
                    console.log(res)
                    let cashier = (res[1].code != 'FAILED') ? res[1] : null,
                        trade = (res[0].code != 'FAILED') ? res[0].statistics : null,
                        recharge = res[2].rechargeStatistics,
                        terminal = (res[4].code != 'FAILED') ? res[4].statisticsList : null
                    this.setData({
                        loading: false,
                        trade,
                        cashier,
                        srcollLoading: false,
                        recharge,
                        terminal,
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
                        loading: false,
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
                        loading: false,
                        trade: trade,
                        cashier: cashier,
                        srcollLoading: false,
                        department: null
                    })
                })
                break
        }
    },
    //时间天数切换
    stepDate(e) {
        let reportDate = this.data.tradeDateValue
        const currDate = new Date(reportDate)
        const ms = base.dayValue
        let _prportDate = null
        const tadayMs = new Date().getTime()
        let disNext = this.data.disNext
        let activeDate = null
        let tradeDateValue = null
        if (e.target.id === 'next') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() + ms
            reportDate = base.formatDate(activeDate, 'yyyyMMdd')
            tradeDateValue = base.formatDate(activeDate, "yyyy-MM-dd")
            console.log(activeDate)
            this.getReport(reportDate)
            this.nextView(activeDate)
        } else if (e.target.id === 'prev') {
            this.setData({
                srcollLoading: true
            })
            activeDate = currDate.getTime() - ms
            reportDate = base.formatDate(activeDate, 'yyyyMMdd')
            tradeDateValue = base.formatDate(activeDate, "yyyy-MM-dd")
            this.getReport(reportDate)
            this.nextView(activeDate)
        }
        if (e.target.id) {
            this.setData({
                reportDate,
                tradeDateValue
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
    //切换报表
    toggleReport(e) {
        let id = e.target.dataset.index,
            reportDate = this.data.reportDate
        switch (id) {
            case 0:
                reportDate = this.lessDate('yyyyMMdd', 1)
                this.setData({
                    tradeDateValue: this.lessDate('yyyy-MM-dd', 1),
                    reportDate,
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: false
                })
                this.getReport(reportDate)
                break
            case 1:
                reportDate = this.lessDate('yyyyMMdd')
                this.setData({
                    tradeDateValue: this.data.taday,
                    reportDate,
                    searchDates: null,
                    searchDate: null,
                    disPrv: false,
                    disNext: true
                })
                this.getReport(reportDate)
                break
            case 2:
                this.toReportDate('trade')
                break
        }
        this.setData({
            reportTab: e.target.dataset.index
        })
    },
    toReportDate(type) {
        wx.navigateTo({
            url: `/pages/reportDate/reportDate?type=${type}`,
        })
    },
    //更多员工
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
    //更多门店
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
    //切换统计门店
    storeChange(e) {
        let role = null,
            navBar,
            selStore = e.detail.value,
            currentCat = this.data.currentCat
        if (selStore == 0) {
            this.getReport(this.data.reportDate)
            wx.removeStorageSync("selStoreCode")
            role = 0
            navBar = ['营业统计', '会员统计']
            currentCat = 0
        } else {
            wx.setStorageSync("selStoreCode", this.data.store[e.detail.value].merchantCode)
            role = 1
            this.getReport(this.data.reportDate, 1)
            navBar = ['营业统计', '会员统计', '核销统计']
        }
        this.setData({
            selStore,
            role,
            navBar,
            currentCat
        })
    },
    //切换分类
    toggleCat(e) {
        let currentCat = e.target.id
        this.setData({
            currentCat: currentCat
        })
        this.initPage()
    },
    // 充值统计
    recharge() {
        return api.recharge(this.reportparams())
    },
    // 会员新增数量
    newMemberCount() {
        return api.newMemberCount(this.reportparams())
    },
    //核销优惠券记录
    couponConsumeRecordList(arg, days) {
        let params = this.setCouponDate(days)
        if (arg) {
            params = { ...params,
                ...arg
            }
        }
        if (this.data.selEmployee > 0) {
            params.operatorId = this.data.employeeList[this.data.selEmployee].operatorId
        }
        if (this.data.selCoupon > 0) {
            params.couponId = this.data.couponList[this.data.selCoupon].couponId
        }
        let _couponPage = this.data.couponPage
        return api.couponConsumeRecordList(params).then(res => {
            console.log(_couponPage)
            let couponPage = _couponPage == 0 ? 1 : _couponPage + 1,
                recordList = res.recordList,
                totalCount = res.totalCount,
                _recordList = this.data.recordList,
                hasmore = recordList.length > 0 ? true : false

            recordList = couponPage > 1 ? _recordList.concat(recordList) : recordList
            console.log("couponPage::::::", couponPage)
            console.log(recordList)
            this.setData({
                recordList,
                totalCount,
                listloading: false,
                loading: false,
                istolower: false,
                hasmore,
                couponPage
            })
        })
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
    //核销统计模块初始化
    initCouponCheck() {
        let init = [
            this.couponConsumeCount(),
            this.couponConsumeList(),
            this.employeeList()
        ]
        Promise.all(init).then(res => {
            console.log(res)
            const yesterdayCount = res[0].yesterdayCount,
                employeeList = res[2].employeeList,
                couponList = res[1].couponList
            couponList.unshift({
                couponName: '全部优惠券'
            });
            employeeList.unshift({
                operatorName: '全部店员'
            })
            this.setData({
                couponList: res[1].couponList,
                todayCount: res[0].todayCount,
                yesterdayCount: res[0].yesterdayCount,
                employeeList: res[2].employeeList,
                tolowerEvent: 'moreRecordList',
                couponPage: 0,
                selCoupon: 0,
                selEmployee: 0
            })
        }).then(res => {
            this.couponConsumeRecordList()
        })
    },
    changeCoupon(e) {
        let index = e.detail.value,
            setCoupon = this.data.couponList[index]
        let arg = index > 0 ? {
            couponId: setCoupon.couponId
        } : {}
        this.setData({
            selCoupon: index,
            couponPage: 0
        })
        this.couponConsumeRecordList(arg)

    },
    changeEmployee(e) {
        const index = e.detail.value,
            selEmployee = this.data.employeeList[index]
        let arg = index > 0 ? {
            operatorId: selEmployee.operatorId
        } : {}
        this.setData({
            selEmployee: index,
            couponPage: 0
        })
        this.couponConsumeRecordList(arg)
    },

    setCouponDate(day) {
        const days = day || this.data.couponDay
        const couponDate = this.data.searchCouponDate || {
                beginTime: this.lessDate('yyyyMMddhhmmss', days),
                endTime: this.lessDate('yyyyMMddhhmmss'),
            },
            couponDates = {
                beginTime: this.lessDate('yyyy-MM-dd', days),
                endTime: this.lessDate('yyyy-MM-dd'),
            }
        this.setData({
            couponDate,
            couponDates,
            couponDay: days
        })
        return couponDate
    },

    //核券时间切换
    toggleCheckTab(e) {
        const index = e.target.dataset.id
        this.setData({
            currentCheck: index,
            couponPage: 0,
            searchCouponDate: null,
            couponDateValue: null
        })
        switch (index) {
            case 0:
                this.setData({
                    listloading: true
                })
                this.couponConsumeRecordList({}, 7)
                break
            case 1:
                this.setData({
                    listloading: true
                })
                this.couponConsumeRecordList({}, 30)
                break
            case 2:
                this.toReportDate("coupon")
                break
        }
    },
    //优惠券查询
    initPage(currentCat) {
        console.log("ROLES::", this.data.r[app.commonParams('role')])
        if (this.data.currentCat == 2) {
            this.initCouponCheck()
        } else {
            this.getReport(this.data.searchDate || this.data.reportDate)
        }
    },
    moreRecordList(e) {
        this.setData({
            istolower: true
        })
        if (this.data.hasmore) {
            this.couponConsumeRecordList({
                pageNumber: this.data.couponPage + 1
            })
        }
    },
    resRecordList(e) {
        console.log("res::::", e);
    },
    goDetail(date, type) {
        let data = this.data,
            d = (date instanceof Object) ?
            wx.setStorageSync("searchDate", date) : `date=${date}`
        wx.navigateTo({
            url: `/pages/reportDetail/reportDetail?${d}&type=${type}&reportTab=${data.reportTab}&tradeDateValue=${data.tradeDateValue}`,
        })
    },
    moreTerimnal() {
        this.goDetail(this.data.searchDate || this.data.reportDate, 'terminal')
    },
    moreOperator() {
        this.goDetail(this.data.searchDate || this.data.reportDate, 'operator')
    },
    onShow() {
        this.initPage()
    }
})