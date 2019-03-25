// components/Scrolls/Scrolls.js
Component({
    properties: {
        listloading:{
            type:Boolean,
            value:true
        }
    },
    data: {

    },
    lifetimes:{
        attached(){
            console.log("ss")
        },
        created(){
            console.log("created:::")
        }
    },
    attached(e) {
        console.log("ssttt")
    },
    created() {
        console.log("created:::")
    },
    methods: {
        scrolltolower(e){
            console.log("scrolltoLower", e)
            this.setData({
                isToTop:true,
            })
            this.triggerEvent('scrolltoLower', e)
        },
        scrolltoupper(e) {
            this.setData({
                isToBottom: true,
            })
            console.log("scrollToupper",e)
            this.triggerEvent('scrolltoupper', e)
        },
    }
})
