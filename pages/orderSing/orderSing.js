const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        isPageLoad: true,
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
        console.log(options)
        this.setData({
            merchantCode: options.merchantCode
        })
        this.getBill({
            billParmas: this.billParmas,
            summaryParmas:this.summaryParmas
        })
    },
    summaryParmas: {
        endDate: base.startDate(0, 'yyyyMMdd'), //new Date().Format('yyyyMMddhhmmss'),
        beginDate: base.startDate(15, 'yyyyMMdd'),
        pageSize: 10,
        merchantCode: app.commonParmas('merchantCode')
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