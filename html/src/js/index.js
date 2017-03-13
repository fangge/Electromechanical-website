seajs.config({
    base:'./js/',
    alias : {
        //三方库
        jquery:'plugins/jquery.js',
        swiper:'plugins/swiper-3.4.1.jquery.min.js',
        mobile:'deps/mobile'
    },
    preload:['jquery']
}).use(['jquery','app/main.js'],function () {
    // 宽窄屏状态
    var body = $('body');
    var isMobile = body.hasClass('g-mobile');

    //宽窄屏切换
    $(window).on('resize', function(){
        var now = $(window).width();
        // 页面大小改变时 越过临界点触发
        if (now < 1000 && !isMobile) {
            // 变窄
            $(window).trigger('resize:narrow');
            isMobile = true;
        } else if (now >= 1000 && isMobile) {
            // 变宽
            $(window).trigger('resize:wide');
            isMobile = false;
        }
    });

    $(window).on('resize:narrow', function(){
        body.addClass('g-mobile');
    }).on('resize:wide', function(){
        body.removeClass('g-mobile');
    })
    $(window).trigger('resize');

    if(isMobile){
        seajs.use('swiper',function () {
            var swiper = new Swiper('#slide', {
                pagination: '.swiper-pagination',
                slidesPerView: 'auto',
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 30,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
                //freeMode: true
            });
        })
    }else{
        seajs.use('swiper',function () {
            var swiper = new Swiper('#slide', {
                pagination: '.swiper-pagination',
                slidesPerView: 'auto',
                centeredSlides: true,
                paginationClickable: true,
                spaceBetween: 30,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
                //freeMode: true
            });
        })
    }

});