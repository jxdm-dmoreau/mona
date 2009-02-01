<?php
Header("content-type: text/html");

require_once('../include/MySQL.php');
require_once('../config.php');
require_once('tools.php');


if (test_get($_GET) == false) {
    die("Require HTTP GET request");
}

// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);


$id = $_GET['id'];


$query = "
DELETE FROM `categories` 
WHERE id='$id'";

/* supprimer tous les fils */
print($query);
$result = $mysql->query($query);
print($result);


?>
