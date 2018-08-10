const api = require('../../openApi/api.js')
const base = require('../../utils/util.js')
let app = getApp()
Page({
    data: {
        isPageLoad: true,
        btnLoading:false,
        orderStatus: {
            'NOTPAY': '未支付',
            'SUCCESS': '已完成',
            'REFUND': '已退款',
            'CLOSED': '已关闭',
            'REVOKED': '已撤销',
            'PAYERROR': '失败'
        },
        orderStatusSel: ['全部支付状态', '未支付', '已完成', '已退款', '已关闭', '已撤销'],
        payTypeSel: ['全部支付方式', '微信', '支付宝', '会员'],
        payType: {
            WXPAY: '微信',
            ALIPAY: '支付宝',
            MPAY: '会员'
        }
    },

    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '订单详情',
        })
        this.setData({
            checkParmas: options,
            detail: wx.getStorageSync("orderDetail"),
            isPageLoad: false,
            role: app.commonParmas('role')
        })
    },
    checkOrder() {
        api.payQuery(options)
            .then(res => {
                console.log(res)
                this.setData({
                    isPageLoad: false,
                    detail: res
                })
            })
    },
    clipOrderNo: function(e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.id,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        console.log(res.data)
                    }
                })
            }
        })
    },
    // goRefund(e) {
    //     this.setData({
    //         btnLoading: true
    //     })
    // },
    goRefund: function (e) {
        console.log(this.data.detail)
        wx.setStorageSync("refundDetail", this.data.detail)
        wx.redirectTo({
            url: '/pages/refund/refund',
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})