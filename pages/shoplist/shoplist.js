// pages/shoplist/shoplist.js
var api_search = "https://giftcardapp.colipu.com/apis.php/index/search";
var api_classify2_goods = "https://giftcardapp.colipu.com/apis.php/index/classify2Goods";
var startItem = 0;  //数据库查询起始点(默认时)
var startItem1 = 0;  //点击销量按钮:数据库查询起始点
var startItem2 = 0;  //点击价格按钮(低~高):数据库查询起始点
var startItem3 = 0;  //点击价格按钮(高~低):数据库查询起始点
var count = 8;  //每页显示的商品数量

var goodsArray = [];   //由搜索关键字而来的所有商品数据(默认状态,即click_item为''时)
var goodsArray1 = [];   //由搜索关键字而来的所有商品数据(点击'销量'事件时,即click_item为1时)
var goodsArray2 = [];   //由搜索关键字而来的所有商品数据(点击价格'低~高'事件时,即click_item为2时)
var goodsArray3 = [];   //由搜索关键字而来的所有商品数据(点击价格'高~低'事件时,即click_item为3时)

var classify2_goodsArray = [];   //由分类页点击某二级分类下的所有商品数据(默认状态,即click_item_classify为''时)
var classify2_goodsArray1 = [];   //由分类页点击某二级分类下的所有商品数据(点击'销量'事件时,即click_item_classify为1时)
var classify2_goodsArray2 = [];   //由分类页点击某二级分类下的所有商品数据(点击价格'低~高'事件时,即click_item_classify为2时)
var classify2_goodsArray3 = [];   //由分类页点击某二级分类下的所有商品数据(点击价格'高~低'事件时,即click_item_classify为3时)

const app = getApp()
// var app = getApp()

// var code1 = true;
// var code2 = false;
// var status = '';

const http = require('../../utils/http')
const ui = require('../../utils/ui')
// var server = require('../../utils/server')    
// const url = app.globalData.url;  
Page({

  /**     
   * 页面的初始数据     
   */  
  data: {
    items: [],  //null
    system: {},
    cardid: null, //用于判断是否登录以判断是否显示商品积分 

    click_item: '',   ///由搜索关键字而来的商品列表页判别用户点击了某事件(销量,低~高,高~低)
    click_item_classify: '', //由分类页点击某二级分类下的商品列表页判别用户点击了某事件(销量,低~高,高~低)
    classify2_id: '', //获取分类页用户点击某二级分类的id
    keyword: '',       //首页或分类页用户输入的关键字
    shoplist_keyword: '',  //商品列表页用户输入的关键字

    //lists: [],          // 接收搜索的内容
    //wxSearchData: '',   // 输入的值

    //商品列表页"综合""销量""价格"红色提示控制
    imageurl2: "../public/images/sort-tip_05.png",  
    daindex2: 0,
    num: 1,
    showMore: false,
    key_word: '',
    show_price: ''

    // search_code: ''  //定义搜索结果状态码: ture为搜索结果有商品数据,false为搜索结果无商品数据
    // code: '',  //用于判断从分类页点击广告位图片后携带的code参数以设置title名称

  },
  
  //点击"价格"按钮促发
  choosesort2: function (e) {
    this.global_view();      
    // startItem2: 0,  //让查询起始点回0
    this.setData({
      num: e.target.dataset.num
    })

    if (this.data.daindex2 == 0) {  
      this.setData({
        imageurl2: "../public/images/sort-tip_03.png",
        daindex2: 1
      })

     // console.log(this.data.keyword)  
      var that = this;
      if (this.data.keyword !== '') { //判断如果是输入关键字进来的那么就调用requestData方法   && this.data.classify2_id == undefined
        startItem2 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        goodsArray2 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
       // console.log('search-22')
        this.setData({
          click_item: 2,
        });
        requestData(that, startItem2, this.data.keyword, 2); //第四参数规定2表示按价格从低往高排序展示出商品列表
      } else if (this.data.classify2_id !== '') {  // && this.data.keyword == undefined
        startItem2 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        classify2_goodsArray2 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
        // startItem2: 0,  //让查询起始点回0
       // console.log('classify2-22')
        this.setData({
          click_item_classify: 2,
        });
        requestData1(that, startItem2, this.data.classify2_id, 2); //第四参数规定2表示按价格从低往高排序展示出商品列表
      } else if (this.data.shoplist_keyword !== '') {  //商品列表页内搜索关键字时
        startItem2 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        goodsArray2 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
      //  console.log('shoplist_search-22')
        this.setData({
          click_item: 2,  
        });
        requestData(that, startItem2, this.data.shoplist_keyword, 2);//第四参数规定2表示按价格从低往高排序展示出商品列表
      }

    } else {
      this.setData({
        imageurl2: "../public/images/sort-tip_02.png",
        daindex2: 0
      })

      var that = this;
      if (this.data.keyword !== '') { //判断如果是输入关键字进来的那么就调用requestData方法   && this.data.classify2_id == undefined
        startItem3 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        goodsArray3 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
      //  console.log('search-33')
        this.setData({
          click_item: 3,
        });
        requestData(that, startItem3, this.data.keyword, 3); //第四参数规定3表示按价格从高往低排序展示出商品列表
      } else if (this.data.classify2_id !== '') {   // && this.data.keyword == undefined
        startItem3 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        classify2_goodsArray3 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
        // startItem3: 0,  //让查询起始点回0
       // console.log('classify2-33')
        this.setData({
          click_item_classify: 3,
        });
        requestData1(that, startItem3, this.data.classify2_id, 3); //第四参数规定3表示按价格从高往低排序展示出商品列表
      } else if (this.data.shoplist_keyword !== '') {  //商品列表页内搜索关键字时
        startItem3 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
        goodsArray3 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
      //  console.log('shoplist_search-33')
        this.setData({
          click_item: 3,
        });
        requestData(that, startItem3, this.data.shoplist_keyword, 3);//第四参数规定3表示按价格从高往低排序展示出商品列表
      }

    }
  },
  //点击"销量"按钮时促发
  changeOil: function (e) {
    this.global_view();
    // startItem: 0  //让查询起始点回0
    this.setData({
      num: e.target.dataset.num,
      imageurl2: "../public/images/sort-tip_05.png",
    })

  //  console.log('点击销量了')
    // console.log(this.data.keyword)
    var that = this;
    if (this.data.keyword !== '') { //判断如果是输入关键字进来的那么就调用requestData方法    && this.data.classify2_id == undefined
      startItem1 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      goodsArray1 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
  //    console.log('search-11')
      this.setData({
        click_item: 1,
      });
      requestData(that, startItem1, this.data.keyword, 1); //第四参数规定1表示按销量倒序展示出商品列表
    } else if (this.data.classify2_id !== '') {   // && this.data.keyword == undefined
      startItem1 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      classify2_goodsArray1 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
   //   console.log('classify2-11')
   //   console.log(this.data.classify2_id)
      this.setData({
        click_item_classify: 1,
      });
      requestData1(that, startItem1, this.data.classify2_id, 1); //第四参数规定1表示按销量倒序展示出商品列表
    } else if (this.data.shoplist_keyword !== '') {  //商品列表页内搜索关键字时
      startItem1 = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      goodsArray1 = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
   //   console.log('shoplist_search-11')
      this.setData({
        click_item: 1,
      });
      requestData(that, startItem1, this.data.shoplist_keyword, 1); //第四参数规定1表示按销量倒序展示出商品列表
    }

  },
  
  //点击'综合'按钮时促发(点击'销量'或'价格'时返回时用到)
  zonghe: function(e){
    this.global_view();
    // startItem: 0  //让查询起始点回0
    this.setData({
      num: e.target.dataset.num,
      imageurl2: "../public/images/sort-tip_05.png",
    })

    //console.log('点击综合了')
  //  console.log(this.data.keyword)
   // console.log(this.data.classify2_id)  
    var that = this;
    if (this.data.keyword != '') { //判断如果是输入关键字进来的那么就调用requestData方法    && this.data.classify2_id == undefined
      this.setData({
        click_item: '',
      });
      startItem = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      goodsArray = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
     // console.log('search-11')
      requestData(that, startItem, this.data.keyword); //正常按关键字查询展示出商品列表
    } else if (this.data.classify2_id !== '') {   // && this.data.keyword == undefined
      this.setData({
        click_item_classify: '',
      });
      startItem = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      classify2_goodsArray = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
     // console.log('classify2-11')            
      requestData1(that, startItem, this.data.classify2_id); //正常点击二级分类时展示出对应的商品列表
    } else if (this.data.shoplist_keyword !== '') {  //商品列表页内搜索关键字时
      this.setData({
        click_item: '',
      })
      startItem = 0    //让其回到初始0的状态, 不然会出现查不到数据的情况(即商品少的情况,即使能查到也不对,因为缺了)
      goodsArray = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
    //  console.log('shoplist_search-11')
      requestData(that, startItem, this.data.shoplist_keyword); //点击返回"综合"按钮时展示出对应的商品列表
    }

  },

  /**  
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // wx.hideShareMenu();
    // app.globalData.search_code = 22  //app.js里的globalData只能在onload里被赋值 哭~
    startItem = 0;  //数据库查询起始点(默认时)----让其查询起始点回0  (不然startItem*不能在 搜索关键字进来的 和 点击二级分类进来的 公用,即会累加startItem*)
    startItem1 = 0;  //点击销量按钮:数据库查询起始点----让其查询起始点回0
    startItem2 = 0;  //点击价格按钮(低~高):数据库查询起始点----让其查询起始点回0
    startItem3 = 0;  //点击价格按钮(高~低):数据库查询起始点----让其查询起始点回0

    
    console.log(options)
    //尝试解决点击二级分类时title名称切换缓慢的问题
    if (options.classify2_id !== "") {
      // 标题根据二级分类名动态变化
      wx.setNavigationBarTitle({
        title: app.globalNav.listtit
      })
    } else {
      // 如果是各处搜索进来的就提示
      wx.setNavigationBarTitle({
        title: '搜索'
      })
    }
    
    if (wx.getStorageSync('cardid') !== '') {   //用于判断用户是否登录以判断是否要显示商品具体的积分值
      this.setData({
        cardid: wx.getStorageSync('cardid'), 
      })
    }

    this.setData({  //首次加载此页面时让click_item和click_item_classify回''
      click_item: '',
      click_item_classify: ''
    })

    // this.setData({  //页面加载时用全局变量(status)给search_code赋值
    //   search_code: status,
    // })

    // if (options) {
    //  // console.log(options)
    //   this.setData({
    //     keyword: options.keyword,
    //     // startItem: 0,  //让查询起始点回0
    //     classify2_id: options.classify2_id,
    //   })
    // }

  //  console.log(status)
  
    this.setData({
      keyword: options.keyword,
      // startItem: 0,  //让查询起始点回0
      classify2_id: options.classify2_id,
      // code: options.code,  //用于判断分类页点击广告位图片后携带的code参数以设置title名称
    })
    

    // wx.setNavigationBarTitle({           
    //   title: "首页"
    // })
    
    //console.log(this.data.keyword)      
    var that = this;
    if (this.data.keyword !== '') {  //判断如果是输入关键字进来的那么就调用requestData方法   && this.data.classify2_id == undefined
      console.log('首页或分类页搜索关键字进来的')
      // requestData(that, startItem, this.data.keyword);
      if (this.data.click_item == '') { //click_item为''表示没有点击任何事件(销量,低~高,高~低)  
        startItem = 0; //让查询起始点回0
        // console.log(startItem)
        goodsArray = [] //让重新搜索时goodsArray回空,不然会叠加上之前搜索的商品
        requestData(that, startItem, this.data.keyword);
        // this.setData({  //页面加载时用全局变量(status)给search_code赋值
        //   search_code: status,
        // })
        // console.log(this.data.search_code)
      } else if (this.data.click_item == 1) { //click_item为1表示点击'销量'事件 (实际上此及往下不会执行)
        requestData(that, startItem1, this.data.keyword, 1);
      } else if (this.data.click_item == 2) { //click_item为2表示点击价格'低~高'事件
        requestData(that, startItem2, this.data.keyword, 2);
      } else if (this.data.click_item == 3) { //click_item为3表示点击价格'高~低'事件
        requestData(that, startItem3, this.data.keyword, 3);
      }
    } else if (this.data.classify2_id !== '') { //判断如果是点击二级分类进来的那么就调用requestData1方法      && this.data.keyword == undefined
      // requestData1(that, startItem, this.data.classify2_id);
      console.log('分类页点击二级分类进来的')
      if (this.data.click_item_classify == '') { //click_item_classify为''表示没有点击任何事件(销量,低~高,高~低)
        startItem = 0; //让查询起始点回0
        classify2_goodsArray = []  //让重新点击某二级分类时classify2_goodsArray回空
        requestData1(that, startItem, this.data.classify2_id);
        //console.log(this.data.search_code)
      } else if (this.data.click_item_classify == 1) { //click_item_classify为1表示点击'销量'事件 (实际上此及往下不会执行)
        requestData1(that, startItem1, this.data.classify2_id, 1);
      } else if (this.data.click_item_classify == 2) { //click_item_classify为2表示点击价格'低~高'事件
      
        requestData1(that, startItem2, this.data.classify2_id, 2);
      } else if (this.data.click_item_classify == 3) { //click_item_classify为3表示点击价格'高~低'事件
       
        requestData1(that, startItem3, this.data.classify2_id, 3);
      }
    } else if (this.data.shoplist_keyword !== '') { //判断如果是商品列表页搜索关键字进来的那么就调用requestData方法(后面测试发现不会走这里,有木有无所谓)
      console.log('商品列表里搜索关键字进来的')
      goodsArray = [] //让重新搜索时goodsArray回空,不然会叠加上之前搜索的商品  
      requestData(that, startItem, this.data.shoplist_keyword);
    }
    // requestData(that, startItem, this.data.keyword);
    // requestData1(that, startItem, this.data.classify2_id);       


    wx.getSystemInfo({
      success: function (res) {   
        that.setData({  
          system: res
        })
      },
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


  

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    // this.global_view();
    
    if (this.data.classify2_id == '') {
      this.setData({
        // key_word: app.globalNav.keyword, //首页过来的搜索关键字
        key_word: wx.getStorageSync('key_word'), //从缓存获取首页或分类页过来的搜索关键字
      })
    } else {
      this.setData({
        key_word: '', //从缓存获取首页过来的搜索关键字
      })
    }
    // goodsArray = [];   //由搜索关键字而来的所有商品数据(默认状态,即click_item为''时)
    // goodsArray1 = [];   //由搜索关键字而来的所有商品数据(点击'销量'事件时,即click_item为1时)
    // goodsArray2 = [];   //由搜索关键字而来的所有商品数据(点击价格'低~高'事件时,即click_item为2时)
    // goodsArray3 = [];   //由搜索关键字而来的所有商品数据(点击价格'高~低'事件时,即click_item为3时)

    // classify2_goodsArray = [];   //由分类页点击某二级分类下的所有商品数据(默认状态,即click_item_classify为''时)
    // classify2_goodsArray1 = [];   //由分类页点击某二级分类下的所有商品数据(点击'销量'事件时,即click_item_classify为1时)
    // classify2_goodsArray2 = [];   //由分类页点击某二级分类下的所有商品数据(点击价格'低~高'事件时,即click_item_classify为2时)
    // classify2_goodsArray3 = [];   //由分类页点击某二级分类下的所有商品数据(点击价格'高~低'事件时,即click_item_classify为3时)

    // this.onLoad();

    // this.setData({
    //   key_word: app.globalNav.keyword, //首页过来的搜索关键字
    // })
    // if (this.data.classify2_id !== '' && this.data.code == 1) {
    //   // 如果是分类页点击广告位进来的就直接写死title
    //   wx.setNavigationBarTitle({
    //     title: '购物卡券'
    //   })
    // } else if
    if (this.data.classify2_id !== '') {
      // 标题根据二级分类名动态变化
      wx.setNavigationBarTitle({
        title: app.globalNav.listtit
      })
    } else {
      // 如果是各处搜索进来的就提示
      wx.setNavigationBarTitle({
        title: '搜索'
      })
    }
  }, 
  
  // //按销量倒序展示商品列表  
  // xiaoliang: function(){
  //   console.log('点击销量了')
  //   // console.log(this.data.keyword)
  //   var that = this;
  //   if (this.data.keyword !== '') { //判断如果是输入关键字进来的那么就调用requestData方法    && this.data.classify2_id == undefined
  //     console.log('search-11')
  //     this.setData({    
  //       click_item: 1,  
  //     });
  //     requestData(that, startItem, this.data.keyword, 1); //第四参数规定1表示按销量倒序展示出商品列表
  //   } else if (this.data.classify2_id !== '') {   // && this.data.keyword == undefined
  //     console.log('classify2-11')
  //     console.log(this.data.classify2_id)         
  //     this.setData({
  //       click_item_classify: 1,    
  //     });
  //     requestData1(that, startItem, this.data.classify2_id, 1); //第四参数规定1表示按销量倒序展示出商品列表
  //   }
    
  // }, 
  
  // //点击价格从低往高排序时促发此事件    
  // digao: function(){
  //   var that = this;
  //   if (this.data.keyword !== '' && this.data.classify2_id == undefined) { //判断如果是输入关键字进来的那么就调用requestData方法
  //     console.log('search-22') 
  //     this.setData({
  //       click_item: 2,
  //     });
  //     requestData(that, startItem, this.data.keyword, 2); //第四参数规定2表示按价格从低往高排序展示出商品列表
  //   } else if (this.data.classify2_id !== '' && this.data.keyword == undefined) {
  //     console.log('classify2-22')
  //     this.setData({
  //       click_item_classify: 2,
  //     });
  //     requestData1(that, startItem, this.data.classify2_id, 2); //第四参数规定2表示按价格从低往高排序展示出商品列表
  //   }  
    
  // },  

  // //点击价格从高往低排序时促发此事件
  // gaodi: function(){
  //   var that = this;
  //   if (this.data.keyword !== '' && this.data.classify2_id == undefined) { //判断如果是输入关键字进来的那么就调用requestData方法
  //     console.log('search-33')
  //     this.setData({
  //       click_item: 3,
  //     });
  //     requestData(that, startItem, this.data.keyword, 3); //第四参数规定3表示按价格从高往低排序展示出商品列表
  //   } else if (this.data.classify2_id !== '' && this.data.keyword == undefined) {
  //     console.log('classify2-33')
  //     this.setData({
  //       click_item_classify: 3,
  //     });
  //     requestData1(that, startItem, this.data.classify2_id, 3); //第四参数规定3表示按价格从高往低排序展示出商品列表
  //   }

  //   // console.log(33);
  //   // this.setData({
  //   //   click_item: 3, 
  //   // });
  //   // var that = this;
  //   // requestData(that, startItem, this.data.keyword, 3); //
  // },


  // 上拉加载新数据 
  onReachBottom: function () {     
    console.log("上拉加载....")
    // 重新发送请求
    var that = this;
    
    if (this.data.keyword !== '') { //判断如果是输入关键字进来的那么就调用requestData方法    && this.data.classify2_id == undefined
      // requestData(that, startItem, this.data.keyword);
      if (this.data.click_item == '') { //click_item为''表示没有点击任何事件(销量,低~高,高~低)
        requestData(that, startItem, this.data.keyword);
      } else if (this.data.click_item == 1) { //click_item为1表示点击'销量'事件
        requestData(that, startItem1, this.data.keyword, 1);  
      } else if (this.data.click_item == 2) { //click_item为2表示点击价格'低~高'事件
        requestData(that, startItem2, this.data.keyword, 2);
      } else if (this.data.click_item == 3) { //click_item为3表示点击价格'高~低'事件
        requestData(that, startItem3, this.data.keyword, 3);
      }
    } else if (this.data.classify2_id !== '') {  //判断如果是点击二级分类进来的那么就调用requestData1方法    && this.data.keyword == undefined
      // requestData1(that, startItem, this.data.classify2_id);
      if (this.data.click_item_classify == '') { //click_item_classify为''表示没有点击任何事件(销量,低~高,高~低)
        requestData1(that, startItem, this.data.classify2_id);
      } else if (this.data.click_item_classify == 1) { //click_item_classify为1表示点击'销量'事件
        requestData1(that, startItem1, this.data.classify2_id, 1);
      } else if (this.data.click_item_classify == 2) { //click_item_classify为2表示点击价格'低~高'事件
        requestData1(that, startItem2, this.data.classify2_id, 2);
      } else if (this.data.click_item_classify == 3) { //click_item_classify为3表示点击价格'高~低'事件
        requestData1(that, startItem3, this.data.classify2_id, 3);
      }
    } else if (this.data.shoplist_keyword !== '') {  //判断如果是商品列表页搜索关键字进来的那么就调用requestData方法
      // requestData(that, startItem, this.data.shoplist_keyword);
      if (this.data.click_item == '') { //click_item为''表示没有点击任何事件(销量,低~高,高~低)
        console.log('你好')
        requestData(that, startItem, this.data.shoplist_keyword);
      } else if (this.data.click_item == 1) { //click_item为1表示点击'销量'事件
        requestData(that, startItem1, this.data.shoplist_keyword, 1);
      } else if (this.data.click_item == 2) { //click_item为2表示点击价格'低~高'事件
        requestData(that, startItem2, this.data.shoplist_keyword, 2);
      } else if (this.data.click_item == 3) { //click_item为3表示点击价格'高~低'事件
        requestData(that, startItem3, this.data.shoplist_keyword, 3);
      }
    }
    // requestData(that, startItem, this.data.keyword);
    // requestData(that, startItem, this.data.keyword, 1);
    // requestData1(that, startItem, this.data.classify2_id); 
    //wxSearchInput()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新....")
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1000)
    // 直接调用onLoad方法
    // this.onLoad()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成 
   */  
  onReady: function () {

  },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {

  // },

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
  },

  /**
   * 搜索
   */
  // wxSearchInput: function (value) {
  //   var that = this;
  //   if (value.detail.value.length > 0) {
  //     wx.request({
  //       //url: 'https://giftcardappuat.colipu.com:9999/apis.php/index/search',
  //       data: {
  //         value: value.detail.value
  //       },
  //       header: { 'content-type': 'application/x-www-form-urlencoded' },
  //       method: 'POST',
  //       dataType: json,
  //       responseType: text,
  //       success: function (res) {
  //         if (res.code) {
  //           var data = that.data.lists;
  //           for (let i = 0; i < res.data.length; i++) {
  //             data.push(res.data[i]);
  //           }
  //           that.setData({
  //             wxSearchData: value.detail.value,
  //             lists: data
  //           })
  //         }
  //       },
  //       fail: function (res) { },
  //       complete: function (res) { },
  //     })
  //   }
  // },

  // wxSearchInput: function (value) {  
  //   console.log(value)
  //   var that = this;
  //   //requestData(that, startItem, that.wxSearchData);
  //   requestData(that, startItem, value);
  // },


  //监控视图层商品列表页里输入框失去焦点时促发 (本页,即商品列表页的搜素事件)
  search: function (e) {
    
    if (e.detail.value !== '') {
      goodsArray = []  //让其回到清空状态, 不然会包含从首页或分类页搜索关键字获取的商品,即不然会累加
      this.setData({
        shoplist_keyword: e.detail.value,  //商品列表页内输入关键字搜索商品时给shoplist_keyword变量赋值
        keyword: '',  //首页或分类页搜索关键字进来的回''
        click_item: '',  //回到默认为''
        classify2_id: '',  //搜索时让二级分类id为空  (非常重要!!! 如果不回空,那么点"销量""价格"或回点"综合"时相当于点击二级分类查对应所有商品了)
        // startItem: 0

        //下面两行是让标红提示回到"综合"按钮上
        num: 1,
        imageurl2: "../public/images/sort-tip_05.png",
      })
      console.log(e.detail.value);
      console.log('商品列表里搜索关键字进来的')
      var that = this;
      // requestData(that, startItem, e.detail.value);
      startItem = 0
      goodsArray = [] //让重新搜索时goodsArray回空,不然会叠加上之前搜索的商品  
      requestData(that, startItem, this.data.shoplist_keyword);
      // this.onLoad()
      // 商品列表页里搜索时设置title提示为"搜索"
      wx.setNavigationBarTitle({  //在onShow方法里判断不了~
        title: '搜索'
      })      
    } else {
      wx.showToast({
        title: '请输入关键字哦',
        image: '/img/icon.png',
        duration: 800 
        // duration: 1000, 
      })
    }
  },

  
})



/** 私有方法: 用户搜索商品关键字获取相关的商品列表(item_code默认为'',即让其处于"综合"位置)*/
function requestData(that, startNum, keyword, item_code='') {
  console.log(startNum)
  console.log(item_code);
  // console.log("test值为: " + that.data.test);   
  // 页面初始化 options为页面跳转所带来的参数
  

  // wx.showLoading({  //必须配合wx.hideLoading()才能关闭
  //   title: '加载中...',
  // })

  // setTimeout(function () {  
  //   wx.hideLoading()
  // }, 1000)


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

  wx.request({
    url: api_search + "?start=" + startNum + "&count=" + count + "&keyword=" + keyword + "&uid=" + wx.getStorageSync('cardid') + "&project_id=" + wx.getStorageSync('project_id') + "&item_code=" + item_code,  
    header: {
      "Content-Type": "json"
    }, 
    success: function (res) { 
      console.log(res)
      wx.hideToast();
      var data = res.data;
      if (data.code == '200') { //code为200才显示数据
        wx.showLoading({  //必须配合wx.hideLoading()才能关闭
          title: '加载中...',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 800)
        // status = code1  //给全局变量status赋值:true规定为搜索时有商品数据(决定视图层显示具体商品)
        if (item_code == '') {  //根据用户不同的点击事件(销量,低~高,高~低)选择对应的容器数组
          // goodsArray = []   
          goodsArray = goodsArray.concat(data.data);
          console.log('看不见我:' +'(空)'+ item_code)
          console.log(goodsArray);
        } else if (item_code == 1) {
          goodsArray1 = goodsArray1.concat(data.data);
          console.log('xiaoliang:' + item_code)
          console.log(goodsArray1);
        } else if (item_code == 2) {   
          goodsArray2 = goodsArray2.concat(data.data);
          console.log('digao:' + item_code)
          console.log(goodsArray2);
        } else if (item_code == 3) {
          goodsArray3 = goodsArray3.concat(data.data);
          console.log('gaodi:' + item_code)
          console.log(goodsArray3);
        }
        // that.setData({
        //   showMore: true  //给showMore赋值用于判断是否在wxml中显示"已经到底啦~"
        // })
        // goodsArray = goodsArray.concat(data.data);  
        // console.log(goodsArray);
    
      } else {
        // status = code2  //给全局变量status赋值:false规定为搜索结果为无商品数据(决定视图层显示无结果提示)  
        // wx.showToast({
        //   title: '没有更多数据啦',
        //   icon: "none"  //none为隐藏图标
        //   // image: '' 
        //   // duration: 1000, 
        // })
        // setTimeout(function () {
        //   wx.hideToast()
        // }, 800)
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"已经到底啦~"
        })
      }
      // 更新商品数组  
      if (item_code == '') {
        if (res.data.msg == null) {  //登录前msg返回null
          that.setData({
            items: goodsArray,
            show_price: ''
          });
        } else if(res.data.msg == "系统异常"){  //"系统异常"为懒加载时当全部加载完毕无数据返回时的提示信息
          that.setData({
            items: goodsArray,
            
          });
        }else{   //登录后
          that.setData({
            items: goodsArray,
            show_price: res.data.msg['show_price']
          });
        }
      } else if (item_code == 1) {
        that.setData({
          items: goodsArray1
        });
      } else if (item_code == 2) {
        that.setData({
          items: goodsArray2
        });
      } else if (item_code == 3) {
        that.setData({
          items: goodsArray3
        });
      }

      //针对不同点击事件(销量,价格)设置不同查询起始点
      if (item_code == '') {
        startItem = startItem + count;
      } else if (item_code == 1) {
        startItem1 = startItem1 + count;
      } else if (item_code == 2) {
        // startItem2 = 0;
        startItem2 = startItem2 + count;
      } else if (item_code == 3) {
        // startItem3 = 0;
        startItem3 = startItem3 + count;
      }
      // startItem = startItem + count; 
    },
    fail: function () {  
      console.log("网络请求失败");
    }
  })
}
    



/** 私有方法: 用户在分类页点击二级分类时展示该分类下的所有商品(item_code_classify默认为'',即让其处于"综合"位置)*/
function requestData1(that, startNum, classify2_id, item_code_classify='') {
  console.log(startNum)
  // console.log("test值为: " + that.data.test);
  // 页面初始化 options为页面跳转所带来的参数
  

  // wx.showLoading({  //必须配合wx.hideLoading()才能关闭
  //   title: '加载中...',
  // })

  // setTimeout(function () {
  //   wx.hideLoading()
  // }, 1000)


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

  wx.request({
    url: api_classify2_goods + "?start=" + startNum + "&count=" + count + "&classify2_id=" + classify2_id + "&uid=" + wx.getStorageSync('cardid') + "&project_id=" + wx.getStorageSync('project_id') + "&item_code_classify=" + item_code_classify,
    header: {
      "Content-Type": "json"
    },
    success: function (res) {           
      console.log(res)  
      // wx.hideToast(); 
      var data = res.data;
      if (data.code == '200') { //code为200才显示数据
        wx.showLoading({  //必须配合wx.hideLoading()才能关闭
          title: '加载中...',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 800)

        // status = true  //给全局变量status赋值: true表示该二级分类下有商品数据(决定视图层显示具体商品)
        if (item_code_classify == '') {  //根据用户不同的点击事件(销量,低~高,高~低)选择对应的容器数组   
          classify2_goodsArray = classify2_goodsArray.concat(data.data);
          console.log('看不见我:' + '(空)' + item_code_classify)
          console.log(classify2_goodsArray);
        } else if (item_code_classify == 1) {
          classify2_goodsArray1 = classify2_goodsArray1.concat(data.data);
          console.log('xiaoliang:' + item_code_classify)
          console.log(classify2_goodsArray1);
        } else if (item_code_classify == 2) {
          classify2_goodsArray2 = classify2_goodsArray2.concat(data.data);
          console.log('digao:' + item_code_classify)
          console.log(classify2_goodsArray2);
        } else if (item_code_classify == 3) {
          classify2_goodsArray3 = classify2_goodsArray3.concat(data.data);
          console.log('gaodi:' + item_code_classify)
          console.log(classify2_goodsArray3);
        }
        // that.setData({
        //   showMore: true  //给showMore赋值用于判断是否在wxml中显示"已经到底啦~"
        // })
        // classify2_goodsArray = classify2_goodsArray.concat(data.data);
      } else {
        // status = false  //给全局变量status赋值: false表示该二级分类下无商品数据(决定视图层显示无结果提示)
        // wx.showToast({
        //   title: '没有更多数据啦',
        //   icon: "none"  //none为隐藏图标
        //   // image: '' 
        //   // duration: 1000, 
        // })
        // setTimeout(function () {
        //   wx.hideToast()
        // }, 800)
        that.setData({
          showMore: true  //给showMore赋值用于判断是否在wxml中显示"已经到底啦~"
        })
      }
      // 更新商品数组
      if (item_code_classify == '') {
        if (res.data.msg == null) {
          that.setData({
            items: classify2_goodsArray,
            show_price: ''
          });
        } else if (res.data.msg == "系统异常") {   //"系统异常"为懒加载时当全部加载完毕无数据返回时的提示信息
          that.setData({
            items: classify2_goodsArray,
            
          });
        }else{  //登录后
          that.setData({
            items: classify2_goodsArray,
            show_price: res.data.msg['show_price']
          });
        }
      } else if (item_code_classify == 1) {
        that.setData({
          items: classify2_goodsArray1
        });
      } else if (item_code_classify == 2) {
        that.setData({
          items: classify2_goodsArray2
        });
      } else if (item_code_classify == 3) {
        that.setData({
          items: classify2_goodsArray3
        });
      }  
      // that.setData({  
      //   items: classify2_goodsArray
      // });
      
      //针对不同点击事件(销量,价格)设置不同查询起始点
      if (item_code_classify == '') {
        startItem = startItem + count;
      } else if (item_code_classify == 1) {
        startItem1 = startItem1 + count;
      } else if (item_code_classify == 2) {
        // startItem2 = 0;
        startItem2 = startItem2 + count;
      } else if (item_code_classify == 3) {
        // startItem3 = 0;
        startItem3 = startItem3 + count;
      }
      // startItem = startItem + count;
    },
    fail: function () {
      console.log("网络请求失败");
    }
  })
}