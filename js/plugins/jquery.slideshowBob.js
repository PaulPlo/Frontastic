// jQuery slideshow Boilerplate
// A boilerplate for jumpstarting jQuery plugin development
// version 1.1, May 14th, 2011
// by Stefan Gabos

(function($) {

    // here we go!
    $.slideshowbob = function(element, options) {

        // slideshow's default options
        // this is private property and is  accessible only from inside the slideshow
        var defaults = {
            'interval': 5000,
            'speed': 700,
            'effect': 'slide',
            'pills': false,
            'autostart':false
        } ; 

        // to avoid confusions, use "slideshow" to reference the 
        // current instance of the object
        var slideshow = $(this);

        // this will hold the merged default, and user-provided options
        // slideshow's properties will be available through this object like:
        // slideshow.settings.propertyName from inside the slideshow or
        // element.data('slideshowbob').settings.propertyName from outside the slideshow, 
        // where "element" is the element the slideshow is attached to;
        slideshow.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
             element = element;    // reference to the actual DOM element

        // variables declaration
        var currentPosition; // amount of margin-left on the container
        var slideNumber; // slide currently shown
        var slideWidth ;
        var slides ;
        var nbSlides ;
        var intervalId ;
        var lastFirst ; 
             
        // the "constructor" method that gets called when the object is created
        slideshow.init = function() {

            // the slideshow's final properties are the merged default and user-provided options (if any)
            slideshow.settings = $.extend({}, defaults, options);

            // Set slideshow overflow to hidden
            $element.css('overflow', 'hidden') ; 
            // variables initialization 
            currentPosition = 0 ;
            slideNumber = 0 ; 
            lastFirst = false ; 
            slides = $element.find('.slide') ; 
            nbSlides = slides.length;
            
            // Wrap the slides in a wrapper
            slides.wrapAll('<div class="slideshow-inner"></div>')
            // Float left to display horizontally
            .css({'float' : 'left'});
            
            // If 'pills' option set to true, create them
            if(slideshow.settings.pills) {
                createPills() ; 
            }
            
            // if 'controls' option set to true, bind click event on .controls > span items
            if(hasControl()) {
                bindControls() ; 
            }
            
            // Initiate the slideshow
            initSlideShow() ; 

            // For devices and tablets, enable swipping
            var swipeOptions={
                triggerOnTouchEnd : true,	
                swipeStatus : swipeStatus,
                allowPageScroll:"vertical",
                threshold:75			
            }
            $element.find(".slide").swipe(swipeOptions) ;
    
            // Bind on resize
            $(window).bind('resize.slideshowbob', function(){
                // Set new size
                resizeSlideShow() ;
                // Show current slide
                $element.children('.slideshow-inner').css('marginLeft',slideWidth*(-currentPosition))
            }) ; 
            
            // Auto start
            if(slideshow.settings.autostart) {
                slideshow.start() ;
            }
        } ; 

        // public methods
        // these methods can be called like:
        // slideshow.methodName(arg1, arg2, ... argn) from inside the slideshow or
        // element.data('slideshowbob').publicMethod(arg1, arg2, ... argn) from outside 
        // the slideshow, where "element" is the element the slideshow is attached to;
        
        slideshow.start = function() {
            intervalId = setInterval(function(){
                $element.find('.controls > .next').click() ; 
            }, slideshow.settings.interval) ; 
        }
        
        // private methods
        // these methods can be called only from inside the slideshow like:
        // methodName(arg1, arg2, ... argn)

        var initSlideShow = function() {
            // Set the slideshow inner to the correct size
            resizeSlideShow() ; 
            // Set the selected slide to the first one
            currentPosition = 0 ;
            // Put the slideshow position to the first slide
            setToFirstSlide() ; 
        } ; 
        
        var setToFirstSlide = function() {
            // Modernizr css animations features detection
            if(Modernizr.csstransitions) {
                $element.children('.slideshow-inner').css("-webkit-transform", "translate3d(0px,0px,0px)");
                $element.children('.slideshow-inner').css("-moz-transform", "translate3d(0px,0px,0px)");
                $element.children('.slideshow-inner').css("transform", "translate3d(0px,0px,0px)");
            } else {
                $(".slideshow-inner").css("margin-left", 0) ;
            }
        }
        
        var resizeSlideShow = function() {
            // get the width of one slide
            slideWidth = $('.slideshow').outerWidth(true);
            // test if slides has negatives margins
            slidesMargin = $(slides).outerWidth() - $(slides).outerWidth(true) ;
            // set the width of all .slide to the width of the .slideshow container
            if(slidesMargin < 0) { // no negatives margins 
                $(slides).css('max-width', slideWidth);
                // Set the slideshow wrapper width equal to total width of all slides
                $element.find('.slideshow-inner').css('width', slideWidth * nbSlides); 
            } else { // If negatives margins, add it to slides width (useful for our framelessGrid framework)
                $(slides).css('max-width', slideWidth+slidesMargin);
                $element.find('.slideshow-inner').css('width', (slideWidth+slidesMargin) * nbSlides); 
            }
        }  ;
        
        // hasControl : tells if this slideshow has a controls bloc or not
        var hasControl = function() {
            if($element.find('.controls').length != 0 && $element.find('.controls > .next').length != 0 && $element.find('.controls > .prev').length != 0) {
                return true ; 
            }
            return false ; 
        }
        
        // bind controls : bind click event on next and prev
        var bindControls = function() {
            
            $element.find('.controls > span').bind('click.slideshowbob', function(){
            
                if(currentPosition == slides.length-1 && $(this).hasClass('next')) {                   
                    //move the first slide after last slide
                    $element.find('.slide:last').after($element.find('.slide:first'));
                    // calculate correct x value
                    var value = -Math.abs(slideWidth*(currentPosition-1)).toString();
                    //flag that we are on one extremity of the slideshow
                    lastFirst = true ; 
                    // Update slideNumber
                    if(slideNumber < slides.length-1) slideNumber++ ; else slideNumber = 0 ; 
                } else if(currentPosition == 0 && $(this).hasClass('prev')){
                    //move the last slide before first slide
                    $element.find('.slide:first').before($element.find('.slide:last'));
                    // calculate correct x value
                    var value = -Math.abs(slideWidth*(currentPosition+1)).toString();
                    //flag that we are on one extremity of the slideshow
                    lastFirst = true ; 
                    // Update slideNumber
                    if(slideNumber > 0 ) slideNumber-- ; else slideNumber = slides.length-1 ;  
                }
                
                // If we were on first or last slide, 
                if(lastFirst) {
                    // Adjust slideshow-inner margin-left  
                    if(Modernizr.csstransitions) {
                        $element.children('.slideshow-inner').css("-webkit-transition-duration", "0s"); 
                        $element.children('.slideshow-inner').css("-moz-transition-duration", "0s"); 
                        $element.children('.slideshow-inner').css("transition-duration", "0s"); 
                        $element.children('.slideshow-inner').css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
                        $element.children('.slideshow-inner').css("-moz-transform", "translate3d("+value +"px,0px,0px)");
                        $element.children('.slideshow-inner').css("transform", "translate3d("+value +"px,0px,0px)");
                    } else {
                        $element.children('.slideshow-inner').css('margin-left', value);
                    }
                    // Wait just a moment (if not, no animation to the next slide, to investigate...)
                    setTimeout(function (){
                        if(slideshow.settings.effect == 'fade') fadeSlide() ; 
                        else scrollSlide() ; 
                    }, 10) ; 
                    lastFirst = false ; 
                } else {

                    // Update currentPosition & slideNumber
                    if($(this).attr('class')=='next') {
                        updateCurrentPosition('next') ; 
                        if(slideNumber < slides.length-1) slideNumber++ ; else slideNumber = 0 ; 
                    } else {
                        updateCurrentPosition('prev') ;
                        if(slideNumber > 0 ) slideNumber-- ; else slideNumber = slides.length-1 ;                          
                    } 
                    
                    // Scroll to other slide
                    if(slideshow.settings.effect == 'fade') fadeSlide() ; 
                    else scrollSlide() ; 
                }
                
                // Update pills
                updatePills() ; 
            });
        } ;
        
        // Create pills : insert pills inside DOM, and bind click event to each one
        var createPills = function() {
            $element.find('.slideshow-inner').after('<ul class="pills"></ul>');
            var i = 0 ; 
            $.each(slides, function(){
                $element.find('.pills').append('<li id=pill_'+i+' class="pill"></li>') ;
                i++ ; 
            }); 
            $element.find('.pill').first().addClass('active') ; 
            
            // click listener on pills
            $element.find('.pills > li').bind('click.slideshowbob', function(){
                // retrieve pill id
                var pillId = $(this).attr('id') ; 
                // Reconstruct initial slides order
                $element.children('.slideshow-inner').html(slides);
                // Set slideshow to firstSlide
                setToFirstSlide() ; 
                // trim the string to get only the last char (the pill number)
                var id = pillId[pillId.length -1];
                // Set current Position to this value
                currentPosition = parseInt(id) ;
                // Set slideNumber to this value
                slideNumber = parseInt(id) ; 
                // Scroll slide
                if(slideshow.settings.effect == 'fade') fadeSlide() ; 
                else scrollSlide() ;   
                // Update pills
                updatePills() ; 
            });
        } ; 
        
        // updatePills : move the active class from old to new selected pill
        var updatePills = function() { 
            // Remove active class
            $element.find('.pills > li').removeClass('active') ; 
            // Set active class on pill corresponding to slideshow current position
            $element.find('#pill_'+slideNumber).addClass('active') ; 
        } ;
        
        // Catch a swipe event
        var swipeStatus = function(event, phase, direction, distance) {
            //If we are moving before swipe, and we are going Lor R in X mode, or U or D in Y mode then drag.
            if( phase=="move" && (direction=="left" || direction=="right") ) {
                var duration=0;
                if (direction == "left")
                    shiftSlide((slideWidth * currentPosition) + distance, duration);
                else if (direction == "right")
                    shiftSlide((slideWidth * currentPosition) - distance, duration);
            }
            else if ( phase == "cancel") {
                shiftSlide(slideWidth * currentPosition, slideshow.settings.speed);
            }
            else if ( phase =="end" ) {
                if(direction == 'left') {
                    updateCurrentPosition('next') ; 
                } else if(direction == 'right') {
                    updateCurrentPosition('prev') ;
                }
                scrollSlide() ; 
            }
        } ; 

        // Update currentPosition : increment or decrement, depending of the direction of the slide movement
        var updateCurrentPosition = function(direction) {
            if(direction == 'next') {
                // increment currentPosition 
                currentPosition = (currentPosition < nbSlides-1) ? currentPosition+1 : currentPosition ;
            } else if(direction == 'prev'){
                // decrement currentPosition
                currentPosition = (currentPosition!=0) ? currentPosition-1 : 0 ;
            }
        } ; 

        // Scroll the slide to the new position
        var scrollSlide = function(duration) {
            
            if(duration == null) duration = slideshow.settings.speed ; 
            
            if(Modernizr.csstransitions) {

                var distance = slideWidth * currentPosition ; 

                $element.children('.slideshow-inner').css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s"); 
                $element.children('.slideshow-inner').css("-moz-transition-duration", (duration/1000).toFixed(1) + "s"); 
                $element.children('.slideshow-inner').css("transition-duration", (duration/1000).toFixed(1) + "s"); 
                var value = (distance<0 ? "" : "-") + Math.abs(distance).toString(); //inverse the number we set in the css
                $element.children('.slideshow-inner').css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
                $element.children('.slideshow-inner').css("-moz-transform", "translate3d("+value +"px,0px,0px)");
                $element.children('.slideshow-inner').css("transform", "translate3d("+value +"px,0px,0px)");
            } else { // fallback jQuery for IE
                $element.children('.slideshow-inner').animate({
                    'marginLeft' : slideWidth*(-currentPosition)
                }, slideshow.settings.speed);
            }
        }
        
        var fadeSlide = function() {
            $element.children('.slideshow-inner').fadeOut(300, function(){
                scrollSlide(0) ; 
            }) ; 
            $element.children('.slideshow-inner').fadeIn(300) ;
        }
        
        // Shift the slide for touch device (only webkit for now)
        var shiftSlide = function(distance, duration) {
            $element.find('.slideshow-inner').css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s"); 
            var value = (distance<0 ? "" : "-") + Math.abs(distance).toString(); //inverse the number we set in the css
            $element.find('.slideshow-inner').css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
        }
        
        // fire up the slideshow!
        // call the "constructor" method
        slideshow.init();
    }

    // add the slideshow to the jQuery.fn object
    $.fn.slideshowbob = function(options) {

        // iterate through the DOM elements we are attaching the slideshow to
        return this.each(function() {

            // if slideshow has not already been attached to the element
            if ($(this).data('slideshowbob') == undefined) {

                // create a new instance of the slideshow
                // pass the DOM element and the user-provided options as arguments
                var slideshow = new $.slideshowbob(this, options);

                // in the jQuery version of the element
                // store a reference to the slideshow object
                // you can later access the slideshow and its methods and properties like
                // element.data('slideshowbob').publicMethod(arg1, arg2, ... argn) or
                // element.data('slideshowbob').settings.propertyName
                $(this).data('slideshowbob', slideshow);

            }
        });
    }
})(jQuery);

// Touch Swipe Library
(function(d){var l="left",k="right",c="up",r="down",b="in",s="out",i="none",o="auto",u="horizontal",p="vertical",f="all",e="start",h="move",g="end",m="cancel",a="ontouchstart" in window,t="TouchSwipe";var j={fingers:1,threshold:75,maxTimeThreshold:null,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"button, input, select, textarea, a, .noSwipe"};d.fn.swipe=function(x){var w=d(this),v=w.data(t);if(v&&typeof x==="string"){if(v[x]){return v[x].apply(this,Array.prototype.slice.call(arguments,1))}else{d.error("Method "+x+" does not exist on jQuery.swipe")}}else{if(!v&&(typeof x==="object"||!x)){return q.apply(this,arguments)}}return w};d.fn.swipe.defaults=j;d.fn.swipe.phases={PHASE_START:e,PHASE_MOVE:h,PHASE_END:g,PHASE_CANCEL:m};d.fn.swipe.directions={LEFT:l,RIGHT:k,UP:c,DOWN:r,IN:b,OUT:s};d.fn.swipe.pageScroll={NONE:i,HORIZONTAL:u,VERTICAL:p,AUTO:o};d.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:f};function q(v){if(v&&(v.allowPageScroll===undefined&&(v.swipe!==undefined||v.swipeStatus!==undefined))){v.allowPageScroll=i}if(!v){v={}}v=d.extend({},d.fn.swipe.defaults,v);return this.each(function(){var x=d(this);var w=x.data(t);if(!w){w=new n(this,v);x.data(t,w)}})}function n(J,R){var aj=(a||!R.fallbackToMouseEvents),ae=aj?"touchstart":"mousedown",K=aj?"touchmove":"mousemove",ac=aj?"touchend":"mouseup",I="touchcancel";var P=0;var E=null;var S=0;var af=0;var w=0;var U=1;var ak=0;var A=d(J);var F="start";var ai=0;var T=null;var B=0;var M=0;try{A.bind(ae,aa);A.bind(I,D)}catch(ag){d.error("events not supported "+ae+","+I+" on jQuery.swipe")}this.enable=function(){A.bind(ae,aa);A.bind(I,D);return A};this.disable=function(){H();return A};this.destroy=function(){H();A.data(t,null);return A};function aa(ao){if(L()){return}if(d(ao.target).closest(R.excludedElements,A).length>0){return}ao=ao.originalEvent;var an,am=a?ao.touches[0]:ao;F=e;if(a){ai=ao.touches.length}else{ao.preventDefault()}P=0;E=null;ak=null;S=0;af=0;w=0;U=1;T=al();if(!a||(ai===R.fingers||R.fingers===f)||W()){T[0].start.x=T[0].end.x=am.pageX;T[0].start.y=T[0].end.y=am.pageY;B=x();if(ai==2){T[1].start.x=T[1].end.x=ao.touches[1].pageX;T[1].start.y=T[1].end.y=ao.touches[1].pageY;af=w=N(T[0].start,T[1].start)}if(R.swipeStatus||R.pinchStatus){an=ah(ao,F)}}else{D(ao);an=false}if(an===false){F=m;ah(ao,F);return an}else{V(true);A.bind(K,G);A.bind(ac,O)}}function G(ap){ap=ap.originalEvent;if(F===g||F===m){return}var an,am=a?ap.touches[0]:ap;T[0].end.x=a?ap.touches[0].pageX:am.pageX;T[0].end.y=a?ap.touches[0].pageY:am.pageY;M=x();E=Z(T[0].start,T[0].end);if(a){ai=ap.touches.length}F=h;if(ai==2){if(af==0){T[1].start.x=ap.touches[1].pageX;T[1].start.y=ap.touches[1].pageY;af=w=N(T[0].start,T[1].start)}else{T[1].end.x=ap.touches[1].pageX;T[1].end.y=ap.touches[1].pageY;w=N(T[0].end,T[1].end);ak=X(T[0].end,T[1].end)}U=v(af,w)}if((ai===R.fingers||R.fingers===f)||!a){y(ap,E);P=z(T[0].start,T[0].end);S=C(T[0].start,T[0].end);if(R.swipeStatus||R.pinchStatus){an=ah(ap,F)}if(!R.triggerOnTouchEnd){var ao=!Y();if(Q()===true){F=g;an=ah(ap,F)}else{if(ao){F=m;ah(ap,F)}}}}else{F=m;ah(ap,F)}if(an===false){F=m;ah(ap,F)}}function O(at){at=at.originalEvent;if(at.touches&&at.touches.length>0){return true}at.preventDefault();M=x();if(af!=0){w=N(T[0].end,T[1].end);U=v(af,w);ak=X(T[0].end,T[1].end)}P=z(T[0].start,T[0].end);E=Z(T[0].start,T[0].end);S=C();if(R.triggerOnTouchEnd||(R.triggerOnTouchEnd===false&&F===h)){F=g;var ap=ad()||!W();var an=((ai===R.fingers||R.fingers===f)||!a);var am=T[0].end.x!==0;var ao=(an&&am&&ap);if(ao){var aq=Y();var ar=Q();if((ar===true||ar===null)&&aq){ah(at,F)}else{if(!aq||ar===false){F=m;ah(at,F)}}}else{F=m;ah(at,F)}}else{if(F===h){F=m;ah(at,F)}}A.unbind(K,G,false);A.unbind(ac,O,false);V(false)}function D(){ai=0;M=0;B=0;af=0;w=0;U=1;V(false)}function ah(ao,am){var an=undefined;if(R.swipeStatus){an=R.swipeStatus.call(A,ao,am,E||null,P||0,S||0,ai)}if(R.pinchStatus&&ad()){an=R.pinchStatus.call(A,ao,am,ak||null,w||0,S||0,ai,U)}if(am===m){if(R.click&&(ai===1||!a)&&(isNaN(P)||P===0)){an=R.click.call(A,ao,ao.target)}}if(am==g){if(R.swipe){an=R.swipe.call(A,ao,E,P,S,ai)}switch(E){case l:if(R.swipeLeft){an=R.swipeLeft.call(A,ao,E,P,S,ai)}break;case k:if(R.swipeRight){an=R.swipeRight.call(A,ao,E,P,S,ai)}break;case c:if(R.swipeUp){an=R.swipeUp.call(A,ao,E,P,S,ai)}break;case r:if(R.swipeDown){an=R.swipeDown.call(A,ao,E,P,S,ai)}break}switch(ak){case b:if(R.pinchIn){an=R.pinchIn.call(A,ao,ak||null,w||0,S||0,ai,U)}break;case s:if(R.pinchOut){an=R.pinchOut.call(A,ao,ak||null,w||0,S||0,ai,U)}break}}if(am===m||am===g){D(ao)}return an}function Q(){if(R.threshold!==null){return P>=R.threshold}return null}function Y(){var am;if(R.maxTimeThreshold){if(S>=R.maxTimeThreshold){am=false}else{am=true}}else{am=true}return am}function y(am,an){if(R.allowPageScroll===i||W()){am.preventDefault()}else{var ao=R.allowPageScroll===o;switch(an){case l:if((R.swipeLeft&&ao)||(!ao&&R.allowPageScroll!=u)){am.preventDefault()}break;case k:if((R.swipeRight&&ao)||(!ao&&R.allowPageScroll!=u)){am.preventDefault()}break;case c:if((R.swipeUp&&ao)||(!ao&&R.allowPageScroll!=p)){am.preventDefault()}break;case r:if((R.swipeDown&&ao)||(!ao&&R.allowPageScroll!=p)){am.preventDefault()}break}}}function C(){return M-B}function N(ap,ao){var an=Math.abs(ap.x-ao.x);var am=Math.abs(ap.y-ao.y);return Math.round(Math.sqrt(an*an+am*am))}function v(am,an){var ao=(an/am)*1;return ao.toFixed(2)}function X(){if(U<1){return s}else{return b}}function z(an,am){return Math.round(Math.sqrt(Math.pow(am.x-an.x,2)+Math.pow(am.y-an.y,2)))}function ab(ap,an){var am=ap.x-an.x;var ar=an.y-ap.y;var ao=Math.atan2(ar,am);var aq=Math.round(ao*180/Math.PI);if(aq<0){aq=360-Math.abs(aq)}return aq}function Z(an,am){var ao=ab(an,am);if((ao<=45)&&(ao>=0)){return l}else{if((ao<=360)&&(ao>=315)){return l}else{if((ao>=135)&&(ao<=225)){return k}else{if((ao>45)&&(ao<135)){return r}else{return c}}}}}function x(){var am=new Date();return am.getTime()}function H(){A.unbind(ae,aa);A.unbind(I,D);A.unbind(K,G);A.unbind(ac,O);V(false)}function W(){return R.pinchStatus||R.pinchIn||R.pinchOut}function ad(){return ak&&W()}function L(){return A.data(t+"_intouch")===true?true:false}function V(am){am=am===true?true:false;A.data(t+"_intouch",am)}function al(){var am=[];for(var an=0;an<=5;an++){am.push({start:{x:0,y:0},end:{x:0,y:0},delta:{x:0,y:0}})}return am}}})(jQuery);

// Modernizr cssAnimations features test
;window.Modernizr=function(a,b,c){function z(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+m.join(c+" ")+c).split(" ");return y(d,b)}function y(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function x(a,b){return!!~(""+a).indexOf(b)}function w(a,b){return typeof a===b}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function u(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m="Webkit Moz O ms Khtml".split(" "),n={},o={},p={},q=[],r,s={}.hasOwnProperty,t;!w(s,c)&&!w(s.call,c)?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],c)},n.csstransitions=function(){return z("transitionProperty")};for(var A in n)t(n,A)&&(r=A.toLowerCase(),e[r]=n[A](),q.push((e[r]?"":"no-")+r));u(""),i=k=null,e._version=d,e._domPrefixes=m,e.testProp=function(a){return y([a])},e.testAllProps=z;return e}(this,this.document);