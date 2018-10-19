let app = getApp()
Page({
    data: {
        totalPrice: "0",
        priceEmpty: true,
        keyborad:true,
        showMark:false
    },
    toPay(){
        wx.navigateTo({
            url: '/pages/userPaySuccess/userPaySuccess',
        })
    },
    addRemark(){
        this.setData({
            showRemark:true
        })
    },
    onLoad: function(options) {

    },
    onReady: function() {

    },
    onShow() {
        this.getInfo()
    },
    onHide: function() {

    },
    getInfo() {
        this.setData({
            isPX: app.systemInfo.isPX,
            btnHeight: app.systemInfo.windowWidth / 4.2
        })
    },
    showKeybord(){
        this.setData({
            keyborad:true
        })
    },
    resRemark(){
        this.setData({
            showRemark:false
        })
    },
    newRemark(){
        this.setData({
            showRemark: false
        })
    },
    touchKey: function(e) {
        let that = this
        let total = that.data.totalPrice
        console.log(typeof total, total)
        let num = e.currentTarget.dataset.number
        console.log(num)
        let decimalReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        let _total = `${total}${num}`
        let nums = (num == "00" && total == "0") ? total : num
        console.log(nums)
        let newTotal = total == "0" ? nums != '.' ? nums : "0." : decimalReg.test(_total) ? _total : total

        this.setData({
            priceEmpty: false,
            totalPrice: newTotal.length < 8 ? newTotal : total
        })
    },
    toggleKeybord(e){
        this.setData({
            keyborad: !this.data.keyborad
        })
    },
    showKeybord(){
        this.setData({
            keyborad: true
        })
    },
    delNumber: function () {
        let totals = this.data.totalPrice
        let strTotals = totals.toString()
        let totalsLength = strTotals.length
        let totalPrice = strTotals.substring(0, totalsLength - 1)
        this.setData({
            priceEmpty: totalPrice.length == 0 ? true : false,
            totalPrice: totalPrice == '' ? "0" : totalPrice
        })
    },
    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    }
})