// pages/jiesuan/jiesuan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      flag: true,
      moneys:{},
      whas:{},
      list:{},
      leave:'',
      addre:{},
      cardka:{},
      yf:0,
      jiage:'',
      id:1,
      Sitenote:true,
      Sitenotes:true,
      xlh:{},
      tyt:'',
      dizhis:'',
      showlist:'',
      zongfen:'',
      order_id:0,
      moneys_order_price:0,
      pay_flag:true,
      sp:{},
      hidden: true,
      setmeal:'',
      unit:{},
      yunfei:'',
      buhuo:{},
      fights: true,
      postage:'',
      quzhifu:false,
  },
  getBackData: function (id, order_id) {
    this.setData({
      dizhis: id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
   // console.log(options);
      var that = this;
    that.setmeal();
      that.setData({
        dizhis:options.id,
        order_id: options.order_id,
      })
      if (that.data.order_id!=0)
      {
        wx.setStorageSync('order_id', Number(that.data.order_id));
      }
      that.shows();
      that.Address();
      that.card();
      that.yunfei();      
      that.practical();
      that.gg();
      that.zongjifen();
      that.yincang();
    var pages = getCurrentPages() //  获取页面栈   
    var prevPage = pages[pages.length - 2]    // 上一个页面   
    prevPage.setData({
      // 给上一个页面变量赋值   
      isRouteMyst: '2'
    })
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
          console.log(e.data.data);
          that.setData({
            setmeal: 1,
            unit: e.data.unit[0],
          })

        }
      }
    })
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '400-118-8366',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
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

  yincang: function () {
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/yincang";
    var d = new Object;
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
        if (e.data.code == '200') {
          var sp = e.data.sp;
          that.setData({
            sp: sp,
          });
          console.log(that.data.sp);
        }
      }
    })
  },
    
cancel: function () {
    var that = this;
    var checks=that.data.checkAl
  var url = "https://giftcardapp.colipu.com/apis.php/shopping/cancelpay";
     var can = that.data.list;
    var d = new Object;
    var jif = can[0]['order_id'];
    d.card_id = wx.getStorageSync('cardid');
    d.order_id =jif;
    wx.request({
      url: url,
      method: 'post',
      data: d,
      success: function (e) {
         if(e.data.code=='200'){
              wx.switchTab({
               url:"../../pages/shop/shop",
              });
         }else if(e.data.code=='200'){
            wx.showToast({    
                title: '失败',
               image: '/img/icon.png',
                duration: 2000
            });
         }
      }
    })
    this.setData({
      flag: true
    })
  },
  zongjifen:function(){
    var that = this;
    var url ="https://giftcardapp.colipu.com/apis.php/shopping/zongjifen";
    var d = new Object;
    d.card_id=wx.getStorageSync('cardid');
    d.fight=wx.getStorageSync('fight');
    // console.log(d);
    wx.request({
      url:url,
      method:'post',
      data:d,
      success:function(e){
        if(e.data.code=='200'){
          that.yunfei();
          var zongfen = e.data.data;
          that.setData({
            zongfen:zongfen,
          })
        }
      }
    })
  },
  shiji:function(){
    var that=this;
     wx.navigateTo({
       url: "/pages/jsadress/address?order_id=" + that.data.order_id,
  });

  },
  gg:function(){
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/jiag";
    var d = new Object();
    d.card_id = wx.getStorageSync('cardid');
    wx.request({
        url:url,
        method:"post",
        data:d,
        success:function(e){
          if(e.data.code=='200'){
              var gfd = e.data.data;
              that.setData({
                xlh:gfd,
              })
          }
        }
    })
  },
  leave:function(e){
    var that = this;
    var leave= e.detail.value;
    that.setData({
        leave:leave,
    })
  },
  shows:function(){
    var that = this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/pay";
    var d = new Object;
    if (that.data.order_id==0)
    {
      d.order_id = wx.getStorageSync('order_id');
    }
    else{
      d.order_id = that.data.order_id;
    }
    d.card_id =  wx.getStorageSync('cardid');
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
        if(e.data.code=='200'){
          var list = e.data.data;
          var moneys= e.data.stat;
          that.setData({
            list:list,
            moneys:moneys,
            moneys_order_price: Number(moneys.order_price) ,
          })
          console.log(that.data.moneys_order_price);
        }
      }
    })
  },
  Address:function(){
      var that = this;     
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/address";
      var d = new Object; 
      d.id = that.data.dizhis;
      d.card_id= wx.getStorageSync('cardid');
      wx.request({
        url:url,
        method:'post',
        data:d,
        success:function(e){
          if(e.data.code=='200'){
            var addre = e.data.data;
            console.log(addre);
            that.setData({
              addre:addre,
              Sitenotes:false,
               Sitenote:true,
            })
          }else{
            that.setData({
              addre:addre,
              Sitenotes:true,
                Sitenote:false,
            })
          }
        }
      })
  },
    card:function(){
    var that=this;
      var url ='https://giftcardapp.colipu.com/apis.php/shopping/cardka';
    var d = new Object;
    d.card_id= wx.getStorageSync('cardid');
        wx.request({
        url:url,
        method:'post',
        data:d,
        success:function(e){
          if(e.data.code=='200'){
            var cardka = e.data.data;
            that.setData({
              cardka:cardka,
            })
          }
        }
      })
  },
  yunfei:function(){
    var that= this;
    var url = "https://giftcardapp.colipu.com/apis.php/shopping/youfei";
    var d = new Object;
    d.project_id = wx.getStorageSync('project_id');
    d.card_id = wx.getStorageSync('cardid')
    d.id= that.data.dizhis;
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
        if(e.data.code=='200'){
          var yf= e.data.data;
          if(yf==0){
            that.setData({        
              yf: '已享受免运费'
            })
          }
          that.setData({
            yunfei:e.data.msg,
            yf: Number(yf),
          })
        }else if(e.data.code=='230'){
          that.setData({
            yf:'已享受免运费',
          }) 
        }else if (e.data.code == '240') {
          var postage = e.data.postage;
          console.log(e.data.postage);
          that.setData({
            postage:postage,
          })
        }
      }
    })
  },
   payment:function(){
     this.global_view();
     var that = this;
     var url = "https://giftcardapp.colipu.com/apis.php/shopping/payment";
        var d = new Object;
     if (!that.data.addre)
     {
       wx.showToast({
            title: '请添加地址',
            image: '/img/icon.png',
            duration: 2000
        });
     }
        d.card_id = wx.getStorageSync('cardid');
        d.freight = that.data.yf;
        d.order_name = that.data.addre['name'];
        d.mobile = that.data.addre['mobile'];
        d.address = that.data.addre['address']+that.data.addre['address_details'];
        d.order_remark = that.data.leave;
        d.id = that.data.order_id;
         if(isNaN(that.data.yf)){
           var tyt =  	Number(that.data.moneys['order_price']);
           d.order_price =  Number(that.data.moneys['order_price']);
         }else{
           var tyt = Number(that.data.moneys['order_price'] * 10000 + that.data.yf * 10000) / 10000;
           d.order_price = Number(that.data.moneys['order_price'] * 10000 + that.data.yf * 10000) / 10000;
           console.log(321);
           console.log(tyt)
         }
     if (that.data.quzhifu == false) {
       that.setData({
         quzhifu: true,
       });
        wx.request({
          url:url,
          method:"post",
          data:d,
          success:function(e){
              if(e.data.code=='200'){
                that.onShow();
              }return;            
          }
        })
     that.yincang();
    this.setData({
      flag: false, 
      tyt:tyt,
    })
       setTimeout(function () {
         that.setData({
           quzhifu: false,
         });
       }, 1500);
     }
  },
confirm: function() {
  var that=this;
  var postage =  that.data.postage;
  var postage_setmeal = that.data.setmeal;
  if(postage_setmeal==1 && postage!=0){
    that.setData({
      fights: false,
      flag: true,
    });
    setTimeout(function () {
      that.setData({
        fights: true,
      })
    }, 3000);return;
  }
  var url ="https://giftcardapp.colipu.com/apis.php/shopping/indent";
    var d = new Object;
    d.order_pay ='1';

  if (wx.getStorageSync('order_id')!=0)
  {
    d.order_id = that.data.order_id;
  }else
  {
    d.order_id = wx.getStorageSync('order_id');
  }
    d.imputs = that.data.zongfen;
    d.card_id=wx.getStorageSync('cardid');
    d.project_id = wx.getStorageSync('project_id');
    var total = that.data.list;
    var good_id ='';
    var totas = '';
    for(var i=0; i<total.length; i++){
        good_id += total[i]['goodsid']+',';
        totas += total[i]['goods_amount']+',';
    }
    d.zhi_id = that.data.addre['id'];
    d.good_id=good_id;
    d.totas = totas;
    console.log(d);
    wx.request({
        url:url,
        method:"post",
        data:d,
        success:function(e){
          console.log(e);
          if(e.data.code=='260'){
            console.log(222);
            wx.showToast({    
              title: '余额不足',
              image: '/img/icon.png',
              duration: 2000
            });           
          } else if(e.data.code=='500'){
            var sp=e.data.sp;
            that.setData({
                sp:sp,
            });
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            });  
          }else if (e.data.code == '261') {
            wx.showToast({
              title: '卡已被禁用',
              image: '/img/icon.png',
              duration: 2000
            });
          }else if (e.data.code == '510'){
            that.setData({
              hidden: false,
            });
            setTimeout(function () {
              that.setData({
                hidden: true,
              })
            }, 1000);
          } else if (e.data.code == '264') {
              var whas = e.data.data;
              // console.log(whas);
              that.setData({
                whas:whas,
              })
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            });
          }else if(e.data.code=='246'){
            // 332027
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            });
          } else if (e.data.code == '7481') {
            var buhuo = e.data.data
            console.log(e)
            that.setData({
              buhuo:buhuo,
            })
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            });
          } else if (e.data.code == '360') {
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            });return;
          }else if(e.data.code=='200'){
          	   that.setData({
			           pay_flag:false,	                 
			    })
          } else if (e.data.code == '370') {
            // wx.showModal({
            //   title: '温馨提示:',
            //   content: e.data.msg,
            // });
            wx.showToast({
              title: e.data.msg,
              image: '/img/icon.png',
              duration: 2000
            }); return;
          }else{
            that.setData({
              hidden: false,
            })
         }
        }
    })
    this.setData({
        flag: true,
        // pay_flag:false,
      })
    },

practical:function(){
  var that=this;
},
Siteskip:function(){
  this.global_view();
  var that = this;
  console.log(that.data.list);
  wx.navigateTo({
    url:"/pages/jsadress/address?order_id="+that.data.order_id,
  });
  if(isNaN(that.data.yf)){
     var tyt =  parsefloat(that.data.moneys['order_price']);
   }else{
     var tyt =  parsefloat(that.data.moneys['order_price'])+parsefloat(that.data.yf);
   }
  that.zongjifen();
  that.setData({
    tyt:tyt,
  })

},
dingdan:function(){
	var that =this;
  wx.redirectTo({
    url: '/pages/order_details/order_details?id='+that.data.order_id
  })
},
shouye:function(){
  wx.switchTab({
    url: '../index/index'
  })
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
     var that = this;
    that.setmeal();
      // that.shows();
      that.Address();
      // that.card();
      that.yunfei();     
    that.yincang(); 
      // that.practical();
      // that.zongjifen();
   if (this.data.isRouteMyst == '2') {
      console.log(1);
      wx.navigateBack({
        delta: 0
      })
    }
      // that.dizhia();
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