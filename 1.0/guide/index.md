## 综述

kissy-mscroller是 基于kissy的更mobile话的scroller，优先使用原生的 overflow-scrolling:touch 。

## 快速使用

### 初始化组件

```javascript
    S.use('gallery/kissy-mscroller/1.0/index', function (S, KSMscroller) {
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
    - ...

## API说明

 - scrollTo
 - scrollBy
