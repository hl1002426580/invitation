// miniprogram/pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id: 0,
      latitude: 37.507225,
      longitude: 111.129695,
      width: '60rpx',
      height: '60rpx',
      iconPath: '../../images/address.png',
      label: {
        content: '龙凤宴酒店',
        fontSize: 14,
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
        color: '#333',
        bgColor: '#fff',
        anchorX: -45,
        anchorY: -60
      },
      alpha: 0.9
    }],
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
  gotohere: function (res) {
    const markers = res.currentTarget.dataset.markers;
    const long = markers[0].longitude;
    const lat = markers[0].latitude;
    const name = markers[0].label.content;
    wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
      latitude: lat,
      longitude: long,
      name: name,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  linkHe: function () {
    wx.makePhoneCall({
      phoneNumber: '18301932467'
    })
  },

  linkShe: function () {
    wx.makePhoneCall({
      phoneNumber: '15955019309'
    })
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