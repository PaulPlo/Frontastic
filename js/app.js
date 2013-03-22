$(document).ready(function() {

    /* override Magellan initialisation to adapt threshold value */
    $(document).foundationMagellan({threshold:35}) ; 
    
    /* Put animated scroll on sections */
    $('.top-nav').moveScroll({speed : 500}) ;
    
    /* Slideshow BOB */
    $('.slideshow').slideshowbob() ;
    
    /* Sticky things */
    $('.sticky').sticky() ; 
});
