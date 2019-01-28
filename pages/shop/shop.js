// pages/shop/shop.js
var api_shop_goods = "https://giftcardapp.colipu.com/apis.php/index/shopGoods";
var startItem = 0;  //数据库查询起始点
var startItem2 = 0;  //数据库查询起始点
var count = 8;  //每页显示的商品数量
var goodsArray = [];   //所有精品商品数据
var goodsArray2 = [];   //所有精品商品数据
var server = require('../../utils/server');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:{ },
    sp:{},
    spsxj:{},
    spsold:{},
    soxj:{},
    goods_num:{},
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    checked: false,
    checkAll: false,
    dataset:'',
    num:'1',
    qx:'',
    dx:'',
    integral:0,
    sl:'',
    spid:'',
    hidden:false,
    whats:false,   
    ss:true,
    hh:false,
    xs:'',
    yinchang:false,
    cardid: null,  //用于判断是否登录以判断是否显示商品积分
    start: 0,
    count1: 6,
    showzhi:'',
    shopadding:0,
    defquanx:'',
    getides:'',
    showMore: false,  //用于判断是否在wxml中显示"点击查看更多商品"
    addend:false,//控制加减号的时间
    checkall_de:false,//控制全选的时间
    sp_xjs:false,
    spt:true,
    hidden:false,
    setmeal:'',
    unit:{},
    show_price: '',
    submit_addend:false,
    joinshopp:false,
  },
  /**
  *生命周期函数--监听页面加载
  */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
    wx.showLoading({  //请求成功有数据时才给它提示动画
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()  //必须配合wx.hideLoading()才能关闭
    }, 1000)
      wx.hideShareMenu() //隐藏转发选项(此页不让转发)
      var that=this;
      that.shuliang(); 
      that.gwxs();
      that.cart();
      that.gwxss();
      that.setmeal();
      that.huancun();
      that.getids();
      that.spxj();
      that.spsl();
      if (wx.getStorageSync('cardid') !== '') { 
       this.goodsfun2();//登录后精选商品数据调用
    }
  },
  //积分卡被禁用后调用的函数(让其跳转登录页)
  global_view: function () {
    var that = this;
    var url = 'https://giftcardapp.colipu.com/apis.php/login/Cardexpired';
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');    
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        if (e.data.code == '200') {
          wx.clearStorageSync(); //清楚登录缓存
          console.log(wx.getStorageSync('cardid'))
          wx.showModal({
            title: '温馨提示:',
            content: e.data.msg,
            success () { //complete: 接口调用结束的回调函数（调用成功、失败都会执行）
              wx.switchTab({
                url: '/pages/personal/personal'
              });
            }
          })
          wx.clearStorageSync(); //清楚登录缓存
        }
      }
    })
  },
  //积分卡被禁用后调用的函数(让其跳转登录页)
  global_views: function () {
    var that = this;
    var url = 'https://giftcardapp.colipu.com/apis.php/login/Cardexpired';
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        if (e.data.code == '200') {
          wx.clearStorageSync(); //清楚登录缓存
          // wx.removeStorageSync('cardid')
          console.log(wx.getStorageSync('cardid'))
          wx.showModal({
            title: '温馨提示:',
            content: e.data.msg,
            // confirmText: '确定',
            success() { //complete: 接口调用结束的回调函数（调用成功、失败都会执行）
              wx.switchTab({
                url: '/pages/personal/personal'
              });
            }
          })
          wx.clearStorageSync(); //清楚登录缓存
        } else {
          that.submit();
        }
      }
    })
  },
  huancun:function(){
    wx.setStorageSync('checkall',this.data.checkAll);
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
  shuliang:function(){
    var taht= this;
    var d = new Object;
    var url ="https://giftcardapp.colipu.com/apis.php/shopping/shuliang";
    d.card_id=wx.getStorageSync('cardid');
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
        var sl = e.data.data;
        var xiangjia = 0;
        for(var i=0; i<sl.length;i++){
          var xj = sl[i]['goods_num'];
          xiangjia += xj;        
        }
        wx.setStorageSync('gouwu',xiangjia);
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新....")
  },
  Visitthe:function(){
    this.global_view();
        wx.switchTab({
        url: '../../pages/index/index'
        }) 
  },
gwxs:function(){
    var that= this;
  var url ="https://giftcardapp.colipu.com/apis.php/shopping/gwxs";
    var d = new Object;
    d.card_id=wx.getStorageSync('cardid');
    wx.request({
        url:url,
        method:"post",
        data:d,
        success:function(e){
          if(e.data.code=='200'){
              var xs = e.data.data;
              that.setData({
                xs:xs,
                hidden:true,
                whats:false,
                ss:false,
              })
          }else if(e.data.code=='251'){
              var xs = e.data.data;
              that.setData({
                xs:xs,
                hidden:false,
                whats:true,
                ss:true,
              })
          }
        }
    })
},
gwxss:function(){
    var that= this;
  var url ="https://giftcardapp.colipu.com/apis.php/shopping/gwxss";
    var d = new Object;
    d.card_id=wx.getStorageSync('cardid');
    wx.request({
        url:url,
        method:"post",
        data:d,
        success:function(e){
          if(e.data.code=='200'){
              var ssx = e.data.data; 
              that.setData({
                yinchang:true,
              })
          }else if(e.data.code=='251'){
              var sx = e.data.data;
              that.setData({
                 yinchang:false,
              })
          }
        }
    })
},
bindMinus:function(e){
      var that = this; 
      if(that.data.addend == false)
      {
         that.setData({
           addend:true,
         });
        setTimeout(function () {
          that.setData({
            addend: false,
          });
        }, 500);
         var ids = e.currentTarget.dataset.id;
          var index = e.currentTarget.dataset.index;
        if (that.data.setmeal==1){
          wx.showToast({
            title: '只能购买一件',
            image: '/img/icon.png',
            duration: 2000
          });return;
        }else{
          var num = this.data.list[index].goods_num;
          if (num > 1) {
            num--;
          }else {
            return;
          }
        }
            var list = this.data.list;
            //商品大于一的话可以点击
            var minusStatus = num <= 1 ? 'disabled' : 'normal';
            list[index].goods_num = num;
            var minusStatuses = this.data.minusStatuses;
            minusStatuses[index] = minusStatus;
              this.setData({
                list: list,
                minusStatuses: minusStatuses,
                num:num
              });
        var url ="https://giftcardapp.colipu.com/apis.php/shopping/bindMinus"
            var d = new Object;
            d.ids = ids;
            d.card_id = wx.getStorageSync('cardid');
            d.goods_num = num;
            wx.request({
                url:url,
                method:'post',
                data:d,
                success:function(e){
                  if(e.data.code=='200'){
                     that.cart();
                     that.integraltotal();
                  } else if (e.data.code == '240') {
                    wx.showToast({
                      title: e.data.msg,
                      icon: 'success',
                      duration: 2000
                    });
                  }
                }
            })      
      }      
},
 bindPlus:function(e){
  var that = this;
      if(that.data.addend == false){      
         that.setData({
            addend:true,
         });
        setTimeout(function () {
          that.setData({
            addend: false,
          });
        }, 800);
        var ids = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var num  = this.data.list[index].goods_num;
        var list = this.data.list;
        if(that.data.setmeal==1){
          wx.showToast({
            title: '只能购买一件',
            image: '/img/icon.png',
            duration: 2000
          });return;
        }else{
          num++;
        }
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        list[index].goods_num = num;
        var minusStatuses = this.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        this.setData({
          list: list,
          minusStatuses: minusStatuses,
          num:num
        });
        var url ="https://giftcardapp.colipu.com/apis.php/shopping/bindPlus"
        var d = new Object;
        d.ids = ids;
        d.card_id = wx.getStorageSync('cardid');
        d.project_id = wx.getStorageSync('project_id');
        d.goods_num = num;
        wx.request({
            url:url,
            method:'post',
            data:d,
            success:function(e){
              if(e.data.code=='200'){
                 that.cart();
                 that.integraltotal();
              } else if (e.data.code == '240') {
                wx.showToast({
                  title: e.data.msg,
                  icon: 'success',
                  duration: 2000
                });
              }
            }
        })
    }
 },
//  套餐
  setmeal: function () {
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/setmeal"
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    d.project_id = wx.getStorageSync('project_id');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
      if (e.data.code == '260') {
          that.setData({
            setmeal: 1,
            unit:e.data.unit[0],
          })
        }else{
        that.setData({
          setmeal: 0,
        })
        }
      }
    })
  },
  // 购物车显示
  cart:function(){
      var that =this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/cartshow"
    var d = new Object;
    d.card_id=  wx.getStorageSync('cardid');
    d.project_id = wx.getStorageSync('project_id');
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
          }
        }
      })
 },
  spxj:function(){
    var that =this;     
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/spxj"
      var d = new Object;
      d.card_id=  wx.getStorageSync('cardid');
      wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
           if(e.data.code=='200'){
              var sp = e.data.sp;
              that.setData({
                spsxj:sp,
              });return;
            }else if(e.data.code=='500'){
              var sp = e.data.sp;               
              that.setData({
                spsxj:sp,
              });return;
            }
          }
    })
 },
  spsl:function(){
    var that =this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/spsl"
      var d = new Object;
      d.card_id=  wx.getStorageSync('cardid');
      wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
            if(e.data.code=='500'){
              var sp = e.data.sp;              
              that.setData({
                sp:sp,
              });return;
            }else if(e.data.code=='200'){
              var sp = e.data.sp;
              that.setData({
                sp:sp,
              });return;
            }
          }
    })
 },
 del:function(e){
    var that= this;
    var ids = e.currentTarget.dataset.id;
    that.setData({
      ids:ids
    })
   var url ="https://giftcardapp.colipu.com/apis.php/shopping/cartdel"
    var d = new Object;
    d.id = that.data.ids;
    wx.request({
        url:url,
        method:'post',
        data:d,
        success:function(e){
          if(e.data.code=='200'){
               that.gwxs();
               that.gwxss();
              that.dedfqx();
            that.integraltotal();
            wx.showToast({    
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                });
            that.cart();
          }
        }
    })
 },
submit:function(e){
  var that = this;
  if (that.data.submit_addend == false) {
    that.setData({
      submit_addend: true,
    });
    setTimeout(function () {
      that.setData({
        submit_addend: false,
      });
    }, 500);          
    if (this.data.joinshopp == false) {
      this.setData({
        joinshopp: true,
      });     
     var d = new Object;
      var url = "https://giftcardapp.colipu.com/apis.php/shopping/close";
                  d.card_id = wx.getStorageSync('cardid');
                  d.project_id = wx.getStorageSync('project_id');
                  d.goods_pice = that.data.shopadding;
                  d.buy_amount = that.data.sl;
                  d.goodsid = that.data.getides;
                  d.checkAll = that.data.checkAll;
                  wx.request({
                    url:url,
                    method:"post",
                    data:d,
                    success:function(e){
                        if(e.data.code=='200'){
                          wx.navigateTo({
                            url: '../../pages/jiesuan/jiesuan?order_id='+e.data.data,
                          })
                        }else if(e.data.code=='225'){
                            wx.showToast({    
                              title: '已存在',
                            image: '/img/icon.png',
                            duration: 2000
                          });
                        }else if(e.data.code=='500'){
                          that.onShow();
                          var sp = e.data.sp;
                          that.setData({
                            sp:sp,
                            yincang:false,
                          })
                            that.spsl();
                            wx.showToast({    
                              title: e.data.msg,
                            image: '/img/icon.png',
                              duration: 2000
                          });
                        }else if (e.data.code == '290') {               
                            that.cheall();
                            that.integraltotal();
                            that.onLoad();                          
                            wx.showToast({
                              title: e.data.msg,
                              image: '/img/icon.png',
                              duration: 2000
                          }); return;

                        }else if(e.data.code=='360'){
                          wx.showToast({
                            title: e.data.msg,
                            image: '/img/icon.png',
                            duration: 2000
                          }); return;
                        } else{
                          wx.showToast({
                            title: e.data.msg,
                            image: '/img/icon.png',
                            duration: 2000
                          });
                        }
                    }
                  })
       }
    setTimeout(function () {
      that.setData({
        joinshopp: false,
      });
    }, 2000);
  }
},
onShow: function () {
  this.global_view();
  //让登录之后积分自动更新为具体的值
  var that = this;
  that.spxj();
  that.dedfqx();
  that.gwxs();
  that.gwxss();
  that.cart();
  that.setmeal();  // 套餐  
  that.shuliang();
  that.spsl();
  that.integraltotal();
  if (wx.getStorageSync('cardid') !== '') {  //用于判断用户是否登录以决定是否显示具体的商品积分值
    this.goodsfun2();//登录后精选商品数据调用
  } else {
    this.goodsfun();//登录前"为你推荐"商品数据调用
  }
    that.setData({
      checkAll: wx.getStorageSync('checkalls'),
    })
},  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
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
  },
  checkboxChange: function(e) {
    var that = this;
    var ds =  e.currentTarget.id;
    var dx =e.detail.value;
    var showids = that.data.list;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/checkboxChange";
    var d = new Object;
    var  ids =ds+',';
    d.card_id = wx.getStorageSync('cardid');
    d.ids = ids;
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
            that.integraltotal();
            that.getids();
      }
    })
    var checkboxItems = this.data.list;
    var values = e.detail.value;
    var val =e.detail.id;
    var checkAll_num=0;
    var spid = '';
    for (var i = 0; i < checkboxItems.length; ++i) {
      if (checkboxItems[i].id == e.currentTarget.id)
      {
        if (checkboxItems[i].checked) {
       
          checkboxItems[i].checked = 0;
        }
        else {        
          checkboxItems[i].checked = 1;
        }    
      }
      if (checkboxItems[i].checked == 1)
      {
        checkAll_num = checkAll_num + 1;
        spid += checkboxItems[i].id+',';
      }
    }
    var checkAll = false;
    if (checkAll_num == checkboxItems.length){
      checkAll = true;
      wx.setStorageSync('checkalls', 1)
    }
    else
    {
      wx.setStorageSync('checkalls', 0)
    }
    var sum = 0;
    var sl =  dx.length;
    this.setData({
      list: checkboxItems,
      checkAll: wx.getStorageSync('checkalls'),
      dx:dx,
      integral:sum,
      sl:sl,
      spid:spid,
    });
  },
//全选相加
  cheall:function(){
    var that=this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/quanxuan";
    var d = new Object;
    d.card_id=wx.getStorageSync('cardid');
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
  //全选默认选中取消
  dedfqx:function(){
    var that = this;
    var url = 'https://giftcardapp.colipu.com/apis.php/shopping/defqx',
     d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
        if(e.data.code=='200'){
          wx.setStorageSync('checkalls',1);
          that.setData({
            checkAll: wx.getStorageSync('checkalls')
          })        
        }else if(e.data.code=='212'){
          wx.setStorageSync('checkalls', 0);         
          that.setData({
            checkAll: wx.getStorageSync('checkalls')
          })
        }
      }
    })
  },
  //提交提点要判断的id
  getids:function(){
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/cunzhi";
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
      url:url,
      method:'post',
      data:d,
      success:function(e){
        // console.log(e);
        var getides = e.data.data;
          if(e.data.code='200'){
              that.setData({
                getides:getides,
                spid:getides
              })
          }
      }
    })
  },
  /**
   * 用户点击全选
   */
  selectalltap: function(e) {   
         var that = this;    
      if(that.data.checkall_de == false)
        {       
          that.setData({
            checkall_de:true,
          });
          var defquanx = that.data.defquanx;
          var qx = e.detail.value;
          var value = e.detail.value;
          var checkAll = 0;
          if (qx  && value[0] ) {
              checkAll = 1;
          }
        var list = this.data.list;
        for (var i = 0; i < list.length; i++) {       
          list[i]['checked'] = !wx.getStorageSync('checkalls');
        }
        var d = new Object;
        d.card_id = wx.getStorageSync('cardid');
        d.projectid = wx.getStorageSync('project_id');
        d.checkAll = !wx.getStorageSync('checkalls');
        wx.request({
          url: 'https://giftcardapp.colipu.com/apis.php/Ceshi/integrals',
          method: "post",
          data: d,
          success: function (e) {
            wx.setStorageSync('checkalls',e.data.data);
            that.getids();
            that.cheall();
            that.setData({
               checkAll: wx.getStorageSync('checkalls'),
               list: list,
               qx: qx,
               getides:that.data.getides,
            });
          }
          })
       setTimeout(function () {
        that.setData({
          checkall_de:false,
        });
        }, 1000);
    }
  },
  //"为你推荐"商品展示 
  goodsfun: function (res) {
    var that = this;
    server.getJSON("/index/shopGoods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: startItem, count: count }, function (res) {
      var data = res.data
      if (data.code == '200') {
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      } else {
        that.setData({
          showMore: false  //给showMore赋值用于判断是否在wxml中显示"点击查看更多商品"
        })
      }
      // 更新商品数组  
      that.setData({
        items: res.data.data
      });
      startItem = startItem + count;
    });
  },
  //"为你推荐"商品展示 
  goodsfun2: function (res) {
    var that = this;
    server.getJSON("/index/shopGoods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: startItem2, count: count }, function (res) {
      var data = res.data
      if (data.code == '200') {
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"没有更多了~"
        })
      } else {
        that.setData({
          showMore: false  //给showMore赋值用于判断是否在wxml中显示"没有更多了~"
        })
      }
      // 更新商品数组  
      that.setData({
        items: res.data.data,
        show_price: res.data.msg['show_price']
      });
      startItem2 = startItem2 + count;
    });
  },
  //"为你推荐"商品展示(只用于页面显示时,不用于上拉加载时使用) 
  goodsfun1: function (res) {
    this.setData({ //在onLoad或onShow走goodsfun1方法时让变量showMore归false
      showMore: false
    })
    var that = this;
    server.getJSON("/index/shopGoods", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id'), start: this.data.start, count: this.data.count1 }, function (res) {
      // 更新商品数组  
      that.setData({
        items: res.data.data
      });
    });
  },
})
/** 私有方法*/
function requestData(that, startNum) {
  wx.showLoading({  //必须配合wx.hideLoading()才能关闭
    title: '加载中...',
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 1000)
  wx.request({
    url: api_shop_goods + "?start=" + startNum + "&count=" + count + "&uid=" + wx.getStorageSync('cardid') + "&project_id=" + wx.getStorageSync('project_id'),
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      wx.hideToast();
      var data = res.data;
      if (data.code == '200') { //code为200才显示数据
        goodsArray = goodsArray.concat(data.data);
      } else {
        wx.showToast({
          title: '没有更多数据啦',
          icon: "none"  //none为隐藏图标
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
      // 更新商品数组  
      that.setData({
        items: goodsArray
      });
      startItem = startItem + count;
    },
    fail: function () {
      console.log("网络请求失败");
    }
  })
}