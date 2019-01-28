// pages/fenlei/fenlei.js
var app = getApp()
const http = require('../../utils/http')
const ui = require('../../utils/ui')
var server = require('../../utils/server')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ncurrentTab: 0,
    classify_1: [],
    classify_2: [],
    checked: true,
    viewtop: 0,
    cate_name: '',  //获取二级分类的名称giftcardapp.colipu.comgiftcardapp.colipu.comgiftcardapp.colipu.com
    clicktime: true,
    swiperError: 0,
    clickt: true,
    // cardid: null
    key_word: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // if (wx.getStorageSync('cardid') !== '') {  //用于判断用户是否登录以决定是否显示具体的商品积分值
    //   this.setData({
    //     cardid: wx.getStorageSync('cardid'),
    //   })
    // }

    this.classify_fun1(); //一级和二级商品分类列表调用  
    // this.classify_fun2();
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
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   this.onLoad()
  //   var that = this;
  //   requestData(that, startItem);
  // },

  //用户点击二级分类时促发
  clicktit: function (e) {
    this.global_view();
    console.log(e)
    app.globalNav.listtit = e.currentTarget.dataset.current;
    app.globalNav.currentLocation = e.currentTarget.dataset.cur;
  },


  //用户点击广告位的图片时促发(跳转链接)
  clickimage: function (e) {
    this.global_view();
    console.log(e.target.id)
    if (e.target.id != '') {
      wx.navigateTo({    //wx.switchTab只能跳转到app.josn里定义好的tab页面
        url: e.target.id,
      })
    }

  },

  // //用户点击广告位的图片时促发(由于后台没写此功能暂时定死跳转到礼品卡券里的购物卡券(classify2_id=72)上)
  // clickimage: function () {
  //   wx.navigateTo({
  //     url: '../shoplist/shoplist?classify2_id=72&code=1&keyword=',  //加keyword是避免js文件里options报未定义的错(定义code为1表示是点击广告位进入到的该二级分类(classify2_id=72)下的商品列表页)
  //   })
  //   // wx.setNavigationBarTitle({ //不是在此页面下设置title
  //   //   title: '购物卡券'
  //   // })

  // },

  //监控搜索框失去焦点函数
  search: function (e) {
    var that = this;
    console.log(e.detail.value);
    // 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
    // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，但是 redirectTo 

    if (e.detail.value !== '') { //如果输入了商品关键字则跳转
      wx.navigateTo({
        url: '../shoplist/shoplist?keyword=' + e.detail.value + '&classify2_id='  //加classify2_id是避免js文件里options报未定义的错
      })
      // app.globalNav.keyword = e.detail.value;
      wx.setStorageSync('key_word', e.detail.value)  //搜索关键字存在缓存
    } else {  //如果没有输入任何关键字则不跳转且提示
      wx.showToast({
        title: '请输入关键字哦',
        image: '/img/icon.png',
        duration: 800
        // duration: 1000, 
      })
    }
  },


  //一级商品分类列表
  classify_fun1: function (res) {
    var that = this;
    server.getJSON("/index/classify_1", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id') }, function (res) {
      console.log(res.data.code);
      if (res.data.code == 500) {
        that.setData({
          classify_1: '', //商品一级分类 
          classify_2: '', //商品二级分类    
        });

      } else {
        that.setData({
          classify_1: res.data.data[0], //商品一级分类 
          classify_2: res.data.data[1], //商品二级分类    
        });
      }

      // console.log(res.data.data[1]);      
      // if (res.data.data[1].goods_category_list == []) {
      //   that.setData({
      //     classify_1: res.data.data[0], //商品一级分类 
      //     classify_2: [], //商品二级分类    
      //   });
      // } else {
      //   that.setData({
      //     classify_1: res.data.data[0], //商品一级分类 
      //     classify_2: res.data.data[1], //商品二级分类    
      //   });
      // }
    });
    // this.classify_fun2();//调用展示对应二级分类       
  },

  //二级商品分类列表
  // classify_fun2: function (res) {  
  //   var that = this;
  //   server.getJSON("/index/classify_2", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), classify_id: app.globalNav.currentLocation }, function (res) {
  //     console.log(app.globalNav.currentLocation) 
  //     console.log(res);
  //     that.setData({
  //       classify_2: res.data.data, //商品二级分类      
  //     });   
  //   }); 
  // },

  nswiperTab: function (e) {
    if (e.detail.source == "touch"){ 
      var that = this;
      if (e.detail.current == 0 && that.data.ncurrentTab > 1){
        that.setData({
          ncurrentTab: app.globalNav.currentLocation,
        });
      }else{
        var len = e.target.dataset.current;
        wx.createSelectorQuery().selectAll('.boxhei').boundingClientRect(function (rectW) {
          that.setData({ viewtop: rectW[e.detail.current].height * (e.detail.current -3) });
        }).exec()
        that.setData({
          ncurrentTab: e.detail.current,
        });
        app.globalNav.currentLocation = e.detail.current;
      }
    }
  },
  nclickTab: function (e) {
    this.global_view();
    var that = this;
    if (that.data.clicktime == true){
      setTimeout(function () {
        that.setData({
          clicktime: true,
        })
      }, 200)
      if (this.data.ncurrentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          ncurrentTab: e.target.dataset.current
        })
      }
      app.globalNav.currentLocation = this.data.ncurrentTab;
      that.setData({
        clicktime: false
      })
    }
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
    this.global_view();
    
    this.setData({
      key_word: ''
    })
    //  this.classify_fun1(); //一级和二级商品分类列表调用(让页面显示时重新获取分类以正确显示登录前后要求对应显示的分类)
    this.onLoad();
    console.log(app.globalNav.currentLocation)
    if (app.globalNav.currentLocation == '') {
      this.setData({
        ncurrentTab: 0
      });
    } else {
      var i = app.globalNav.currentLocation;
      this.setData({
        ncurrentTab: i
      });
    }
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
