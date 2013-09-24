// support overflow scrolling
KISSY.add(function (S) {
    function hasOverflowScrolling() {
        var prefixes = ['webkit', 'moz', 'o', 'ms'];
        var div = document.createElement('div');
        var body = document.getElementsByTagName('body')[0];
        var hasIt = false;
     
        body.appendChild(div);
     
        for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            div.style[prefix + 'OverflowScrolling'] = 'touch';
        }
     
        // And the non-prefixed property
        div.style.overflowScrolling = 'touch';
     
        // Now check the properties
        var computedStyle = window.getComputedStyle(div);
     
        // First non-prefixed
        hasIt = !!computedStyle.overflowScrolling;
     
        // Now prefixed...
        for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            if (!!computedStyle[prefix + 'OverflowScrolling']) {
                hasIt = true;
                break;
            }
        }
     
        // Cleanup old div elements
        div.parentNode.removeChild(div);
     
        return hasIt;
    }
    
    return hasOverflowScrolling();
});
