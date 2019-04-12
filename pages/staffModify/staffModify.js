const app = getApp()
const api = require('../../openApi/api.js')
Page({
    data: {
        sex: ["男", '女'],
        loading: true,
        viewPassword: false,
        status: ["删除", "启用", "禁用"]
    },
    onLoad(options) {
        if (options.id) {
            this.employeeQuery(options.id).then(r => {
                this.employeeRoles()
            })
            wx.setNavigationBarTitle({
                title: '编辑员工信息',
            })
        } else {
            this.employeeRoles()
        }
    },
    employeeQuery(id) {
        return api.employeeQuery({
            operatorId: id,
            merchantCode: app.commonParams('merchantCode')
        }).then(res => {
            wx.hideLoading()
            let detail = res.employeeInfo
            detail.sexIndex = Number(detail.sexId) - 1
            this.setData({
                detail: res.employeeInfo
            })
        })
    },
    employeeRoles() {
        api.employeeRoles({
            merchantCode: app.commonParams('merchantCode')
        }).then(data => {
            this.setData({
                roleList: data.roleList,
                loading: false
            })
        })
    },
    changeRole(e) {
        console.log(e)
        this.setData({
            roleValue: e.detail.value
        })
    },
    changeSex(e) {
        if (!this.data.detail) {
            this.setData({
                sexId: Number(e.detail.value) + 1,
                sexIndex: e.detail.value
            })
        } else {
            let detail = this.data.detail
            detail.sexId = Number(e.detail.value) + 1
            detail.sexIndex = e.detail.value
            this.setData({
                detail
            })
        }
    },
    checkForm(item) {
        let check = false
        if (item.operatorName == "") {
            app.tip("请输入员工姓名")
        } else if (item.loginName.length < 6) {
            app.tip("登录名的长度在6 - 30位间")
        } else if (item.mobile == '') {
            app.tip("请输入手机号")
        } else if (!app.base.reg.mobile(item.mobile)) {
            app.tip("请输入正确的手机号")
        } else if (item.password == "") {
            app.tip("请输入密码")
        } else if (item.loginName == "") {
            app.tip("请输入登录名")
        } else {
            check = true
        }
        return check
    },
    inputPassword(e) {
        let password = e.detail.value
        this.setData({
            password
        })
        console.log(app.base.reg.password(password))
    },
    passwordBlur(e) {
        if (!app.base.reg.password(e.detail.value)) {
            app.tip('密码为6-20位的字符，需由数字、大小写字母及符号中的至少两种组成')
        }
    },
    viewPassword(e) {
        this.setData({
            viewPassword: !this.data.viewPassword
        })
    },
    employeeAdd(params) {
        wx.showLoading()
        params.merchantCode = app.commonParams('merchantCode')
        api.employeeAdd(params).then(res => {
            console.log(res)

            questRes(res)
        })
    },
    addSatff(e) {
        let params = e.detail.value
        console.log(params)
        if (this.checkForm(params)) {
            for (let i in params) {
                if (params[i] == null || params[i] == '') {
                    delete params[i]
                }
            }
            this.employeeAdd(params)
        }
    },
    questRes(res) {
        wx.hideLoading()
        if (res.code.code == 'SUCCESS') {
            wx.navigateBack()
        }
        if (res.subMsg) {
            wx.showModal({
                title: res.msg,
                content: res.subMsg,
                showCancel: false,
                confirmColor: '#0ec695'
            })
        } else {
            app.tip(res.msg)
        }
    },
    editStaff(e) {
        wx.showLoading()
        let params = e.detail.value
        api.employeeModify({
            merchantCode: app.commonParams('merchantCode'),
            operatorId: this.data.detail.operatorId
        }).then(res => {
            this.questRes(res)
        })
    },
    changeStatus(e) {
        let detail = this.data.detail
        detail.status = e.detail.value
        this.setData({
            detail
        })
    }
})