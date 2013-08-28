KISSY.add(function (S, Node, Base, Promise) {
    var $ = Node.all;
    /**
     * 
     * @class KSMScroller
     * @constructor
     * @extends Base
     */
    function KSMScroller(selector, comConfig) {
        var self = this;
        //调用父类构造函数
        KSMScroller.superclass.constructor.call(self, comConfig);
        
        this.selector = selector;
        this.isTouch = !!('ontouchstart' in window);
        this.cfg = S.mix({
                hasPtr: false,
                message: {
                    pull: 'Pull to refresh',
                    release: 'Release to refresh',
                    loading: 'Loading'
                },
                ptrCallback: function () {}
            }, comConfig, true, null, true);
        this.html = '<div class="pull-to-refresh">' +
	          '<div class="icon"></div>' +
	          '<div class="message">' +
	            '<i class="arrow"></i>' +
	            '<i class="spinner large"></i>' +
	            '<span class="pull">' + this.cfg.message.pull + '</span>' +
	            '<span class="release">' + this.cfg.message.release + '</span>' +
	            '<span class="loading">' + this.cfg.message.loading + '</span>' +
	          '</div>' +
	        '</div>';
        
        this.els = {};
        
        this._init();
        
    }
    S.extend(KSMScroller, Base, /** @lends KSMScroller.prototype*/{
        _init: function () {
            this.els.container = $(this.selector);
            this._initScroll();
            this.cfg.hasPtr && this._initPtr();
        },
        _initScroll: function () {
            this.els.container.css({
                'overflowY': 'auto',
                'webkitOverflowScrolling': 'touch',
                'mozOverflowScrolling': 'touch',
                'msOverflowScrolling': 'touch',
                'oOverflowScrolling': 'touch',
                'overflowScrolling': 'touch',
                'position': 'relative'
            })
        },
        _initPtr: function () {
            var isTouch = this.isTouch,
                cfg = this.cfg,
                html = this.html;

            this.els.container.each(function () { 
                if (!isTouch) {
                    return;
                }     
                
                var e = $(this).prepend(html),
                  content = e.one('.scroll-wrap'),
                  ptr = e.one('.pull-to-refresh'),
                  arrow = e.one('.arrow'),
                  spinner = e.one('.spinner'),
                  pull = e.one('.pull'),
                  release = e.one('.release'),
                  loading = e.one('.loading'),
                  ptrHeight = ptr.height(),
                  arrowDelay = ptrHeight / 3 * 2,
                  isActivated = false,
                  isLoading = false;
                  
                content.css({
                    'minHeight': '100%',
                    'webkitTransform': 'translateZ(0)'
                });
                content.on('touchstart', function (ev) {
                    if (e.scrollTop() === 0) { // fix scrolling
                        e.scrollTop(1);
                    }
                }).on('touchmove', function (ev) {
                var top = e.scrollTop(),
                        deg = 180 - (top < -ptrHeight ? 180 : // degrees to move for the arrow (starts at 180° and decreases)
                              (top < -arrowDelay ? Math.round(180 / (ptrHeight - arrowDelay) * (-top - arrowDelay)) 
                              : 0));

                    if (isLoading) { // if is already loading -> do nothing
                        return true;
                    }

                    arrow.show(); 
                    arrow.css('webkitTransform', 'rotate('+ deg + 'deg)'); // move arrow

                    spinner.hide();

                    if (-top > ptrHeight) { // release state
                        release.css('opacity', 1);
                        pull.css('opacity', 0);
                        loading.css('opacity', 0);
                        

                        isActivated = true;
                      } else if (top > -ptrHeight) { // pull state
                        release.css('opacity', 0);
                        loading.css('opacity', 0);
                        pull.css('opacity', 1);

                        isActivated = false;
                      }
                    
                }).on('touchend', function(ev) {
                    var top = e.scrollTop();
                    
                    if (isActivated) { // loading state
                        isLoading = true;	
                        isActivated = false;

                        release.css('opacity', 0);;
                        pull.css('opacity', 0);
                        loading.css('opacity', 1);
                        arrow.hide();
                        spinner.show();

                        ptr.css('position', 'static');
                        
                        // defer callback
                        var deferCallback = function () {
                            var d = new Promise.Defer(),
                                promise = d.promise;
                            var ret = promise.then(function () {
                                var d = new Promise.Defer()
                                cfg.ptrCallback(d);
                                return d.promise;
                           });
                           d.resolve();
                           
                           return ret;
                        }
                        
                        deferCallback().then(function() {
                              ptr.animate({
                                height: 0
                              }, 0.1, 'easeOut', function () {
                                ptr.css({
                                    position: 'absolute',
                                    height: ptrHeight
                                });
                                isLoading = false;
                              });  
                        });
                    }	
                });
            });
        }
    }, {ATTRS : /** @lends KSMScroller*/{

    }});
    
    return KSMScroller;
}, {
    requires: ['node', 'base', 'promise']
});