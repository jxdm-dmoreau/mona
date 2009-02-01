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
 * input_total : somme totale
 * form_type : débit ou crédit
 * input_cat_name_x : nom de la catégorie 
 * input_cat_id_x :  id de la catégorie
 * input_somme_x :  somme de la catégorie
 * input_labels :  liste des tags de cette opétation
 */       



extract($_POST);

/* parametres globaux */
if ($form_type == "debit") {
    $input_total = $input_total * (-1);
}

/* paramètres par catégories */
$max_cat_nb = 20;
$nb = 0;
for($i=0; $i < $max_cat_nb; $i++) {
    if (isset($_POST["input_cat_id_$i"])) {
        $cat_tab[$nb]['id'] = $_POST["input_cat_id_$i"];
        $cat_tab[$nb]['somme'] = $_POST["input_somme_$i"];
        //$cat_tab[$nb]['name'] = $_POST["input_cat_name_$i"];
        $nb++;
    }
}


print('<br><br><br>');
print_r($cat_tab);



$query = "INSERT INTO operations VALUES ('', '$date', '$input_total', '', '', '', '')";
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
    $value = $tab['somme'];
    $query .= "('', '$op_id', '$cat_id', '$value')";
}
$query .= ';';
$result = $mysql->query($query);


/*****************************************************************************/
/*                           labels                                          */
/*****************************************************************************/
$ret = split(", ", $input_labels);
$nb_labels = count($ret);
for($i=0; $i<$nb_labels; $i++) {
    /* creer les tags qui n'existent pas */
    $query = "SELECT id FROM labels WHERE name='$ret[$i]'";
    $result = $mysql->query($query);
    $line = mysql_fetch_assoc($result);
    if (isset($line['id'])) {
        // le label existe
        $label_id = $line['id'];
    } else {
        // le label n'existe pas
        // on l'ajoute
        $query = "INSERT INTO labels VALUES ('', '$ret[$i]')";
        $result = $mysql->query($query);
        // on récupère l'id
        $query = "SELECT id FROM labels WHERE name='$ret[$i]'";
        $result = $mysql->query($query);
        $line = mysql_fetch_assoc($result);
        $label_id = $line['id'];
    }
    /* on a l'id correspondant au tag, on peut ajouter la relatetion 
       operation-tag */
    $query = "INSERT INTO `op-labels` VALUES ('', '$op_id', '$label_id')";
    $result = $mysql->query($query);
}
exit(0);








