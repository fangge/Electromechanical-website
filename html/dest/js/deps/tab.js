/*!
 * @project : website
 * @version : 1.0.0
 * @author  : Mrfangge
 * @update  : 2017-03-14 12:58:04 pm
 */define("deps/tab",["jquery"],function(require,exports,module){require("jquery");window.jQuery=window.$=$;var t=function(t,n,e,a){var i=$(t),r=n;i.each(function(t,n){var e=$(this).find(".tab-btn");e.each(function(t,n){$(this).attr("data-indent",t)});var a=$(this).find(".tab-cont");if(a.length<2)return;if(r){a.hide().eq(r).show();e.eq(r).addClass("cur")}else{a.hide().eq(0).show();e.eq(0).addClass("cur")}});i.on("mouseover",".tab-btn",function(n){var a=$(this).parents(t),i=a.find(".tab-cont"),r=a.find(".tab-btn");r.removeClass(e||"cur");$(this).addClass(e||"cur");i.hide().eq(parseInt($(this).attr("data-indent"))).show();n.preventDefault()});if(a){var s=0;setInterval(function(){i.find(".tab-btn").eq(s).trigger("mouseover");s>i.find(".tab-btn").length-1?s=0:s++},5e3)}};t("#tab-col",0)});