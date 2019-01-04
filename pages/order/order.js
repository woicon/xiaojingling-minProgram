const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        isPageLoad: true,
        summaryHasMore: true,
        orderIsBottm: false,
        orderHasMore: true,
        searchParmas: {},
        cancelSearch: true,
        payIndex: 0,
        orderIndex: 0,
        orderStatus: {
            'NOTPAY': '未支付',
            'SUCCESS': '已支付',
            'REFUND': '已退款',
            'CLOSED': '已关闭',
            'REVOKED': '已撤销',
            'PAYERROR': '失败'
        },
        orderStatusSel: ['全部支付状态', '未支付', '已支付', '已退款', '已关闭', '已撤销'],
        payTypeSel: ['全部支付方式', '微信', '支付宝 ', '会员'],
        payType: {
            WXPAY: '微信',
            ALIPAY: '支付宝 ',
            MPAY: '会员'
        }
    },
    onLoad: function(options) {
        app.checkLogin()
        wx.setNavigationBarTitle({
            title: '交易流水',
        })
        this.setData({
            orderIndex: 2,
            searchParmas: {
                orderStatus: "SUCCESS"
            }
        })
    },

    orderInit(parmas, isMore) {
        let sumparmas = this.summaryParmas()
        delete sumparmas.merchantCode
        console.log(sumparmas)
        return api.tradeSummaryMerchant(sumparmas)
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
                    let summaryHasMore = (res.totalPage > 1) ? true : false
                    this.setData({
                        summaryHasMore: summaryHasMore,
                        tradeMerchant: res,
                        isPageLoad: false
                    })
                }
            })

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

    /*============orderSing=============*/
    summaryParmas() {
        return {
            endDate: base.startDate(0, 'yyyyMMdd'), //new Date().Format('yyyyMMddhhmmss'),
            beginDate: base.startDate(1, 'yyyyMMdd'),
            pageSize:18,
            merchantCode: this.data.merchantCode
        }
    },
    billParmas() {
        let parmas = {
            pageNumber: 1,
            pageSize:20,
            billEndTime: base.startDate(0, 'yyyyMMddhhmmss'), //new Date().Format('yyyyMMddhhmmss'),
            billBeginTime: base.startDate(30, 'yyyyMMddhhmmss'),
            merchantCode: this.data.merchantCode
        }
        //角色 0总部 1门店 2员工 3店长
        if (this.data.role == 2) {
            parmas.operatorId = app.commonParams("operatorId")
        }
        let _parmas = Object.assign(parmas, this.data.searchParmas)
        return _parmas
    },
    getBill(arg) {
        console.log(arg)
        if (arg.isSelect) {
            this.setData({
                searchLoad: true
            })
        }
        //获取账单
        let summary = () => {
            console.log(arg.summaryParmas)
            return api.tradeSummaryMerchant(arg.summaryParmas)
                .then(res => {
                    this.setData({
                        summary: res.statisticsList[0]
                    })
                })
        }

        function toDate(bill) {
            if (bill) {
                let str = bill.orderDetails
                for (let i in str) {
                    if (str[i].payTime) {
                        str[i].payTime = base.strDateFormat(str[i].payTime)
                    }
                }
            }
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
                        toDate(bill)
                        this.setData({
                            bill: bill,
                            isPageLoad: false,
                            orderHasMore: orderHasMore,
                            role: 3
                        })
                    } else {
                        let orderHasMore = (res.totalPage > 1) ? true : false
                        let bill = res.code != 'FAILED' ? res : null
                        toDate(bill)
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
        this.setData({
            [e.target.id]: e.detail.value,
            orderIsBottm: false,
        })
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
        this.setData({
            searchParmas: searchParmas
        })
        let billParmas = this.billParmas()
        this.getBill({
            isSelect: true,
            billParmas: billParmas
        })
    },
    normalSearch(e) {
        this.setData({
            searchValue: "",
            cancelSearch: true,
            showSearch: false,
            searchParmas: wx.getStorageSync("tempSearchParmas"),
        })
        this.getBill({
            billParmas: this.billParmas(),
            summaryParmas: this.summaryParmas()
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
            orderIsBottm: false
        })
        if (e.detail.value != '') {
            wx.setStorageSync("tempSearchParmas", this.data.searchParmas)
            this.setData({
                searchParmas:{}
            })
            let billParmas = this.billParmas()
            billParmas.outTradeNo = e.detail.value
            this.getBill({
                billParmas: billParmas,
                isSelect: true
            })
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
    orderPage(e) {
        wx.navigateTo({
            url: `/pages/orderSing/orderSing?id=${e.currentTarget.id}`,
        })
    },
    onReady: function() {

    },
    onShow() {
        let role = app.commonParams("role")
        this.setData({
            role: app.commonParams('role'),
            merchantCode: app.commonParams('merchantCode')
        })
        if (role == 0) {
            this.orderInit()
        } else {
            this.getBill({
                billParmas: this.billParmas(),
                summaryParmas: this.summaryParmas()
            })
        }
    }
})