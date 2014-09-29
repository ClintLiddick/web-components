var BetterMultiSelect = (function($){

    /**
     * Creates an instance of BetterMultiSelect
     *
     * @param  {String} containerId  id of the node to append to
     * @param  {String} selectorName name to use for the form element
     * @param  {Object[]} options    array of {"id":"", "label":""} for select options
     */
    var newInstance = function(containerId,selectorName,options) {
    	if ( !$('#'+selectorName).length ) {
	        var html = "<div class='betterSelect_div'>";
	        html += generateHiddenSelect(selectorName,options);
	        html += generateVisibleSelector(options);
	        html += generateVisibleList();
	        html += generateDeleteButton();
	        html += "</div>";

	        $('#' + containerId).append(html);
	        initEventHandlers(containerId);
    	}
    };


    /**
     * Sets the currently selected options of the form element
     *
     * @param {String} selectorName the name/id of the form element
     * @param {String[]} options    an array of option value strings to set as selected
     */
    var setSelected = function(selectorName,options) {
        var hiddenSel = $('#'+selectorName);
        hiddenSel.val(options);
        hiddenSel.change();
    };

    /**
     * Gets currently selected options of the form element
     * 
     * @param  {String} selectorName the name/id of the form element
     * @return {String[]}            an array of option value strings that set as selected
     */
    var getSelected = function(selectorName) {
        var hiddenSel = $('#'+selectorName);
        return hiddenSel.val();
    }

    /**
     * @param  {String}   selectorName name of form element
     * @param  {String[]} options      array of {"id":"", "label":""} for select options
     * @return {String}                HTML for hidden <select> form element
     */
    function generateHiddenSelect(selectorName,options) {
        var html = "<select id='" + selectorName + "' name='" + selectorName + "' class='betterSelect_hidden' multiple='multiple'>";
        $.each(options, function(i,obj){
            html += "<option value='" + obj.id + "' class='betterSelect_value'>" + obj.label + "</option>";
        });
        html += "</select>";

        return html;
    }


    /**
     * @param  {String} options array of {"id":"", "label":""} for select options
     * @return {String}         HTML for dropdown selector
     */
    function generateVisibleSelector(options) {
        var html = "<select class='betterSelect_selector'>";
        html += "<option value='' class='betterSelect_option'>Please Select</option>";
        $.each(options, function(i,obj){
            html += "<option value='" + obj.id + "' class='betterSelect_option'>" + obj.label + "</option>";
        });
        html += "</select>";

        return html;
    }


    /**
     * @return {String} HTML for visible "selected" list
     */
    function generateVisibleList() {
        return "<div class='betterSelect_list'><ul></ul></div>";
    }


    /**
     * @return {String} HTML for delete button
     */
    function generateDeleteButton() {
        return "<button class='betterSelect_del'>Remove Selected</button>";
    }


    /**
     * Initializes all necessary event handlers for BetterMultiSelect widget
     *
     * @param  {String} containerId id of container contianing BetterMultiSelect form element
     */
    function initEventHandlers(containerId) {

        // Handler for dropdown selector
        // Adds a single value to the hidden <select> form element
        $('#' + containerId).on('change','.betterSelect_selector', function(e) {
            var visibleSel = $(this);
            var hiddenSel = $(visibleSel.siblings('.betterSelect_hidden')[0]);
            var newSelectedVal = visibleSel.val();
            var selectedVals = hiddenSel.val();
            if (selectedVals) {
                // if not already selected
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

        // Handler for hidden <select> form element
        // Updates the visible "selected" list to match current selections
        $('#' + containerId).on('change', '.betterSelect_hidden', function(e) {
            var hiddenSel = $(this);
            var visibleList = hiddenSel.siblings('.betterSelect_list').first().children('ul').first();
            visibleList.empty();
            $.each(hiddenSel.children(':selected'), function(i, opt) {
                visibleList.append('<li>' + $(opt).text() + '</li>');
            });
        });

        // Handler for "selected" list items
        $('#' + containerId).on('click', 'li', function(e) {
            $(this).toggleClass('betterSelect_liSelected');
        });

        // Handler for delete selected button
        // Uses the text of the visible selected list to remove hidden selected values
        $('#' + containerId).on('click', '.betterSelect_del', function(e) {
            e.preventDefault();
            var hiddenSel = $(this).siblings('.betterSelect_hidden').first();
            var visibleList = $(this).siblings('.betterSelect_list').first().children('ul').first();
            var valsToDelete = visibleList.children('.betterSelect_liSelected');
            $.each(valsToDelete, function(i,liEle){
                var selectedVals = hiddenSel.val();
                var eleToDelete = hiddenSel.children(':contains('+$(liEle).text()+')').first();
                var indexToDelete = hiddenSel.children(':selected').index(eleToDelete);
                selectedVals.splice(indexToDelete,1);
                hiddenSel.val(selectedVals);
            });
            hiddenSel.change();
        });
    }


return {
    newInstance : newInstance,
    setSelected : setSelected,
    getSelected : getSelected
};

})(jQuery);