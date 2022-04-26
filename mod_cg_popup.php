<?php
/**
 * @package CG Popup Module for Joomla 4.0
 * @version 2.1.0
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @copyright (c) 2021 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz 
 *
 */
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Helper\ModuleHelper;

HTMLHelper::_('jquery.framework'); // make sure jQuery is loaded

$document = Factory::getDocument();
$modulefield	= 'media/'.$module->module;
// Get module sfx class
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx'));
/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$wa = Factory::getApplication()->getDocument()->getWebAssetManager();
$wa->addInlineStyle($params->get('css_popup'));
$wa->registerAndUseStyle('popupstyle',$modulefield.'/css/style.css');

$wa->registerAndUseScript('velocity', $modulefield.'/js/velocity.min.js');
$wa->registerAndUseScript('velocityui', $modulefield.'/js/velocity.ui.min.js');
$wa->registerAndUseScript('cgpopup', $modulefield.'/js/cg_popup.js');

$layout = 'default';
$tag_id = 'sp-popup-'.$module->id;
$detail = $params->get("detail");
$width = $detail->width_popup;
$margin = str_replace(',',' ',$detail->margin_popup);
$opacity = $detail->opacity_popup;
$color = $detail->color_popup;

$delay = '0';
if ($params->get('trigger','none') == 'delay') {
	$delay = $params->get('sp-delay','0') ;
}
$document->addScriptOptions('cg_popup_'.$module->id, 
	array('id' => $module->id,'current' => JURI::current(),'title_button_popup' => $params->get('title_button_popup','')
		,'speffect' => $params->get('sp-effect','fadeIn'),'delay' => $delay,'spscroll' => $params->get('sp-scroll','0'), 'spscrollmax' => $params->get('sp-scroll-max','9999')
		,'trigger' => $params->get('trigger','none'),'duration' => $params->get('cookie_duration','0'),'date_popup' => $params->get('update_date_popup','') 
		, 'width' => $width, 'background' => $color, 'margin' => $margin, 'opacity' => $opacity,'pos' => $params->get('position')->vertical_popup
		, 'title_button_first' =>  $params->get('title_button_first','0') )
	);
require ModuleHelper::getLayoutPath($module->module, $layout);
?>