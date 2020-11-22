(function ($) {
    "use strict";

    var confer_window = $(window);

    // ****************************
    // :: 2.0 ClassyNav Active Code
    // ****************************

    if ($.fn.classyNav) {
        $("#conferNav").classyNav();
    }

    // ************************************
    // :: 4.0 Instragram Slides Active Code
    // ************************************

    if ($.fn.owlCarousel) {
        var clientArea = $(".client-area");
        clientArea.owlCarousel({
            items: 2,
            loop: true,
            autoplay: true,
            smartSpeed: 1000,
            margin: 40,
            autoplayTimeout: 7000,
            nav: true,
            navText: [
                '<i class="zmdi zmdi-chevron-left"></i>',
                '<i class="zmdi zmdi-chevron-right"></i>',
            ],
            responsive: {
                0: {
                    items: 1,
                },
                576: {
                    items: 2,
                    margin: 15,
                },
                992: {
                    margin: 20,
                },
                1200: {
                    margin: 40,
                },
            },
        });
    }

    // ***********************************
    // :: 6.0 Portfolio Button Active Code
    // ***********************************

    $(".portfolio-menu button.btn").on("click", function () {
        $(".portfolio-menu button.btn").removeClass("active");
        $(this).addClass("active");
    });

   
    // ************************
    // :: 8.0 Stick Active Code
    // ************************

    confer_window.on("scroll", function () {
        if (confer_window.scrollTop() > 0) {
            $(".header-area").addClass("sticky");
        } else {
            $(".header-area").removeClass("sticky");
        }
    });

    // *********************************
    // :: 9.0 Magnific Popup Active Code
    // *********************************
    if ($.fn.magnificPopup) {
        $(".video-play-btn").magnificPopup({
            type: "iframe",
        });
        $(".portfolio-img").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
                preload: [0, 2],
                navigateByImgClick: true,
                tPrev: "Previous",
                tNext: "Next",
            },
        });
        $(".single-gallery-item").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
                preload: [0, 2],
                navigateByImgClick: true,
                tPrev: "Previous",
                tNext: "Next",
            },
        });
    }

    // **************************
    // :: 10.0 Tooltip Active Code
    // **************************
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }


    // *********************************
    // :: 14.0 Prevent Default 'a' Click
    // *********************************
    $('a[href="#"]').on("click", function ($) {
        $.preventDefault();
    });
})(jQuery);
