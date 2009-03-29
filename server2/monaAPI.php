<?php
require_once('./MySQL.php');
require_once('./Categories.php');

/**
 * @author David
 *
 */
class monaAPI {
	
	private $mysql;
	private $logger;
	const DEBUG_LEVEL = 0;
	
    function __construct() {
    	$this->logger = new Logger('monaAPI', monaAPI::DEBUG_LEVEL);
    	$this->mysql = new MySQL('127.0.0.1', 'root', 'Kamikas1', 'mona');
    }
    
    function getCategories() {
		$query = "SELECT * FROM cat";
		$result = $this->mysql->query($query);
		$cats = new Categories();
    	while ($line = mysql_fetch_assoc($result)) {
    		extract($line);
    		$cats->add(new Categorie($id, $name, $father_id));
    		$this->logger->debug("Ajout de la catégorie $name ($id - $father_id)");
    	}
    	return $cats;
    }

    private function statsXml_r($catId, $cats, $tab, $xml) {
    	$tab .= "\t";
    	$this->logger->debug("statsXml_r($catId)");
    	$name = $cats->getCatFromId($catId)->getName();
    	$value = $cats->getCatFromId($catId)->getTotalValue();
    	$xml .= "$tab<cat name=\"$name\" value=\"$value\"";
    	$children = $cats->getChildren($catId);
    	if (!$children) {
    		$xml .= " />\n";
    		return $xml;
    	}
    	$xml .= ">\n";
    	for($i = 0; $i < sizeof($children); $i++) {
    		$xml = $this->statsXml_r($children[$i], $cats, $tab, $xml);
    	}
    	$xml .= "$tab</cat>\n";
    	return $xml;
    }
    

    
    /**
     * Fonction qui calcule récursivement le total de chaque catégorie
     * 
     * @param $catId id de la catégorie à calculer
     * @param $cats liste de toutes les catégories
     * @param $value somme de départ
     * @return somme calculée
     */
    private function calculateTotalValue($catId, $cats) {
    	$this->logger->debug("calculateTotalValue($catId, )");
    	$value = $cats->getCatFromId($catId)->getValue();
    	$children = $cats->getChildren($catId);
    	if ($children != FALSE) {
	    	for ($i = 0; $i < sizeof($children); $i++) {
	    		$value += $this->calculateTotalValue($children[$i], $cats);
	    	}
    	}
    	/* on stocke dans la catégorie le total */
    	$name = $cats->getCatFromId($catId)->getName();
    	$this->logger->debug("$name $value €");
    	$cats->getCatFromId($catId)->setTotalValue($value);
    	return $value;
    }
    
    
    /**
     * @param $cats
     * @param $begin
     * @param $end
     * @return unknown_type
     */
    function getStatsXml($cats, $begin, $end) {
    	/* pour chaque catégorie, on va chercher le total sur la période */
		for($i = 0; $i < $cats->size(); $i++) {
			$cat = $cats->getCategorie($i);
			$query = "SELECT SUM(operations.value) FROM operations, op_cat
				WHERE  op_cat.op_id = operations.id
				AND op_cat.cat_id = ".$cat->getId()."
				AND operations.date >= '$begin'
				AND operations.date <= '$end'
				AND operations.value < 0";
			$res = $this->mysql->query($query);
			$line = mysql_fetch_assoc($res);
			if (isset($line['SUM(operations.value)'])) {
				$cat->setValue(sprintf("%.2f", $line['SUM(operations.value)']));
			} else {
				$cat->setValue(0);
			}
		}
		
		/* Calcul hiérarchique des totaux */
		$total = 0;
		$children = $cats->getChildren(0);
        for($i = 0; $i < sizeof($children); $i++) {        	
    		$total += $this->calculateTotalValue($children[$i], $cats);
    	}
    	
    	/* On génére le fichier xml */
    	$xml =  "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
    	$xml .= "<categories>\n";
    	$tab = '';
        for($i = 0; $i < sizeof($children); $i++) {        	
    		$xml = $this->statsXml_r($children[$i], $cats, $tab, $xml);
    	}
    	$xml .= "</categories>\n";    	
    	return utf8_encode($xml);    	
    }

}
?>