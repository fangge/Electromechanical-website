define(function(require, exports, module) {
    require('jquery');
    window.jQuery = window.$ = $;


        $('#header').on('touchend','.nav-trigger',function () {
            var _this = $(this);
            if(_this.hasClass('nav-trigger-on')){
                _this.removeClass('nav-trigger-on');
                $('nav').hide()
            }else{
                _this.addClass('nav-trigger-on');
                $('body').addClass('overflow')
                $('nav').show();
            }
        })

})