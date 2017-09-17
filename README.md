# component-scroll
### 滚动条封装
[链接](https://hsiangleev.github.io/component-scroll/scroll.html)

* c_scroll(x,y)
* 例: c_scroll(300,400)
* x: 最外层盒子宽度(必需)
* y: 最外层盒子高度(必需)
* 
* 1.可拖动小球上下移动
* 2.点击滚动条移动
* 3.滚轮滚动移动
*
``` javascript
<div id="c-scroll">
	<div id="c-scrollBar">
		<div id="rollingBall"></div>
	</div>
	<div id="c-content">
		<div id="c-content-body">
			<!-- 存放内容 -->
		</div>
	</div>
</div>
```
