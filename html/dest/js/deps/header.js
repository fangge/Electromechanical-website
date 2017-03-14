/*!
 * @project : website
 * @version : 1.0.0
 * @author  : Mrfangge
 * @update  : 2017-03-14 12:58:04 pm
 */define("deps/header",["jquery"],function(require,exports,module){require("jquery");window.jQuery=window.$=$;$("#header").on("touchend",".nav-trigger",function(){var e=$(this);if(e.hasClass("nav-trigger-on")){e.removeClass("nav-trigger-on");$("nav").hide()}else{e.addClass("nav-trigger-on");$("body").addClass("overflow");$("nav").show()}})});