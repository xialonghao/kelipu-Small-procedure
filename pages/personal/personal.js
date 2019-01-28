// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    login: 0,
    setmeal: '',
    project_info: [],
    order_num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.global_view();

    // if (wx.getStorageSync('cardid') == '') {
    //   wx.switchTab({
    //     url: '/pages/personal/personal'
    //   });
    // }

    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
    var that = this;
    that.reveal();
    // that.setmeal();

    //  that.login();
  },
  //  套餐
  setmeal: function () {
    console.log(1)
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/setmealka"
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    d.project_id = wx.getStorageSync('project_id');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        console.log(e);
        if (e.data.code == '260') {
          console.log(1)
          //  that.onShow();
          that.setData({
            setmeal: 1,
            unit: e.data.unit[0],
          })

        } else {
          that.reveal();
        }
      }
    })
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



  login: function () {
    var that = this;
    if (wx.getStorageSync('cardid')) {
      that.setData({
        login: 1
      });
    } else {
      that.setData({
        login: 0
      });
      wx.navigateTo({
        url: '../../pages/login/login'
      })
    }
  },
  reveal: function () {
    var that = this;
    var url = 'https://giftcardapp.colipu.com/apis.php/login/cardread';
    var d = new Object;
    d.cardid = wx.getStorageSync('cardid');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        if (e.data.code == '200') {
          var list = e.data;
          //   console.log(list);             
          that.setData({
            list: e.data.data,
            project_info: e.data.project,
            order_num: e.data.order_num
          });
        }

      }
    })
  },
  //订单判断是否登录
  nclickStatus: function (e) {
    this.global_view();

    var that = this;
    that.login();

    if (that.data.login == '1') {
      wx.navigateTo({
        url: '../../pages/order/order?status=' + e.currentTarget.id
      })
    } else {
      console.log(2);
    }

  },
  //我的卡栏目 - 积分栏目 - 地址栏目  验证登录
  nclickMyLogin: function (e) {
    this.global_view();
    var that = this;
    that.login();
    if (that.data.login == '1') {
      var url = e.currentTarget.id
      wx.navigateTo({
        url: url
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // if (wx.getStorageSync('cardid') == '') {
    //   wx.switchTab({
    //     url: '/pages/personal/personal'
    //   });
    // }
    // this.global_view();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(11);
    //   var that = this;
    // if (wx.getStorageSync('cardid') == ''){
    //   wx.switchTab({
    //     url: '/pages/personal/personal'
    //   });
    // }

    this.reveal();
    this.setmeal();

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
    // if (wx.getStorageSync('cardid') == ''){
    //   wx.clearStorageSync(); //清楚登录缓存
    // }
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