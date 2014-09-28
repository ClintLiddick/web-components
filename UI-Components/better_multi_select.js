/**
 *
 */


var BetterMultiSelect = (function($){


    // TODO replace strings with jQuery objects?
    var newInstance = function(containerId,selectorName,selectId,options) {
        var html = "<div class='betterSelect_div'>";
        html += generateHiddenSelect(selectorName,options);
        html += generateVisibleSelector(selectId,options);
        html += generateVisibleList();
        html += generateDeleteButton();
        html += "</div>";

        $('#' + containerId).append(html);
        initHandlers(containerId);
    };

    /**
     * [setSelected description]
     * @param {String} selectorName is the name/id attribute given to the hidden value selector
     * @param {String[]} options is an array of option value strings to set as selected
     */
    var setSelected = function(selectorName,options) {
        var hiddenSel = $('#'+selectorName);
        hiddenSel.val(options);
        hiddenSel.change();
    };

    function generateHiddenSelect(selectorName,options) {
        var html = "<select id='" + selectorName + "' name='" + selectorName + "' class='betterSelect_hidden' multiple='multiple'>";
        $.each(options, function(i,obj){
            html += "<option value='" + obj.val + "' class='betterSelect_value'>" + obj.text + "</option>";
        });
        html += "</select>";

        return html;
    }

    function generateVisibleSelector(selectId,options) {
        var html = "<select id='" + selectId + "' class='betterSelect_selector'>";
        html += "<option value='' class='betterSelect_option'>Please Select</option>";
        $.each(options, function(i,obj){
            html += "<option value='" + obj.val + "' class='betterSelect_option'>" + obj.text + "</option>";
        });
        html += "</select>";

        return html;
    }

    function generateVisibleList() {
        return "<div class='betterSelect_list'><ul></ul></div>";
    }

    function generateDeleteButton() {
        return "<button class='betterSelect_del'>Remove Selected</button>";
    }


    function initHandlers(containerId) {
        $('#' + containerId).on('change','.betterSelect_selector', function(e) {
            var visibleSel = $(this);
            var hiddenSel = $(visibleSel.siblings('.betterSelect_hidden')[0]);
            var newSelectedVal = visibleSel.val();
            var selectedVals = hiddenSel.val();
            if (selectedVals) {
                if (selectedVals.indexOf(newSelectedVal) <= -1) {
                    selectedVals.push(newSelectedVal);
                    hiddenSel.val(selectedVals);
                    hiddenSel.change();
                }
            } else {
                selectedVals = [newSelectedVal];
                hiddenSel.val(selectedVals);
                hiddenSel.change();
            }
            visibleSel.val('');
        });

        $('#' + containerId).on('change', '.betterSelect_hidden', function(e) {
            var hiddenSel = $(this);
            var visibleList = hiddenSel.siblings('.betterSelect_list').first().children('ul').first();
            visibleList.empty();
            $.each(hiddenSel.children(':selected'), function(i, opt) {
                visibleList.append('<li>' + $(opt).text() + '</li>');
            });
        });

        $('#' + containerId).on('click', 'li', function(e) {
            $(this).toggleClass('selected');
        });

        $('#' + containerId).on('click', '.betterSelect_del', function(e) {
            e.preventDefault();
            var hiddenSel = $(this).siblings('.betterSelect_hidden').first();
            var visibleList = $(this).siblings('.betterSelect_list').first().children('ul').first();
            var valsToDelete = visibleList.children('.selected');
            $.each(valsToDelete, function(i,liEle){
                var selectedVals = hiddenSel.val();
                var eleToDelete = hiddenSel.children(':contains('+$(liEle).text()+')').first();
                var indexToDelete = hiddenSel.children(':selected').index(eleToDelete);
                selectedVals.splice(indexToDelete,1);
                hiddenSel.val(selectedVals);
                hiddenSel.change();
            });
            // valsToDelete.remove();
        });
    }


return {
    newInstance : newInstance,
    setSelected : setSelected
};

})(jQuery);