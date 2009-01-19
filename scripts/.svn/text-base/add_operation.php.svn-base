<?php
Header("content-type: text/html");
// Inclusion des librairies
require_once('../include/MySQL.php');
require_once('../config.php');

/* BEGIN */


// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);
print_r($_POST);

/* 
 * valeurs attendues :
 * date : date de l'opération
 * somme : somme taotale
 * type : débit ou crédit
 * qui : pour qui est / d'où vient  l'argent
 * cat_nb : nombre max de catégories
 * cat_name_x : nom de la catégorie x
 * cat_id_x : identifiant de la catégorie x
 * cat_value_x : valeur associé à la catégorie x
 * pointage : si l'opération est pointée ou non
 */       

$date = $_POST['date'];
$somme = $_POST['somme'];
$type = $_POST['type'];
if ($type == "debit") {
    $somme = $somme * (-1);
}
$who = $_POST['who'];
$cat_nb = $_POST['nb_cat'];
$cat_tab;
$nb = 0;
for ($i=0; $i < $cat_nb; $i++) {
    $tmp = $_POST["cat_id_$i"];
    $cat_tab[$nb]['id'] = $tmp;
    $tmp = $_POST["cat_value_$i"];
    $cat_tab[$nb]['value'] = $tmp;
    $tmp = $_POST["cat_name_$i"];
    $cat_tab[$nb]['name'] = $tmp;
    $nb++;
}
print('<br>');
print_r($cat_tab);



$query = "INSERT INTO operations VALUES ('', '$date', '$somme', '', '', '', '', '$who')";
print("<p>$query</p>");
$result = $mysql->query($query);

/* il faut récuperer l'id de l'opération que l'on vient de créer */
$query = "SELECT id FROM operations ORDER BY id DESC LIMIT 1";
$result = $mysql->query($query);
$line = mysql_fetch_assoc($result);
$op_id = $line['id'];

/* on ajoute les infos de catégories */
$query = "INSERT into `op_cat` VALUES ";
foreach($cat_tab as $key => $tab) {
    /* construction de la requête SQL */
    if ($key != 0) {
        $query .= ', ';
    }
    $cat_id =$tab['id'];
    $value = $tab['value'];
    $query .= "('', '$op_id', '$cat_id', '$value')";
}
$query .= ';';
$result = $mysql->query($query);
exit(0);






/* TODO si plusieurs valeurs, faire une boucle */

foreach($_POST as $key => $value) {
	if(ereg("cat_([0-9]+)", $key,  $regs )) {
		$query = "INSERT INTO `operation-category` VALUES ('$id','$regs[1]', '$value')";
		print("<p>$query</p>");
		$result = $mysql->query($query);
		print("<p><b>$result</b></p>");
	}
}

print("</results>\n");

