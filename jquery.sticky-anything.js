(function($) {
'use strict';
    $.fn.stickThis = function( options ) {

        var settings = $.extend({
            // Default
            top: 0,
            minscreenwidth: 0,
            maxscreenwidth: 99999,
            fixedClass: 'stick-it',
            zindex: 1,
        }, options );

        var thisObject = $( this );

        // Insert an empty div, for placeholder and measuring purposes
        $( '<div></div>' ).addClass( $( this ).attr( 'class' ) ).insertAfter( this );

        $( window ).bind( 'load scroll resize', function() {
            // Calculating actual viewport width
            var e = window, a = 'inner';
            if ( ! ( 'innerWidth' in window ) ) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            var viewport = e[ a + 'Width' ];

            if ( ( viewport >= settings.minscreenwidth ) && ( viewport <= settings.maxscreenwidth ) ) {
                stickIt( settings.top, settings.zindex, settings.fixedClass, thisObject );
            }
        });

        return this;
    };

    function calculatePosition( placeholder, zindex, thisObject ) {
        // Calculate object position based on placeholder position
        var placeholderRight = ( $( window ).width() - ( placeholder.offset().left + placeholder.outerWidth() ) );

        thisObject.css({
            'max-width': placeholder.outerWidth() + 'px',
            left: placeholder.offset().left,
            right: placeholderRight,
            'z-index': zindex
        });
    }

    function stickIt( stickyTop, zindex, fixedClass, thisObject ) {
        var placeholder = thisObject.next();
        var placeholderTop = placeholder.offset().top;
        var selectorHeight = thisObject.height();
        var isFixed = thisObject.css("position") === 'fixed';

        // Check WordPress admin bar
        var adminBarheight = ( $( '#wpadminbar' ).length && $( '#wpadminbar' ).css( 'position' ) === 'fixed' ) ? $( '#wpadminbar' ).height() : 0;
        stickyTop += adminBarheight;

        if ( ( $( window ).scrollTop() >= ( ( placeholderTop - stickyTop ) - selectorHeight ) ) && ! isFixed ) {
            thisObject.addClass( fixedClass );
            thisObject.css( { 'position': 'fixed', top: stickyTop + 'px' } );
            placeholder.css( {height: selectorHeight} );
            isFixed = true;
        } else if ( ( $( window ).scrollTop() < ( placeholderTop - stickyTop ) ) ) {
            thisObject.removeClass( fixedClass );
            thisObject.removeAttr( 'style' );
            placeholder.css( {height: 0} );
        }

        if ( isFixed ) {
            calculatePosition( placeholder, zindex, thisObject );
        };
    }

}(jQuery));
