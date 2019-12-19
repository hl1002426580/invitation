// miniprogram/pages/comment/index.js
const moment = require('../../util/moment.min.js');
const db = wx.cloud.database();
moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm:ss",
  }
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //获取用户信息
  getuserInfo: function () {
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
        this.save();
      },
      fail: (err) => {
        wx.showToast({
          title: '请先授权用户信息',
          icon: 'none'
        })
      }
    })
  },
  clickSave: function(e) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          return;
        } else {
          this.setData({
            userInfo: e.detail.userInfo
          });
          this.save();
        }

      },
    });
  },
  save: function () {
    if(this.data.inputValue&&this.data.inputValue.length){
      if(this.data.inputValue.length>100){
        wx.showToast({
          title: "祝福语不能超过100字哦",
          icon: "none"
        })
        return;
      }
      const time = moment().format("L");
      const comment = db.collection("commentList");
      const userInfo = this.data.userInfo;
      wx.showLoading({
        title:"提交中",
        mask:true
      });
      comment.add({
        data:{
          img: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          createTime: time,
          content: this.data.inputValue
        }
      }).then(res => {
        wx.reLaunch({
          url:"../greet/index"
        });
      }).finally(() => {
        wx.hideLoading();
      })
    }else{
      wx.showToast({
        title:"你还没有输入内容哦",
        icon:"none"
      })
    }
  },

  inputSuccess: function (event) {
    const value = event.detail.value;
    if(value&&value.length){
      this.setData({
        inputValue:value
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '韩磊 & 张婷婷 的婚礼邀请',
      path: '/pages/index/index',
      imageUrl: '../../images/share.jpg'
    }
  }
})