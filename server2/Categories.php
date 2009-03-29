<?php

class Categories {

    private $fathers;
    private $catsById;
    private $cats;
    private $logger;

	const DEBUG_LEVEL = 0;
		
    function __construct() {
    	$this->logger = new Logger('Categories', Categories::DEBUG_LEVEL);
    }
    function add($cat) {
    	$id = $cat->getId();
        $this->catsById["$id"] = $cat;
        $this->cats[] = $cat;
        $this->fathers[$cat->getFather()][] = $cat->getId();
    }

    function size() {
        return sizeof($this->cats);
    }
    
    function getCategorie($i) {
    	if ($i < 0 || $i > $this->size()) {
    		die("Categorie $i erreur");
    	}
    	return $this->cats[$i];
    }
    
    function getCatFromId($id) {
    	if (isset($this->catsById[$id])) {
    		return $this->catsById[$id];
    	} else {
    		$this->logger->err("Cat Id $id not found!");
    		return FALSE;
    	}
    }
    
    function getChildren($father_id) {
    	if (!isset($this->fathers[$father_id])) {
    		return FALSE;
    	}
    	return $this->fathers[$father_id];
    }
    
    private function getXml_r($id, $value) {
    	if (!isset($this->fathers[$id])) {
    		$value = $this->catsById["$id"]->getValue();
    		$this->catsById["$id"]->setTotalValue($value);
    		return $value;    		
    	}
    	for($i=0; $i < sizeof($this->fathers[$id]); $i++) {
    		$value += $this->getXml_r($this->fathers[$id][$i], $value);
    	}
    	$value += $this->catsById["$id"]->getValue();
    	$this->catsById["$id"]->setTotalValue($value);
    	$name = $this->catsById["$id"]->getName();
    	$this->logger->debug("$name --> $value");
    	return $value;
    }
    
    private function createXml_r($tab, $id) {
    	$tab .= "\t";
    	$name = $this->catsById["$id"]->getName();
    	$value = $this->catsById["$id"]->getTotalValue();
    	print("$tab<$name value=$value>\n");
    	if (isset($this->fathers[$id])) {
    	   	for($i=0; $i < sizeof($this->fathers[$id]); $i++) {
    			$this->createXml_r($tab, $this->fathers[$id][$i]);
    		}
    	}
    	print("$tab</$name>\n");
    }

    function getXml() {
    	/* calcul des sommes */
    	$total = 0;
    	$tab = '';
        for($i = 0; $i < sizeof($this->fathers[0]); $i++) {
    		$total += $this->getXml_r($this->fathers[0][$i], $value);
    	}
    	/* ecriture du fichier XML */
    	print("<categories value=$total>\n");
         for($i = 0; $i < sizeof($this->fathers[0]); $i++) {
    		$this->createXml_r($tab, $this->fathers[0][$i]);
    	}
    	print("</categories>\n");
    }
    

}
?>
