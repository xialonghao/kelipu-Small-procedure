// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carduser:'',
    cardpass:'',
    shopadding:'',
    // focus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
    var that= this;
    that.integraltotal();
    var l=wx.getStorageSync('cardid');
    if (l)
    {
      wx.switchTab({
        url: '/pages/personal/personal'
      });
    }
    
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

  re_login:function(){
    wx.redirectTo({
      url: '../../pages/phone_login/phone_login',
    })
  },
  username:function(e){ 
    console.log(e); 
    var that = this;
    var username = e.detail.value;
    that.setData({
      carduser:username,
      // focus: false,
    })
  },
  password:function(e){
    console.log(e);
    var that = this;
    var password = e.detail.value;
    that.setData({
    cardpass:password,
    // focus: false,
    })
  },
    integraltotal:function(){
    var that = this;
      var url = "https://giftcardapp.colipu.com/apis.php/shopping/shopadding";
    var d = new Object;
    d.card_id=wx.getStorageSync('cardid');
    d.isr =that.data.spid;
    wx.request({
      url:url,
      method:'post',
      data:d,
      success:function(e){
        that.setData({
          shopadding:e.data.data
        })
      }
    })
  },
  //'https://giftcardappuat.colipu.com:9999/apis.php/login/login';
  landing:function(){
     var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/login/login";
     var d = new Object;
     d.gift_number = that.data.carduser;
     d.password = that.data.cardpass;  
    if (d.gift_number=='')
    {
      wx.showToast({
        title: '请输入卡号',
        image: '/img/icon.png',
        duration: 2000
      });return;
    } 
    if (d.password == '') {
      wx.showToast({
        title: '请输入卡密',
        image: '/img/icon.png',
        duration: 2000
      }); return;
    } 
     wx.request({
      url: url,
      method: 'post',
      data:d,
      success:function(e){
      
            if(e.data.code=='200'){
           wx.setStorageSync('cardid',e.data.id);
                wx.setStorageSync('project_id',e.data.project_id);
                wx.switchTab({
                  url:'/pages/personal/personal'
                });
              app.globalNav.currentLocation = 0;
              app.globalData.current = 0;
                return;
            }else if(e.data.code =='230'){
                wx.showToast({
                      title: e.data.msg,
                      image: '/img/icon.png',
                      duration: 2000
                  });return;
            }else if(e.data.code =='223'){
                  wx.showToast({
                      title: '积分卡已被禁用',
                      image: '/img/icon.png',
                      duration: 2000
                  });return;
            }else if(e.data.code == '201'){
                wx.showToast({    
                      title: '卡密不对',
                      image: '/img/icon.png',
                      duration: 2000
                  })
            }else if(e.data.code == '202'){
                wx.showToast({
                      title: '积分卡号不存在',
                      image: '/img/icon.png',
                      duration: 2000
                  })
            } 
      }  
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.global_view();
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
    // if (ops.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(ops.target)
    // }
    // return {
    //   title: '晨光科力普移动商城',
    //   path: 'pages/index/index',
    //   success: function(res) {
    //     // 转发成功
    //     console.log("转发成功:" + JSON.stringify(res));
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //     console.log("转发失败:" + JSON.stringify(res));
    //   }
    // }
  }
})