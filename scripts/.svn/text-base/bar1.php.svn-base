<?php

include '../OFC/php-ofc-library/open-flash-chart.php';
require_once('../include/MySQL.php');
require_once('../config.php');

$id_get = $_GET['id'];
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);


/* il faut chercher tout les fils de la catégorie id ... */
$query = "
    SELECT *
    FROM categories";
$result = $mysql->query($query);
$categories = array();
while ($line = mysql_fetch_assoc($result)) {
    extract($line);
    $tmp['id'] = $id;
    $tmp['name'] = $name;
    $categories[$father_id][] = $tmp;
}


function get_children($id, &$tab, $categories) {
    if (!is_array($categories[$id])) {
        return 0;
    }
    foreach ($categories[$id] as $key => $value) {
        $tab[] = $value;
        get_children($value['id'], $tab, $categories);
    }
    return 0;
}


get_children($id_get, $tab, $categories);
// TODO ajouter lui-même?
/* le tablau $tab contient tous les fils */


/* construction de la requete conditonnelle */
$i = 0;
$where = "";
foreach ($tab as $value) {
    if ($i > 0) {
        $where .= " OR ";
    }
    extract($value);
    $where .= "categories.id = $id";
    $i++;
}



/* envoie des 12 requetes vers le serveur MySQL */
for($i = 1; $i < 13; $i++ ) {
    $current_month = $i;
    $next_year = 2008;
    $current_year = 2008;
    $next_month = $current_month + 1;
    if ($next_month == 13) {
        $next_month = 1;
        $next_year = $current_year + 1;
    }
    $query = "
        SELECT SUM(op_cat.value)
        FROM op_cat, categories, operations
        WHERE ($where)
        AND op_cat.cat_id = categories.id
        AND op_cat.op_id = operations.id
        AND operations.date >= '$current_year-$current_month-01'
        AND operations.date < '$next_year-$next_month-01'
        GROUP BY categories.id";
    $result = $mysql->query($query);
    $sous_total = 0;
    while($line = mysql_fetch_assoc($result)) {
        $sous_total += $line['SUM(op_cat.value)'];
    }
     $sum[] = $sous_total;

}


/* recherche du max */
$max = 0;
foreach ($sum as $value) {
    if ($value > $max) {
        $max = $value;
    }
}

/* graphique */
$chart = new open_flash_chart();

$names[] = 'Jan';
$names[] = 'Fév';
$names[] = 'Mar';
$names[] = 'Avr';
$names[] = 'Mai';
$names[] = 'Juin';
$names[] = 'Juil';
$names[] = 'Aoû';
$names[] = 'Sep';
$names[] = 'Oct';
$names[] = 'Nov';
$names[] = 'Déc';


$title = new title("tmp");



$bar = new bar_glass();
$bar->set_values($sum);

$chart->set_bg_colour( '#FFFFFF' );
$chart->set_title( $title );
$chart->add_element( $bar );

// x axis
$x = new x_axis();
$x->set_labels_from_array($names);
$x->set_colour('#000000');
$x->set_grid_colour('#d3d3d3');
$chart->set_x_axis($x);

$y = new y_axis();
$y->set_range(0, $max, $max/10);
$y->set_colour('#000000');
$y->set_grid_colour('#d3d3d3');
$chart->set_y_axis($y);

$y_legend = new y_legend( 'Euros' );
$y_legend->set_style( '{font-size: 22px; color: #778877}' );
$chart->set_y_legend( $y_legend );


echo $chart->toPrettyString();


?>
