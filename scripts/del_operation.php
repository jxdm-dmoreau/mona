<?php
Header("content-type: text");
// Inclusion des librairies
require_once('../include/MySQL.php');
require_once('../config.php');




// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);

$id = $_POST['id'];

$query = "DELETE FROM operations WHERE id = '$id'";
$result = $mysql->query($query);
print($result);
