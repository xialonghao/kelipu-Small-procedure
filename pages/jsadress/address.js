// pages/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    order_id:'',
    addend:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
      var that=this;
      that.siteshow();
      that.setData({
        order_id: wx.getStorageSync('order_id'),
      })
    var pages = getCurrentPages() //  获取页面栈   

    var prevPage = pages[pages.length - 2]    // 上一个页面   
    console.log(pages);
    console.log(prevPage);
    prevPage.setData({
      // 给上一个页面变量赋值   
      isRouteMysy: '2'
    })
  },

  //积分卡被禁用后调用的函数(让其跳转登录页)
  global_view: function () {
    var that = this;
    if (this.data.addend == false) {
      this.setData({
        addend: true,
      });
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
    setTimeout(function () {
      that.setData({
        addend: false,
      });
    }, 1000);
  }
  },

  // tiaozhuan:function(e){
  //   var that = this;
  //   console.log(that.data.list);
  //   console.log(e.currentTarget.dataset.current);
  //   wx.navigateTo({
  //     // url: '../../pages/jiesuan/jiesuan',
  //   })  
  //   // wx.setStorageSync('dizhis', e.currentTarget.dataset.current); 
  //   app.globalData.dizhis = e.currentTarget.dataset.current;
  //   var url = "https://giftcardappuat.colipu.com:9999/apis.php/shopping/insertindex";
  //   var d = new Object;
  //   d.indexid = e.currentTarget.dataset.current
  // },
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
    var that = this;
    that.siteshow();
    if (this.data.isRouteMysy == '2') {
    //   wx.switchTab({
    //     url: '../../pages/jiesuan/jiesuan',
    //     success: function (e) {
    //       var page = getCurrentPages().pop();
    //       if (page == undefined || page == null) {
    //         return;
    //       }
    //       console.log(111);
    //      // page.onLoad(); 
    //     }
    //   })
    
      wx.navigateBack({
        delta: 0
      })
    }
  },
  siteshow:function(){
      var that = this;
    var url ='https://giftcardapp.colipu.com/apis.php/login/siteshow';
      var d = new Object;
      d.card_id = wx.getStorageSync('cardid');
      wx.request({
        url:url,
        method:'post',
        data:d,
        success:function(e){
            if(e.data.code=='200'){
               var list = e.data.data;
               that.setData({
                  list:list,
               })
            }else if(e.data.code=='210'){
              that.setData({
                list: '',
              })
                  // wx.showToast({    
                  //     title: '地址不存在',
                  //     image: '/img/icon.png',
                  //     duration: 2000
                  // })
            }
        }
      })
  },
  jiesuanye : function(e){
    this.global_view();
    var that = this; 
    var pagelist = getCurrentPages();
    console.log(pagelist);
    if (pagelist.length > 1) {
      //获取上一个页面实例对象
      var prePage = pagelist[pagelist.length - 2];
      if (pagelist.length > 3) {
        wx.redirectTo({
          url: "/pages/jiesuan/jiesuan?id=" + e.currentTarget.id + "&order_id=" + that.data.order_id,
        })
        wx.navigateBack({
          delta: 2
        })
      }
      else {
        prePage.getBackData(e.currentTarget.id, that.data.order_id);
        wx.navigateBack({
          delta: 1
        })
      }  
    }
  },
  // xiugai: function (e) {
  //   var that = this;
  //   wx.redirectTo({
  //     url:  e.currentTarget.id,
  //   })
  // },
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