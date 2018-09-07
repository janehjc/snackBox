//var respImg = 'http://www.bdgaoxiao.com';   //公网
var respImg = 'http://192.168.21.216:8080'; 
var respUrl = respImg + '/snacksBox/f/app/getH5Response/';   //接口
//截取url参数
var getParam = function getParam(paramName) {
	paramValue = "", isFound = !1;
	if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
		arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0;
		while (i < arrSource.length && !isFound) {
			arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++;
		}
	}
	return paramValue == "" && (paramValue = null), paramValue;
}
// 加载
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
// 通知
Vue.prototype.notify = function (tit,msg,type){
   	this.$notify({
	    title: tit,
	    message: msg,
	    type: type,
	    duration: 2000,
	    showClose: false,
	    offset: 100
    });
}
// 消息
Vue.prototype.message = function (msgCon,msgType){
   	this.$message({  
        message : msgCon,  
        type : msgType,
        duration : 1000
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

