
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
<meta http-equiv="Content-Language" content="french" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >





<link rel="stylesheet" media="screen" type="text/css" title="Style" href="./styles/main.css" />
        <link rel="stylesheet" media="screen" type="text/css" title="Style" href="./styles/ui.datepicker.css" />
        <script type="text/javascript" src="javascripts/jquery-1.3.min.js"></script>
        <script type="text/javascript" src="javascripts/mona.js"></script>
        <script type="text/javascript" src="javascripts/jquery.tablesorter.min.js"></script>
        <script type="text/javascript" src="javascripts/mona.catTree.js"></script>
        <script type="text/javascript" src="javascripts/mona.liste.js"></script>
        <script type="text/javascript" src="javascripts/mona.form.js"></script>
        <script type="text/javascript" src="javascripts/jquery.dtree.js"></script>
        <script type="text/javascript" src="javascripts/jquery.ui.all.js"></script>
	<script type="text/javascript" src="javascripts/swfobject.js"></script>
	<script type="text/javascript" src="javascripts/jquery.sprintf.js"></script>
	<link rel="StyleSheet" href="./styles/dtree.css" type="text/css" />
	<link rel="StyleSheet" href="./styles/ui.all.css" type="text/css" />
	<script type="text/javascript" src="javascripts/dtree.js"></script>
	<script src="javascripts/jquery.cookie.js" type="text/javascript"></script>
	<script src="javascripts/jquery.treeview.js" type="text/javascript"></script>
	<link rel="stylesheet" href="./styles/jquery.treeview.css" />
        <script type="text/javascript" src="blackbird/blackbird.js"></script>
        <link type="text/css" rel="Stylesheet" href="blackbird/blackbird.css" />




        <script type="text/javascript">

            function register() {
                /* chargement */
               initWho(); 

                $("#liste").click(monaDisplayList);
                $("#params").click(monaDisplayParams);
		$("#stats").click(monaDisplayStats);


                $("#close").click(function() {
				$.modal.close();
                        });

                $("#modal").click(function() {
                    displayForm();
		});

       		$("#form").submit(function() {
			/* check the form */
			if ($("#form_date input").val() == "") {
				$("#form_date span").addClass("error").text("Date invalide").show().fadeOut(3000);
				return false;
			}
			if ($("#form_value input").val() == "00.00") {
				$("#form_value span").hide().addClass("error").text("Somme invalide").show().fadeOut(3000);
				return false;
			}

			/* Vérifier que la somme se retrouve dans la toutes les catégories */
			var somme = $("#form_value input").val();

			/* Somme des autres */
			var total_to_check = 0.00;
			$("#list_cat input:odd").each(function() {
				var value = $(this).val();
				/* bidouille pour ne pas confonde concatÃ©nation et addition */
				value = value * (-1) ;
				total_to_check = total_to_check - value;
			});
			if (somme != total_to_check) {
				$("#form_value span").hide().addClass("error").text("Mauvais partage entre les catÃ©gories").show().fadeOut(3000);
				return false;
			}

			/* send */
			var s = $(this).serialize(); 
			$.ajax({ 
				type: "POST", 
				data: s, 
				url: $(this).attr("action"), 
				success: function(retour){
					$.modal.close();
					$("#log").html(retour);
					monaDisplayList();
				}
			}); 
			return false; 
			});

		$("#david_tree").hide();
		$(".cat_input").click( function() {
			$("#david_tree").show();
			});
	    }

            $(document).ready(register);


        </script>
    </head>

    <body>
        <div id="log"></div>
        <div id="out">
            <div id="in"></div>
        </div>

        <div id="menu">
        <ul>
        <li><a id="liste" href="#">Liste des Opérations</a></li>
        <li><a id="params" href="#">Paramètres</a></li>
        <li><a id="modal" href="#">Ajout d'une opération</a></li>
        <li><a  id="stats" href="#stats">Statistiques</a></li>
        <li> << Retour</li>
        <ul>
        </div>

        <div id="main">
jie est vraiment très gentille et jolie<br />
        </div>


<div id="div_form"></div>

    </body>

</html>
