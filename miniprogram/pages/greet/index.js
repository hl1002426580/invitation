// miniprogram/pages/greet/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    pageSize: 20,
    pageLoading: true,
    pageNo: 1,
    showDel:true,
    canScroll: true,
    isPullRefresh: false,
    openid:"",
    allowDel: false,
    pressIndex: -1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommontList(this.data.pageNo);
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
    this.setData({
      isPullRefresh:true,
      pageNo: 1,
      canScroll: true
    });
    this.getCommontList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { total, pageSize, pageNo, commentList, canScroll } = this.data;
    if(!canScroll) return;
    const maxPage = total % pageSize > 0 ? total/pageSize+1 : total/pageSize;
    if(pageNo === maxPage){
      this.setData({
        canScroll:false
      });
      return;
    }
    this.getCommontList(pageNo+1);
    this.setData({
      pageNo: pageNo+1
    });
  },
  // 获取删除权限
  getDelAuth: function () {
    const auth = db.collection("authList");
    auth.get().then(res=>{
      const find = res.data.find(item => item.openId === this.data.openid);
      if(find){
        this.setData({
          allowDel:true
        });
      }
    })
  },
  //长按显示删除按钮
  showDelBtn: function(event) {
    if(this.data.pressIndex>-1){
      this.setData({
        pressIndex: -1
      });
    }else{
      const index = event.currentTarget.dataset.index;
      this.setData({
        pressIndex: index
      });
    }
    
  },
  //删除评论
  delComment: function () {
    const thisdb = db.collection('commentList');
    const id = this.data.commentList[this.data.pressIndex]._id;
    wx.showLoading({
      title: "删除中",
      mask: true
    });
    wx.cloud.callFunction({
      name:'delComment',
      data:{
        id
      }      
    }).then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: "删除成功"
      });
      this.setData({
        pressIndex: -1
      });
      this.getCommontList(1);
    }, err => {
        wx.hideLoading();
        wx.showToast({
          title: "失败",
          icon: 'none'
        });
    });
  },
  gotoComment: function () {
    wx.navigateTo({
      url: '../comment/index'
    });
  },
  // 获取评论列表
  getCommontList: function(pageNo) {
    const pageSize = this.data.pageSize;
    this.setData({
      pageLoading: true
    });
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    wx.cloud.callFunction({
      name:"getCommentList",
      data:{
        pageNo,
        pageSize,
      }
    }).then(res => {
      const { total,data,openid } = res.result;
      if(pageNo == 1){ // 刷新清空数据
        this.setData({
          commentList:[]
        })
      }
      this.setData({
        commentList: [...this.data.commentList, ...data],
        total,
        openid,
        pageLoading: false
      });
      if(data.length < pageSize){
        this.setData({
          canScroll: false
        });
      }
      if (this.data.isPullRefresh){
        wx.stopPullDownRefresh();
        this.setData({
          isPullRefresh:false
        });
      }
      this.getDelAuth();
      wx.hideLoading();
    },err => {
      wx.hideLoading();
      this.setData({
        pageLoading: false
      });
    });
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