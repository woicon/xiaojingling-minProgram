let app = getApp()
const api = require('../../openApi/api.js')
const qrcode = require('../../libs/qrcode/code.js')
console.log(app)
Page({
    data: {
        loading:true,
        role:app.commonParams('role')
    },
    onLoad(options) {
        if(options.code){
            this.setData({
                qrCode: options.code,
                loading: false
            })
        }else{
            api.getPayQrcode(merchantCode).then(res => {
                this.setData({
                    qrCode: res.url,
                    loading: false
                })
            })
        }
    },
    onReady(){
        wx.showLoading()
        setTimeout(()=>{
            qrcode.creatPayCode(this.data.qrCode, "qrCode", 250, 250, 98);
        },1200)
    },
    saveFile(e){
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 500,
            height: 700, 
            destWidth: 500,
            destHeight: 700,
            canvasId: "qrCode",
            success: (res) => {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                    filePath:res.tempFilePath,
                    success:(img)=>{
                        app.tip('收款码已保存到相册')
                    }
                })
            }
        })
    },
    clipboardCode(){
        wx.setClipboardData({
            data: this.data.qrCode,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        app.tip('收款码复制成功')
                    }
                })
            }
        })
    },
    onShareAppMessage() {

    }
})