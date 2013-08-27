/**
 * @fileoverview 
 * @author cen'an<cenan.chr@taobao.com>
 * @module kissy-mscroller
 **/
KISSY.add(function (S, hos, NativeScroller, FakeScroller) {
    //return FakeScroller;
    return hos ? NativeScroller : FakeScroller;
    
}, {requires:['./hos', './osptr', './fakescroller']});


