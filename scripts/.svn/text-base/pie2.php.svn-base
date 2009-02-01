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


/* tous les fils de 1er niveau */
foreach ($categories[$id_get] as $value) {
    $first_children[] = $value;
}

/*pour chauque fils, il faut trouver le total*/
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

foreach ($first_children as $value) {
    $children = array();
    get_children($value['id'], $children, $categories);
    $children[] = $categories[$id_get];

    /* construction de la requete conditonnelle */
    $i = 0;
    $where = "";
    foreach ($children as $value2) {
        if ($i > 0) {
            $where .= " OR ";
        }
        extract($value2);
        $where .= "categories.id = $id";
        $i++;
    }
    
    $query = "
        SELECT SUM(op_cat.value)
        FROM op_cat, categories, operations
        WHERE ($where)
        AND op_cat.cat_id = categories.id
        AND op_cat.op_id = operations.id
        AND operations.date >= '2008-01-01'
        AND operations.date <= '3008-12-31'
        GROUP BY categories.id";
    $result = $mysql->query($query);
    $sum = 0;
    while($line = mysql_fetch_assoc($result)) {
        $sum += $line['SUM(op_cat.value)'];
    }
    if ($sum != 0) {
        $pie_values[] = new pie_value($sum, $value['name']);
    }
}

/* graphique */
$chart = new open_flash_chart();


$title = new title("tmp");


$pie = new pie();
$pie->set_start_angle( 35 );
$pie->set_animate( true );
$pie->set_tooltip( '#val#€ de #total#€<br>#percent# of 100%' );
$pie->set_values($pie_values);

$chart->set_title( $title );
$chart->add_element( $pie );
$chart->set_bg_colour( '#FFFFFF' );


$chart->x_axis = null;

echo $chart->toPrettyString();



?>
