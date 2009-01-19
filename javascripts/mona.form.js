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
        var pos = jThis.findPos();
        var jTree = $("#form_tree");
        var posX = pos.x;
        var posY = pos.y + 30;
        log.debug("x="+posX+" y="+posY);
        jTree.css("left", posX);
        jTree.css("top", posY);
        jTree.fadeIn("fast");
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
        var jInputHidden = $("<input type=\"hidden\" id=\"input_cat_id_"+nb_row+"\">");
        var jInputCatName = $("<input id=\"input_cat_name_"+nb_row+"\" class=\"input_cat\" type=\"text\">");
        var jInputSomme = $("<input id=\"input_somme_"+nb_row+"\" class=\"somme\" type=\"text\" value=\"0.00\">");
        var jTr = $("<tr></tr>");
        var jTd = $("<td></td>");
        var jTd2 = $("<td></td>");

        jInputSomme.change(formate_somme);
        jInputSomme.change(update_total); // le live ne gere pas encore l'event onChange

        jTd.append(jInputHidden);
        jTd.append(jInputCatName);
        jTd2.append(jInputSomme);
        jTd2.append("€");
        jTr.append(jTd);
        jTr.append(jTd2);
        $("#table_cat tbody").append(jTr);
        nb_row++;
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
        /* cache l'arbre */
        $("#form_tree").hide();
        /* on enlève l'attribut */
        jInput.removeClass("input_cat_selected");
        return false;
    }


    var _oldInputFieldValue=""; // valeur précédente du champ texte
    var _currentInputFieldValue=""; // valeur actuelle du champ texte

    function extract_tags_from_input()
    {
        var $input = $("#input_tags").val();
        var reg = new RegExp(".+, ", "i");
        var res = reg.exec($input);
        if (res != null) {
            log.debug("res="+res.length);
        }
    }

    function auto_completion()
    {
        log.info("auto_completion");
        _currentInputFieldValue = $("#input_tags").val();
        log.debug("current: "+_currentInputFieldValue);
        extract_tags_from_input();
        if (_oldInputFieldValue != _currentInputFieldValue){
            $("#tags_suggestions").empty();
            if (_currentInputFieldValue != "") {
                var pos = $("#input_tags").findPos();
                var posX = pos.x;
                var posY = pos.y + 25;
                var jUl = $("<ul id=\"suggestions\"></ul>");
                jUl.css("left", posX+"px");
                jUl.css("top", posY+"px");
                var reg = new RegExp(_currentInputFieldValue, "i");
                for(var cle in monaTabWho) {
                    var val = monaTabWho[cle];
                    if (reg.exec(val) != null) {
                        val = val.replace(reg, "<b>"+_currentInputFieldValue+"</b>");
                        jUl.append($("<li>"+val+"</li>"));
                    }
                }
                $("#tags_suggestions").append(jUl);
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
        /* fill input */
        $("#input_tags").val($("li.tagsselected").text()+", ");
        /* erase autocomplete */
        $("ul#suggestions").empty();
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



    function chargement_page()
    {
        log.info("chargement_page()");
        /* calendrier */
        $("#form_calendar").datepicker("destroy");
        $("#form_calendar").datepicker({dateFormat: 'yy-mm-dd'});
        /* quand on clique dans le tableau --> categorie */
        $("input.input_cat").live("click", afficher_arbre);
        ajouter_ligne_tableau();

        /* L'arbre des catégories */
        buildCatTree("#form_tree");
        $("#form_tree a").click(onClick_sur_larbre);
        $("#form_tree").hide();
        /* remplir la liste des who */
        monaFillWho("#form_who");
        /* transformation du formulaire en modal */
        $("#form").dialog({
            buttons: {
                "Annuler": function() {
                    alert("Cancel");
                },
                "Envoyer": function() {
                    alert("OK");
                    }
            },
            modal: true,
            overlay: { 
                opacity: 0.5, 
                background: "black" 
            } 
            });

        /* ajout d'une catégorie */
        $("#button_add_cat").click(ajouter_ligne_tableau);

        $("#input_tags").keyup(auto_completion);
        $("#input_tags").keydown(move_key);

        return false;
    }

    /* aller chercher la page */
    $("#div_form").load("form2.html", chargement_page);


}

