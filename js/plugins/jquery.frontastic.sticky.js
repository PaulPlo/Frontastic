;(function($) {
    
    $.fn.sticky = function() {
        
        // We loop through the selected elements, in case the slideshow was called on more than one element e.g. `$('.foo, .bar').slideShow();`
        return this.each(function() {

            var elt = $(this);
        
            var stickyTop = $(elt).offset().top; // returns number
            var stickyLeft = $(elt).offset().left;
            
            $(window).scroll(function(){ // scroll event 
             
                var windowTop = $(window).scrollTop(); // returns number
                if (stickyTop < windowTop) {
                  $(elt).css({ position: 'fixed', top: 0, left:stickyLeft });
                }
                else {
                  $(elt).css('position','static');
                }
            });
        });
    };
}(jQuery));