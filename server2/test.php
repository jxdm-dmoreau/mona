<?php
Header("content-type: application/xml");

require_once('./Categorie.php');
require_once('./Categories.php');
require_once('./monaAPI.php');




$api = new monaAPI();
$cats = $api->getCategories(); 
$xml = $api->getStatsXml($cats, '2008-01-01', '2009-12-12');
print("$xml");









?>
