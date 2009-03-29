<?php

class Categorie {

    private $id = -1;
    private $name = "unknow";
    private $father = -1;
    private $value = 0;
    private $totalValue = 0;

    function __construct($id, $name, $father) {
        $this->id = $id;
        $this->name = $name;
        $this->father = $father;
    }

    function __destruct() {
    }

    function getName() {
        return $this->name;
    }

    function getId() {
        return $this->id;
    }

    function getFather() {
        return $this->father;
    }
    
    function setValue($v) {
    	$this->value = $v;
    }
    
    function getValue() {
    	return $this->value;
    }
    
    function setTotalValue($v) {
    	$this->totalValue = $v;
    }
    
    function getTotalValue() {
    	return $this->totalValue;
    }

}
?>
