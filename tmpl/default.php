<?php
/**
 * @package CG Popup Module for Joomla 4.x/5.x
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU/GPL
 * @copyright (c) 2025 ConseilGouz. All Rights Reserved.
 * @author ConseilGouz
 */
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;

$app = Factory::getApplication();
$document = $app->getDocument();

$modulefield	= 'media/'.$module->module;
// Get module sfx class
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''));
/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
$wa = $app->getDocument()->getWebAssetManager();
$wa->addInlineStyle($params->get('css_popup', ''));
$wa->registerAndUseStyle('popupstyle', $modulefield.'/css/style.css');
$wa->registerAndUseStyle('animate', $modulefield.'/css/animate.min.css');

if ((bool)$app->getConfig()->get('debug')) { // Mode debug
    $document->addScript(''.URI::base(true).'/media/mod_cg_popup/js/cg_popup.js');
} else {
    $wa->registerAndUseScript('cgpopup', $modulefield.'/js/cg_popup.js');
}
$layout = 'default';
$tag_id = 'sp-popup-'.$module->id;
$detail = $params->get("detail", '');
$width = $detail->width_popup;
$margin = '0px 0px 0px 0px;'; // hidden parameter str_replace(',',' ',$detail->margin_popup);
$opacity = $detail->opacity_popup;
$color = $detail->color_popup;

if (!isset($detail->type_color)) {
    $color = $detail->color_popup;
    $font_color = '#000'; // default black
} else {
    if ($detail->type_color == 'pick') { // color picker
        $color = $detail->color_popup;
        $font_color = $detail->color_font;
    } else {// CSS variable
        $color = 'var('.$detail->color_var.')';
        $font_color = 'var('.$detail->font_var.')';
    }
}

$delay = '0';
if ($params->get('trigger', 'none') == 'delay') {
    $delay = $params->get('sp-delay', '0') ;
}
$document->addScriptOptions(
    'cg_popup_'.$module->id,
    array('id' => $module->id,'current' => URI::current(),'title_button_popup' => $params->get('title_button_popup', '')
        ,'speffect' => $params->get('sp-effect', 'fadeIn')
        ,'delay' => $delay,'spscroll' => $params->get('sp-scroll', '0'), 'spscrollmax' => $params->get('sp-scroll-max', '9999')
        ,'trigger' => $params->get('trigger', 'none'),'duration' => $params->get('cookie_duration', '0')
        ,'date_popup' => $params->get('update_date_popup', '')
        , 'width' => $width, 'background' => $color,'font_color' => $font_color
        ,'margin' => $margin, 'opacity' => $opacity,'pos' => $params->get('position')->vertical_popup
        , 'title_button_first' =>  $params->get('title_button_first', '0'), 'close_on_click' => $params->get('close_on_click', '0'))
);

$item = new \stdClass();
$item->text = $params->get('content_popup', '');
$item->params = $params;
$app->triggerEvent('onContentPrepare', array('com_content.article', &$item, &$item->params, 0));
$tag_id = 'sp-popup-'.$module->id;
if ($params->get('show_btn_close_popup', '0') == 1) {
    $close_popup = '<div class="sp-close-popup sp-close-popup-'.$module->id.'"></div>';
} else {
    $close_popup = '';
}
$class = "class='sp_popup_wrap ";
$pos = $params->get('position');
$class .= " popup-".$pos->horizontal_popup.$moduleclass_sfx."'";
$class_pos = " popup-".$pos->horizontal_popup.$moduleclass_sfx;
$cookieName = 'cg_popup_'.$module->id;
$cookieValue = Factory::getApplication()->getInput()->cookie->get($cookieName);
echo '<div class="cg_popup_main" id = "cg_popup_'.$module->id.'" data="'.$module->id.'">';
if ($params->get('title_button_popup', '0') == 1) { // show title button if cookie present
    echo '<div id="btn_'.$tag_id.'" '.$class.'><button id="le_btn_'.$tag_id.'" class="cg_popup_btn'.$class_pos.'" type="button">'.$module->title.'</button></div>';
}
echo '<div id="'.$tag_id.'" '.$class.'><div class="relative">'.$close_popup.$item->text.'</div>';
echo '</div>';
echo '</div>';
$delay = '0';
if ($params->get('trigger', 'none') == 'delay') {
    $delay = $params->get('sp-delay', '0') ;
}
