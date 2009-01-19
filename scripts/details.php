<?php

Header("content-type: application/xml");
// Inclusion des librairies
require_once('../include/MySQL.php');
require_once('../config.php');
//session_start();

//if (!isset($_SESSION['id'])) {
 // die("erreur de session PHP");
//}


$id = $_GET['id'];

// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);



$query = "
SELECT categories.name,`op_cat`.value
FROM categories, `op_cat`
WHERE `op_cat`.cat_id = categories.id
AND `op_cat`.op_id = $id";

$result = $mysql->query($query);

print "<details>\n";
while ($line = mysql_fetch_assoc($result)) {
    extract($line);
    print "\t<row>\n";
    foreach($line as $key => $value) {
	    print("\t\t<$key>$value</$key>");
    }
    print "\t</row>\n";
}
print "</details>\n";



?>
