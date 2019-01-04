import types from './utils/types'
App({
    onLaunch() {
        //适配iPhone X
        console.log(types)
        this.updateManager()
        wx.getSystemInfo({
            success: (res) => {
                let isPX = (res.model.indexOf("iPhone X") != -1) ? true : false
                this.isPX = isPX
                this.systemInfo = {
                    isPX: isPX,
                    headHeight: isPX ? 88 : 64,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                }
            }
        })
        this.types = types
        this.base = require('./utils/util.js')
        this.checkLogin()
    },
    globalData: {
        userInfo: null
    },
    currPage: function() {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    commonParams(arg) {
        try {
            let login = wx.getStorageSync("login")
            return login[arg]
        } catch (error) {
            console.log(error)
        }
    },
    checkLogin() {
        if (!wx.getStorageSync("login")) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    },
    //检测更新
    updateManager() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log("是否有更新??===",res.hasUpdate)
        })
        updateManager.onUpdateReady(() => {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(() => {
            // 新版本下载失败
            wx.showToast({
                title: '新版本下载失败',
                icon: "none"
            })
        })
    },
})