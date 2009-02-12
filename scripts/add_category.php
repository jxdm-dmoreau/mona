<?php
Header("content-type: text/html");

require_once('../include/MySQL.php');
require_once('../config.php');



// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);


$name = $_GET['name'];
$father_id = $_GET['father_id'];
$color = $_GET['color'];


$query = "
INSERT INTO `mona`.`cat` (
	`id` ,
	`father_id` ,
	`name` ,
	`color`
) VALUES (
	NULL ,
       	'$father_id',
       	'$name',
       	'$color'
       );
";
$result = $mysql->query($query);

$query = "
SELECT id
FROM cat
WHERE name = '$name'
AND father_id = '$father_id'";

$result = $mysql->query($query);
$line = mysql_fetch_assoc($result);

print $line['id'];


?>
