<?php
/**
 * @package CG Popup Module for Joomla 4.0
 * @version 2.1.0 
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @copyright (c) 2021 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz 
 */
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;

	$app = Factory::getApplication(); 
	$item = new \stdClass;
	$item->text = $params->get('content_popup');
	$item->params = $params;
	$app->triggerEvent('onContentPrepare', array ('com_content.article', &$item, &$item->params, 0));
	$tag_id = 'sp-popup-'.$module->id;
	if($params->get('show_btn_close_popup') == 1){
		$close_popup = '<div class="sp-close-popup sp-close-popup-'.$module->id.'"></div>';
	}else{
		$close_popup = '';
	}
	$class = "class='sp_popup_wrap ";
	$pos = $params->get('position');
	$class .= " popup-".$pos->horizontal_popup.$moduleclass_sfx."'";
	$cookieName = 'cg_popup_'.$module->id;
	$cookieValue = Factory::getApplication()->input->cookie->get($cookieName);
	echo '<div class="cg_popup_main" data="'.$module->id.'">';
	if ($params->get('title_button_popup','0') == 1) { // show title button if cookie present
		echo '<div id="btn_'.$tag_id.'" '.$class.'><button id="le_btn_'.$tag_id.'" class="cg_popup_btn" type="button">'.$module->title.'</button></div>';
	}
	echo '<div id="'.$tag_id.'" '.$class.'><div class="relative">'.$close_popup.$item->text.'</div>';
	echo '</div>';
	echo '</div>';
	$delay = '0';
	if ($params->get('trigger','none') == 'delay') {
		$delay = $params->get('sp-delay','0') ;
	}
?>

