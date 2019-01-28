// pages/integral/integral.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:{},
      ss:'',
    onfi: '',
    project_info:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
      this.shows();

  },

  //积分卡被禁用后调用的函数(让其跳转登录页)
  global_view: function () {
    var url = 'https://giftcardapp.colipu.com/apis.php/login/Cardexpired';
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        if (e.data.code == '200') {
          wx.showModal({
            title: '温馨提示:',
            content: e.data.msg,
            // confirmText: '确定',
            complete: function () { //complete: 接口调用结束的回调函数（调用成功、失败都会执行）
              wx.switchTab({
                url: '/pages/personal/personal'
              });
            }
          })
          // return;
          wx.clearStorageSync(); //清楚登录缓存
        }
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  shows:function(){
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/integral"
    var d = new Object();
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
        url:url,
        method:"post",
        data:d,
        success:function(e){
          if(e.data.code=='200'){
              var list = e.data.data;
             // var ss = e.data.ss;
              var onfi = e.data.onfi;
              that.setData({
                list:list,
                project_info: e.data.project_info,
                onfi: onfi
              })
            console.log(list);
          }
        }
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.global_view();
    // if (wx.getStorageSync('cardid') == ''){
    //   wx.reLaunch({
    //     url: '/pages/personal/personal'
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '晨光科力普移动商城',
      path: 'pages/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})