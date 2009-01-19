<?php

$debug = true;

function test_get() {
    if (!isset($_GET)) {
        return false;
    }
    if (sizeof($_GET) == 0) {
        return false;
    }
    if ($GLOBALS['debug']) {
        print("<b>Valid GET:</b><br />\n");
        print_r($_GET);
        print("<br />\n");
    }
    return true;
}

################################################################################
# 
################################################################################
function extract_get($n) {
    if($GLOBALS['debug']) {
        print("$n = ".$_GET[$n].'<br>');
    }
	return $GET_[$n];
}

################################################################################
# 
################################################################################
function extract_post($name) {
    if($debug) {
        print("$name = ".$_POST[$name].'<br>');
    }
	return $_POST[$name];
}

?>
