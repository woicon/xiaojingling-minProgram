const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        isPageLoad: true,
        summaryHasMore: true,
        orderIsBottm: false,
        orderHasMore: true,
        orderStatus: {
            'NOTPAY': '未支付',
            'SUCCESS': '支付成功',
            'REFUND': '转入退款',
            'CLOSED': '已关闭',
            'REVOKED': '已撤销'
        },
        orderStatusSel: ['全部支付状态', '未支付', '支付成功', '转入退款', '已关闭', '已撤销'],
        orderIndex: 0,
        payTypeSel: ['全部支付方式', '微信', '支付宝 ', '会员'],
        payIndex: 0,
        payType: {
            WXPAY: '微信',
            ALIPAY: '支付宝 ',
            MPAY: '会员'
        }
    },
    onLoad: function(options) {
        app.checkLogin()
        let role = app.commonParmas('role')
        if(role != 0){
            wx.redirectTo({
                url: '/pages/orderSing/orderSing',
            })     
        }
        wx.setNavigationBarTitle({
            title: '订单记录',
        })
        this.setData({
            role: app.commonParmas('role'),
            merchantCode: app.commonParmas('merchantCode')
        })
        this.orderInit()
    },
    billParmas: {
        pageNumber: 1,
        pageSize: 20,
        billEndTime: base.startDate(0, 'yyyyMMddhhmmss'), //new Date().Format('yyyyMMddhhmmss'),
        billBeginTime: base.startDate(15, 'yyyyMMddhhmmss'),
        merchantCode: app.commonParmas('merchantCode')
    },
    getBill(arg) {
        //获取账单
        let summary = () => {
            return api.tradeSummaryMerchant(arg.summaryParmas)
                .then(res => {
                    this.setData({
                        summary: res.statisticsList[0]
                    })
                })
        }
        let bill = () => {
            return api.bill(arg.billParmas)
                .then(res => {
                    console.log(res)
                    if (arg.isMore) {
                        let bill = this.data.bill
                        bill.orderDetails = bill.orderDetails.concat(res.orderDetails)
                        bill.pageNumber = res.pageNumber
                        let orderHasMore = (res.pageNumber == bill.totalPage) ? false : true
                        this.setData({
                            bill: bill,
                            isPageLoad: false,
                            orderHasMore: orderHasMore,
                            role: 3
                        })
                    } else {
                        this.setData({
                            bill: res,
                            isPageLoad: false,
                            role: 3
                        })
                    }
                })
        }

        if (arg.isMore || arg.isSelect) {
            bill(arg.parmas)
        } else {
            summary()
                .then(res => {
                    bill(arg.parmas)
                })
        }

    },
    summaryParmas: {
        endDate: base.startDate(0, 'yyyyMMdd'), //new Date().Format('yyyyMMddhhmmss'),
        beginDate: base.startDate(15, 'yyyyMMdd'),
        pageSize: 10,
        //  merchantCode: app.commonParmas('merchantCode')
    },
    orderInit(parmas, isMore) {
        if (app.commonParmas('role') == 0) {
            api.tradeSummaryMerchant(this.summaryParmas)
                .then(res => {
                    if (isMore) {
                        //分页加载更多
                        let _tradeMerchant = this.data.tradeMerchant
                        _tradeMerchant.statisticsList = _tradeMerchant.statisticsList.concat(res.statisticsList)
                        _tradeMerchant.pageNumber = res.pageNumber
                        let summaryHasMore = (res.pageNumber = _tradeMerchant.totalPage) ? false : true
                        this.setData({
                            summaryHasMore: summaryHasMore,
                            tradeMerchant: _tradeMerchant,
                            isPageLoad: false
                        })
                    } else {
                        this.setData({
                            tradeMerchant: res,
                            isPageLoad: false
                        })
                    }
                })
        } else {
            let summaryParmas = this.summaryParmas
            let billParmas = this.billParmas
            this.getBill({
                summaryParmas: summaryParmas,
                billParmas: billParmas
            })
        }
    },
    moreSummary() {
        this.setData({
            orderIsBottm: true
        })
        if (this.data.summaryHasMore) {
            let parmas = this.summaryParmas
            parmas.pageNumber = this.data.tradeMerchant.pageNumber + 1

            this.orderInit(parmas, true)
        }
    },
    moreBill(e) {
        this.setData({
            orderIsBottm: true
        })
        if (this.data.orderHasMore) {
            let billParmas = this.billParmas
            billParmas.pageNumber = this.data.bill.pageNumber + 1
            console.log(billParmas)
            this.getBill({
                isMore: true,
                billParmas: billParmas
            })
        }
    },
    orderPage(e) {
        // this.setData({
        //     isPageLoad: true
        // })
        // console.log(e)
        // this.getBill(e.currentTarget.id)
        wx.navigateTo({
            url: `/pages/orderSing/orderSing?id=${e.currentTarget.id}`,
        })
    },
    orderStatus(e) {
        console.log(e)
        this.setData({
            [e.target.id]: e.detail.value
        })
        let billParmas = this.billParmas

        function getValues(arr) {
            let ars = []
            for (let i in arr) {
                ars.push(i)
            }
            return ars[Number(e.detail.value) + 1]
        }
        console.log(getValues(this.data.orderStatus))
        if (e.target.id == 'orderIndex') {
            billParmas.orderStatus = getValues(this.data.orderStatus)
        } else if (e.target.id == 'payIndex') {
            billParmas.payType = getValues(this.data.payType)
        }
        console.log(billParmas)
        //billParmas.orderStatus=
        this.getBill({
            isSelect: true,
            billParmas: billParmas
        })
    },
    onReady: function() {

    },
    getOrder: function() {

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