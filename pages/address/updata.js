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
    provinces:'',
    citys:'',
    countys:'',
    dxz:'',
    itemid:'',
    card_id:'',
    is_default:'',
    names:'',
    mobile:'',
    // address:'',
    address_details:'',
    status:'',
    username:'',
    address:'',
    addr:'',
    addend:false,
    allGoodsFilte: [
      {danxuan:'0',bushidx:'1',checked: false },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu() //隐藏转发选项(此页不让转发)
      var that = this;
      that.setData({
        itemid : options.id,
        card_id:options.card_id,
        is_default:options.is_default,
        names:options.name,
        mobile:options.mobile,
        address:options.address,
        address_details:options.address_details,
        status:options.status
      })
    if (that.data.is_default==1)
    {
      var allGoodsFilte = that.data.allGoodsFilte;
      
      allGoodsFilte[0]['checked']=true;

      that.setData({
        allGoodsFilte: allGoodsFilte,
      })
      
    }
  
    var address_str_1=options.address.split(',');
    
    that.setData({
      provinces: address_str_1[0],
      citys: address_str_1[1],
      countys: address_str_1[2],
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


    // check:function(e){
    
    //   var dxz =e.changedTouches.length;

    //   this.setData({
    //     dxz:dxz,
    //   })
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
      dxz:dxz,
    })
   
  },
    submits:function(e){
      this.global_view();   
      var that = this;
      var url = 'https://giftcardapp.colipu.com/apis.php/login/uppsite';
      var d = new Object;
      d.id = that.data.itemid;
      d.card_id=  that.data.card_id;
      d.name = that.data.names;
      d.mobile = that.data.mobile;
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
      var province_ce = '';
      if (that.data.provinces != '') {
        province_ce = that.data.provinces;
        d.address = that.data.provinces + ',' + that.data.citys + ',' + that.data.countys;
      } else {
        province_ce = that.data.province;
        d.address = that.data.province + ',' + that.data.city + ',' + that.data.county;
      }
      d.address_details = that.data.address_details;
      d.is_default = that.data.allGoodsFilte[0]['checked'];
      if (province_ce == '~请选择~') {
        wx.showToast({
          title: '请选择地址',
          image: '/img/icon.png',
          duration: 2000
        });
        return;
      }
    //  console.log(d);
      if (d.address_details.match(/^[ ]*$/) || d.address_details == '' ) {
        wx.showToast({
          title: '请输入详细地址',
          image: '/img/icon.png',
          duration: 2000
        });
        return;
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
                    duration: 1000
                  })
                // wx.redirectTo({
                //     url: '../address/address',
                //   })
                wx.navigateBack({
                  delta: 1
                })
             }else if(e.data.code=='209'){
               wx.showToast({    
                      title: '请修改后保存',
                       image: '/img/icon.png',
                      duration: 1000
                  })
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
  delet:function(e){
    this.global_view();
    var that  = this;
    if (this.data.addend == false) {
      this.setData({
        addend: true,
      });
      var url =  "https://giftcardapp.colipu.com/apis.php/login/delet";
    var d = new Object;
    d.card_id =  wx.getStorageSync('cardid');
    d.id = e.currentTarget.dataset.id;
    wx.request({
      url:url,
      method:"post",
      data:d,
      success:function(e){
          if(e.data.code=="200"){
            
              wx.showToast({    
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
              })
            // wx.redirectTo({
            //   url: '../../pages/address/address',
            // })
            wx.navigateBack({
              delta: 1
            })
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
  username:function(e){
    var that = this;
    var names = e.detail.value;
    that.setData({
      names:names,
    })
  },
  telthone:function(e){
    var that = this;
    var mobile = e.detail.value;
    that.setData({
      mobile:mobile,
    })
  },
  addr:function(e){
   
    var that = this;
    var address_details = e.detail.value;
    that.setData({
      address_details:address_details,
   })
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

    // console.log(this.data.province);

  },
  //隐藏picker-view
  hiddenFloatView: function(e) {
    var that = this;
    // console.log(e);
    model.animationEvents(this, 200, false, 400);
    // console.log(e.target.id)
    if(e.target.id == '11')
    {
      that.setData({
        provinces: '',
        citys: '',
        countys: '',
      })
    }
   
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