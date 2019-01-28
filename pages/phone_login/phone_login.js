// pages/phone_login/phone_login.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用
    mobile:'',
    content:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
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
 
  mobile:function(e){  
    var that = this;
    var mobile = e.detail.value;
    var url = 'https://giftcardapp.colipu.com/apis.php/login/telverify';     
      var d    = new Object;
          d.mobile = mobile;
      wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
          }
      })
    that.setData({
      mobile:mobile,
    })
  },
  re_login_phone:function(){
    wx.redirectTo({
      url: '../../pages/login/login',
    })
  },
  password:function(e){
    var that = this;
    var content = e.detail.value;
    that.setData({
    content:content
    })
  },
   landing: function() {
     var that = this;
     var url = 'https://giftcardapp.colipu.com/apis.php/login/tellogin';     
      var d    = new Object;
          d.mobile = that.data.mobile;
          d.content = that.data.content;
          if (d.mobile=='')
          {
            wx.showToast({
              title: '请输入手机号',
              image: '/img/icon.png',
              duration: 2000
            });
            return;
          }

     var pd = /^1[3456789]\d{9}$/;
     if (!pd.test(that.data.mobile)) {
       wx.showToast({
         title: '请输入正确手机号',
         image: '/img/icon.png',
         duration: 2000
       });
       return;
     }else
     {
       wx.request({
         url: url,
         method: 'post',
         data: d,
         success: function (e) {
           if (e.data.code == '206') {
             wx.switchTab({
               url: '/pages/personal/personal'
             });
             console.log(e.data);
             wx.setStorageSync('cardid', e.data.id);
             wx.setStorageSync('project_id', e.data.project_id);
             app.globalNav.currentLocation=0;
             app.globalData.current = 0;
             that.setData({
               flag: false
             })
           } else if (e.data.code == '205') {
             wx.showToast({
               title: '验证码有误',
               image: '/img/icon.png',
               duration: 2000
             });
             return;
           } else if (e.data.code == '207') {
             wx.showToast({
               title: '验证码有误',
               image: '/img/icon.png',
               duration: 2000
             });
             return;
           } else if (e.data.code == '230') {
             wx.showToast({
               title: e.data.msg,
               image: '/img/icon.png',
               duration: 2000
             }); return;
           } else if (e.data.code == '223') {
             wx.showToast({
               title: e.data.msg,
               image: '/img/icon.png',
               duration: 2000
             }); return;
           }else if(e.data.code=='266'){
                     wx.showToast({    
                        title: '未绑定手机号',
                        image: '/img/icon.png',
                        duration: 2000
                    });

           } else if (e.data.code == '280') {
             wx.showToast({
               title: e.data.msg,
               image: '/img/icon.png',
               duration: 2000
             })
           }
         }

       }) 

     }
         
  },
  /*
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.global_view();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
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
  },
    bindButtonTap: function() {
      var that = this;
      var url = 'https://giftcardapp.colipu.com/apis.php/login/qingqiu';     
      var d    = new Object;
          d.mobile = that.data.mobile;
      wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
            var pd = /^(13|14|15|16|17|18|19)[\d]{9}$/;
            if(!pd.test(that.data.mobile)){
                    wx.showToast({    
                        title: '请输入正确手机号',
                        image: '/img/icon.png',
                        duration: 2000
                    });
            }else if(e.data.code=='266'){
                     wx.showToast({    
                        title: '未绑定手机号',
                        image: '/img/icon.png',
                        duration: 2000
                    });

            }else if(that.data.mobile==''){
              wx.showToast({    
                  title: '请填写手机号',
                   image: '/img/icon.png',
                  duration: 2000
              });
            }else if(e.data.code=='260'){
              wx.showToast({    
                  title: '积分卡已被禁用',
                   image: '/img/icon.png',
                  duration: 2000
              });
            }else if(e.data.code=='230'){
              wx.showToast({    
                  title: e.data.msg,
                   image: '/img/icon.png',
                  duration: 2000
              });
            } else if (e.data.code == '223') {
              wx.showToast({
                title: e.data.msg,
                image: '/img/icon.png',
                duration: 2000
              });
            }else if(e.data.code=='200'){
                var verify = e.data.stuts.Rets[0];             
                that.setData({
                   verify:verify.Msg_Id,
                })
                               that.setData({
                  disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
                })
                var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
                //设置一分钟的倒计时
                var interval = setInterval(function() {
                  currentTime--; //每执行一次让倒计时秒数减一
                  that.setData({
                    text: '重新发送' + '(' + currentTime + 's' + ')', //按钮文字变成倒计时对应秒数
                  })
                  //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
                  if (currentTime <= 0) {
                    clearInterval(interval)
                    that.setData({
                      text: '重新发送',
                      currentTime: 61,
                      disabled: false
                    })
                  }
                }, 1000);
            }else{

            }
          }
      })  

  }
})