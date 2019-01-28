// pages/order/order.js
var server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus : 0 ,
    orderList   : null,
    project_info:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
    var that = this;

    that.setData({
      orderStatus: options.status
    });

 
    //请求订单列表
    that.orderlist(that.data.orderStatus);
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
    
  //切换订单状态tab
  nclickStatus: function (e)
  {
    this.global_view();
    var that = this;
   

    if (e.currentTarget.id === that.data.orderStatus)
    {
      return false;
    }
    else
    {
      that.setData({
        orderStatus: e.currentTarget.id
      });
    }
    //调用订单列表
    that.orderlist(that.data.orderStatus);

  },

  //订单列表
  orderlist: function(e){
    var cardid = wx.getStorageSync('cardid'); //卡id
    var that   = this;
    server.getJSON("/order/order_list?card_id="+cardid+"&order_status=" + that.data.orderStatus  , function (res) {
    
      if(res.data.code=='200')
      {
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 500,
          success: function (e) { //接口调用成功的回调函数
          console.log(res.data.data);
            that.setData({
              project_info: res.data.data[0],
              orderList: res.data.data[1]
            });
            console.log(that.data.orderList)
          }, 
          fail: function (e) {
            console.log(e);
           },  //接口调用失败的回调函数
        });
       
      }
      else
      {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 1000
        });

        that.setData({
          orderList: null
        });

      }
        
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
    // this.global_view();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '晨光科力普移动商城',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})