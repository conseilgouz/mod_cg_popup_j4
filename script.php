<?php
/**
* CG Popup Module  - Joomla 4.x/5.x/6.x Module 
* Package			: CG Popup
* copyright 		: Copyright (C) 2025 ConseilGouz. All rights reserved.
* license    		: https://www.gnu.org/licenses/gpl-3.0.html GNU/GPL
*/
// No direct access to this file
defined('_JEXEC') or die;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Version;
use Joomla\Database\DatabaseInterface;
use Joomla\Filesystem\File;
use Joomla\Filesystem\Folder;

class mod_cg_popupInstallerScript
{
	private $min_joomla_version      = '4.2.0';
	private $min_php_version         = '7.4';
	private $name                    = 'CG Popup';
	private $exttype                 = 'module';
	private $extname                 = 'cg_popup';
	private $previous_version        = '';
    private $newlib_version	         = '';
	private $dir           = null;
	private $installerName = 'cg_popupinstaller';
	private $lang;
	
	public function __construct()
	{
		$this->dir = __DIR__;
		$this->lang = Factory::getApplication()->getLanguage();
		$this->lang->load($this->extname);
	}

    function preflight($type, $parent)
    {
		if ( ! $this->passMinimumJoomlaVersion())
		{
			$this->uninstallInstaller();
			return false;
		}

		if ( ! $this->passMinimumPHPVersion())
		{
			$this->uninstallInstaller();
			return false;
		}
		// To prevent installer from running twice if installing multiple extensions
		if ( ! file_exists($this->dir . '/' . $this->installerName . '.xml'))
		{
			return true;
		}
		$xml = simplexml_load_file(JPATH_BASE . '/modules/mod_'.$this->extname.'/mod_'.$this->extname.'.xml');
		$this->previous_version = $xml->version;
    }
    
    function postflight($type, $parent)
    {
		if (($type=='install') || ($type == 'update')) { // remove obsolete dir/files
			$this->postinstall_cleanup();
		}
        if (!$this->checkLibrary('conseilgouz')) { // need library installation
            $ret = $this->installPackage('lib_conseilgouz');
            if ($ret) {
                Factory::getApplication()->enqueueMessage('ConseilGouz Library ' . $this->newlib_version . ' installed', 'notice');
            }
        }
        // delete obsolete version.php file
        $this->delete([
            JPATH_SITE . '/modules/mod_'.$this->extname.'/src/Field/VersionField.php',
            JPATH_SITE . '/modules/mod_'.$this->extname.'/src/Field/CgrangeField.php',
            JPATH_SITE . '/modules/mod_'.$this->extname.'/layouts/cgrange.php',
            JPATH_SITE . '/modules/mod_'.$this->extname.'/layouts/cgrange.php',
            JPATH_SITE . '/media/mod_'.$this->extname.'/js/cgrange.js',
            JPATH_SITE . '/media/mod_'.$this->extname.'/css/cgrange.css',
        ]);

		switch ($type) {
            case 'install': $message = Text::_('ISO_POSTFLIGHT_INSTALLED'); break;
            case 'uninstall': $message = Text::_('ISO_POSTFLIGHT_UNINSTALLED'); break;
            case 'update': $message = Text::_('ISO_POSTFLIGHT_UPDATED'); break;
            case 'discover_install': $message = Text::_('ISO_POSTFLIGHT_DISC_INSTALLED'); break;
        }
		return true;
    }
	private function postinstall_cleanup() {
		$obsloteFolders = ['assets', 'language'];
		// Remove plugins' files which load outside of the component. If any is not fully updated your site won't crash.
		foreach ($obsloteFolders as $folder)
		{
			$f = JPATH_SITE . '/modules/mod_'.$this->extname.'/' . $folder;

			if (!@file_exists($f) || !is_dir($f) || is_link($f))
			{
				continue;
			}

			Folder::delete($f);
		}
		$obsloteFiles = [
			sprintf("%s/modules/mod_%s/mod_cg_popup.php", JPATH_SITE, $this->extname),
			sprintf("%s/modules/mod_%s/helper.php", JPATH_SITE, $this->extname),
			sprintf("%s/modules/mod_%s/css_admin.css", JPATH_SITE, $this->extname),
			sprintf("%s/media/mod_%s/js/velocity.min.js", JPATH_SITE, $this->extname),
			sprintf("%s/media/mod_%s/js/velocity.ui.min.js", JPATH_SITE, $this->extname),
			sprintf(JPATH_ADMINISTRATOR.'/manifests/packages/pkg_cg_popup.xml')
		];
		foreach ($obsloteFiles as $file)
		{
			if (@is_file($file))
			{
				File::delete($file);
			}
		}
		$j = new Version();
		$version=$j->getShortVersion(); 
		$version_arr = explode('.',$version);
		if (($version_arr[0] == "4") || (($version_arr[0] == "3") && ($version_arr[1] == "10"))) {
			// Delete 3.9 and older language files
			$langFiles = [
				sprintf("%s/language/en-GB/en-GB.mod_%s.ini", JPATH_SITE, $this->extname),
				sprintf("%s/language/en-GB/en-GB.mod_%s.sys.ini", JPATH_SITE, $this->extname),
				sprintf("%s/language/fr-FR/fr-FR.mod_%s.ini", JPATH_SITE, $this->extname),
				sprintf("%s/language/fr-FR/fr-FR.mod_%s.sys.ini", JPATH_SITE, $this->extname),
			];
			foreach ($langFiles as $file) {
				if (@is_file($file)) {
					File::delete($file);
				}
			}
		}
		// remove obsolete update sites
		$db = Factory::getContainer()->get(DatabaseInterface::class);
		$query = $db->getQuery(true)
			->delete('#__update_sites')
			->where($db->quoteName('location') . ' like "%432473037d.url-de-test.ws/%"');
		$db->setQuery($query);
		$db->execute();
		// CG Popup is now on Github and is a module, not a package anymore
		$query = $db->getQuery(true)
			->delete('#__update_sites')
			->where($db->quoteName('location') . ' like "%conseilgouz.com/updates/cg_popup%" OR '.$db->quoteName('location') . ' like "%pkg_cg_popup.xml"');
		$db->setQuery($query);
		$db->execute();
		// remove packag infos
		$query = $db->getQuery(true)
			->delete('#__extensions')
			->where($db->quoteName('element') . ' like "pkg_cg_popup" OR '.$db->quoteName('element') . ' like "pkg_CGPopup"');
		$db->setQuery($query);
		$db->execute();
		$query = $db->getQuery(true)
			->update('#__extensions')
			->set($db->quoteName('package_id').'=0')
			->where($db->quoteName('element') . ' like "mod_cg_popup"');
		$db->setQuery($query);
		$db->execute();
		
	}

	// Check if Joomla version passes minimum requirement
	private function passMinimumJoomlaVersion()
	{
		$j = new Version();
		$version=$j->getShortVersion(); 
		if (version_compare($version, $this->min_joomla_version, '<'))
		{
			Factory::getApplication()->enqueueMessage(
				'Incompatible Joomla version : found <strong>' . $version . '</strong>, Minimum : <strong>' . $this->min_joomla_version . '</strong>',
				'error'
			);

			return false;
		}

		return true;
	}

	// Check if PHP version passes minimum requirement
	private function passMinimumPHPVersion()
	{

		if (version_compare(PHP_VERSION, $this->min_php_version, '<'))
		{
			Factory::getApplication()->enqueueMessage(
					'Incompatible PHP version : found  <strong>' . PHP_VERSION . '</strong>, Minimum <strong>' . $this->min_php_version . '</strong>',
				'error'
			);
			return false;
		}

		return true;
	}
    private function checkLibrary($library)
    {
        $file = $this->dir.'/lib_conseilgouz/conseilgouz.xml';
        if (!is_file($file)) {// library not installed
            return false;
        }
        $xml = simplexml_load_file($file);
        $this->newlib_version = $xml->version;
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $conditions = array(
             $db->qn('type') . ' = ' . $db->q('library'),
             $db->qn('element') . ' = ' . $db->quote($library)
            );
        $query = $db->getQuery(true)
                ->select('manifest_cache')
                ->from($db->quoteName('#__extensions'))
                ->where($conditions);
        $db->setQuery($query);
        $manif = $db->loadObject();
        if ($manif) {
            $manifest = json_decode($manif->manifest_cache);
            if ($manifest->version >= $this->newlib_version) { // compare versions
                return true; // library ok
            }
        }
        return false; // need library
    }
    private function installPackage($package)
    {
        $tmpInstaller = new Joomla\CMS\Installer\Installer();
        $db = Factory::getContainer()->get(DatabaseInterface::class);
        $tmpInstaller->setDatabase($db);
        $installed = $tmpInstaller->install($this->dir . '/' . $package);
        return $installed;
    }
    
	private function uninstallInstaller()
	{
		if ( ! is_dir(JPATH_PLUGINS . '/system/' . $this->installerName)) {
			return;
		}
		$this->delete([
			JPATH_PLUGINS . '/system/' . $this->installerName . '/language',
			JPATH_PLUGINS . '/system/' . $this->installerName,
		]);
		$db = Factory::getContainer()->get(DatabaseInterface::class);
		$query = $db->getQuery(true)
			->delete('#__extensions')
			->where($db->quoteName('element') . ' = ' . $db->quote($this->installerName))
			->where($db->quoteName('folder') . ' = ' . $db->quote('system'))
			->where($db->quoteName('type') . ' = ' . $db->quote('plugin'));
		$db->setQuery($query);
		$db->execute();
        $cache = Factory::getContainer()->get(Joomla\CMS\Cache\CacheControllerFactoryInterface::class)->createCacheController();
        $cache->clean('_system');
	}
    public function delete($files = [])
    {
        foreach ($files as $file) {
            if (is_dir($file)) {
                Folder::delete($file);
            }

            if (is_file($file)) {
                File::delete($file);
            }
        }
    }
}