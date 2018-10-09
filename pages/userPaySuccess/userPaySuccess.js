Page({
    data: {
        endTxt: 0,
        isComment:false
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '支付完成'
        })
    },
    selectStar(e) {
        console.log(e)
        let startId = e.currentTarget.dataset.id,
            star = e.currentTarget.dataset.star
        let lightStar = []
        for (let i = 0; i < star; i++) {
            lightStar.push(i <= startId ? true : false)
        }
        this.setData({
            lightStar: lightStar,
            comment:true
        })
    },
    commentTxt(e){
        let endTxt = e.detail.value.length
        if (endTxt<=140){
            this.setData({
                commentTxt:e.detail.value,
                endTxt: endTxt
            })
        }else{
            wx.showToast({
                title: '留言字数不能大于140',
            })
        }
    },
    sendComment(){
        wx.showModal({
            title: '完成',
            content: '感谢评价！',
        })

        this.setData({
            isComment:true
        })
    }
})