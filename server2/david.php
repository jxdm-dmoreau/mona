<?php

include '../OFC/php-ofc-library/open-flash-chart.php';
require_once('../include/MySQL.php');
require_once('../config.php');


$id_get = 0;
$date_min_get = $_GET['min'];
$date_max_get = $_GET['max'];
$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);


function DEBUG($str)
{
    print($str);
}


/* On remplit le tableau CATEGORIES qui contiendra toutes les catégories */
/*
   CATEGORIES[id]['name']
   CATEGORIES[id]['value']
*/
$CATEGORIES = array();
$query = "
    SELECT *
    FROM cat";
$result = $mysql->query($query);
while ($line = mysql_fetch_assoc($result)) {
    extract($line);
    $tmp['id'] = $id;
    $tmp['name'] = $name;
    $CATEGORIES[$father_id][] = $tmp;
}


/* contiendra toute la structure xml */
$xml_tab = new array();


function recursif($id)
{
    DEBUG("recursif($id)\n");
    /* Il y a des sous-catégories */
    if (isset($categories[$id]) {
        $first_children = new array();
        /* tous les fils de 1er niveau */
        foreach ($categories[$id] as $value) {
            recursif($value);
        }
    } else {
        /* il n'y a pas de sous-catégorie */
    }


    return 0;
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
        $where .= "cat.id = $id";
        $i++;
    }
    
    $query = "
        SELECT SUM(op_cat.value)
        FROM op_cat, cat, operations
        WHERE ($where)
        AND op_cat.cat_id = cat.id
        AND op_cat.op_id = operations.id
        AND operations.date >= '$date_min_get'
        AND operations.date <= '$date_max_get'
        GROUP BY cat.id";
    $result = $mysql->query($query);
    $sum = 0;
    while($line = mysql_fetch_assoc($result)) {
        $sum += $line['SUM(op_cat.value)'];
    }
    if ($sum != 0) {
        $pie_values[] = new pie_value($sum, $value['name']);
    }
}

print "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
print "<categories>\n";
    print "<".$value['name']." />";
print "</categories>\n";
exit(0);

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

$myFile = "pie.json";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $chart->toString());
fclose($fh);



?>
