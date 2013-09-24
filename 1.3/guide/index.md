## 综述

kissy-mscroller是 基于kissy的更mobile话的scroller，优先使用原生的 overflow-scrolling:touch 。

- 专一化：只考虑更适合mobile 的 features
- 优先使用原生 overflow-scrolling:touch ，再降级为 js 模拟方案（ios5+ 使用的是原生的 overflow-scrolling:touch）
- 集成 pull to refresh, callback 采用promise方案，使用成本更低
- 集成 img 的lazyload
- Scroll 数据和 view的分离，也就是说只要稍加适配，scrollfn 可以应用在非DOM环境下，比如canvas上的scroller组件

## 快速使用

### 初始化组件

```html
<!-- 外围容器请overflow:hidden 且限定高度 -->
<div class="scroll-container">
    <!-- 容器里需要有一个 class 名为 scroll-wrap 的元素包裹所有可滚动的内容 -->
    <div class="scroll-wrap">
        ...
    </div>
</div>
```

```javascript
    S.use('gallery/kissy-mscroller/1.3/index', function (S, KSMscroller) {
         var scroller = new KSMscroller('.scroll-container', {
            scrollingY: true,
            scrollingX: false,
            hasPtr: false,
            ptrCallback: function () {...},
            imgLazyload: true
            ...
         });
    });
```

### 参数说明

 - selector : Kissy Selector
 - options: 
    - scrollingY: 是否允许y方向滚动
    - scrollingX: 是否允许x方向滚动
    - hasPtr: 是否启用 pull to refresh
    - ptrCallback: pull to refresh 触发后的回调，比如异步请求数据等。（ptrCallback 在 hasPtr 为true的情况下有效）
    - imgLazyload: 是否启用滚动容器内 的img 自动懒加载策略。
    - message: {pull: '***', release: '***', loading: '***'}
    - ...

## API说明

 - scrollTo
 - scrollBy
