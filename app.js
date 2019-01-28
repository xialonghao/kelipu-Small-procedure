//app.js
var server = require('/utils/server')
App({
  onLaunch: function () {
    // 展示本地存储能力
    // this.bannerfun();
    var that =this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // //轮播图及顶级分类展示 
  // bannerfun: function (res) {
  //   var that = this;

  //   server.getJSON("/index/banner", { uid: wx.getStorageSync('cardid'), project_id: wx.getStorageSync('project_id') }, function (res) {
  //     console.log(res.data.data);
  //     var called = res.data.data[0];
  //     wx.setStorageSyneSync('called', called);

      // if (that.employIdCallballbacks){
      //  that.employIdCallballbacks(called);
      // }

  //     if (res.data.code == '500') {
  //       that.setData({
  //         imgUrls: '', //轮播图
  //         classify: '', //商品分类    
  //         autoplay: true
  //       });
  //     } else {
  //       that.setData({
  //         imgUrls: res.data.data[0], //轮播图
  //         classify: res.data.data[1], //商品分类    
  //         autoplay: true
  //       });
  //     }

      

  //   });
  // },




  globalNav: {
    userInfo: null,
    currentLocation: '',
    listtit: '',
    // search_code: ''
    dataclick: true,
    keyword: ''  //首页搜索的关键字
  },
  globalData: {
    csrdid: 123,//卡id
    projectid:null,//项目id
    userInfo: null,
    url:"https://giftcardapp.colipu.com/apis.php",
    datas:null,
    // search_code: null
    dizhis:null,
    current:1
  }
})