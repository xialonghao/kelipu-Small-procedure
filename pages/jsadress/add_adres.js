// pages/add_adres/add_adres.js
var model = require('../../model/model.js')
var show = false;
var item = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      show: show
    },
    province:'',
    city:'',
    county:'',
    names:'',
    mobile:'',
    address:'',
    dizhi:'',
    detu:'',
    dxz:'',
    addend: false,
    allGoodsFilte: [
      { danxuan: '0', bushidx: '1', checked: false },
    ],
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

  username:function(e){
     console.log(e);
       var that = this;
       var names = e.detail.value;
       that.setData({
         names :names,
       })
  },
  telthone:function(e){
      console.log(e);
      var that = this;
      var mobile = e.detail.value;
      that.setData({
        mobile : mobile
      })
  },
  address:function(e){     
      var that = this;
      var address = e.detail.value;
      that.setData({
        address:address,
      })
  },  
  check:function(e){
    // console.log(e);
    var allGoodsFilte = this.data.allGoodsFilte;
    var dxz = allGoodsFilte[0].bushidx;
    // console.log(dxz);
    var checkArr = e.detail.value;
    // console.log(checkArr);
    for (var i = 0; i < allGoodsFilte.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        allGoodsFilte[i].checked = true;
      } else {
        allGoodsFilte[i].checked = false;
      }
    }
    this.setData({
      allGoodsFilte: allGoodsFilte,
      dxz: dxz,
    })
  },
  
  submits:function(){
    var that = this;


    this.global_view();
    var url = 'https://giftcardapp.colipu.com/apis.php/login/addsite';
      var d = new Object;
      d.card_id=  wx.getStorageSync('cardid');
      d.name = that.data.names,
      d.mobile = that.data.mobile,
      d.address = that.data.province+','+that.data.city+','+that.data.county,
      d.address_details = that.data.address,
      d.city = that.city;
      d.county = that.county;
      d.is_default = that.data.dxz;

  

    if (d.name.match(/^[ ]*$/) || d.name == '') {
      wx.showToast({
        title: '请输入姓名',
        image: '/img/icon.png',
        duration: 2000
      });
      return;
    }
    var pd = /^1[3456789]\d{9}$/;
    if (!pd.test(d.mobile)) {
      wx.showToast({
        title: '请输入正确手机号',
        image: '/img/icon.png',
        duration: 2000
      });
      return;
    }
    if (that.data.province == '~请选择~') {
      wx.showToast({
        title: '请选择地址',
        image: '/img/icon.png',
        duration: 2000
      });
      return;
    }

    if (d.address_details.match(/^[ ]*$/) || d.address_details == '') {
      wx.showToast({
        title: '请输入详细地址',
        image: '/img/icon.png',
        duration: 2000
      });
      return;
    }
      if(that.data.names==''||that.data.mobile=='' || that.data.address=='' ||that.data.city=='' ||that.data.county==''){
         wx.showToast({    
                      title: '请填写完整',
                      image: '/img/icon.png',
                      duration: 2000
                  });return;
      }
    if (this.data.addend == false) {
      this.setData({
        addend: true,
      });
      wx.request({
          url:url,
          method:'post',
          data:d,
          success:function(e){
              if(e.data.code=='200'){
                    wx.showToast({    
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                  })
                wx.navigateBack({
                  delta: 1
                })
             }else if(e.data.code=='208'){
               wx.showToast({    
                      title: '保存失败',
                      image: '/img/icon.png',
                      duration: 2000
                  })
             }
          }
                
      })

      setTimeout(function () {
        that.setData({
          addend: false,
        });
      }, 3000);
    }  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);

  },
  //点击选择城市按钮显示picker-view
  translate: function(e) {
    var ex = model.animationEvents(this, 0, true, 400);
    console.log(e);
  },
  //隐藏picker-view
  hiddenFloatView: function(e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function(e) {
    var son = model.updateAreaData(this, 1, e);
    var item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
    console.log(e);
    console.log(item);
  },
  onReachBottom: function () { },
  nono: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 监听页面显示的处理函数
   */
  onShow: function() {
    // this.global_view();
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