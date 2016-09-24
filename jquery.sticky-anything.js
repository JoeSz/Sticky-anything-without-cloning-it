(function($) {
'use strict';
    $.fn.stickThis = function( options ) {

        var settings = $.extend({
            // Default
            top: 0,
            minscreenwidth: 0,
            maxscreenwidth: 99999,
            fixedClass: 'sticked',
            zindex: 1,
        }, options );

        var thisObject = $( this );

        // Insert an empty div, for placeholder and measuring purposes
        $( '<div></div>' ).addClass( $( this ).attr( 'class' ) ).insertAfter( this );

        var runThis = function( callingEvent ) {
            // Calculating actual viewport width
            var e = window, a = 'inner';
            if ( ! ( 'innerWidth' in window ) ) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            var viewport = e[ a + 'Width' ];

            if ( ( viewport >= settings.minscreenwidth ) && ( viewport <= settings.maxscreenwidth ) ) {
                stickIt( settings.top, settings.zindex, settings.fixedClass, thisObject, callingEvent );
            }
        };

        $(window).on('resize', runThis('resize') );

        var checkElement = setInterval( function(){
            runThis('');
        }, 16);

        return this;
    };

    function stickIt( stickyTop, zindex, fixedClass, thisObject, callingEvent ) {
        var placeholder = thisObject.next();
        var placeholderTop = placeholder.offset().top;
        var selectorHeight = thisObject.height();
        var isFixed = thisObject.css("position") === 'fixed';
        var fixedInit = false;

        // Check WordPress admin bar
        var adminBarheight = ( $( '#wpadminbar' ).length && $( '#wpadminbar' ).css( 'position' ) === 'fixed' ) ? $( '#wpadminbar' ).height() : 0;
        stickyTop += adminBarheight;

        if ( ( $( window ).scrollTop() >= ( ( placeholderTop - stickyTop ) - selectorHeight ) ) && ! isFixed ) {
            thisObject.addClass( fixedClass );
            thisObject.css( { 'position': 'fixed', top: stickyTop + 'px' } );
            placeholder.css( {height: selectorHeight} );
            fixedInit = true;
        } else if ( ( $( window ).scrollTop() < ( placeholderTop - stickyTop ) ) ) {
            thisObject.removeClass( fixedClass );
            thisObject.removeAttr( 'style' );
            placeholder.css( {height: 0} );
        }

        if ( fixedInit || isFixed && callingEvent == 'resize' ) {
            // Calculate object position based on placeholder position
            var placeholderRight = ( $( window ).width() - ( placeholder.offset().left + placeholder.outerWidth() ) );

            thisObject.css({
                'max-width': placeholder.outerWidth() + 'px',
                left: placeholder.offset().left,
                right: placeholderRight,
                'z-index': zindex
            });
        };
    }

    // Example, how to use:
    $('.main-navigation').stickThis({
        fixedClass: 'floating-header',
        zindex: 3,
    });

}(jQuery));

