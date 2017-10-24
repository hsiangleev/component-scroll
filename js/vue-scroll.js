
Vue.component("scroll",{
	template: `<div id="c-scroll" ref="box" @mousewheel="rollerSlide" @touchstart="handSlide">
			<div id="c-scrollBar" ref="scrollBar" @click="clickSlide">
				<div id="rollingBall" ref="rollingBall" :style="{top: ballTop}" @mousedown="dragSlide" @touchstart="phoneDrag"></div>
			</div>
			<div id="c-content" ref="content">
				<div id="c-content-body" ref="contentBody" :style="{top: bodyTop}">
					<!-- 存放内容 -->
					<slot name="slot1"></slot>
				</div>
			</div>
		</div>`,
	data: function (){
		return {
			ballMaxHeight: 0,
			contentMaxHeight: 0,
			ballTop: "0px",
			bodyTop: "0px",
			step: 0
		}
	},
	methods: {
		init: function (){
			//初始化小球可移动区域距离
			this.ballMaxHeight=this.$refs["box"].clientHeight-this.$refs["rollingBall"].clientHeight;
			//初始化内容可移动区域距离
			this.contentMaxHeight=this.$refs["contentBody"].clientHeight-this.$refs["content"].clientHeight;
		},
		//拖拽滚动
		dragSlide: function (e){
			var self=this;
			//点击处距离小球顶部高度
			var y1=e.clientY-this.$refs["box"].offsetTop-this.$refs["rollingBall"].offsetTop;
			this.addHandler(document,"mousemove",pcScroll);
			function pcScroll(e){
				var e=event || window.event;
				// 小球距离父盒子滚动条顶部的高度
				var y2=e.clientY-self.$refs["box"].offsetTop-y1;
				if(y2<0){
					y2=0;
				}
				if(y2>self.ballMaxHeight){
					y2=self.ballMaxHeight;
				}
				self.ballTop=y2+"px";
				// //比率，距离父盒子高度/可移动区域距离
				var bite=y2/self.ballMaxHeight;
				var y4=bite*self.contentMaxHeight;
				self.bodyTop=-1*y4+"px";

				self.step=y2;
				// //让被选文字清除。
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			}

			this.addHandler(document,"mouseup",function (){
				self.removeHandler(document,"mousemove",pcScroll)
			})
		},
		//点击滚动
		clickSlide: function (e){
			var y1=e.clientY-this.$refs["box"].offsetTop;
			if(y1>this.ballMaxHeight){
				y1=this.ballMaxHeight;
			}
			this.animate(this.$refs["rollingBall"],"top",y1);
			var bite=y1/this.ballMaxHeight;
			var y4=bite*this.contentMaxHeight;
			this.animate(this.$refs["contentBody"],"top",-y4);

			this.step=y1;
		},
		//滚轮滚动
		rollerSlide: function (e){
			//e.wheelDelta: 每向下移动一次为-120
			this.step-=e.wheelDelta/5;
			if(this.step>this.ballMaxHeight){
				this.step=this.ballMaxHeight;
			}
			if(this.step<0){
				this.step=0;
			}
			this.animate(this.$refs["rollingBall"],"top",this.step);
			var bite=this.step/this.ballMaxHeight;
			var y4=bite*this.contentMaxHeight;
			this.animate(this.$refs["contentBody"],"top",-y4);
		},
		//手机小球拖拽滚动
		phoneDrag: function (e){
			var self=this;
			var e=event || window.event;
			//阻止手机滚动默认行为
			this.preventDefault(e);
			//点击处距离小球顶部高度
			var y1=e.touches[0].clientY-this.$refs["box"].offsetTop-this.$refs["rollingBall"].offsetTop;
			this.addHandler(document,"touchmove",phoneTouch);

			this.addHandler(this.$refs["rollingBall"],"touchend",function (e){
				self.removeHandler(document,"touchmove", phoneTouch)
			});
			//阻止冒泡
			this.stopPropagation(e);

			function phoneTouch(){
				var e=event || window.event;
				//小球距离父盒子滚动条顶部的高度
				var y2=e.touches[0].clientY-self.$refs["box"].offsetTop-y1;

				if(y2<0){
					y2=0;
				}
				if(y2>self.ballMaxHeight){
					y2=self.ballMaxHeight;
				}
				self.ballTop=y2+"px";
				//比率，距离父盒子高度/可移动区域距离
				var bite=y2/self.ballMaxHeight;
				var y4=bite*self.contentMaxHeight;
				self.bodyTop=-1*y4+"px";


				self.step=y2;
				//让被选文字清除。
	            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			}
		},
		//手机手势滚动
		handSlide: function (e){
			var self=this;
			var y1=e.touches[0].pageY;
			//阻止手机滚动默认行为
			this.preventDefault(e);
			this.addHandler(document,"touchmove",phoneTouch);

			this.addHandler(this.$refs["box"],"touchend",function (e){
				self.removeHandler(document,"touchmove", phoneTouch)
			});

			function phoneTouch(){
				var e=event || window.event;
				var y2=e.touches[0].pageY;
				//y2-y1: 滚动的距离
				//speed: 减慢速度
				var speed=(y2-y1)/10;
				//currentHeight: contentBody当前距离父盒子高度
				var currentHeight=self.$refs["contentBody"].offsetTop;
				var y3=currentHeight+speed;
				if(y3<-self.contentMaxHeight){
					y3=-self.contentMaxHeight;
				}
				if(y3>0){
					y3=0;
				}
				self.bodyTop=y3+"px";
				//比率，距离父盒子高度/可移动区域距离
				var bite=y3/self.contentMaxHeight;
				var y4=bite*self.ballMaxHeight;
				self.ballTop=-1*y4+"px";

				self.step=y2;
				//让被选文字清除。
	            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			}
		},


		addHandler: function (ele,type,handler) {
			if(ele.addEventListener){
				ele.addEventListener(type,handler,false);
			}else if(ele.attachEvent){
				ele.attachEvent("on"+type,handler);
			}else{
				ele["on"+type]=handler;
			}
		},
		preventDefault:function (event) {
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue=false;
			}
		},
		removeHandler:function (ele,type,handler) {
			if(ele.removeEventListener){
				ele.removeEventListener(type,handler,false);
			}else if(ele.detachEvent){
				ele.detachEvent("on"+type,handler);
			}
			else{
				ele["on"+type]=null;
			}
		},
		//阻止冒泡
		stopPropagation:function (event) {
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelable=true;
			}
		},
		//单属性缓动动画
		animate: function (ele,attr,target){
			var self=this;
			clearInterval(ele.timer);
			ele.timer=setInterval(function(){
				var leader=parseInt(self.getStyle(ele,attr))||0;
				var step=(target-leader)/10;
				step=step>0?Math.ceil(step):Math.floor(step);
				leader=leader+step;
				ele.style[attr]=leader+"px";

				if(Math.abs(target-leader)<=Math.abs(step)){
					ele.style[attr]=target+"px";
					clearInterval(ele.timer);
				}
			},30);
		},
		//兼容方法获取元素样式
		getStyle: function (ele,attr){
			 if(window.getComputedStyle){
	            return window.getComputedStyle(ele,null)[attr];
	        }
	        return ele.currentStyle[attr];
	    }
		
	},
	mounted: function (){
		this.init();
	}
})
