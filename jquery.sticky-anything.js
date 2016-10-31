(function($) {
'use strict';
    $.fn.stickThis = function( options ) {

        var settings = $.extend({
            // Default
            top: 0,
            minscreenwidth: 0,
            maxscreenwidth: 99999,
            fixedClass: 'sticked',
            staticClass: 'static',
            placeholderClass: 'sticky-placeholder',
            zindex: 1,
        }, options );

        var thisObject = $( this );
        var top = 0;

        // Insert an empty div, for placeholder and measuring purposes
        $( '<div></div>' ).addClass( $( this ).attr( 'class' ) ).addClass( settings.placeholderClass ).insertAfter( this );

        var runThis = function( callingEvent ) {
            // Calculating actual viewport width
            var e = window, a = 'inner';
            if ( ! ( 'innerWidth' in window ) ) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            var viewport = e[ a + 'Width' ];

            if ( ( viewport >= settings.minscreenwidth ) && ( viewport <= settings.maxscreenwidth ) ) {

                // Stick it in desired viewport range
                stickIt( settings.top, settings.zindex, settings.fixedClass, settings.staticClass, thisObject, callingEvent );
            }
        };

        $(window).on('resize', runThis('resize') );

        var checkElement = setInterval( function(){

            // Do not run, unless scroll top has changed
            var currentTop = ( (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop );
            if ( top != currentTop )  {
                top = currentTop;
                runThis('');
            }
        }, 16);

        return this;
    };

    function stickIt( stickyTop, zindex, fixedClass, staticClass, thisObject, callingEvent ) {
        var placeholder = thisObject.next();
        var placeholderTop = placeholder.offset().top;
        var selectorHeight = thisObject.outerHeight();
        var isFixed = thisObject.css("position") === 'fixed';
        var fixedInit = false;

        // Check WordPress admin bar
        var adminBarheight = ( $( '#wpadminbar' ).length && $( '#wpadminbar' ).css( 'position' ) === 'fixed' ) ? $( '#wpadminbar' ).height() : 0;
        stickyTop += adminBarheight;

        if ( ( $( window ).scrollTop() >= ( ( placeholderTop - stickyTop ) - selectorHeight ) ) && ! isFixed ) {
            // Element top reached or above desired top position and element is not fixed (yet)

            thisObject.removeClass( staticClass );
            thisObject.addClass( fixedClass );
            thisObject.css( { 'position': 'fixed', top: stickyTop + 'px' } );
            placeholder.css( {height: selectorHeight} );
            fixedInit = true;

            // Add hook after load is success
            // Can be used e.g. refresh masonry container, etc...
            // https://gist.github.com/JoeSz/6aa061ff48eaf1af658d3adf9d71ec37
            if ( typeof filter !== 'undefined' ) filter.apply( 'stickAnythingOnFixed' );
            
        } else if ( ( $( window ).scrollTop() < ( placeholderTop - stickyTop ) ) && isFixed ) {
            // Placeholder element top reached or below desired top position

            thisObject.removeClass( fixedClass );
            thisObject.addClass( staticClass );
            thisObject.removeAttr( 'style' );
            placeholder.css( {height: 0} );
            
            // Add hook after load is success
            // Can be used e.g. refresh masonry container, etc...
            // https://gist.github.com/JoeSz/6aa061ff48eaf1af658d3adf9d71ec37
            if ( typeof filter !== 'undefined' ) filter.apply( 'StickAnythingOnUnfixed' );
        }

        // Set element left and right position, z-index and max-width only
        // on scroll if just become fixed or
        // on resize, but only if it is fixed
        if ( fixedInit || ( isFixed && callingEvent == 'resize' ) ) {

            // Calculate element position based on placeholder position
            var placeholderRight = ( $( window ).width() - ( placeholder.offset().left + placeholder.outerWidth() ) );

            thisObject.css({
                'max-width': placeholder.outerWidth() + 'px',
                left: placeholder.offset().left,
                right: placeholderRight,
                'z-index': zindex
            });
        };
    }

    // Example, how to use it:
    $('.main-navigation').stickThis({
        fixedClass: 'floating-header',
        zindex: 3,
    });

}(jQuery));

