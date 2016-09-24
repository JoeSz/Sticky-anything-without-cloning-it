STICKY ANYTHING WITHOUT CLONING IT - JQUERY PLUGIN
============================================

- Author: Joe Szalai
- Original idea and concept by: Mark Senff
- Forked from: https://github.com/senff/Sticky-Anything
- Version: 1.0.0
- Plugin URL: https://github.com/JoeSz/Sticky-anything-without-cloning-it
- Author URL: http://joe.szalai.org
- License: GNU General Public License v3 or later
- License URI: http://www.gnu.org/licenses/gpl-3.0.html



DESCRIPTION
-----------
This plugin (including this readme) based on Sticky Anything plugin from Mark Senff. https://github.com/senff/Sticky-Anything

It is heavily modified.

Main differences:
- Working without cloning the element. Cloning the element consume more CPU and RAM. Also can be dangerous, if cloned element has a unique ID.
- Based on load, scroll and resize events, without using setInterval.
- Theoretically possible, to apply selector more then once. More below.
- Can apply class(es) to fixed element.

The Sticky anything without cloning it plugin allows you to make any element on your page "sticky" as soon as it hits the top of the page when you scroll down. Although this is commonly used to keep menus at the top of your page, the plugin actually allows you to make ANY element sticky (such as a Call To Action box, a logo, etc.)



USAGE
-----

Put the minified JS file *jquery.sticky-anything.min.js* in your JS folder (or wherever you like, of course) and call it in your document -- after you load your jQuery library and before your custom jQuery code/calls:

    <script src="/path/to/plugin/jquery.sticky-anything.min.js"></script>

In your custom jQuery calls, attach the function "stickThis" to the element you want to stick at the top of the screen:

    $('.main-menu').stickThis();


### Options

#### General

The following default options are provided by the plugin. None of them are required:

	$('.main-menu').stickThis({
        top: 		0,		// top position of sticky element, measured from 'ceiling'
        minscreenwidth:	0,		// element will not be sticky when viewport width smaller than this
        maxscreenwidth: 999999,		// element will not be sticky when viewport width larger than this
        zindex: 	1,		// z-index value of sticky element
        fixedClass:	'class-name'	// add class to fixed element
    });

More information below.


#### Top position

It's possible that you don't want your element to be sticky EXACTLY at the top of the page, but a little lower (so there is room between the "ceiling" and your element). In this case, add the necessary space as an option named "top", e.g.:

    $('.main-menu').stickThis({
        top:80
    });

If you use a negative number, the element will be sticky ABOVE the "ceiling", and will therefore be cut off a bit at the top, e.g.:

    $('.main-menu').stickThis({
        top:-35
    });

#### Minimum screen width

If you don't want your element to be sticky when the viewport is smaller than a certain width (for example, you don't want your menu to be sticky for mobile devices, or your site is responsive so that a smaller screen width changes the design enough to make stickiness unnecessary), you can add a minimum screen width.

If you want your main menu to behave normally ("not sticky") for screens/widths smaller than 700 pixels:

    $('.main-menu').stickThis({
        minscreenwidth:700
    });

#### Maximum screen width

If you don't want your element to be sticky when the viewport is larger than a certain width (for example, you don't want your menu to be sticky for desktop devices while still use it for mobile devices, or your site is responsive so that a wider screen width changes the design enough to make stickiness unnecessary), you can add a maximum screen width.

If you want your main menu to behave normally ("not sticky") for screens/widths wider than 1600 pixels:

    $('.main-menu').stickThis({
        maxscreenwidth:1600
    });

This setting can be combined with the Minimum screen width, so that stickiness can occur between certain screen widths only, for example:

    $('.main-menu').stickThis({
        maxscreenwidth:700,
        maxscreenwidth:1600
    });


#### Z-index

If your page has any elements that may obscure/overlap your sticky element, you can try to overrule that by assigning it a particular Z-index value, e.g.:

    $('.main-menu').stickThis({
        zindex:100
    });

Don't be lazy by assigning a value of 99999 -- that's definitely like shooting a mosquito with a bazooka. Although it'll probably work, it's often unnecessary. Try to find the Z-index of the element(s) that obscure(s) your sticky element, and add a few to it for your sticky one.


#### Class(es)

This is the class what you can style, using CSS to design sticky element, on fixed positioning. Sometimes it is good, if the element, after it is fixed, has a class, to identify its fixed state. Mainly for design purposes.

    $('.main-menu').stickThis({
        fixedClass:'class-name'
    });



NOTES AND RESTRICTIONS AND BUGS AND STUFF
-----------------------------------------

- Recommended use is to call *jquery.sticky-anything.min.js*. The other JS file, *jquery.sticky-anything.js*, is functional and works fine too, but is only included for study purposes, to show more clearly what the code does.

- When you attach "stickThis" to your element of choice, it is theoretically possible, to apply selector more then once, but I haven't tested yet.

- Although this plugin works fine even down to IE7, it will not work if you try to stick any HTML5 elements (`<NAV>`, `<HEADER>`, `<ARTICLE>`, etc), not even when you use a polyfill like HTML5shiv or Modernizr, and not even when you just use the classname and don't include the element name. You can only stick HTML5 elements in IE9 and up.

CHANGELOG
---------

= 1.0.0 =
* Initial release


LICENSE DETAILS
---------------
The GPL license of Sticky anything without cloning it grants you the right to use, study, share (copy), modify and (re)distribute the software, as long as these license terms are retained.
