const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        isPageLoad: true,
        orderIsBottm: false,
        orderHasMore: true,
        searchParmas: {},
        cancelSearch: true,
        payIndex: 0,
        orderIndex: 0,
        orderStatus: {
            'NOTPAY': '未支付',
            'SUCCESS': '已完成 ',
            'REFUND': '已退款',
            'CLOSED': '已关闭',
            'REVOKED': '已撤销',
            'PAYERROR': '失败'
        },
        orderStatusSel: ['全部支付状态', '未支付', '已完成', '已退款', '已关闭', '已撤销'],
        payTypeSel: ['全部支付方式', '微信', '支付宝 ', '会员'],
        payType: {
            WXPAY: '微信',
            ALIPAY: '支付宝 ',
            MPAY: '会员'
        }
    },
    onLoad: function(options) {
        this.setData({
            merchantCode: options.id || app.commonParmas('merchantCode'),
            role: app.commonParmas('role')
        })
    },
    summaryParmas() {
        return {
            endDate: base.startDate(0, 'yyyyMMdd'), //new Date().Format('yyyyMMddhhmmss'),
            beginDate: base.startDate(15, 'yyyyMMdd'),
            pageSize: 10,
            merchantCode: this.data.merchantCode
        }
    },
    billParmas() {
        return {
            pageNumber: 1,
            pageSize: 20,
            billEndTime: base.startDate(0, 'yyyyMMddhhmmss'), //new Date().Format('yyyyMMddhhmmss'),
            billBeginTime: base.startDate(15, 'yyyyMMddhhmmss'),
            merchantCode: this.data.merchantCode
        }
    },
    getBill(arg) {
        if (arg.isSelect) {
            this.setData({
                searchLoad: true
            })
        }
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
                        let orderHasMore = (res.totalPage > 1) ? true : false
                        let bill = res.code != 'FAILED' ? res : null
                        this.setData({
                            bill: bill,
                            isPageLoad: false,
                            orderHasMore: orderHasMore,
                            searchLoad: false
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
            let billParmas = this.billParmas()
            billParmas.pageNumber = this.data.bill.pageNumber + 1
            console.log(billParmas)
            this.getBill({
                isMore: true,
                billParmas: billParmas
            })
        }
    },
    orderStatus(e) {
        console.log(e)
        this.setData({
            [e.target.id]: e.detail.value,
            orderIsBottm: false
        })
        let billParmas = this.billParmas()

        function getValues(arr) {
            let ars = []
            for (let i in arr) {
                ars.push(i)
            }
            return ars[Number(e.detail.value) - 1]
        }
        let searchParmas = this.data.searchParmas
        if (e.detail.value == 0) {
            if (e.target.id == 'orderIndex') {
                delete searchParmas.orderStatus
            } else if (e.target.id == 'payIndex') {
                delete searchParmas.payType
            }
        } else {
            if (e.target.id == 'orderIndex') {
                console.log(getValues(this.data.orderStatus))
                searchParmas.orderStatus = getValues(this.data.orderStatus)
            } else if (e.target.id == 'payIndex') {
                searchParmas.payType = getValues(this.data.payType)
            }
        }
        billParmas = Object.assign(billParmas, searchParmas)
        this.getBill({
            isSelect: true,
            billParmas: billParmas
        })
    },
    normalSearch(e) {
        this.getBill({
            billParmas: this.billParmas(),
            summaryParmas: this.summaryParmas()
        })
        this.setData({
            searchValue: "",
            cancelSearch: true,
            showSearch: false
        })
    },
    toggleSearch(e) {
        this.setData({
            showSearch: true
        })
    },
    //订单搜索
    searchOrder(e) {
        this.setData({
            orderIsBottm:false
        })
        if (e.detail.value != '') {
            let billParmas = this.billParmas()
            billParmas.outTradeNo = e.detail.value

            this.getBill({
                billParmas: billParmas,
                isSelect: true
            })
            // wx.navigateTo({
            //     url: `/pages/orderDetail/orderDetail?merchantCode=${this.data.merchantCode}&outTradeNo=${e.detail.value}`
            // })
        } else {
            wx.showToast({
                title: '请输入搜索订单号',
            })
        }
    },
    viewDetail(e) {
        let outTradeNo = e.currentTarget.dataset.detail.outTradeNo
        wx.setStorageSync("orderDetail", e.currentTarget.dataset.detail)
        wx.navigateTo({
            url: `/pages/orderDetail/orderDetail?merchantCode=${this.data.merchantCode}&outTradeNo=${outTradeNo}`
        })
    },
    onReady: function() {

    },
    onShow: function() {
        this.getBill({
            billParmas: this.billParmas(),
            summaryParmas: this.summaryParmas()
        })
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