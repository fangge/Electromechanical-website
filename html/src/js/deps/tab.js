define(function(require, exports, module) {
    require('jquery');
    window.jQuery = window.$ = $;

    /**
     * tab切换
     * @param selector
     * @param navindex
     * @param currentClass
     */
    var newsbox  = function(selector,navindex,currentClass,autoSlide){
        var newsbox = $(selector),n = navindex;
        newsbox.each(function(index, el) {
            var trigger = $(this).find('.tab-btn');

            trigger.each(function(index, el) {
                $(this).attr("data-indent",index);
            });
            var videoList = $(this).find('.tab-cont');
            if( videoList.length < 2 ) return;
            if(n){
                videoList.hide().eq(n).show();
                trigger.eq(n).addClass('cur');
            }else{
                videoList.hide().eq(0).show();
                trigger.eq(0).addClass('cur');
            }

        });
        newsbox.on('mouseover', '.tab-btn', function(event) {
            var parent = $(this).parents(selector),
                videoList = parent.find('.tab-cont'),
                trigger = parent.find('.tab-btn');
            trigger.removeClass(currentClass ||'cur');
            $(this).addClass(currentClass ||'cur');
            videoList.hide().eq( parseInt( $(this).attr("data-indent") ) ).show();
            event.preventDefault();
            /* Act on the event */
        });

        if(autoSlide){
            var j = 0;
            setInterval(function () {
                newsbox.find('.tab-btn').eq(j).trigger('mouseover');
                j>newsbox.find('.tab-btn').length-1?j=0:j++;
            },5000)
        }

    }
    newsbox('#tab-col',0);
})