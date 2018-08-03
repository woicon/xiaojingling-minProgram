App({
    onLaunch: function() {
        //适配iPhone X
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.isPX = (res.model.indexOf("iPhone X") != -1) ? true : false
            }
        })
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        this.checkLogin()
    },
    globalData: {
        userInfo: null
    },
    currPage: function () {
        let _curPageArr = getCurrentPages()
        return _curPageArr[_curPageArr.length - 1]
    },
    commonParmas(arg){
        let login = wx.getStorageSync("login")
        return login[arg]
    },
    checkLogin(){
        if(!wx.getStorageSync("login")){
            console.log("sdf")
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    }
})