const sign = require('../../libs/getSign/getSign.js')
const base = require('../../utils/util.js')
const api = require('../../openApi/api.js')
const app = getApp()

Page({
    data: {
        ids: "", //07863
        audioList: null,
        addForm: false,
        isPageLoad: true
    },
    onLoad: function(options) {
        this.checkAudio()
        wx.setNavigationBarTitle({
            title: '云喇叭设置',
        })
    },
    bindCode() {
        this.bindAudio("BIND")
    },
    unBindCode: function(e) {
        let selItem = this.data.audioList[e.target.id]
        this.setData({
            ids: selItem.speakerid
        })
        wx.showModal({
            title: '提示',
            content: `您确定要解除该喇叭盒子(${selItem.speakerid})的绑定吗？`,
            success: (res) => {
                if (res.confirm) {
                    this.codes("UNBIND")
                        .then(res => {
                            console.log(res)
                            wx.hideLoading()
                            if (res.code == "SUCCESS") {
                                wx.showToast({
                                    title: res.message,
                                    icon: "none"
                                })
                                this.checkAudio()
                            }
                        })
                }
            },

        })
        console.log(e)
        //this.bindAudio(0)
    },
    bindAudio: function(status) {
        console.log(this.data.ids)
        if (status == "UNBIND") {
            if (this.data.ids && this.data.ids != '') {
                this.codes(status)
                    .then(res => {
                        this.setData({
                            tid: '',
                            addForm: false
                        })
                    })
            }
        } else if (status == "BIND") {
            if (this.data.ids && this.data.ids != '') {
                this.codes(status)
                    .then(res => {
                        wx.hideLoading()
                        console.log(res)
                        if (res.code == "FAILED") {
                            wx.showToast({
                                title: `${res.msg},${res.subMsg}`,
                                icon: 'none'
                            })
                        } else if (res.code == "SUCCESS") {
                            this.checkAudio()
                            this.setData({
                                tid: '',
                                ids: '',
                                addForm: false
                            })
                        }
                    })
            } else {
                wx.showToast({
                    title: '请输入产品ID',
                    icon: 'none'
                })
            }
        }

    },
    codes: function(status) {
        wx.showLoading()
        var parmas = {
            bindCode: app.commonParmas("merchantCode"),
            status: status,
            speakerId: this.data.ids,
            appId: app.commonParmas("merchantCode")
        }
        return api.bindYunlaba(parmas)
    },
    inputId(e) {
        console.log(e)
        this.setData({
            ids: e.detail.value,
            tid: e.detail.value
        })
    },
    checkAudio() {
        let that = this
        wx.request({
            url: 'https://ylb1.top/list_bind.php',
            data: {
                token: "5032g0BL2tdi",
                uid: app.commonParmas("merchantCode")
            },
            success: (res) => {
                var audioList = null
                if (res.errcode == 6) {} else if (res.data.records) {
                    var audioList = res.data.records
                }
                that.setData({
                    audioList: audioList
                })
            },
            complete: () => {
                this.setData({
                    isPageLoad: false
                })
            }
        })
    },
    toggleAdd() {
        this.setData({
            addForm: !this.data.addForm,
            tid: '',
            ids: ''
        })
    },
    onReady: function() {

    },
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
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