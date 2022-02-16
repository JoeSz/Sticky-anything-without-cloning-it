/**
 * Sticky anything without cloning it - jQuery plugin
 *
 * Author: Joe Szalai
 * Website: joe.szalai.org
 *
 * GitHub: https://github.com/JoeSz/Sticky-anything-without-cloning-it
 *
 * Version: 1.2.5
 *
 * The Sticky anything without cloning it plugin allows you to make any element on your page "sticky"
 * as soon as it hits the top of the page when you scroll down. Although this is commonly used to keep
 * menus at the top of your page, the plugin actually allows you to make ANY element sticky
 * (such as a Call To Action box, a logo, etc.)
 */
(function($) {
'use strict';
    $.fn.stickThis = function( options ) {
        return this.each(function() {

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

            // Insert an empty div, for placeholder and measuring purposes
            $( '<div></div>' ).addClass( $( this ).attr( 'class' ) ).addClass( settings.placeholderClass ).css({ 'background-color': $( this ).css( 'backgroundColor' ), 'height': '0' }).insertAfter( this );


            var checkFixed = function(callingEvent) {

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

            /*
             * For better user experience, if we are close to the top, check more often.
             *
             * @link https://stackoverflow.com/questions/24306290/lodash-debounce-not-working-in-anonymous-function/42455876#42455876
             */
            var throttle_fast = throttle( checkFixed, 10, 'scroll' );
            var throttle_normal = throttle( checkFixed, 100, 'scroll' );

            $( window ).on( 'scroll', function() {
                if( $( window ).scrollTop() > 200 ) {
                    throttle_normal();
                } else {
                    throttle_fast();
                }
            });
            $(window).on('resize', throttle(checkFixed, 100, 'resize') );

        });
    };

    // Source: https://gist.github.com/killersean/6742f98122d1207cf3bd
    function throttle(callback, limit, callingEvent) {
        var wait = false;
        return function() {
            if ( wait && $(window).scrollTop() > 0 ) {
                return;
            }
            callback.call(undefined, callingEvent);
            wait = true;
            setTimeout(function() {
                wait = false;
            }, limit);
        };
    }

    function stickIt( stickyTop, zindex, fixedClass, staticClass, thisObject, callingEvent ) {
        var placeholder = thisObject.next();
        var placeholderTop = placeholder.offset().top;
        var selectorHeight = thisObject.outerHeight();
        var isFixed = thisObject.css("position") === 'fixed';
        var fixedInit = false;

        // Check WordPress admin bar
        var adminBarheight = ( $( '#wpadminbar' ).length && $( '#wpadminbar' ).css( 'position' ) === 'fixed' ) ? $( '#wpadminbar' ).height() : 0;
        stickyTop += adminBarheight;

        if ( ( $( window ).scrollTop() > ( ( placeholderTop - stickyTop ) - selectorHeight ) ) && ! isFixed ) {
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

        } else if ( ( $( window ).scrollTop() <= ( placeholderTop - stickyTop ) ) && isFixed ) {
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
        }
    }

    // Example, how to use it:
    /*
    $('.main-navigation').stickThis({
        fixedClass: 'floating-header',
        zindex: 3,
    });
    */

}(jQuery));
