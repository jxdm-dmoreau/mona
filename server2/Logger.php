<?php

class Logger {

    private $class = "undefined";
    private $level = 0;

    function __construct($name, $level) {
        $this->class = "$name";
        $this->level = $level;
    }

    private function display($level, $msg) {
    	if ($level > $this->level) {
    		return;
    	}
        print "<p>";
        print "[$this->class] ";
        print "$msg";
        print "</p>";
        print "\n";
    }

    function debug($msg) {
        $this->display(4, $msg);
    }

    function info($msg) {
        $this->display(3, $msg);
    }

    function warn($msg) {
        $this->display(2, $msg);
    }

    function err($msg) {
        $this->display(1, $msg);
    }



}
?>
