;(function($) {
    
    $.fn.moveScroll = function(options) {
        
        options = $.extend({
            'speed': 500 
        }, options);
        // We loop through the selected elements, in case the slideshow was called on more than one element e.g. `$('.foo, .bar').slideShow();`
        return this.each(function() {
            $(this).find("a").each(function() {
                var section = $("section"+$(this).attr("href")) ;
                $(this).bind("click", function() { 
                    $('html, body').animate({
                        scrollTop: section.offset().top 
                    }, options.speed, "swing");
                }) ;
            });        
        });
    };
}(jQuery));