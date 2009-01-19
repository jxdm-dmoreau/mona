
var ulId = "";


function onSelect() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    $("#form_add_cat input:first").val($(".selected").attr("href"));
    $("#form_add_cat p b").text($(".selected").text());
    return false;
}

function buildCatTree(name)
{

    ulId = name;

    function insertTree2()
    {
        insertTree2_r(0, "Catégories", $(name));
    }
    function insertTree2_r(ancestorId, ancestorName, jContent)
    {
        var jLi = $("<li>").append("<a href=\""+ancestorId+"\">"+ancestorName+"</a>");
        if (monaTabCategoriesFather[ancestorId] == undefined) {
            /* pas d'enfants */
            jContent.append(jLi);
            return true;
        } else {
            var jUl = $("<ul>");
            $(monaTabCategoriesFather[ancestorId]).each(function() {
                    insertTree2_r(this, monaTabCategoriesId[this], jUl);
            });
            jLi.append(jUl);
            jContent.append(jLi);
            return true;
        }
    }

    insertTree2();
    $(ulId).treeview({
                persist: "location",
                collapsed: true,
                unique: true,
    });
    $(ulId +" a").click(onSelect);
    return false;
}


function addCat(newName, newId)
{
    var link = "<li><a href=\""+newId+"\">"+newName+"</a></li>";
    if ($(".selected:parent + ul").length == 0) {
            $(".selected").parent().append("<ul>"+link+"</ul>");
    } else {
            $(".selected + ul").prepend(link);
    }
                $(".collapsable").removeClass("collapsable");
                $(".lastCollapsable").removeClass("lastCollapsable");
                $(".expandable").removeClass("expandable");
                $(".hitarea").removeClass("hitarea");
                $(".collapsable-hitarea").removeClass("collapsable-hitarea");
                $(ulId+" div").remove();
                $(ulId).treeview();
                $(ulId+" a").unbind('click');
                $(ulId+" a").click(onSelect);
}

function delCat()
{
    var ul = $(".selected").parent().parent();
    $(".selected").parent().remove();
    if (ul.text() == "") {
        ul.remove();
    }
    /* clean tree */
    $(".collapsable").removeClass("collapsable");
    $(".lastCollapsable").removeClass("lastCollapsable");
    $(".expandable").removeClass("expandable");
    $(".last").removeClass("last");
    $(".hitarea").removeClass("hitarea");
    $(".collapsable-hitarea").removeClass("collapsable-hitarea");
    $(ulId+" div").remove();
    $(ulId).treeview();


}
