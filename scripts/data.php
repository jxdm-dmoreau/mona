<?php

include 'OFC/php-ofc-library/open-flash-chart.php';
require_once('include/MySQL.php');
require_once('config.php');

$mysql = new MySQL($mysql_server, $mysql_login, $mysql_pwd, $mysql_db);
$query = "
SELECT name, SUM( `operation-category`.value ), color
FROM `operation-category` , categories, operations
WHERE `operation-category`.category_id = categories.id
AND operations.id = `operation-category`.operation_id
AND date >= '2008-10-01'
AND date <= '2008-10-31'
GROUP BY categories.name
";
$result = $mysql->query($query);

$chart = new open_flash_chart();
$max = 0;
while($line = mysql_fetch_assoc($result)) {
	$value = floatval($line['SUM( `operation-category`.value )']);
	$max = max($max, $value);

	$bar = new bar();
	$bar->set_values(array($value));
	$bar->set_colour($line['color']);
	$bar->set_tooltip($line['name'].": #val#€");
	//$chart->add_element( $bar );
	$pie_value = new pie_value($value, $line['name']);
	$pie_value->set_colour($line['color']);
	$pie_tab[] = $pie_value;
}


$title = new title("Octobre 2008");


$chart->set_title( $title );


// PIE
$pie = new pie();
$pie->set_values($pie_tab);
$pie->set_animate( false );
$pie->set_tooltip( '#val#€ sur #total#€<br>#percent#' );
$chart->add_element( $pie );

// x axis
$x = new x_axis();
$x->set_labels_from_array(array('Octobre 2008'));
$chart->set_x_axis( $x );

// y axis
$y = new y_axis();
$y->set_range( 0, $max, 10 );
$chart->add_y_axis( $y );
$chart->set_bg_colour("#FFFFFF");

                    
echo $chart->toPrettyString();


?>
