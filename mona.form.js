function displayForm()
{
    log.info("displayForm()");

    var nb_row = 1; // compteur pour les différentes lignes du tableau

    /* affiche l'arbre des catégories */
    function afficher_arbre(t)
    {
        log.info("afficher_arbre()");
        var jThis = $(t);
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


    /* pour ajouter une ligne dans le tableau */
    function ajouter_ligne_tableau(t)
    {
        log.info("ajouter_ligne_tableau()");
        var jInputHidden = $("<input type=\"hidden\" id=\"input_cat_id_"+nb_row+"\">");
        var jInputCatName = $("<input id=\"input_cat_name_"+nb_row+"\" class=\"input_cat\" type=\"text\">");
        var jInputSomme = $("<input class=\"input_somme_"+nb_row+"\" type=\"text\">");
        var jTr = $("<tr></tr>");
        var jTd = $("<td></td>");
        var jTd2 = $("<td></td>");
        jInputCatName.click(afficher_arbre(t));
        jTd.append(jInputHidden);
        jTd.append(jInputCatName);
        jTd2.append(jInputSomme);
        jTr.append(jTd);
        jTr.append(jTd2);
        $("#table_cat tbody").append(jTr);
        nb_row++;
        return false;
    }



    function submit_formulaire(t)
    {
        log.info("submit_formulaire()");
        return false;
            /* send */
        /*
            var s = $(this).serialize(); 
            $.ajax({ 
                    type: "POST", 
                    data: s, 
                    url: $(this).attr("action"), 
                    success: function(retour){
                            $.modal.close();
                            $("#log").html(retour);
                            monaDisplayList();
                    },
                    error: function() {
                        alert("error");
                        return false;
                    }
            }); 
            */
            /* check the form */
            /*
            if ($("#form_date input").val() == "") {
                    $("#form_date span").addClass("error").text("Date invalide").show().fadeOut(3000);
                    return false;
            }
            */
        /*
            alert("Submit");
            return false;
            */
            /*
            if ($("#form_value input").val() == "00.00") {
                    $("#form_value span").hide().addClass("error").text("Somme invalide").show().fadeOut(3000);
                    return false;
            }
            */

    }

    /* quand on clique dans l'arbre */
    function click_choix_cat_arbre(t)
    {
        log.info("click_choix_cat_arbre()");
        return false;
        var jThis = $(t);
        var jInput = $(".input_cat_selected");
        var reg = /input_cat_name_(\d+)/;
        var id = reg.exec(jInput.attr("id"));
        /* le nom */
        jInput.val(jThis.text());
        /* l'id */
        $("#input_cat_id_"+id[1]).val(jThis.attr("href"));
        /* cache l'arbre */
        $("#form_tree").hide();
        /* on enlève l'attribut */
        jInput.removeClass("input_cat_selected");
        return false;
    }

    /* au chargement de la page */
    function charment_page()
    {
        log.info("chargement_page()");
        $("#form").modal();
        return false;


        /* calendrier */
        $("#form_calendar").datepicker("destroy");
        $("#form_calendar").datepicker({dateFormat: 'yy-mm-dd'});
        /* L'arbre des catégories */
        buildCatTree("#form_tree");
        /* fill the input */
        alert("chargement page");
        $("#form_tree a").click(click_choix_cat_arbre(this));
        alert("chargement page");

        $("#form_tree").hide();
        /* remplir la liste des who */
        monaFillWho("#form_who");
        /* transformation du formulaire en modal */

        //$("button#button_add_cat").click(ajouter_ligne_tableau(this));


        function affiche_choix_categories() {
            $("#form_tree").show();
            return false;
        }

        /* on click sur l'input categorie*/
        //$(".input_cat").click(afficher_arbre(this));

        //$("#form_cat button").click(affiche_choix_categories);

        /* quand on valide le formulaire */
        //$("#form").submit(submit_formulaire(this));
        return false;
    }
        /* aller chercher la page */
        $("#div_form").load("form2.html", charment_page());
        //return false;

}
