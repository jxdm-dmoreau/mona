<?php

include '../OFC/php-ofc-library/open-flash-chart.php';
require_once('../include/MySQL.php');
require_once('../config.php');

$month_names[0] = 'error';
$month_names[1] = 'Jan';
$month_names[2] = 'Fév';
$month_names[3] = 'Mar';
$month_names[4] = 'Avr';
$month_names[5] = 'Mai';
$month_names[6] = 'Juin';
$month_names[7] = 'Juil';
$month_names[8] = 'Aoû';
$month_names[9] = 'Sep';
$month_names[10] = 'Oct';
$month_names[11] = 'Nov';
$month_names[12] = 'Déc';

$id_get = $_GET['id'];
$date_min_get = $_GET['min'];
$date_max_get = $_GET['max'];
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);


/* il faut chercher tout les fils de la catégorie id ... */
$query = "
    SELECT *
    FROM cat";
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
    $where .= "cat.id = $id";
    $i++;
}

/* boucle de date min à date max */
list($year_min, $month_min, $day_min) = split('-', $date_min_get);
list($year_max, $month_max, $day_max) = split('-', $date_max_get);

/* on incrémente date de 1 pour prendre en compte le dernier mois */
$month_max = ($month_max==12)?$month_max=1:$month_max+1;
if ($month_max == 1) {
    $year_max++;
}


$end = false;
//print_r($sum);
do {
    /* sauvegarde des min */
    $year_begin = $year_min + 0;
    $month_begin = $month_min + 0;
    /* mois suivant */
    $month_min = ($month_min==12)?$month_min=1:$month_min+1;
    if ($month_min == 1) {
        $year_min++;
    }
    /* requetes */
    $query = "
        SELECT SUM(op_cat.value)
        FROM op_cat, cat, operations
        WHERE ($where)
        AND op_cat.cat_id = cat.id
        AND op_cat.op_id = operations.id
        AND operations.date >= '$year_begin-$month_begin-01'
        AND operations.date < '$year_min-$month_min-01'
        GROUP BY cat.id";
    print("<query>$query</query>\n");
    $result = $mysql->query($query);
    $sous_total = 0;
    while($line = mysql_fetch_assoc($result)) {
        $sous_total += $line['SUM(op_cat.value)'];
    }
    $sum[] = $sous_total;
    $names[] = "$month_names[$month_begin] $year_begin";
    /* done ? */
    $end = ($year_min == $year_max) && ($month_min == $month_max);
} while (!$end);

/* envoie des 12 requetes vers le serveur MySQL */
/*
for($i = 1; $i < 12; $i++ ) {
    $current_month = $i;
    $next_year = 2009;
    $current_year = 2009;
    $next_month = $current_month + 1;
    if ($next_month == 13) {
        $next_month = 1;
        $next_year = $current_year + 1;
    }
    $query = "
        SELECT SUM(op_cat.value)
        FROM op_cat, cat, operations
        WHERE ($where)
        AND op_cat.cat_id = cat.id
        AND op_cat.op_id = operations.id
        AND operations.date >= '$current_year-$current_month-01'
        AND operations.date < '$next_year-$next_month-01'
        GROUP BY cat.id";
    $result = $mysql->query($query);
    $sous_total = 0;
    while($line = mysql_fetch_assoc($result)) {
        $sous_total += $line['SUM(op_cat.value)'];
    }
     $sum[] = $sous_total;

}
*/
/* recherche du max */
$max = 0;
foreach ($sum as $value) {
    if ($value > $max) {
        $max = $value;
    }
}

/* graphique */
$chart = new open_flash_chart();



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


$myFile = "bar.json";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $chart->toString());
fclose($fh);


?>
