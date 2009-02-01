<?php
Header("content-type: application/xml");
// Inclusion des librairies
require_once('../include/MySQL.php');
require_once('../config.php');
//session_start();

//if (!isset($_SESSION['id'])) {
 // die("erreur de session PHP");
//}




// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);



$query = "
SELECT operations.id, operations.date, operations.value
FROM operations"; 
$result = $mysql->query($query);
print "<liste>\n";
while ($line = mysql_fetch_assoc($result)) {
    extract($line);
    print "\t<row>\n";
    foreach($line as $key => $value) {
	    print("\t\t<$key>$value</$key>");
    }
    $query="SELECT labels.name
        FROM labels, `op-labels`
        WHERE `op-labels`.`op-id` = $id
        AND labels.id = `op-labels`.`label-id`
        ";
    $result2 = $mysql->query($query);
    while ($line2 = mysql_fetch_assoc($result2)) {
        $name = $line2['name'];
        print("\t\t<label>$name</label>");
    }
    print "\t</row>\n";
}
print "</liste>\n";




