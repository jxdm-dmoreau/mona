
// who
// clé: index
// valeur : nom
var monaTabLabels = new Array();

/* categories */
var monaTabCategoriesId = new Array();
var monaTabCategoriesFather = new Array();



function initLabels()
{
    /* who */
    $.ajax({
        type: "GET",
        url: "scripts/liste.php?table=labels",
        success: function(xml) {
            var jXml = $(xml);
            var jWho = jXml.find("labels");
            var jRow = jWho.children();
            jRow.each(function() {
                var jThis = $(this);
                var jName = jThis.find("name");
                var jId = jThis.find("id");
                log.debug("label: " + jId.text() + " - " + jName.text());
                monaTabLabels[jId.text()] = jName.text();
            });
        }
    });

    /* categories */
    $.ajax({
        type: "GET",
        url: "scripts/liste.php?table=cat",
        async: false,
        success: function(xml) {
            var jXml = $(xml);
            var jWho = jXml.find("cat");
            var jRow = jWho.children();
            jRow.each(function() {
                var jThis = $(this);
                var jName = jThis.find("name");
                var jId = jThis.find("id");
                var jFather = jThis.find("father_id");
                log.debug("cat: " + jId.text() + " - " + jName.text());
                monaTabCategoriesId[jId.text()] = jName.text();
                if (monaTabCategoriesFather[jFather.text()] == undefined) {
                    monaTabCategoriesFather[jFather.text()] = new Array();
                }
                monaTabCategoriesFather[jFather.text()].push(jId.text());
            });
        }
    });
}








// Transformation XML en tableau



function monaDisplayParams() {
    // aller chercher le fichier XML
    $("#main").empty();
    $("#main").load("parametres.html", function() {
    buildCatTree("#david_tree");
        registerFunctions();
        /* faire disparaitre autres formulaires */
        $("#form_add_cat").hide();
        $("#div_modif").hide();
        /* who */
        displayWho();
    });
}



/* remplit le select avec les who */
function monaFillWho(id) {
    for(var cle in monaTabWho) {
        $(id+" select").append($("<option>"+monaTabWho[cle]+"</option>").attr("value", cle));
    }
    return false;
}




function addCategory(node) {
	var somme = $("#form_value input:first").val();
	$("#list_cat input:odd").each(function() {
			somme = somme - $(this).val();
			});
	total = somme;

	var input = $("<input type=\"text\" size=\"15\">");
	input.click(function() {
			$("#david_tree").show();
			});
	$("#list_cat").append(input);


	return false;
	var cat_id = $("#david_tree .cat_selected").attr("cat_id");
	var name = $("#david_tree .cat_selected").text();
	if (cat_id == undefined) {
		alert("Il faut choisir une catégorie");
		return false;
	}
	var jSpan = $("<span id=\"span_"+cat_id+"\">");
	var input = $("<span>"+name+"</span>");
	input.attr("value", name).attr("disabled", "disabled");
	jSpan.append(input);
	var input2 = $("<input type=\"text\">");
	/* fill value*/
	buffer = $("#form_value input").val();
	$("#david_cat input").each(function() {
			buffer = buffer - $(this).val();
			});
	input2.attr("value", buffer);
	jSpan.append(input2);
	var button_submit = $("<button id=\"but_"+cat_id+"\">Annuler</button>");
	button_submit.click( function() {
			var reg = /but_(\d+)/;
			var id = reg.exec($(this).attr("id"));
			$("#span_"+id[1]).remove();
			});
	jSpan.append(button_submit);
	jSpan.append($("<br>"));
	$("#david_cat").append(jSpan);
	return false;
}




function monaDisplayStats() {
	$("#main").empty();
        /*
	$("#main").append($("<div id=\"my_chart2\">"));
    swfobject.embedSWF(
	"open-flash-chart.swf", "my_chart2", "550", "300",
	"9.0.0", "expressInstall.swf",
	{"data-file":"scripts/data2.php"}
	);
	$("#main").append($("<div id=\"my_chart3\">"));
    swfobject.embedSWF(
	"open-flash-chart.swf", "my_chart3", "550", "300",
	"9.0.0", "expressInstall.swf",
	{"data-file":"scripts/data3.php?id=0"}
	);
        */
	$("#main").append($("<div id=\"bar1\">"));
    swfobject.embedSWF(
	"open-flash-chart.swf", "bar1", "550", "300",
	"9.0.0", "expressInstall.swf",
	{"data-file":"scripts/bar1.php?id=0"}
	);
	$("#main").append($("<div id=\"pie2\">"));
    swfobject.embedSWF(
	"open-flash-chart.swf", "pie2", "550", "300",
	"9.0.0", "expressInstall.swf",
	{"data-file":"scripts/pie2.php?id=0"}
	);
}


// Params
function monaTreeParams(id) {
    $.ajax({
        type: "GET",
        url: "scripts/liste.php?table=categories",
        async: false,
        success: function(xmlDoc) {
            var jXml = $(xmlDoc);
            var jCategories = jXml.find("categories");
            var jLi = $("<li>").append("<a href=\"0\">Catégories</a>");
            var jUl = $("<ul>");
            processXmlCat_rec(jCategories, 0, jUl);
            jLi.append(jUl);
            $(id).append(jLi);
            /* construction de l'arbre */
            $(id).treeview({
                persist: "location",
                collapsed: true,
                unique: true
            });

            $("#david_tree a").click(function() {
                $(".selected").removeClass("selected");
                $(this).addClass("selected");
                /* new */
                $("#form_add_cat input:first").val($(".selected").attr("href"));
                $("#form_add_cat p b").text($(".selected").text());
                return false;
            });
        }
    });
}

function registerFunctions() {
    /* ajout des évènements */

    /* on veut ajouter une nouvelle catégorie */
    $("#add_cat").click(function() {
        /* tester si on a bien cliqué quelque part */
        if ($(".selected").length == 0) {
            $("#admin_log").text("Il faut choisir une catégorie").addClass("error").show().fadeOut(3000);
            return false;
        }
        /* afficher le formulaire */
        $("#selector button").hide();
        $("#form_add_cat").show();
        return false;
    });

    /* */
    $("#form_add_cat").submit(function() {
        /* récupérer les infos */
        var s = $("#form_add_cat").serialize(); 
        $.ajax({ 
            type: "GET", 
            data: s,
            async: false, 
            url: $("#form_add_cat").attr("action"), 
            success: function(id_created){
                $("#selector button").show();
                $("#form_add_cat").hide();
                addCat($("#form_add_cat input[name='name']").val(), id_created);
                /*
                var link = "<li><a href=\""+id_created+"\">"+$("#form_add_cat input[name='name']").val()+"</a></li>";
                if ($(".selected:parent + ul").length == 0) {
                    $(".selected").parent().append("<ul>"+link+"</ul>");
                } else {
                    $(".selected + ul").prepend(link);
                }
                */
                /* clean tree */
                /*
                $(".collapsable").removeClass("collapsable");
                $(".lastCollapsable").removeClass("lastCollapsable");
                $(".expandable").removeClass("expandable");
                $("#david_tree div").remove();
                */
                /* construct tree */
                /*
                $("#david_tree").treeview();
                */
                return true;
                $("#david_tree a").unbind('click');
                $("#david_tree a").click(function() {
                    $(".selected").removeClass("selected");
                    $(this).addClass("selected");
                    /* new */
                    $("#form_add_cat input:first").val($(".selected").attr("href"));
                    $("#form_add_cat p b").text($(".selected").text());
                    return false;
                });
                $("#admin_log").text(id_created);
            }
        });
        return false;
    }); 

    $("#cancel").click(function() {
            $("#form_add_cat").hide();
            $("#selector button").show();
            return false;
            });

                $("#mod_cat").click(function() {
                                alert("modifier?");
                        return false;
                        });

        /* suppression d'une catégorie */
        $("#del_cat").click(function() {
            /* tester si on a bien cliqué quelque part */
            if ($(".selected").length == 0) {
                $("#admin_cat div:last").text("Il faut choisir une catégorie").addClass("error").show().fadeOut(3000);
                return false;
            }
            if (confirm("Voulez-vous vraiment effacer la catégorie "+$(".selected").text()+"?")) {
                var url = "scripts/del_category.php?id="+$(".selected").attr("href");
                $.ajax({ 
                    type: "GET", 
                    async: false,
                    url: url, 
                    success: delCat
                });
            }
            return false;
        });
    }

function displayWho() {
    $.ajax({
        type: "GET",
        url: "scripts/liste.php?table=who",
        success: function(xml) {
            var jXml = $(xml);
            var jWho = jXml.find("who");
            var jRow = jWho.children();
            jRow.each(function() {
                var jThis = $(this);
                var name = jThis.find("name").text();
                var id = jThis.find("id").text();
                $("#form_who select").append($("<option>"+name+"</option>"));
            });

        }
        });
}

