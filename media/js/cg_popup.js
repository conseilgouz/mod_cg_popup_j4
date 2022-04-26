/**
 * @package CG Popup Module for Joomla 4.0
 * @version 2.1.0 
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @copyright (c) 2021 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz 
 */

var animateOptions = {
	delay: 100,
    duration:800};
var once = {};
var btn_clicked = {};
if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
	console.log('Joomla.getOptions not found! The Joomla core.js file is not being loaded.');
}
jQuery(document).ready(function ($){
	$('.cg_popup_main').each(function() {
		var $this = $(this);
		var myid = $this.attr("data");
		once[myid] = false;
		btn_clicked[myid] = false;
		if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
			var options;
		} else {
			var options = Joomla.getOptions('cg_popup_'+myid);
		}
		if (typeof options === 'undefined' ) { // cache Joomla problem
			return false;
		};
		if (typeof options !== 'undefined' ) {
			go_popup(myid,options);
		}
	});
});
function go_popup(myid,options) {
	jQuery('#sp-popup-'+myid).css({"width":options.width+"%","background":options.background,"margin":options.margin});
	jQuery('#le_btn_sp-popup-'+myid).css({"background-color":options.background});
	$cookieName = 'cg_popup_'+myid;
	
	if (options.title_button_popup == '0') options.title_button_first = '0'; // force 0
	if (options.trigger == 'scroll') options.delay = 0;
	
	jQuery('#sp-popup-'+myid).css('display','none');
    if ((getCookie($cookieName) != "") || (options.title_button_first == '1') ) { // affichage bouton
		jQuery('#btn_sp-popup-'+myid).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity}); 
		once[myid] = true;
		btn_clicked[myid] = false;
	} else {  // on cache le bouton
		jQuery('#btn_sp-popup-'+myid).css({'display':'none','width':'auto'});
		btn_clicked[myid] = true;
		if (options.title_button_first == '1') { 
			once[myid] = true;
		} 
	}
	if (options.pos == 'left') {
		jQuery('#sp-popup-'+myid).css('left','0%');
		jQuery('#btn_sp-popup-'+myid).css('left','0%');
	}
	if (options.pos == 'right') {
		jQuery('#sp-popup-'+myid).css('right','0%');
		jQuery('#btn_sp-popup-'+myid).css('right','0%');
	}
	if (options.pos == 'center') {
		$center = options.width / 2;
		jQuery('#sp-popup-'+myid).css('left',$center+'%');
		jQuery('#btn_sp-popup-'+myid).css('left',$center+'%');
	}
	jQuery('.sp-close-popup-'+myid).click(function(){ // close button
		$cookieName = 'cg_popup_'+myid;
		setCookie($cookieName,"test",options.duration);
		jQuery('#sp-popup-'+myid).css("display","none");
		if (options.title_button_popup == 1) { // show title button 
			jQuery('#btn_sp-popup-'+myid).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity});
		};
		once[myid] = true;
		btn_clicked[myid] = false;
	});
	jQuery('#btn_sp-popup-'+myid).click(function(){ // title button
		$cookieName = 'cg_popup_'+myid;
		setCookie($cookieName,"test",options.duration);
		jQuery('#btn_sp-popup-'+myid).css("display","none");
		jQuery('#sp-popup-'+myid).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity});
		once[myid] = true;
		btn_clicked[myid] = true;
	});
	$date_limit = options.date_popup;
	if ($date_limit != "") {
		date_popup = convertDate($date_limit);
		date_cookie = getCookie("cg_popup_"+myid);
		if (( date_cookie != "") && (date_popup >  date_cookie)) { deleteCookie('cg_popup_'+myid) }
	}
	if  ( (getCookie("cg_popup_"+myid) == "") && ((options.trigger != 'scroll')  || ((options.trigger == 'scroll' ) && (options.spscroll == '0')) ) && (options.title_button_first == '0')) {// pas de cookie: on affiche la popup 
		jQuery('#sp-popup-'+myid).delay(options.delay).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity});
		once[myid] = true;
	} 
	if  (options.trigger == 'scroll') { 
		jQuery(window).scroll(function() {
			if  (btn_clicked[myid] == true ) { // scroll popup box
				if ((jQuery(window).scrollTop() >= options.spscroll) && (jQuery(window).scrollTop() < options.spscrollmax)) {
					if (!once[myid]) {
						jQuery('#sp-popup-'+myid).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity});
						jQuery('#btn_sp-popup-'+myid).css("display","none");
						once[myid] = true;
					} 
				} else {
					jQuery('#sp-popup-'+myid).css("display","none");
					once[myid] = false;
				}
			}  else {
				if ((jQuery(window).scrollTop() >= options.spscroll) && (jQuery(window).scrollTop() < options.spscrollmax)) {
					if (!once[myid]) {
						jQuery('#btn_sp-popup-'+myid).velocity("transition."+options.speffect,animateOptions).velocity({opacity:options.opacity});
						jQuery('#sp-popup-'+myid).css("display","none");
						btn_clicked[myid] = false;
						once[myid] = true;
					} 
				} else {
					jQuery('#btn_sp-popup-'+myid).css("display","none");
					jQuery('#sp-popup-'+myid).css("display","none");
					once[myid] = false;
				}
			}
		});
	};
}
function getCookie(name) { 
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : '';
}	
function pad(s) { return (s < 10) ? '0' + s : s; }
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
	var now = new Date().getFullYear() + "-" + pad(new Date().getMonth() + 1) + "-" + pad(new Date().getDate());
	$secure = "";
	if (window.location.protocol == "https:") $secure="secure;"; 
    document.cookie = cname + "=" + now + ";" + expires + ";path=/; samesite=lax;"+$secure;
}
function deleteCookie(cname) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function convertDate(inputFormat) {
  var d = inputFormat.split('-');
  return d[2] + '-' + d[1] + '-' + d[0];
}
