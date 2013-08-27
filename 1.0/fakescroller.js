KISSY.add(function (S, Scroller, Node) {
    
    var $ = Node.all;
    
    var EasyScroller = function(content, options) {
        
        this.content = content;
        this.container = content.parentNode;
        this.options = options || {};

        // create Scroller instance
        var that = this;
        this.scroller = new Scroller(function(left, top, zoom) {
            that.render(left, top, zoom);
        }, options);

        // bind events
        this.bindEvents();

        // the content element needs a correct transform origin for zooming
        this.content.style[EasyScroller.vendorPrefix + 'TransformOrigin'] = "left top";

        // reflow for the first time
        this.reflow();

    };

    EasyScroller.prototype.render = (function() {
        
        var docStyle = document.documentElement.style;
        
        var engine;
        if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
            engine = 'presto';
        } else if ('MozAppearance' in docStyle) {
            engine = 'gecko';
        } else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit';
        } else if (typeof navigator.cpuClass === 'string') {
            engine = 'trident';
        }
        
        var vendorPrefix = EasyScroller.vendorPrefix = {
            trident: 'ms',
            gecko: 'Moz',
            webkit: 'Webkit',
            presto: 'O'
        }[engine];
        
        var helperElem = document.createElement("div");
        var undef;
        
        var perspectiveProperty = vendorPrefix + "Perspective";
        var transformProperty = vendorPrefix + "Transform";
        
        if (helperElem.style[perspectiveProperty] !== undef) {
            
            return function(left, top, zoom) {
                this.content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
            };	
            
        } else if (helperElem.style[transformProperty] !== undef) {
            
            return function(left, top, zoom) {
                this.content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
            };
            
        } else {
            
            return function(left, top, zoom) {
                this.content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
                this.content.style.marginTop = top ? (-top/zoom) + 'px' : '';
                this.content.style.zoom = zoom || '';
            };
            
        }
    })();

    EasyScroller.prototype.reflow = function() {

        // set the right scroller dimensions
        this.scroller.setDimensions(this.container.clientWidth, this.container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);

        // refresh the position for zooming purposes
        var rect = this.container.getBoundingClientRect();
        this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
        
    };

    EasyScroller.prototype.bindEvents = function() {

        var that = this;

        // reflow handling
        window.addEventListener("resize", function() {
            that.reflow();
        }, false);

        // touch devices bind touch events
        if ('ontouchstart' in window) {

            this.container.addEventListener("touchstart", function(e) {

                // Don't react if initial down happens on a form element
                if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                    return;
                }

                that.scroller.doTouchStart(e.touches, e.timeStamp);
                

            }, false);

            document.addEventListener("touchmove", function(e) {
                e.preventDefault();
                that.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
            }, false);

            document.addEventListener("touchend", function(e) {
                that.scroller.doTouchEnd(e.timeStamp);
            }, false);

            document.addEventListener("touchcancel", function(e) {
                that.scroller.doTouchEnd(e.timeStamp);
            }, false);

        // non-touch bind mouse events
        } else {
            
            var mousedown = false;

            this.container.addEventListener("mousedown", function(e) {

                if (e.target.tagName.match(/input|textarea|select/i)) {
                    return;
                }
            
                that.scroller.doTouchStart([{
                    pageX: e.pageX,
                    pageY: e.pageY
                }], e.timeStamp);

                mousedown = true;
                e.preventDefault();

            }, false);

            document.addEventListener("mousemove", function(e) {

                if (!mousedown) {
                    return;
                }
                
                that.scroller.doTouchMove([{
                    pageX: e.pageX,
                    pageY: e.pageY
                }], e.timeStamp);

                mousedown = true;

            }, false);

            document.addEventListener("mouseup", function(e) {

                if (!mousedown) {
                    return;
                }
                
                that.scroller.doTouchEnd(e.timeStamp);

                mousedown = false;

            }, false);

            this.container.addEventListener("mousewheel", function(e) {
                if(that.options.zooming) {
                    that.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);	
                }
            }, false);

        }

    };
    
    
    var FakeScroller = function (selector, opt) {
        this.selector = selector;
        this.isTouch = !!('ontouchstart' in window);
        this.els = {};
        this.cfg = S.mix({
                message: {
                    pull: 'Pull to refresh',
                    release: 'Release to refresh',
                    loading: 'Loading'
                },
                hasPtr: false,
                ptrActivateCallback: function () {},
                ptrDeactivateCallback: function () {},
                ptrStartLoadingCallback: function () {}
            }, opt, true, null, true);
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
            
        this._init();
    };
    FakeScroller.prototype = {
        _init: function () {
            var cfg = this.cfg,
                scrollers = [];
            this.els.container = $(this.selector).css('overflow', 'hidden');
            var $wrap = this.els.container.all('.wrap');
            if (cfg.hasPtr) {
                $wrap.prepend(this.html);
            }
            $wrap.each(function (o) {
                var scroller = new EasyScroller(o[0], cfg).scroller;
                if (cfg.hasPtr) {
                    scroller.activatePullToRefresh(o.all('.pull-to-refresh').height(), function () {
                        o.all('.pull,.loading').css('opacity', 0);
                        o.all('.release').css('opacity', 1);
                    }, function () {
                        o.all('.release,.loading').css('opacity', 0);
                        o.all('.pull').css('opacity', 1);
                    }, function () {
                        o.all('.release,.pull').css('opacity', 0);
                        o.all('.loading').css('opacity', 1);
                        o.all('.spinner').css('opacity', 1);
                        setTimeout(function(sc) {
                            return function () {
                                sc.finishPullToRefresh();
                                o.all('.spinner').css('opacity', 0);
                            }
                        }(scroller), 2000);

                    })
                }
                
                scrollers.push(scroller);
            });
            
            this.scroller = scrollers.length > 1 ? scrollers : scrollers[0];
        }
    };

    return FakeScroller;
    
}, {
    requires: ['./scrollfn', 'node']
});