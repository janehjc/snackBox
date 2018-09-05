# snackBox

这是一款应用于校园宿舍零食盒子简单vue项目，技术栈：vue、ElementUI、微信支付(H5网页支付、微信公众号支付 两种支付场景）。

应用中难点：微信支付(H5网页支付、微信公众号支付）场景理解及前后端数据效验。

1、H5网页支付：不基于微信环境的H5页面访问
    1）前端这边需要做的事很简单，根据后台（服务端）接口 入参协议 传给 后台 对应的订单数据信息；
    2）后台（服务端）收到参数 起调微信统一下单接口文档，下单校验成功，会返回给前端 mweb_url 回调微信支付的地址，我们拿到这个地址，根据微信官方文档配置window.location.href = respData.mweb_url + '&redirect_url=https://www.baidu.com' 起调微信支付校验即可。
    3）redirect_url 属性 是 我们支付成功后点击确定 需要回调到 你想去的前端界面 公网环境的路径。
    4）微信支付 会对 终端ip(当前手机网络公网ip）和 微信接收到的服务端传输ip做效验，一致则通过。

2、微信公众号支付：微信内运行 H5页面访问
    1）微信公众号支付（H5页面）调起微信支付 第一步 和 H5网页支付一样，需要效验环境 公网IP是否一致；
    2）获取当前 微信 code（唯一性） 服务端需要拿着code去起调微信获取openId；
    3）（根据后端接口入参协议 + code）请求后端（服务端）下单接口，服务端接收到参数生成订单（或者拿着前端生成的随机订单号“小于32位”）调用微信统一下单接口，生成签名 返回给前端起调微信支付几个必须的参数（官方文档很详细，代码如下：）
    4）签名验证 这个过程 可能会出现很多报错形式，细心细心再细心，一般都是必传数据是否一致\正确\字符长度 等问题导致的，只要足够心细一定会解决的，都不是什么大问题，好啦，说的有点繁琐，祝好运！
    
    
    var ua = navigator.userAgent.toLowerCase(); //判断当前环境
    if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信 
        this.wxPay(respData);
    }else{//其他浏览器
        window.location.href = respData.mweb_url + '&redirect_url=https://www.baidu.com';
    }
    //公众号支付
    wxPay(e){
        var wxData = {
                "appId":e.app_id,     //公众号名称，由商户传入     
                "timeStamp":e.timestamp, //时间戳，自1970年以来的秒数     
                "nonceStr":e.nonce_str, //随机串     
                "package":e.prepay_id,   // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）  
                "signType":"MD5",         //微信签名方式：     
                "paySign":e.sign //微信签名 
            }
        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',wxData,
                function(res){
                if(res.err_msg == "get_brand_wcpay_request:ok" ){
                    alert("支付成功");
                    //微信支付成功后回调地址
                    window.location.href = "https://www.baidu.com";
                } 
            }); 
        }
        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
   }
