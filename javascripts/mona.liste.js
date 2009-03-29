
function monaDisplayList() {
    // aller chercher le fichier XML
    $.ajax({
        type: "GET",
        //url: "scripts/liste.php?table=op",
        url: "scripts/liste2.php",
        success: displayList
    });
}


/* un essai */
jQuery.fn.extend({
   findPos : function() {
       obj = $(this).get(0);
       var curleft = obj.offsetLeft || 0;
       var curtop = obj.offsetTop || 0;
       while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft
                curtop += obj.offsetTop
       }
       return {x:curleft,y:curtop};
   }
});


/* affiche les details d'une opération */
function displayDetails()
{
    var jA = $(this);
    function processXML(xmlDoc)
    {
        //$("div#details").fadeOut("fast");
        $("div#details").remove();
        log.debug("processXML()");
        var jDiv = $("<div id=\"details\"></div>");
        var rows = xmlDoc.getElementsByTagName('row');
        for (var i=0; i < rows.length; ++i) {
            var name  = rows[i].getElementsByTagName("name")[0].firstChild.data;
            var value = rows[i].getElementsByTagName("value")[0].firstChild.data;
            jDiv.append("<ul><li>"+name+"</li><li>"+value+"</li></ul>");
        }
        var pos = jA.findPos();
        var posX = pos.x +30;
        var posY = pos.y - 30;
        log.debug("pacement en "+posX+","+posY);
        jDiv.css("position", "absolute");
        jDiv.css("left", posX);
        jDiv.css("top", posY);
        jDiv.hide();
        $("#main").append(jDiv);
        jDiv.fadeIn("fast");

        return false;
    }
    // aller chercher le fichier XML
    var id = jA.attr("href");
    $.ajax({
        type: "GET",
        url: "scripts/details.php?id="+id,
        success: processXML,
        error : function (ret)
            {
                alert(ret);
                return false;
            }
    });

    return false;
}


function monaIcon(iconName) {
    var jDiv = $("<div></div>");
    jDiv.addClass("ui-widget");
    jDiv.addClass("ui-state-default");
    jDiv.addClass("ui-corner-all");
    jDiv.addClass("mona-icon");
    var jSpan = $("<span></span>");
    jSpan.addClass("ui-icon")
    jSpan.addClass(iconName);
    jDiv.append(jSpan);
    jDiv.hover(
            function() { $(this).addClass('ui-state-hover'); }, 
            function() { $(this).removeClass('ui-state-hover'); }
  );
    return  jDiv;
}


function displayList(xml) {
    var tab = traiteXmlList(xml);
    $("#main").empty();
    $("<table id=\"tab_liste\">").appendTo("#main");
    var tr = $("<tr>");
    tr.append("<th id=\"th_id\">ID</th>");
    tr.append("<th id=\"th_date\">Date</th>");
    tr.append("<th id=\"th_credit\">Crédit</th>");
    tr.append("<th id=\"th_debit\">Débit</th>");
    tr.append("<th id=\"th_labels\">Labels</th>");
    tr.append("<th id=\"\"></th>");
    tr.append("<th id=\"\"></th>");
    tr.append("<th id=\"\"></th>");
    var thead = $("<thead></thead>");
    thead.append(tr);
    $("#tab_liste").append(thead);
    for (var i = 0; i < tab.length; i++) {
	    var tr = $("<tr>");
	    tr.append("<td>" + tab[i]['id'] + "</td>");
	    tr.append("<td>" + tab[i]['date'] + "</td>");
            if (tab[i]['value'] > 0) {
                tr.append("<td>" + $.sprintf("%.2f€", tab[i]['value']) + "</td>");
                tr.append("<td>-</td>");
            } else {
                tr.append("<td>-</td>");
                tr.append("<td>" + $.sprintf("%.2f€", tab[i]['value']*(-1)) + "</td>");
            }
            /* labels */
            var tmp = "<td>";
            for(var j = 0; j < tab[i]['labels'].length; j++) {
                tmp += tab[i]['labels'][j].textContent + " ";
            }
            tmp += "</td>";
            tr.append(tmp);

            /* detail icon */
            var td = $("<td></td>");
            var icon = monaIcon("ui-icon-zoomin");
            var link = $("<a></a>");
            link.attr("href", tab[i]['id']);
            link.addClass("details");
            link.append(icon);
            td.append(link);
            tr.append(td);


            /* Edit button */
            td = $("<td></td>");
            link = $("<a></a>");
            link.attr("href", tab[i]['id']);
            link.append(monaIcon("ui-icon-pencil"));
            link.addClass("edit");
            td.append(link);
            tr.append(td);
            /* delete icon */
            td = $("<td></td>");
            var icon = monaIcon("ui-icon-closethick");
            icon.attr("id", "del_"+tab[i]['id']);
            tr.append(td.append(icon));

	    $("#tab_liste").append(tr);
            $("#tab_liste tr:odd").addClass("odd");
            $("#tab_liste tr:even").addClass("even");


            $("#del_"+tab[i]['id']).click(function() {
                var reg = /del_(\d+)/;
                var id = reg.exec($(this).attr("id"));
                if(confirm("Voulez-vous supprimer l'opération "+id[1]+"?")) {
                    $.ajax({
                    type: "POST",
                    async: false,
                    data: "id="+id[1],
                    url: "scripts/del_operation.php",
                    success: function(res) {
                        $("#log").text(res);
                        monaDisplayList();
                    },
                    error:
                        function (XMLHttpRequest, textStatus, errorThrown) {
                            document.getElementById('result').innerHTML = textStatus;
                        }
                    });
                } else {
                    alert("OK, je ne fais rien");
                }
            });
    }
    /* afficher les details d'une operation */
    $(".details").click(displayDetails);
    $(".edit").click(displayForm);
    //$("tr").click(displayDetails);
    /*$(".details").hover(displayDetails, function() {
            $("div#details").fadeOut("fast");
            });*/
    //$("#tab_liste").tablesorter();
}

function traiteXmlList(xmlDoc) {
    var operations = xmlDoc.getElementsByTagName('row');
    var bigTab = new Array();
    for (var i=0; i < operations.length; ++i) {
        bigTab[i]= new Array();
        bigTab[i]['id'] = operations[i].getElementsByTagName("id")[0].firstChild.data;
        bigTab[i]['labels'] = operations[i].getElementsByTagName("label");
        bigTab[i]['value'] = operations[i].getElementsByTagName("value")[0].firstChild.data;
        bigTab[i]['date'] = operations[i].getElementsByTagName("date")[0].firstChild.data;
    }
    return bigTab;
}
