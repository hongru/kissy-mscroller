## kissy-mscroller

* 版本：1.0
* 教程：[http://gallery.kissyui.com/kissy-mscroller/1.0/guide/index.html](http://gallery.kissyui.com/kissy-mscroller/1.0/guide/index.html)
* demo：[http://gallery.kissyui.com/kissy-mscroller/1.0/demo/index.html](http://gallery.kissyui.com/kissy-mscroller/1.0/demo/index.html)

## features

* 专一化：只考虑更适合mobile 的 features
* 优先使用原生 overflow-scrolling:touch ，再降级为 js 模拟方案（ios5+ 使用的是原生的 overflow-scrolling:touch）
* 集成 pull to refresh, callback 采用promise方案，使用成本更低
* 集成 img 的lazyload
* Scroll 数据和 view的分离，也就是说只要稍加适配，scrollfn 可以应用在非DOM环境下，比如canvas上的scroller组件


## changelog

### V1.0

    [!]

### V1.1

- fix blurring after scrolling translate
- mousewheel scroll & mousedrag scroll support


