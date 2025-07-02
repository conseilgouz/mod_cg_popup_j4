<?php
/**
 * CG Popup Module for Joomla 4.x/5.x
 *
 * @author     ConseilgGouz
 * @copyright (C) 2025 www.conseilgouz.com. All Rights Reserved.
 * @license    GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */

namespace ConseilGouz\Module\CGPopup\Site\Field;

defined('_JEXEC') or die;
use Joomla\CMS\Form\Field\RangeField;
use Joomla\CMS\Factory;

class CgrangeField extends RangeField
{
    public $type = 'Cgrange';

    /**
     * Name of the layout being used to render the field
     *
     * @var    string
     * @since  3.7
     */
    protected $layout = 'cgrange';

    /**
     * Unit
     *
     * @var    string
     */

    protected $unit = "";
    /* module's information */
    public $_ext = "mod";
    public $_type = "cg";
    public $_name = "memo";

    protected function getLayoutPaths()
    {
        $paths = parent::getLayoutPaths();
        $paths[] = dirname(__DIR__).'/../layouts';
        return $paths;

    }

    /**
     * Method to get the field input markup.
     *
     * @return  string  The field input markup.
     *
     * @since   3.2
     */
    protected function getInput()
    {
        return $this->getRenderer($this->layout)->render($this->collectLayoutData());
    }
    /**
     * Method to get the data to be passed to the layout for rendering.
     * The data is cached in memory.
     *
     * @return  array
     *
     * @since 5.1.0
     */
    protected function collectLayoutData(): array
    {
        if ($this->layoutData) {
            return $this->layoutData;
        }

        $this->layoutData = $this->getLayoutData();
        return $this->layoutData;
    }
    protected function getLayoutData()
    {
        $data      = parent::getLayoutData();
        $extraData = ["unit" => $this->element['unit']
        ];
        return array_merge($data, $extraData);
    }
}
