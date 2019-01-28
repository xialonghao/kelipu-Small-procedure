// pages/shopdetails/shopdetails.js
//var api_goods_details = "https://giftcardapp.colipu.com/apis.php/index/goodsDetails";
var server = require('../../utils/server');
var WxParse = require('../../wxParse-master/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      // 'http://www.zhxb.com/wechat/kelipu/img1.jpg',
      // 'http://www.zhxb.com/wechat/kelipu/img1.jpg',
      // 'http://www.zhxb.com/wechat/kelipu/img1.jpg'
    ],
    autoplay: false,
    interval: 4500,
    duration: 500,
    indicatorDots: true, //轮播图之用
    currentSwiper: 0,
    goods_id: '',
    goods_details: [],   
    cardid: null,  //用于判断是否登录以判断是否显示商品积分
    splist:{},
    shuliang:"",
    quantity:'',
    goods_name:'',
    goodsid: '',
    show_price: '',
    addend:false,
    joinshopp:false,
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },


  onHide: function () {
    this.setData({
      autoplay: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    console.log(options);
    var that = this;
    that.shopshow();
    if (wx.getStorageSync('cardid') !== '') {  //用于判断用户是否登录以决定是否显示具体的商品积分值
      this.setData({
        cardid: wx.getStorageSync('cardid'),
      })
    }
    var shuliang = wx.getStorageSync('gouwu');
    this.setData({
      goods_id: options.goods_id,
      shuliang : shuliang,
    })
    var url = 'https://giftcardapp.colipu.com/apis.php/shopping/readcommodity';
        var d = new Object;
        d.id = that.data.goods_id;
        wx.request({
          url:url,
          method:"POST",
          data:d,
          success:function(e){
            if(e.data.msg = '200'){
                  var splist = e.data.data;
                  that.setData({
                      splist:splist,
                  })                   
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
  shopshow:function(){
    var that = this;
    var url = 'https://giftcardapp.colipu.com/apis.php/shopping/shopshow';
    var d = new Object;
    d.card_id= wx.getStorageSync('cardid');
    wx.request({
      url:url,
      method:'post',
      data:d,
      success:function(e){
        if(e.data.code=='200'){
               var quantity=e.data.data;
            that.setData({
             quantity:quantity
            })
        }
      }
    })
  },
    /**
   * 生命周期函数--监听页面显示  
   */
  onShow: function () {
    // this.global_view();
    
    this.setData({
      currentSwiper: 0
    })
    this.goods_details_fun();//页面显示时商品详情接口再调用(好及时更新显示在登录后的积分值)
    this.data.shuliang;
    this.shopshow();
  },
  submits:function(){
    this.global_view();
    if(wx.getStorageSync('cardid')==''){
           wx.navigateTo({
              url: '/pages/login/login',
            })
    }else{ 
      if (this.data.joinshopp == false) {
        this.setData({
          joinshopp: true,
        });
        var that = this;
        var url = 'https://giftcardapp.colipu.com/apis.php/shopping/gaincomm';
         var d = new Object;
        d.card_id = wx.getStorageSync('cardid');
        d.project_id = wx.getStorageSync('project_id');
        d.goodsid = that.data.splist['id'];
        d.goods_name = that.data.splist['goods_name'];
         d.goods_img = that.data.splist['goods_img'];
        d.goods_price = that.data.splist['goods_price'];  
        d.goods_erp = that.data.splist['goods_erp'];
        d.goods_num_price = that.data.splist['goods_price'];
        d.goods_unit = that.data.splist['goods_unit'];
        d.goods_num = '1';
        wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
            if(e.data.code=='200'){
             that.shopshow();
            wx.showToast({    
                        title: '添加成功',
                        icon: 'success',
                        duration: 2000
                  })   
              }else if(e.data.code=='220'){
                  wx.showToast({    
                        title: '已加入购物车',
                        image: '/img/icon.png',
                        duration: 2000
                  })
              }else if(e.data.code=='261'){
                  wx.showToast({    
                    title: '宝贝补货中',
                        image: '/img/icon.png',
                        duration: 2000
                  });return;
            } else if (e.data.code == '270') {
              wx.showToast({
                title: '宝贝补货中',
                image: '/img/icon.png',
                duration: 2000
              }); return;
            } else if (e.data.code == '360') {
              wx.showToast({
                title: e.data.msg,
                image: '/img/icon.png',
                duration: 2000
              });
                // wx.showModal({
                //   title: '温馨提示:',
                //   content: e.data.msg,
                // });

            } else if (e.data.code == '378') {
              wx.showModal({
                title: '温馨提示:',
                content: e.data.msg,
              });

            }else{
              wx.showModal({
                title: '温馨提示:',
                content: '只能添加一种套餐',
              }); return;
            }
          }
        })
    }
      setTimeout(function () {
        that.setData({
          joinshopp: false,
        });
      }, 1000);
    }
  },
  purchase:function(){
    this.global_view();
        if(wx.getStorageSync('cardid')==''){

           wx.navigateTo({
              url: '../../pages/login/login',
            })
    }else{
          if (this.data.joinshopp == false) {
            this.setData({
              joinshopp: true,
            });
        var that = this;
            var url = 'https://giftcardapp.colipu.com/apis.php/shopping/gaincomm';
        var d = new Object;
        d.card_id = wx.getStorageSync('cardid');
        d.goodsid = that.data.splist['id'];
          d.project_id = wx.getStorageSync('project_id');
        d.goods_name = that.data.splist['goods_name'];
        d.goods_img = that.data.splist['goods_img'];
        d.goods_price = that.data.splist['goods_price'];  
        d.goods_erp = that.data.splist['goods_erp'];
        d.goods_num_price = that.data.splist['goods_price'];
        d.goods_unit = that.data.splist['goods_unit'];
        d.goods_num = '1';

        wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
            if(e.data.code=='200'){
                that.shopshow();
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/shop/shop'
                })
              }, 500)
              }else if(e.data.code=='220'){
                 wx.switchTab({
                url: '../../pages/shop/shop'
              }) 
            } else if (e.data.code == '261') {
              wx.showToast({
                title: '宝贝补货中',
                image: '/img/icon.png',
                duration: 2000
              }); return;
            }
            else if (e.data.code == '270') {
              wx.showToast({
                title: '宝贝补货中',
                image: '/img/icon.png',
                duration: 2000
              }); return;
            }else if (e.data.code == '360') {
            // wx.showModal({
                //   title: '温馨提示:',
                //   content: e.data.msg,
                // });
              wx.showToast({
                title: e.data.msg,
                image: '/img/icon.png',
                duration: 2000
              });
            } else if (e.data.code == '378') {
              wx.showModal({
                title: '温馨提示:',
                content: e.data.msg,
              });

            } else if (e.data.code == '280') {
              wx.switchTab({
                url: '../../pages/shop/shop'
              }) 
            }
          }
        })
    }
          setTimeout(function () {
            that.setData({
              joinshopp: false,
            });
          }, 1000);
        }
  },
  //商品详情展示 
  goods_details_fun: function (res) { 
    var that = this;
    server.getJSON("/index/goodsDetails", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), goods_id: this.data.goods_id }, function (res) {  
      if (res.data.data[0] == null) {
        //当无商品详情信息时给提示并自动返回
        wx.showModal({
          title: '亲爱的主人:',
          content: '宝贝下架啦~',
          // confirmText: '确定',
          complete: function () { //complete: 接口调用结束的回调函数（调用成功、失败都会执行）
            wx.navigateBack({
              delta: 1 //自动返回上一页
            })
          }
        })
        return;
      }else{
      that.setData({ //给goods_name变量赋值为商品的名称
        goods_name: res.data.data[0].goods_name,
        goodsid: res.data.data[0].id
      })   
      var content = res.data.data[0].goods_content;
      WxParse.wxParse('content', 'html', content, that, 5); //插件实现小程序显示html代码块  
        if (res.data.msg == null) {
          that.setData({
            goods_details: res.data.data[0], //商品信息(总)     
            imgUrls: res.data.data[1],
            show_price: ''
          });
        } else {
          that.setData({
            goods_details: res.data.data[0], //商品信息(总)     
            imgUrls: res.data.data[1],
            show_price: res.data.msg['show_price']
          });
        }
        if (that.data.indicatorDots != true) {
          that.setData({
            indicatorDots: true
          });
        }
        setTimeout(function () {
          if (that.data.autoplay != true) {
            that.setData({
              autoplay: true
            });
          }
        }, 1000)
    
      }
    });
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
      title: this.data.goods_name,
      path: 'pages/shopdetails/shopdetails?goods_id='+ this.data.goodsid,
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