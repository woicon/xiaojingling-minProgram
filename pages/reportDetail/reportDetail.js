const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        loading: true,
        disNext: true
    },
    onLoad(options) {
        console.log(options)
        let types = {
            'terminal': "款台报表",
            "operator": "收银员报表"
        }
        wx.setNavigationBarTitle({
            title: types[options.type],
        })
        
        if (!options.date) {
            options.searchDate = wx.getStorageSync("searchDate")
        }
        this.setData(options)
    },
    toggleReport(e) {
        let id = e.target.dataset.index
        let reportDate = this.data.reportDate
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
                this.initDetail(reportDate)
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
                this.initDetail(reportDate)
                break
            case 2:
                wx.navigateTo({
                    url: '/pages/reportDate/reportDate?type=trade'
                })
                break
        }
        this.setData({
            reportTab: e.target.dataset.index
        })
    },

    stepDate(e) {
        let reportDate = this.data.tradeDateValue,
            currDate = new Date(reportDate),
            ms = base.dayValue,
            _prportDate = null,
            tadayMs = new Date().getTime(),
            disNext = this.data.disNext,
            activeDate = null,
            tradeDateValue = null,
            id = e.target.id
        if (id) {
            const dates = (type) => {
                this.setData({
                    listloading: true
                })
                activeDate = currDate.getTime() + type
                reportDate = base.formatDate(activeDate, 'yyyyMMdd')
                tradeDateValue = base.formatDate(activeDate, "yyyy-MM-dd")
                this.initDetail(reportDate)
                this.nextView(activeDate)
            }
            id == 'next' ? dates(+ms) : dates(-ms)
            this.setData({
                reportDate,
                tradeDateValue,
            })
        }
    },
    lessDate(type, days) {
        const nowDate = new Date()
        return base.formatDate(nowDate.getTime() - base.dayValue * (days || 0), type)
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
    params(sdate) {
        let date = this.data.date,
            type = this.data.type,
            params = this.data.searchDate ? this.data.searchDate : {
                beginDate: sdate || date,
                endDate: sdate || date,
            }
        if (this.data[type]) {
            let detail = this.data[type]
            if (this.data.istolower && detail.totalPage > detail.pageNumber) {
                params.pageNumber = detail.pageNumber + 1
            }
        }
        params.pageSize = 25
        params.merchantCode = wx.getStorageSync("selStoreCode") || app.commonParams('merchantCode')
        return params
    },
    operator(date) {
        return api.tradeOperator(this.params(date))
    },
    terminal(date) {
        return api.terminal(this.params(date))
    },
    initDetail(date) {
        let type = this.data.type
        this[type](date).then(res => {
            let hasmore = true,
                list = res.statisticsList
            if (this.data[type]) {
                if (this.data.istolower && this.data.hasmore) {
                    res.statisticsList = list.concat(this.data[type].statisticsList)
                }
                hasmore = res.totalPage == res.pageNumber ? false : true
            }
            this.setData({
                [type]: res,
                listloading: false,
                loading: false,
                istolower: false,
                hasmore
            })
        })

    },
    moreDetail() {
        this.setData({
            istolower: true
        })
        if (this.data.hasmore) {
            this.initDetail()
        }
    },
    onShow() {
        this.initDetail()
    }
})