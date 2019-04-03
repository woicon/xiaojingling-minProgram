import types from './utils/types'
App({
    onLaunch() {
        //适配iPhone X //role  0总部 1门店 2员工 3店长
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
        // let nod = require('./libs/aes/public.js')
        // console.log(nod, nod.Decrypt('ALhHd7bcTjj6/5cynbPaj9cx4TkC9n7RyXBvPWi56hGItdZwo+r+B6nP0GuqvvLE16gVgPftaWBSE/MuazlFLMG6FknZnIUYDnuFsH6PUw8qjnYP9qYSPbadICzlS6JDFKwVRQpwPjXnxh1mF1b9Kg=='))
       
    },
    globalData: {
        userInfo: null
    },
    currPage() {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    commonParams(arg) {
        try {
            let login = wx.getStorageSync("login")
            return login[arg]
        } catch (error) {
            wx.redirectTo({
                url: '/pages/login/login',
            })
        }
    },
    checkLogin() {
        if (!wx.getStorageSync("login")) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
        console.log('s')
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
    tip(title){
        wx.showToast({
            title: title,
            icon:'none'
        })
    },
    //截取URL参数
    getQueryString(url) {
        let str = url.split('?')
        let arr = str[1].split("&")
        let obj = {}
        for (let i = 0; i < arr.length; i++) {
            let num = arr[i].indexOf("=")
            if (num > 0) {
                obj[arr[i].substring(0, num)] = arr[i].substr(num + 1)
            }
        }
        return obj
    }
})