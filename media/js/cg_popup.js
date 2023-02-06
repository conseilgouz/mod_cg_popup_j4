/**
 * @package CG Popup Module for Joomla 4.X
 * @version 2.2.0 
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @copyright (c) 2023 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz 
 * using https://animate.style/
 */

var once = {};
var btn_clicked = {};
var animate_effects = []; // animate 2 to animate 3
animate_effects["fadeIn"] = "fadeIn";
animate_effects["flipXIn"] = "flipInX";
animate_effects["flipYIn"] = "flipInY";
animate_effects["swoopIn"] = "rollIn";
animate_effects["whirlIn"] ="rotateIn";
animate_effects["slideUpIn"] ="slideInUp";
animate_effects["slideUpBigIn"] = "slideInUp";
animate_effects["slideDownBigIn"] ="slideInDown";
animate_effects["slideLeftBigIn"] = "slideInLeft";
animate_effects["slideRightBigIn"] ="slideInRight"
animate_effects["perspectiveUpIn"] ="fadeInUpBig";
animate_effects["perspectiveDownIn"] = "fadeInDownBig";
animate_effects["perspectiveLeftIn"] ="fadeInLeftBig";
animate_effects["perspectiveRightIn"] = "fadeInRightBig";

	
if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
	console.log('Joomla.getOptions not found! The Joomla core.js file is not being loaded.');
}
document.addEventListener('DOMContentLoaded', function() {
	mains = document.querySelectorAll('.cg_popup_main');
	for(var i=0; i< mains.length; i++) {
		var $this = mains[i];
		var myid = $this.getAttribute("data");
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
	};
});
var css = new function()
{
    function addStyleSheet()
    {
        let head = document.head;
        let style = document.createElement("style");

        head.appendChild(style);
    }

    this.insert = function(rule)
    {
        if(document.styleSheets.length == 0) { addStyleSheet(); }

        let sheet = document.styleSheets[document.styleSheets.length - 1];
        let rules = sheet.rules;

        sheet.insertRule(rule, rules.length);
    }
}


function go_popup(myid,options) {
	sp_popup = document.querySelector('#sp-popup-'+myid);
	sp_popup.style.width = options.width+"%";
	sp_popup.style.backgroundColor = options.background;
	sp_popup.style.margin = options.margin ;
	sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
	sp_button.style.backgroundColor = options.background;
	sp_popup.style.opacity = 0; // hide popup
	sp_popup.style.zIndex = 10000;
	sp_button.style.zIndex = 10001;
	sp_button.style.opacity = 0; // hide button
	sp_popup.style.setProperty('--animate-duration', '800ms');
	sp_button.style.setProperty('--animate-duration', '800ms');

	$cookieName = 'cg_popup_'+myid;
	
	if (options.title_button_popup == '0') options.title_button_first = '0'; // force 0
	if (options.trigger != 'delay')  options.delay = 0;
	
    if  (options.trigger != 'exit') { 
		if ((getCookie($cookieName) != "") || (options.title_button_first == '1') ) { // affichage bouton
			sp_button.style.opacity = options.opacity;
			sp_button.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
			once[myid] = true;
			btn_clicked[myid] = false;
		} else {  // on cache le bouton
			btn_clicked[myid] = true;
			if (options.title_button_first == '1') { 
				once[myid] = true;
			} 
		}
	}
	if (options.pos == 'left') {
		sp_popup.style.left = '0%';
		sp_button.style.left = '0%';
	}
	if (options.pos == 'right') {
		sp_popup.style.right = '0%';
		sp_button.style.right = '0%';
	}
	if (options.pos == 'center') {
		$center = options.width / 2;
		sp_popup.style.left = $center+'%';
		sp_popup.style.left = $center+'%';
	}
	close_popup = document.querySelector('.sp-close-popup-'+myid);
	close_popup.addEventListener("click",function(e){ // close button
		$cookieName = 'cg_popup_'+myid;
		setCookie($cookieName,"test",options.duration);
		sp_popup = document.querySelector('#sp-popup-'+myid);
		sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
		sp_popup.style.opacity = 0;
		sp_popup.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
		if (options.title_button_popup == 1) { // show title button 
			sp_button.style.opacity = options.opacity;
			sp_button.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
		};
		once[myid] = true;
		btn_clicked[myid] = false;
	});
	sp_button.addEventListener("click",function(e){ // title button
		$cookieName = 'cg_popup_'+myid;
		setCookie($cookieName,"test",options.duration);
		sp_popup = document.querySelector('#sp-popup-'+myid);
		sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
		sp_button.style.opacity = 0; // hide button
		sp_button.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
		sp_popup.style.opacity = options.opacity;
		sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
		once[myid] = true;
		btn_clicked[myid] = true;
	});
	$date_limit = options.date_popup;
	if ($date_limit != "") {
		date_popup = convertDate($date_limit);
		date_cookie = getCookie("cg_popup_"+myid);
		if (( date_cookie != "") && (date_popup >  date_cookie)) { deleteCookie('cg_popup_'+myid) }
	}
	if  ( (getCookie("cg_popup_"+myid) == "") && ((options.trigger != 'scroll')  || ((options.trigger == 'scroll' ) && (options.spscroll == '0')) ) && (options.title_button_first == '0') && (options.trigger != 'exit')) {// pas de cookie: on affiche la popup 
		if (options.delay > 0) {
			setTimeout(function(){
				sp_popup = document.querySelector('#sp-popup-'+myid);
				sp_popup.style.opacity = options.opacity;
				sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
			}, options.delay); 
		} else {
			sp_popup = document.querySelector('#sp-popup-'+myid);
			sp_popup.style.opacity = options.opacity;
			sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
		}
		once[myid] = true;
	} 
	if  (options.trigger == 'scroll') { 
		window.onscroll = function() {
			if  (btn_clicked[myid] == true ) { // scroll popup box
				if ((window.pageYOffset >= options.spscroll) && (window.pageYOffset < options.spscrollmax)) {
					if (!once[myid]) {
						sp_popup.style.opacity = options.opacity;
						sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
						sp_button.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
						sp_button.style.opacity = 0;
						once[myid] = true;
					} 
				} else {
					sp_popup.style.opacity = 0;
					sp_popup.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
					once[myid] = false;
				}
			}  else {
				if ((window.pageYOffset >= options.spscroll) && (window.pageYOffset < options.spscrollmax)) {
					if (!once[myid]) {
						sp_button.style.opacity = options.opacity;
						sp_button.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
						sp_popup.style.opacity = 0;
						sp_popup.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
						btn_clicked[myid] = false;
						once[myid] = true;
					} 
				} else {
					sp_popup.style.opacity = 0;
					sp_popup.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
					sp_button.style.opacity = 0;
					sp_button.classList.remove('animate__animated','animate__'+animate_effects[options.speffect]);
					once[myid] = false;
				}
			}
		};
	};
	if  (options.trigger == 'exit') { // show popup on exit
		setTimeout(() => {
			document.addEventListener('mouseout', mouseEvent);
			}, 1000);  // spent more than 1 seconds on this page : activate show on exit
		const mouseEvent = e => {
			const shouldShowExitIntent = !e.toElement && !e.relatedTarget && e.clientY < 10;
			if (shouldShowExitIntent) {
				document.removeEventListener('mouseout', mouseEvent);
				sp_popup.style.opacity = options.opacity;
				sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options.speffect]);
				once[myid] = true;
			}
		};
	}
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
