// miniprogram/pages/photo/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList:[],
    likeNum:0, // 点赞总数
    initLikeStatus: false,
    liked: false, // 是否已点赞
    openId: '',
    showText: false //是否显示情话文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhotoList();
    wx.cloud.callFunction({
      name:'login'
    }).then(res=>{
      this.setData({
        openId: res.result.openid
      });
      this.getLikeInfo();
    });
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
    this.setData({
      showText: true
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      showText:false
    });
    const {initLikeStatus,liked} = this.data;
    if(initLikeStatus!=liked){
      this.updateLikeInfo();
    }
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
  //获取点赞信息
  getLikeInfo: function () {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'getLikeInfo',
      data: {
        openId: this.data.openId
      }
    }).then(res => {
      console.log(res.result.data);
      const { data } = res.result;
      const find = data.find(item => item.openId == this.data.openId);
      this.setData({
        initLikeStatus: find ? true : false,
        liked: find ? true : false,
        likeNum: data.length || 0
      });
      wx.hideLoading();
    },err=>{
      wx.hideLoading();
    });
  },
  // 更新数据库点赞信息
  updateLikeInfo: function () {
    const { initLikeStatus,liked } = this.data;
    if(initLikeStatus == liked){
      return;
    }
    wx.cloud.callFunction({
      name:'setLikeStatus',
      data:{
        type: liked ? 'add' : 'cancel',
        openId: this.data.openId
      }
      
    }).then(res=>{
      this.setData({
        initLikeStatus:liked
      })
    })
  },
  //（取消）点赞
  setLikeStatus: function () {
    const { liked,likeNum } = this.data;
    this.setData({
      likeNum: liked ? likeNum - 1 : likeNum + 1,
      liked: !liked
    });
  },
  // 获取相册列表
  getPhotoList: function () {
    const swiperCollection = db.collection('photoList');
    swiperCollection.get()
      .then(res => {
        this.setData({
          photoList: res.data
        });
      }).catch(err => {

      });
  },
  // 图片放大预览
  preview: function(event) {
    const currentIndex = event.currentTarget.dataset.index;
    const urls = this.data.photoList.map(photo => photo.url);
    wx.previewImage({
      urls,
      current: urls[currentIndex]
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'XXX & XXX 的婚礼邀请',
      path: '/pages/index/index',
      imageUrl: '../../images/share.png'
    }
  }
})