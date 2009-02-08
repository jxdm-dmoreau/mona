
var once = 0;

function displayForm()
{

    var nb_row = 0; // compteur pour les différentes lignes du tableau

    /* affiche l'arbre des catégories */
    function afficher_arbre()
    {
        log.info("afficher_arbre()");
        var jThis = $(this);
        /* on applique une class au input pour pouvoir l'indentifier */
        jThis.addClass("input_cat_selected");
        /* on cherche la position */
        var pos = jThis.findPos();
        var posX = pos.x;
        var posY = pos.y + 25;
        var jTree = $("#form_tree");
        jTree.css("top", posY);
        jTree.css("left", posX);
        jTree.fadeIn("slow");
    }

    function update_total()
    {
        log.info("update_total()");
        var i = 0;
        var total = 0;
        for(i; i < nb_row; i++) {
            var s = $("#input_somme_"+i).val();
            log.debug("i="+i+" somme="+s);
            total += parseFloat(s);
        }
        total +=    0.00;
        log.debug("total:"+total);
        var total = $.sprintf("%.2f", total);
        $("#input_total").val(total);
        return false;
    }

    function formate_somme()
    {
        log.info("formate_somme()");
        var jThis = $(this);
        var s = jThis.val();
        var sf = $.sprintf("%.2f", s);
        jThis.val(sf);
        return false;
    }

    /* pour ajouter une ligne dans le tableau */
    function ajouter_ligne_tableau()
    {
        log.info("ajouter_ligne_tableau()");

        var jInputHidden = $("<input />");
       jInputHidden.attr("type", "hidden");
       jInputHidden.attr("id", "input_cat_id_"+nb_row);
       jInputHidden.attr("name", "input_cat_id_"+nb_row);

        var jInputCatName = $("<input />");
        jInputCatName.attr("type", "text");
        jInputCatName.attr("id", "input_cat_name_"+nb_row);
        jInputCatName.attr("name", "input_cat_name_"+nb_row);
        jInputCatName.attr("autocomplete", "off");
        jInputCatName.addClass("input_cat");

        var jInputSomme = $("<input />");
        jInputSomme.attr("type", "text");
        jInputSomme.attr("id", "input_somme_"+nb_row);
        jInputSomme.attr("name", "input_somme_"+nb_row);
        jInputSomme.addClass("somme");
        jInputSomme.val("0.00");

        var jTr = $("<tr></tr>");
        jTr.attr("id", "row-"+nb_row); // pour pouvoir supprimer la ligne correspondante
        var jTd = $("<td></td>");
        var jTd2 = $("<td></td>");
        var jTd3 = $("<td></td>");
        if (nb_row != 0) {
            var jDiv = $("<div></div>");
            jDiv.addClass("ui-widget").addClass("ui-corner-all").addClass("ui-state-default").addClass("mona-icon");;
            var jDiv2 = $("<div></div>");
            jDiv2.addClass("ui-icon").addClass("ui-icon-closethick").attr("nb", nb_row);
            jDiv.append(jDiv2);
            jTd3.append(jDiv);
        }


        jInputSomme.change(formate_somme);
        jInputSomme.change(update_total); // le live ne gere pas encore l'event onChange

        jTd.append(jInputHidden);
        jTd.append(jInputCatName);
        jTd2.append(jInputSomme);
        jTd2.append("€");
        jTr.append(jTd);
        jTr.append(jTd2);
        jTr.append(jTd3);
        $("#table_cat tbody").append(jTr);
        nb_row++;

        /* overwrite hover event for icons */
        $(".mona-icon").hover(
                 function() { $(this).addClass('ui-state-hover'); }, 
                 function() { $(this).removeClass('ui-state-hover'); }
                );

        return false;
    }

    function enlever_ligne()
    {
        log.info("enlever_ligne()");
        var nb = $(this).attr("nb");
        $("#row-"+nb).remove();

        return false;
    }

    function onClick_sur_larbre()
    {
        log.info("onClick_sur_larbre()");
        var jInput = $(".input_cat_selected");
        var reg = /cat_name_(\d+)/;
        var id = reg.exec(jInput.attr("id"));
        /* le nom */
        jInput.val($(this).text());
        /* l'id */
        $("#input_cat_id_"+id[1]).val($(this).attr("href"));
        /* on deselectionne le input */
        var jInput = $(".input_cat_selected");
        jInput.removeClass("input_cat_selected");
        /* on ferme la fenêtre*/
        $("#form_tree").hide();
        return false;
    }


    var _oldInputFieldValue=""; // valeur précédente du champ texte
    var _currentInputFieldValue=""; // valeur actuelle du champ texte

    function extract_tags_from_input()
    {
        var $input = $("#input_labels").val();
        var last = "";
        var reg=/, /;
        var res = $input.split(reg);
        return res[res.length-1];
    }

    function auto_completion()
    {
        log.info("auto_completion");
        /* conversion en minuscule */
        var str = $("#input_labels").val();
        $("#input_labels").val(str.toLowerCase());
        _currentInputFieldValue = extract_tags_from_input();
        log.debug("current: " + _currentInputFieldValue);
        if (_oldInputFieldValue != _currentInputFieldValue){
            $("#tags_suggestions").hide();
            $("#tags_suggestions").empty();
            if (_currentInputFieldValue != "") {
                var pos = $("#input_labels").findPos();
                var posX = pos.x;
                var posY = pos.y + 25;
                var jUl = $("<ul id=\"suggestions\"></ul>");
                jUl.css("left", posX+"px");
                jUl.css("top", posY+"px");
                var reg = new RegExp(_currentInputFieldValue, "i");
                for(var cle in monaTabLabels) {
                    var val = monaTabLabels[cle];
                    if (res = reg.exec(val) != null) {
                        log.debug("dd--> "+res[0]);
                        val = val.replace(reg, "<b>"+_currentInputFieldValue+"</b>");
                        jUl.append($("<li>"+val+"</li>"));
                    }
                }
                $("#tags_suggestions").append(jUl);
                $("#tags_suggestions").show();
                _oldInputFieldValue = _currentInputFieldValue;
            }
        }
    }

    function select_tags_up()
    {
        var $kids = $("ul#suggestions").children();
        var $selected = $("li.tagsselected");
        var l = $selected.length;
        if (l != 0) {
            $selected.removeClass("tagsselected");
            $selected.prev().addClass("tagsselected");
        }
    }
    
    function select_tags_down()
    {
        var $kids = $("ul#suggestions").children();
        var $selected = $("li.tagsselected");
        var l = $selected.length;
        if (l == 0) {
            $("ul#suggestions li:first").addClass("tagsselected");
        } else {
            $selected.removeClass("tagsselected");
            $selected.next().addClass("tagsselected");
        }
    }

    function select_current()
    {
        log.debug("select_current()");
        /* fill input */
        var $input = $("#input_labels");
        var val = $input.val();
        var $auto_completion = $("li.tagsselected").text();
        var new_value = "";
        var reg=/, /;
        var res = val.split(reg);
        for (var i = 0; i < res.length-1; i++) {
            new_value += res[i] + ", ";
        }
        $input.val(new_value + $auto_completion + ", ");
        /* erase autocomplete */
        $("ul#suggestions").hide();
        return false;
    }

    function move_key(e)
    {
        log.info("up_key()");        
        var lastKeyPressCode = e.keyCode;
        switch(e.keyCode) {
            case 38: // up
                select_tags_up();
                e.preventDefault();
                break;
            case 40:
                select_tags_down();
                e.preventDefault();
                break;
            case 13:
                select_current();
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    function check_form()
    {
        /* date */
        var jObj = $("#form_calendar");
        if (jObj.val() == "") {
            jObj.addClass("form-error");
            return false;
        }
        jObj.removeClass("form-error");

        /* categories */
        for (var i=0; i < 20; i++) {
            jObj = $("#input_cat_name_"+i);
            if (jObj != undefined && jObj.val() == "") {
                jObj.addClass("form-error");
                return false;
            }
            jObj.removeClass("form-error");
            jObj = $("#input_somme_"+i);
            if (jObj != undefined && (jObj.val() == "0.00" || jObj.val() == "0")) {
                jObj.addClass("form-error");
                return false;
            }
            jObj.removeClass("form-error");
        }


        return true;
    }

    function submit_formulaire() {
        log.info("submit_formulaire()");
        /* TODO vérification du formulaire */
        if (!check_form()) {
            return false; 
        }
        var $form = $("#form");
        var s = $form.serialize(); 
        $.ajax({ 
                type: "POST", 
                data: s, 
                url: $form.attr("action"), 
                success: function(retour){
                        $("#div_form").dialog("close");
                        $("#log").html(retour);
                        monaDisplayList();
                        return false;
                },
                error: function() {
                    alert("error");
                    return false;
                }
        });
    }

    function chargement_page(html)
    {
        log.info("chargement_page()");
        /* L'arbre des catégories */
        buildCatTree("#form_tree");
        /* quand on clique dans le tableau --> categorie */
        $("#form_tree a").click(onClick_sur_larbre);
        if (once == 0) {
            $("input.input_cat").live("click", afficher_arbre);
        }
        ajouter_ligne_tableau();


        /* mise à jour des labels */
        initLabels();

        /* transformation du formulaire en modal */
        if (once == 0) {
            $("#div_form").dialog({
                buttons: {
                    "Annuler": function() {
                        $("#div_form").dialog("close");
                    },
                    "Envoyer": submit_formulaire
                },
                modal: false,
                overlay: { 
                    opacity: 0.5, 
                    background: "black" 
                },
                title: "Ajout d'une opération" ,
                });
            once = 1;
        } else {
            $("#div_form").dialog("open");
        }

        /* ajout d'une catégorie */
        $(".ui-icon-plusthick").click(ajouter_ligne_tableau);
        /* suppression d'une ligne */
        $(".ui-icon-closethick").live("click", enlever_ligne);

        /* autocompletion */
        $("#input_labels").keyup(auto_completion);
        $("#input_labels").keydown(move_key);

        /* calendrier */
        $("#form_calendar").datepicker({dateFormat: 'yy-mm-dd'});

        return false;
    }

    /* aller chercher la page */
    $("#div_form").empty();
    $("#div_form").load("form2.html", chargement_page);



}

