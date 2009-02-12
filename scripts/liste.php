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

$table = $_GET['table'];

$query = "SELECT * FROM $table ";
$result = $mysql->query($query);
print "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";

print "<$table>\n";
while ($line = mysql_fetch_assoc($result)) {
    extract($line);
    print "   <row>\n";
    foreach($line as $key => $value) {
        $value = utf8_encode($value);
        print("      <$key>$value</$key>\n");
    }
    print "   </row>\n";
}
print "</$table>\n";




