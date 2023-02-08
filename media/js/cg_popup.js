/**
 * @package CG Popup Module for Joomla 4.X
 * @version 2.2.6 
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @copyright (c) 2023 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz 
 * using https://animate.style/
 */

var once = {}, btn_clicked = {}, options_popup = {};
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

	
if (typeof Joomla === 'undefined' || typeof Joomla.getoptions === 'undefined') {
	console.log('Joomla.getoptions not found! The Joomla core.js file is not being loaded.');
}
document.addEventListener('DOMContentLoaded', function() {
	mains = document.querySelectorAll('.cg_popup_main');
	for(var i=0; i< mains.length; i++) {
		var $this = mains[i];
		var myid = $this.getAttribute("data");
		once[myid] = false;
		btn_clicked[myid] = false;
		if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
			options_popup[myid] = '';
		} else {
			options_popup[myid] = Joomla.getOptions('cg_popup_'+myid);
		}
		if (typeof options_popup[myid] === 'undefined' ) { // cache Joomla problem
			return false;
		};
		if (typeof options_popup[myid] !== 'undefined' ) {
			go_popup(myid);
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
function go_popup(myid) {
	sp_popup = document.querySelector('#sp-popup-'+myid);
	sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
	close_popup = document.querySelector('.sp-close-popup-'+myid);
	sp_popup.style.width = options_popup[myid].width+"%";
	sp_popup.style.backgroundColor = options_popup[myid].background;
	sp_popup.style.margin = options_popup[myid].margin ;
	sp_popup.style.opacity = 0; // hide popup
	sp_popup.style.display = 'none'; // hide popup
	sp_popup.style.setProperty('--animate-duration', '800ms');
	if (sp_button) {
		sp_button.style.backgroundColor = options_popup[myid].background;
		sp_button.style.display = 'none';
		sp_button.style.opacity = 0; 
		sp_button.style.setProperty('--animate-duration', '800ms');
	}
	$cookieName = 'cg_popup_'+myid;
	if (options_popup[myid].title_button_popup == '0') options_popup[myid].title_button_first = '0'; // force 0
	if (options_popup[myid].trigger != 'delay')  options_popup[myid].delay = 0;
	
    if  (options_popup[myid].trigger != 'exit') { 
		if ((getCookie($cookieName) != "") || (options_popup[myid].title_button_first == '1') ) { // affichage bouton
			show_button(myid);
			once[myid] = true;
			btn_clicked[myid] = false;
		} else {  // on cache le bouton
			btn_clicked[myid] = true;
			if (options_popup[myid].title_button_first == '1') { 
				once[myid] = true;
			} 
		}
	}
	if (options_popup[myid].pos == 'left') {
		sp_popup.style.left = '0%';
		if (sp_button) sp_button.style.left = '0%';
	}
	if (options_popup[myid].pos == 'right') {
		sp_popup.style.right = '0%';
		if (sp_button) sp_button.style.right = '0%';
	}
	if (options_popup[myid].pos == 'center') {
		$center = (100 - options_popup[myid].width) / 2;
		sp_popup.style.left = $center+'%';
		if (sp_button) sp_button.style.left = $center+'%';
	}
	if (close_popup) {
		close_popup.addEventListener("click",function(e){ // close button
			$cookieName = 'cg_popup_'+myid;
			setCookie($cookieName,"test",options_popup[myid].duration);
			hide_popup(myid);
			if (options_popup[myid].title_button_popup == 1) { // show title button 
				show_button(myid);
			};
			once[myid] = true;
			btn_clicked[myid] = false;
		});
	}
	if (sp_button) {
		sp_button.addEventListener("click",function(e){ // title button
		$cookieName = 'cg_popup_'+myid;
		setCookie($cookieName,"test",options_popup[myid].duration);
		hide_button(myid);
		show_popup(myid);
		once[myid] = true;
		btn_clicked[myid] = true;
		});
	}
	$date_limit = options_popup[myid].date_popup;
	if ($date_limit != "") {
		date_popup = convertDate($date_limit);
		date_cookie = getCookie("cg_popup_"+myid);
		if (( date_cookie != "") && (date_popup >  date_cookie)) { deleteCookie('cg_popup_'+myid) }
	}
	if  ( (getCookie("cg_popup_"+myid) == "") && ((options_popup[myid].trigger != 'scroll')  || ((options_popup[myid].trigger == 'scroll' ) && (options_popup[myid].spscroll == '0')) ) && (options_popup[myid].title_button_first == '0') && (options_popup[myid].trigger != 'exit')) {// pas de cookie: on affiche la popup 
		if (options_popup[myid].delay > 0) {
			setTimeout(function(){
				show_popup(myid);
			}, options_popup[myid].delay); 
		} else {
			show_popup(myid);
		}
		once[myid] = true;
	} 
	if  (options_popup[myid].trigger == 'scroll') { 
		window.onscroll = function() {
			if  (btn_clicked[myid] == true ) { // scroll popup box
				if ((window.pageYOffset >= options_popup[myid].spscroll) && (window.pageYOffset < options_popup[myid].spscrollmax)) {
					if (!once[myid]) {
						show_popup(myid);
						hide_button(myid);
						once[myid] = true;
					} 
				} else {
					hide_popup(myid);
					once[myid] = false;
				}
			}  else {
				if ((window.pageYOffset >= options_popup[myid].spscroll) && (window.pageYOffset < options_popup[myid].spscrollmax)) {
					if (!once[myid]) {
						show_button(myid);
						hide_popup(myid);
						btn_clicked[myid] = false;
						once[myid] = true;
					} 
				} else {
					hide_popup(myid);
					hide_button(myid);
					once[myid] = false;
				}
			}
		};
	};
	if  (options_popup[myid].trigger == 'exit') { // show popup on exit
		setTimeout(() => {
			document.addEventListener('mouseout', mouseEvent);
			}, 1000);  // spent more than 1 seconds on this page : activate show on exit
		const mouseEvent = e => {
			const shouldShowExitIntent = !e.toElement && !e.relatedTarget && e.clientY < 10;
			if (shouldShowExitIntent) {
				document.removeEventListener('mouseout', mouseEvent);
				show_popup(myid);
				once[myid] = true;
			}
		};
	}
}
function show_popup(myid) {
	sp_popup = document.querySelector('#sp-popup-'+myid);
	sp_popup.style.opacity = options_popup[myid].opacity;
	sp_popup.style.display = 'block';
	sp_popup.classList.add('animate__animated', 'animate__'+animate_effects[options_popup[myid].speffect]);	
}
function hide_popup(myid) {
	sp_popup = document.querySelector('#sp-popup-'+myid);
	sp_popup.style.opacity = 0;
	sp_popup.style.display = "none";
	sp_popup.classList.remove('animate__animated','animate__'+animate_effects[options_popup[myid].speffect]);
}
function show_button(myid) {
	sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
	if (!sp_button) return; // not defined : exit
	sp_button.style.opacity = options_popup[myid].opacity;
	sp_button.style.display = 'block';
	sp_button.classList.add('animate__animated', 'animate__'+animate_effects[options_popup[myid].speffect]);
}
function hide_button(myid) {
	sp_button = document.querySelector('#le_btn_sp-popup-'+myid);
	if (!sp_button) return; // not defined : exit
	sp_button.style.opacity = 0; // hide button
	sp_button.style.display = 'none'; 
	sp_button.classList.remove('animate__animated','animate__'+animate_effects[options_popup[myid].speffect]);
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
