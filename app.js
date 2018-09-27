App({
    onLaunch: function() {
        //适配iPhone X
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.isPX = (res.model.indexOf("iPhone X") != -1) ? true : false
            }
        })
        this.checkLogin()
    },
    globalData: {
        userInfo: null
    },
    currPage: function() {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    commonParmas(arg) {
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
    }
})