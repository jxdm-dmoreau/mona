<?php
// Inclusion des librairies
require_once('./smarty/Smarty.class.php');
require_once('./include/MySQL.php');
require_once('./include/chrono.php');
require_once('./include/Categorie.php');
require_once('./config.php');
session_start();

if (!isset($_SESSION['id'])) {
  include('error.php');
  die();
}



// Temps pour générer la page
$chrono = new chrono();
$chrono->start();

// MySQL
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);
$_SESSION['mysql'] = $mysql;

// Smarty
$oSmarty = new Smarty();

// Categorie
$cat = new Categorie($mysql);
$_SESSION['cat'] = $cat;
// ajout de la somme de départ
$fp = fopen('./solde.txt', 'r');
$solde = fread($fp, 10);
fclose($fp);

// Pointage
if (isset($_GET['id'])) {
	extract($_GET);
	$query = "SELECT * FROM transactions WHERE id='$id'";
	$result = $mysql->query($query);
	$line = mysql_fetch_assoc($result);
	if($categories[$line['id_cat']]['type']=='credit') {
		$solde_p += $line['somme'];
	} else {
		$solde_p -= $line['somme'];
	}
	$query = "UPDATE soldes SET solde_p = $solde_p WHERE id = 0";
	$result = $mysql->query($query);
	$query = "UPDATE transactions SET pointage=1 WHERE id=$id";
	$result = $mysql->query($query);
}

// Drop
if (isset($_GET['drop'])) {
	$id = $_GET['drop'];
	
	$query = "DELETE FROM transactions WHERE  id='$id'";
	$result = mysql_query($query);
	if(!$result) {
	    print("<br />$query<br />");
	    die(mysql_error());
	}
	
}
	

if (!isset($_GET['compte']) && !isset($_SESSION['compte'])) {
	die("Aucun compte précisé");
}
if (isset($_GET['compte'])) {
    $_SESSION['compte'] = $_GET['compte'];
}
$compte = $_SESSION['compte'];

// Exécuter des requêtes SQL
$query = "SELECT * FROM transactions WHERE compte=$compte ORDER BY date DESC ";
$result = $mysql->query($query);
$checkedSolde = 0;

while ($line = mysql_fetch_assoc($result)) {
	extract($line);
	$tab[$i]['id'] = $id;
	$tab[$i]['date'] = date('d/m/Y',$date);
	if( $valeur > 0 ) {
    $tab[$i]['credit'] = sprintf("%.2f€", $valeur);
    $tab[$i]['debit'] = '';
  } else {
    $tab[$i]['credit'] = '';
    $tab[$i]['debit'] = sprintf("%.2f€",$valeur*(-1));
  }
	$tab[$i]['categorie'] = $cat->getName($categorie);
	$tab[$i]['description'] = $description;
	$tab[$i]['checked'] = $pointage;
	$i++;
	/* solde */
	$solde += $valeur;
	if($pointage == 1)
	   $checkedSolde += $valeur;
}

if (!isset($tab)) {
	$tab = 0;
}


// stats
$chrono->stop();
$oSmarty->assign("TIME",sprintf("%.2f ",$chrono->getTime()*1000));
$oSmarty->assign("REQUESTS",$mysql->nbRequest);

// Assignation des valeurs
$oSmarty->assign("TAB",$tab);
$oSmarty->assign("SOLDE",sprintf("%.2f€",$solde));
$oSmarty->assign("SOLDE_P",sprintf("%.2f€",$checkedsolde));

// Affichage du template après compilation
$oSmarty->debugging = false;
$oSmarty->display('liste.html');


?>
