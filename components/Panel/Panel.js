// components/Panel/Panel.js
Component({
    properties: {
        showClose: {
            type: Boolean,
            value: true
        },
        status: {
            type: Boolean,
            value: true
        }
    },
    data: {

    },
    created(){
        console.log("created")
    },
    attached(){
        console.log("attached")
    },
    detached(){
        console.log("detached")
    },
    observers(){

    },
    methods: {
        close(e) {
            this.setData({
                status: false
            })
            this.triggerEvent('close', e)
        }
    }
})