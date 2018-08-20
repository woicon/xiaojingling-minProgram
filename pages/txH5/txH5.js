// pages/txH5/txH5.js
Page({

    data: {

    },

    onLoad: function(options) {
        console.log(options)
        let bagList = wx.getStorageSync("bag")
        for(let i in bagList){
            bagList[i].endNum = bagList[i].balanceAccount.substr(bagList[i].balanceAccount.length - 4)
        }
        let url = wx.getStorageSync("rsurl")
        let pant = new RegExp("http://jhzs.kshbank.cn:90","g")
        let urls = url.replace(pant, "https://kshbank.liantuobank.com")
        console.log(urls)
        this.setData({
            bag: bagList,
            url: urls
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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})