// pages/guest/guest.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picker: {
      arr: ["0", "1", "2", "3", "4", "5"],
      index: 1,
    },
  },
  pickerChange: function (e) {
    this.setData({
      "picker.index": e.detail.value,
    });
  },

  nameChange: function (e) {
    this.checkName(e.detail.value);
  },

  phoneChange: function (e) {
    this.checkPhone(e.detail.value);
  },

  checkName: function (data) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    return this.check(data, reg, "姓名输入错误！");
  },

  checkPhone: function (data) {
    var reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    return this.check(data, reg, "手机号码输入有误！");
  },

  check: function (data, reg, errMsg) {
    if (!reg.test(data)) {
      wx.showToast({
        title: errMsg,
        icon: "none",
        duration: 1500,
      });
      return false;
    }
    return true;
  },

  formSubmit: function (e) {
    console.log(e.detail.formId);
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    if (this.checkName(name) && this.checkPhone(phone)) {
      wx.login({
        success: (res) => {
          //将表单提交到服务器，传入formId和code
          server.post({ formId: e.detail.formId, code: res.code }, () => {
            wx.showToast({
              title: "提交成功",
              icon: "success",
              duration: 1500,
            });
            //提交成功后，由服务器发送模板消息
            server.sendTemplateMessage((res) => {
              console.log("模板消息发送结果:", res.data);
            });
          });
        },
      });
    }
  },
});

//在Page()函数后面增加如下代码使用servewr对象来模拟服务器
var server = {
  appid: "wxd5fa748be0f881bc", //在此处填写自己的appid
  secret: "5a18921130d98c061470e16d35e63b60", //在此处填写自己的secret
  //用于保存用户的openId和formid
  user: { openid: "", formId: "" },
  //用于接收表单，调用this.getOpenid()根据code获取openid
  post: function (data, success) {
    console.log("收到客户端提交的数据:", data);
    this.user.formId = data.formId;
    this.getOpenid(data.code, (res) => {
      console.log("用户openid:" + res.data.openid);
      this.user.openid = res.data.openid;
      success();
    });
  },
  //用于根据code获取openid
  getOpenid: function (code, success) {
    wx.request({
      url: "https//api.weixin.qq.com/sns/jscode2session",
      data: {
        appid: this.appid,
        secret: this.secret,
        grant_type: "authorization_code",
        js_code: code,
      },
      success: success,
    });
  },
  //用于发送模板消息
  sendTemplateMessage: function (success) {
    var user = this.user;
    var data = {
      touser: user.openid,
      template_id: "CyK2StPOxv2Pxihuy2_BFdWgr53xCw0w8A63UoULoRM",
      page: "index",
      form_id: user.formId,
      data: {
        keyword1: { value: "王明，张利" },
        keyword2: { value: "谢谢你的祝福" },
        keyword3: { value: "2018-09-12 20:33:33" },
        keyword4: { value: "北京市" },
      },
    };
    this.getAccessToken((res) => {
      var token = res.data.access_token;
      console.log("服务器access_token:" + token);
      var url =
        "https//api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" +
        token;
      wx.request({ url: url, method: "post", data: data, success: success });
    });
  },
  //用于获取access_token
  getAccessToken: function (success) {
    var url =
      "https//api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" +
      this.appid +
      "&secret=" +
      this.secret;
    wx.request({ url: url, success: success });
  },
};
