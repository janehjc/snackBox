var respImg = 'http://www.bdgaoxiao.com';   //公网
//var respImg = 'http://test.xingchida.com';   //测试环境
//var respImg = 'http://192.168.21.138:8080';  //联调地址
var respUrl = respImg + '/snacksBox/f/app/getH5Response/';   //接口
//截取url参数
var getParam = function getParam(paramName) {
	paramValue = "", isFound = !1;
	if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
		arrSource = decodeURI(window.location.search).substring(1, window.location.search.length).split("&"), i = 0;
		while (i < arrSource.length && !isFound) {
			arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++;
		}
	}
	return paramValue == "" && (paramValue = null), paramValue;
}
// 设置cook
Vue.prototype.setCookie = function(c_name, value, time) {
	var exdate = new Date();
	if(time && time !=0){
		exdate = new Date(time);
	}
	document.cookie = c_name + "=" + escape(value) + ((time == null || time==0) ? "" : ";expires=" + exdate.toGMTString())
}
// loading加载
var loading;
Vue.prototype.startLoading = function (){
   	loading = this.$loading({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.2)'
    })
}
// 取消加载
Vue.prototype.endLoading = function (){
   	loading.close();
}
// 消息
Vue.prototype.message = function (msgCon,msgType){
   	this.$message({  
        message : msgCon,  
        type : msgType,
        duration : 2000
    });
}
//价格筛选
Vue.filter("moneyMark", function (value) {
	var moneyNum = '';
	if(value != '' && value != null){
		moneyNum = '¥ ' + value;
	}
    return moneyNum;
});
//返回
Vue.prototype.goBack = function (){
   	window.history.back();
}
//动态适配字体大小
Vue.prototype.setFontSize = function (){
	var docEl = document.documentElement,
	    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	    recalc = function() {
	        //设置根字体大小
	        let maxWidth = 750
	        let cw = docEl.clientWidth>maxWidth ? maxWidth : docEl.clientWidth
	        docEl.style.fontSize = 10 * (cw / 320) + 'px';
	    };
	window.addEventListener(resizeEvt, recalc, false);
	document.addEventListener('DOMContentLoaded', recalc, false);	
}
