var vm = new Vue({  
    el : '#takeOut',
    beforeMount: function () {
	  	//设置cookie数据
		var cookieDate = new Date();		
		this.setCookie("loginType","h5",cookieDate.getTime() + 3600 * 1000);
		this.setCookie("boxId",getParam('boxId'),cookieDate.getTime() + 3600 * 1000);
	},
    mounted: function () {
    	this.initParm();
	  	var indexMainHeight = document.documentElement.clientHeight - 205 + 'px';
	  	this.$refs.indexMain.style.height = indexMainHeight;
	  	this.setFontSize();
	  	this.isOnload = true;
	},
    data : {
    	//获取商家Id
    	isOnload : false,
    	boxId : getParam('boxId'),
    	schoolId : getParam('schoolId'),
    	flag : getParam('flag'),
    	isSearch : false,
    	imgIp : respImg,
    	initTab : '0',
        search : '',
        moneyNum : 0,
        isClick : false,
        indexData : {},
        viewDemo : [],
        sendData : [],
		isMore:	false,
		timer: null
    },
    methods : {
    	//初始化配置参数
    	initParm(){
    		//请求 获取code
    		var H5params;
    		if (this.boxId && this.schoolId && (this.flag == 'Y')) {
    			var H5params = {
	    			"funCode": "queryMenu",
	    			"boxId": this.boxId,
	    			"schoolId": this.schoolId,
	    			"flag": this.flag	
	    		}
    		} else{
    			H5params = {
    				"funCode": "queryMenu",
    				"boxId": this.boxId
    			}    			
    		}
//  		console.log(H5params);
    		H5params = JSON.stringify(H5params);
    		//3des数据加密
      		var initEnterData = encrypt.encryptByDES(H5params);
    		var ajaxParm = {
    			"H5params":initEnterData
			}
    		this.initResp(ajaxParm);
    	},
    	//公共请求服务
    	initResp(ajaxParm){
    		axios({
    			url: respUrl,
				method: 'post',
				data: ajaxParm,
			}).then(resp => {
				//返回数据解密
				var outData = encrypt.decryptByDES(resp.data);
				outData = JSON.parse(outData);
//				console.log(outData);
				if(outData.resultCode == '0'){
					this.indexData = outData;
					if(outData.cateList.length != '0'){
						this.viewDemo = this.indexData.cateList[0].foodList;
						this.message(outData.resultMessage,'success');						
					}else{
						this.message('盒子里没有任何产品 ！','success');
					}
				}else{
					this.message(outData.resultMessage,'error');
				}
				this.$refs.boxInitImg.style.display = 'none';
			}).catch(err => {
				this.message(err,'error');
				this.$refs.boxInitImg.style.display = 'none';
		   	});
    	},
    	//搜索切换
    	searchClick(){
    		this.search = '';
            this.isSearch = !this.isSearch;
    	},
    	//tab切换事件
    	indexAsideTab(e){
    		this.initTab = e;
    		this.viewDemo = this.indexData.cateList[e].foodList;
    	},
    	//加
    	addPrice(e){
    		if (this.viewDemo[e].num < this.viewDemo[e].prodNum) {
    			this.viewDemo[e].num =  ++this.viewDemo[e].num;
    			this.moneyNum += this.viewDemo[e].petailPrice * 1;    			
    		} else{
    			this.message('不能超过现有库存数量'+this.viewDemo[e].prodNum+'件','error');
    		}
    	},
    	//减
    	subPrice(e){
    		if (this.viewDemo[e].num > 0) {
    			this.viewDemo[e].num =  --this.viewDemo[e].num;
    			this.moneyNum -= this.viewDemo[e].petailPrice * 1;
    		}
    	},
    	//点击列表查看详情
    	listClick(e){
    		sessionStorage.setItem('listData',JSON.stringify(this.viewDemo[e]));
    		window.location.href = "./foodDetails.html";
    	},
    	//去结算
    	sendDataClick(){
    		let	_that = this;
    		_that.indexData.cateList.forEach(function(v , k) {
    			v.foodList.forEach(function(v1 , k1) {
		          	v1.num != 0 && _that.sendData.push(v1);
		       	});
	        });
			if (_that.sendData.length != 0) {
				_that.isClick = true;
				var submitData = {
					"boxAddress" : _that.indexData.boxAddress,
					"boxId" : _that.boxId,
					"agentName" : _that.indexData.agentName,
					"agentId" : _that.indexData.agentId,
					"moneyNum" : _that.moneyNum,
					"foodList" : _that.sendData,
					"courierId" : _that.indexData.courierId,
					"courierName" : _that.indexData.courierName,
					"topPrice" : _that.indexData.topPrice
				}
				sessionStorage.setItem('submitData',JSON.stringify(submitData));
				var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    			var url1 = "./settle.html";
    			var url2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx768b9bb8de0ef8fa&redirect_uri=http://www.bdgaoxiao.com/snacksBox/static/snackBox/settle.html&res&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
    			window.location.href = (ua.match(/MicroMessenger/i) == 'micromessenger') ? url2 : url1;
			} else{
				_that.message('未选中食物','error');
			}
    	},
    	//意见反馈
        locationToFaceback(){
            window.location.href = "./faceback.html";
        },
        //补货催办
        addProjectHandle () {
        	window.location.href = "./addProject.html";
        }
   	},
   	watch: {
   		//搜索
	    search () {
	      	if (this.timer) {
	        	clearTimeout(this.timer);
	      	}
	      	if (!this.search) {
	        	this.viewDemo = [];
	        	return;
	     	}
	      	this.timer = setTimeout(() => {
	      		let	_that = this;
	        	const result = [];
    			_that.indexData.cateList.forEach(function(v , k) {
    				v.foodList.forEach(function(v1 , k1) {
		          		v1.prodName.indexOf(_that.search) > -1 && result.push(v1);
		       		});
	      		});
	      		this.viewDemo = result;
	      	}, 100)
	    }
  	}
});