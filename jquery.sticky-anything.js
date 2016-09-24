(function($) {
'use strict';

    /**
     * @link https://davidwalsh.name/javascript-debounce-function
     *
     * Here's the basic JavaScript debounce function (as taken from Underscore.js):
     */

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

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

/*
        $(window).on('scroll', checkElement );

        var checkElement = debounce(function() {
            runThis('');
        }, 10);
*/
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

