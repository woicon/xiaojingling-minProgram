// components/Bar/Bar.js
Component({
    properties: {

    },

    data: {

    },
    options: {
        styleIsolation: 'shared'
    },
    attached() {
        console.log("attached")
        wx.getSystemInfo({
            success: (res) => {
                let model = res.model,
                    isPX = (model.indexOf("iPhone X") != -1 || model.indexOf("iPhone_X") != -1) ? true : false
                this.setData({
                    isPX,
                    headHeight: isPX ? 88 : 64,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            }
        })
    },
    methods: {

    }
})