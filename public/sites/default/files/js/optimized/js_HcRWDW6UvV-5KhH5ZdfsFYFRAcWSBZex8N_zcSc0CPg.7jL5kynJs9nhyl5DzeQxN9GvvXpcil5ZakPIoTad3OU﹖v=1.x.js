/**
 * @file
 */

(function ($, Drupal) {

    "use strict";

    Drupal.behaviors.conditional_message_edit_form = {
        attach: function (context, settings) {
            // Show or hide options according to selected conditions.
            function toggleVisibility() {
                if ($('#edit-conditions-role', context).prop('checked')) {
                    $('#edit-role-options-wrapper', context).show();
                }
                else {
                    $('#edit-role-options-wrapper', context).hide();
                }
                if ($('#edit-conditions-path', context).prop('checked')) {
                    $('#edit-path-options-wrapper', context).show();
                }
                else {
                    $('#edit-path-options-wrapper', context).hide();
                }
                if ($('#edit-conditions-content-type', context).prop('checked')) {
                    $('#edit-content-type-options-wrapper', context).show();
                }
                else {
                    $('#edit-content-type-options-wrapper', context).hide();
                }
            }
            toggleVisibility();

            $(document, context).on('click', toggleVisibility);
        }
    }
})(jQuery, Drupal);
