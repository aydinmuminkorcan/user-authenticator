(function ($) {
    'use strict';

    var confer_window = $(window);

    // ****************************
    // ClassyNav Active Code
    // ****************************

    if ($.fn.classyNav) {
        $('#conferNav').classyNav();
    }

    // ************************
    // Stick Active Code
    // ************************

    confer_window.on('scroll', function () {
        if (confer_window.scrollTop() > 0) {
            $('.header-area').addClass('sticky');
        } else {
            $('.header-area').removeClass('sticky');
        }
    });

    // *********************************
    // Prevent Default 'a' Click
    // *********************************
    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });
})(jQuery);
