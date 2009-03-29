<?php
require_once('./Logger.php');
class MySQL {

    private $server;
    private $user;
    private $base;
    private $link;
    private $nbRequest;
    private $logger;
    
    const LOGGER_LEVEL = 0;

    /* Constructor */
    function  __construct($server, $user, $pass, $base) {
    	$this->logger = new Logger('MySQL', MySQL::LOGGER_LEVEL);
        $this->server = $server;
        $this->user = $user;
        $this->pass = $pass;
        $this->base = $base;
        $this->logger->debug("server=$server user=$user base=$base");
        $this->nbRequest = 0;
        $this->link = mysql_connect($server,$user,$pass);
        if (!$this->link) {
        	die("Impossible de se connecter : ".mysql_error());
        }
        if (!mysql_select_db($base)) {
        	die("Impossible de selectionner la base : ".mysql_error());
        }
    }


  function query($query) {
    $this->logger->debug($query);
    $result = mysql_query($query);
    if (!$result) {
        die(mysql_error());        
    }
    $this->nbRequest++;    
    return $result;  
  }

  function close() {
        mysql_close($this->link);
  }


}
?>
