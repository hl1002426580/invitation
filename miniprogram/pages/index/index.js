// miniprogram/pages/index/index.js
const app = getApp();
const db = wx.cloud.database();
const manager = wx.getBackgroundAudioManager();
let music_index = 0; // 当前播放索引
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isPlayingMusic: false,
    showText: false,
    music_url: [],
    swiperList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicList();
    this.getSwiperList();    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* 循环播放 */
    manager.onEnded(() => {
      if (music_index == this.data.music_url.length - 1) {
        music_index = 0;
      } else {
        music_index++;
      }
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url[music_index].url,
        title: 'music',
        coverImgUrl: ''
      })
    });
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
      showText: false
    });
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
  /* 点击播放按钮 */
  play: function () {
    if (this.data.isPlayingMusic) {
      if (music_index == this.data.music_url.length - 1) {
        wx.stopBackgroundAudio();
        music_index = 0;
        this.setData({
          isPlayingMusic: false
        });
      } else {
        music_index++;
        wx.playBackgroundAudio({
          dataUrl: this.data.music_url[music_index].url,
          title: 'music',
          coverImgUrl: ''
        });
      }

    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url[music_index].url,
        title: 'music',
        coverImgUrl: ''
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  },
  //获取背景音乐列表
  getMusicList: function () {
    const musicCollection = db.collection('musicList');
    musicCollection.get()
      .then(res => {
        let randomList = [];
        const length = res.data.length;
        for(let i=0;i<length;i++){
          const index = Math.floor(Math.random() * (res.data.length - 1));
          randomList = [...randomList, res.data[index]];
          res.data.splice(index, 1);
        }
        this.setData({
          music_url: randomList,
          isPlayingMusic: true
        });
        wx.playBackgroundAudio({
          dataUrl: this.data.music_url[music_index].url,
          title: 'music',
          coverImgUrl: ''
        });
      }).catch(err => {

      });
  },

  //获取swiper图片列表
  getSwiperList: function () {
    const swiperCollection = db.collection('invitationImgList');
    swiperCollection.get()
      .then(res => {
        this.setData({
          swiperList: res.data
        });
      }).catch(err => {

      });
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
});

