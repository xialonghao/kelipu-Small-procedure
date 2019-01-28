//index.js
//获取应用实例
var api_goods = "https://giftcardapp.colipu.com/apis.php/index/goods";
var startItem = 0;  //数据库查询起始点
var startItem2 = 0;  //数据库查询起始点
var count = 8;  //每页显示的商品数量(设置比count1大可以使初次上拉刷新时看到效果,不然第一次懒加载出来的数量跟onLoad加载出来的数量一致,用户看不出来)
// var uid = app.globalData.cardid;   //卡id(用于判断用户是否登录)
// var project_id = app.globalData.projectid; //项目id(用于判断用户是否登录)

var goodsArray = [];   //所有精品商品数据
var goodsArray2 = [];   //所有精品商品数据

const app = getApp()
const http = require('../../utils/http')
const ui = require('../../utils/ui')
var server = require('../../utils/server')
const url = app.globalData.url;  

Page({
  data: {

    imgUrls: [
      // 'http://www.zhxb.com/wechat/kelipu/index_banner.jpg',
      // 'http://www.zhxb.com/wechat/kelipu/index_banner.jpg',
      // 'http://www.zhxb.com/wechat/kelipu/index_banner.jpg'
    ],
    currentSwiper: 0,
    autoplay: false,
    timeclick: true,
    interval: 5000,
    duration: 500,
    //jingpin:[],   
    classify: [
      // {
      //   'img': '../public/images/index_listimg1.jpg',
      //   'title': '时尚文具', 
      //   'id': '1'
      // },
    ],
    items: [],
    system: {},
    cardid: null,  //用于判断是否登录以判断是否显示商品具体积分
    // project_id: null,
    start: 0,
    count1: 6,   //onLoad和onShow加载的单页数量
    indicatorDots:true, //轮播图之用
    showMore: false,  //用于判断是否在wxml中显示"点击查看更多商品" 
    key_word: '',
    show_price: '' 
  },
  //事件处理函数
  bindViewTap: function () {  
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onLoad: function () {
    
    // app.bannerfun();
   // this.bannerfun();//轮播图调用
  //  this.bannerfun2();//轮播图调用
    // if (wx.getStorageSync('imgUrls'))
    // {
    //   this.setData({
    //     imgUrls: wx.getStorageSync('imgUrls')
    //   })
    // }
  
    // var that =this;
    // var called = wx.getStorageSync('called')
    // console.log(called)

    // if (called) {
    //   that.setData({
    //     imgUrls: called,
    //   });
    // } else {
    //   app.employIdCallbacks = called => {
    //     if (called) {
    //       console.log(called)
    //       that.setData({
    //         imgUrls: called,
    //         // showModalStatus:res
    //       });
    //       return;
    //     }
    //   }
    // }


    // this.forbidden();
    if (wx.getStorageSync('cardid') !== '') {
      this.goodsfun2();//登录后精选商品数据调用
    }


    // wx.showLoading({  //请求成功有数据时才给它提示动画
    //   title: '加载中...',
    // })

    // setTimeout(function () {
    //   wx.hideLoading()  //必须配合wx.hideLoading()才能关闭
    // }, 1000)


    //获取缓存
    // wx.getStorage({
    //   key: 'key',
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })

    // var that = this;
    // requestData(that, startItem);
    // this.goodsfun1();//精选商品数据调用
    // this.goodsfun1();//精选商品数据调用

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理 
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  


    // wx.setNavigationBarTitle({ 
    //   title: "首页"
    // })
    var that = this


    //获取手机设备系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          system: res
        })
      },
    })
  },

  // navingforbid: function () {
  //   var url = 'https://giftcardappuat.colipu.com:9999/apis.php/login/navingforbid';
  //   var d = new Object;
  //   d.card_id = wx.getStorageSync('cardid');
  //   wx.request({
  //     url: url,
  //     method: 'post',
  //     data: d,
  //     success: function (e) {
  //       if (e.data.code == '200') {
  //         wx.showToast({
  //           title: e.data.msg,
  //           image: '/img/icon.png',
  //           duration: 2000
  //         })
  //         wx.clearStorage();
  //       }
  //     }
  //   })
  // },
 
  // Cardexpired: function () {
  //   var url = 'https://giftcardappuat.colipu.com:9999/apis.php/login/Cardexpired';
  //   var d = new Object;
  //   d.card_id = wx.getStorageSync('cardid');
  //   wx.request({
  //     url: url,
  //     method: 'post',
  //     data: d,
  //     success: function (e) {
  //       if (e.data.code == '200') {
  //         wx.redirectTo({
  //           url: '/pages/login/login'
  //         });
  //         wx.showToast({
  //           title: e.data.msg,
  //           image: '/img/icon.png',
  //           duration: 2000
  //         })
  //         wx.clearStorage();
  //       }
  //     }
  //   })
  // },

    //积分卡被禁用后调用的函数(让其跳转登录页)
    global_view: function() {
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
  


  // forbidden: function () {
  //   var url = 'https://giftcardappuat.colipu.com:9999/apis.php/login/forbidden';
  //   var d = new Object;
  //   d.card_id = wx.getStorageSync('cardid');
  //   wx.request({
  //     url: url,
  //     method: 'post',
  //     data: d,
  //     success: function (e) {
  //       // console.log(e);
  //       if (e.data.code == '200') {
  //         wx.showToast({
  //           title: '卡号已禁用',
  //           image: '/img/icon.png',
  //           duration: 2000
  //         })
  //         wx.clearStorage();
  //       }
  //     }
  //   })
  // },
  //点击轮播图跳转
  jump_url: function (e) {
    this.global_view();
    if (e.target.id != '') {
      wx.navigateTo({   //wx.switchTab只能跳转到app.josn里定义好的tab页面
        url: e.target.id,
      })
    }
  },


  //点击查看更多商品
  seeMore: function () {
    this.global_view();
    wx.switchTab({   //wx.switchTab只能跳转到app.josn里定义好的tab页面
      url: '../fenlei/fenlei',
    })
    app.globalNav.currentLocation = 0; //让点击后在分类页回到(展示)最上面第一个分类
  },


  /**
   * 生命周期函数--监听页面显示  
   */
  onShow: function () {
    
    this.global_view();
    // this.navingforbid()
    this.setData({
      // currentSwiper: 0,  //让轮播图的位置回零 (不然会出现偶尔不显示的情况,因为轮播图在轮播时会记录位置)
      key_word: ''
    })
    if (app.globalData.current == 0 || !app.globalData.current)
   {
     this.setData({
       currentSwiper: 0  //让轮播图的位置回零 (不然会出现偶尔不显示的情况,因为轮播图在轮播时会记录位置)
     })
     app.globalData.current=1;
   }
   
  

    if (wx.getStorageSync('cardid') !== '') {
      // console.log('登录后')
      // startItem = 0;  //数据库查询起始点回零
      // goodsArray = [];   //所有精品商品数据归空
      // this.setData({ //在onLoad或onShow走goodsfun1方法时让变量showMore归false
      //   showMore: false
      // })
      // goodsArray = [];   //所有精品商品数据
      // goodsArray2 = [];   //所有精品商品数据
      // this.goodsfun2();//登录后精选商品数据调用
 
      this.onLoad();

    } else {
      // console.log('登录前')
      // startItem = 0;  //数据库查询起始点回零
      // goodsArray = [];   //所有精品商品数据归空
      // this.setData({ //在onLoad或onShow走goodsfun1方法时让变量showMore归false
      //   showMore: false
      // })

      this.goodsfun();//登录前精选商品数据调用

    }

    // this.onLoad()
    // var that = this;
    // requestData(that, startItem);
    this.bannerfun();//轮播图调用
    this.bannerfun2();//轮播图调用
    // this.goodsfun();//精选商品数据调用
    // this.goodsfun2();//精选商品数据调用
  },

  onHide:function(){
    this.setData({
      autoplay:false,
    });
  //  app.bannerfun();
  },

  onReady: function () { //页面初次渲染完成时调用
  // console.log(123456798)
    wx.showLoading({ //请求成功有数据时才给它提示动画
      title: '加载中...',
    })
    // app.bannerfun();
    setTimeout(function () {
      wx.hideLoading() //必须配合wx.hideLoading()才能关闭
    }, 1000)
  },

  //搜索框失去焦点
  search: function (e) {
    var that = this;
    // console.log(e.detail.value);
    // 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
    // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，但是 redirectTo 
    if (e.detail.value !== '') {  //如果没有输入任何关键字则不跳转
      wx.navigateTo({
        url: '../shoplist/shoplist?keyword=' + e.detail.value + '&classify2_id='  //加classify2_id是避免js文件里options报未定义的错
      })
      // app.globalNav.keyword = e.detail.value;
      wx.setStorageSync('key_word', e.detail.value)  //搜索关键字存在缓存
    }else{
      wx.showToast({
        title: '请输入关键字哦',
        image: '/img/icon.png',
        duration: 800
        // duration: 1000, 
      })
    }

  },


  // 上拉加载新数据
  onReachBottom: function () {
    // console.log("上拉加载....")
    // // 重新发送请求
    // // var that = this;
    // // requestData(that, startItem);
    // // this.goodsfun();//精选商品数据调用
    // if (wx.getStorageSync('cardid') !== '') {
    //   // this.setData({
    //   //   cardid: wx.getStorageSync('cardid'),
    //   // })
    //   // startItem = 0;  //数据库查询起始点
    //   // goodsArray = [];   //所有精品商品数据
    //   this.goodsfun2();//精选商品数据调用

    // } else {
    //   this.goodsfun();//精选商品数据调用
    // }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新....")
    // 直接调用onLoad方法
    // this.onLoad()
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1000)
  },

  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
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
  },     


  //轮播图及顶级分类展示 
  bannerfun: function (res) { 
    var that = this;


    
    server.getJSON("/index/banner", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id') },  function (res) {
      console.log(res.data.data);
    
      if (res.data.code == '500') {
        that.setData({
          imgUrls: '', //轮播图
          classify: '', //商品分类    
        });
        // setTimeout(function () {
        //   if (that.data.autoplay!=true)
        //   {
        //     that.setData({
        //       autoplay: true
        //     });
        //   }
        // }, 1000)
      } else {
        // wx.setStorageSync('imgUrls', res.data.data[0])
      //  app.globalData.banner = res.data.data[0];
        that.setData({
       //   imgUrls: res.data.data[0], //轮播图
          classify: res.data.data[1], //商品分类    
        });
        if (that.data.indicatorDots !=true)
        {
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

  //轮播图及顶级分类展示 
  bannerfun2: function (res) {
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/index/banner2";
      var d = new Object;
      d.uid = wx.getStorageSync('cardid')
    d.project_id = wx.getStorageSync('project_id')
      wx.request({
        url: url,
        method: "get",
        data: d,
        success: function (e) {
         
          if (e.data.code == '200') {
            console.log(e.data.data);
            // console.log('陳工')
            that.setData({
              imgUrls: e.data.data, //轮播图
              //   classify: res.data.data[1], //商品分类    
            });
          }else
          {
            that.setData({
              imgUrls:'', //轮播图
              //   classify: res.data.data[1], //商品分类    
            });
          }
        }
      })
  
  },


  //精选商品展示 
  goodsfun: function (res) {
    // wx.showLoading({  //必须配合wx.hideLoading()才能关闭
    //   title: '加载中...',
    // })

    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)

    var that = this;
    server.getJSON("/index/goods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: startItem, count: count }, function (res) {
      // console.log(res.data.data);
      var data = res.data

      // //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
      // if (data.code == '500') {
      //   that.setData({
      //     showMore: true
      //   })
      // }
     
      if (data.code == '200') { //code为200才显示数据
        // wx.showLoading({  //请求成功有数据时才给它提示动画
        //   title: '加载中...',
        // })

        // setTimeout(function () {
        //   wx.hideLoading()  //必须配合wx.hideLoading()才能关闭
        // }, 1000)

        // goodsArray = goodsArray.concat(data.data);
        // var goodsArray = data.data
       // console.log(goodsArray)
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      } else {
        that.setData({
          showMore: false  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      }
      // } else {
      //   wx.showToast({
      //     title: '没有更多数据啦',
      //     icon: "none"  //none为隐藏图标
      //     // image: '' 
      //     // duration: 1000, 
      //   })
      //   setTimeout(function () {
      //     wx.hideToast()
      //   }, 1000)

      // }

      // 更新商品数组  
      that.setData({
        items: res.data.data
      });
      startItem = startItem + count;
      // this.setData({
      //   startItem: this.data.startItem + count
      // })


    });
  },


  //精选商品展示 
  goodsfun2: function (res) {
    // wx.showLoading({  //必须配合wx.hideLoading()才能关闭
    //   title: '加载中...',
    // })

    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)

    var that = this;
    server.getJSON("/index/goods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: startItem2, count: count }, function (res) {
      // console.log(res.data.data);
      var data = res.data

      // //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
      // if (data.code == '500') {
      //   that.setData({
      //     showMore: true
      //   })
      // }

      if (data.code == '200') { //code为200才显示数据
        // wx.showLoading({  //请求成功有数据时才给它提示动画
        //   title: '加载中...',
        // })

        // setTimeout(function () {
        //   wx.hideLoading()  //必须配合wx.hideLoading()才能关闭
        // }, 1000)

        // goodsArray2 = goodsArray2.concat(data.data);
        // goodsArray2 = data.data
        // console.log(goodsArray2)
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      } else {
        that.setData({
          showMore: false  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      }
      // } else {
      //   wx.showToast({
      //     title: '没有更多数据啦',
      //     icon: "none"  //none为隐藏图标
      //     // image: '' 
      //     // duration: 1000, 
      //   })
      //   setTimeout(function () {
      //     wx.hideToast()
      //   }, 1000)

      // }

      // 更新商品数组  
      that.setData({
        items: res.data.data,
        show_price: res.data.msg['show_price']
      });
      console.log(1);
      console.log(that.data.items);
      startItem2 = startItem2 + count;
      // this.setData({
      //   startItem: this.data.startItem + count
      // })


    });
  },


  //精选商品展示(只用于页面显示时,不用于上拉加载时使用) 
  goodsfun1: function (res) {
    // wx.showLoading({  //必须配合wx.hideLoading()才能关闭
    //   title: '加载中...',
    // })

    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)

    this.setData({ //在onLoad或onShow走goodsfun1方法时让变量showMore归false
      showMore: false
    })

    var that = this;
    server.getJSON("/index/goods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: this.data.start, count: this.data.count1 }, function (res) {
      // console.log(res.data.data);
      // var data = res.data
      // if (data.code == '200') { //code为200才显示数据
      //   goodsArray = goodsArray.concat(data.data);
      //   console.log(goodsArray)
      // }
      // } else {
      //   wx.showToast({
      //     title: '没有更多数据啦',
      //     icon: "none"  //none为隐藏图标
      //     // image: '' 
      //     // duration: 1000, 
      //   })
      //   setTimeout(function () {
      //     wx.hideToast()
      //   }, 1000)

      // }

      // 更新商品数组  
      that.setData({
        // items: goodsArray
        items: res.data.data
      });
      
      // startItem = startItem + count;

      // this.setData({
      //   startItem: this.data.startItem + count
      // })


    });
  },     


  listnav: function (e) {
    this.global_view(); 
    var that= this;
    if (app.globalNav.dataclick == true) {
      setTimeout(function () {
        app.globalNav.dataclick = true;
      }, 1200)
      
      var i = e.currentTarget.dataset.current;
      // console.log(i)
      // console.log(e)
      app.globalNav.currentLocation = i;
      wx.switchTab({
        url: '../fenlei/fenlei'
      })
      app.globalNav.dataclick = false;
    }
  },
})



/** 私有方法*/
function requestData(that, startNum) {
  // console.log(startNum)
  // console.log("test值为: " + that.data.test);
  // 页面初始化 options为页面跳转所带来的参数

  wx.showLoading({  //必须配合wx.hideLoading()才能关闭
    title: '加载中...',
  })

  setTimeout(function () {
    wx.hideLoading()
  }, 500)

  // wx.showToast({
  //   title: "加载中...",
  //   icon: "loading",
  //   duration: 1000,
  // })

  //提示加载中并设置显示时间
  // setTimeout(function () {
  //   wx.showToast({ 
  //     title: "加载中...",
  //     icon: "loading", 
  //   }) 
  // }, 1000)
  
  //隐藏提示
  // setTimeout(function () {
  //   wx.hideToast()
  // }, 2000)

  wx.request({
    url: api_goods + "?start=" + startNum + "&count=" + count + "&uid=" + wx.getStorageSync('cardid') + "&project_id=" + wx.getStorageSync('project_id'),  
    header: {
      "Content-Type": "json"
    },
    success: function (res) {     
      // console.log(res)
      wx.hideToast();
      var data = res.data;
      if (data.code == '200') { //code为200才显示数据
        goodsArray = goodsArray.concat(data.data);  
        // console.log(goodsArray)
      } else {
        wx.showToast({
          title: '没有更多数据啦',
          icon: "none"  //none为隐藏图标
          // image: '' 
          // duration: 1000, 
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)

      }
      // 更新商品数组  
      that.setData({
        //title: data.title, 
        items: goodsArray
      });
      startItem = startItem + count;
    },
    fail: function () {
      console.log("网络请求失败");
    }
  })
}