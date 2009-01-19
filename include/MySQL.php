<?php
class MySQL {
	var $server;
	var $user;
	var $base;
	var $link;
	
	var $nbRequest;


	/* Constructor	*/
	function MySQL($server,$user,$pass,$base) {
	    $this->nbRequest = 0;
	    $this->server = $server;
	    $this->user = $user;
	    $this->pass = $pass;
	    $this->base = $base;
            $this->link = mysql_connect($server,$user,$pass);
            mysql_select_db($base);
	}


  function query($query) {
    $result = mysql_query($query);
    $this->nbRequest++;
    // Vérification du résultat
    if (!$result) {
		  $message  = '<b>Requete invalide :</b> ' . mysql_error() . '<br>';
		  $message .= '<b>Requete complete :</b> ' . $query;
		  die($message);
    }
    return $result;  
  }

  function close() {
    mysql_close($this->link);
  }


	function delete($id) {
			$query = "DELETE FROM transactions WHERE  id='$id'";
			$result = mysql_query($query);
			if(!$result) {
			    print("<br />$query<br />");
			    die(mysql_error());
			}
			

  }



}
?>
