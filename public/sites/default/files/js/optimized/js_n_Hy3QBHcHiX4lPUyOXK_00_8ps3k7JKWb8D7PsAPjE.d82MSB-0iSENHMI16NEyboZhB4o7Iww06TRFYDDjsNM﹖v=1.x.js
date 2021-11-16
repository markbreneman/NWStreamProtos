/**
 * @file
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  Drupal.behaviors.conditional_message = {
    attach: function (context, settings) {
      // Run only once (not on ajax calls).
      if (context != document) {
        return;
      }
      // Shorthand for the configurations.
      let config = drupalSettings.conditional_message;
      let htmls = [];
      // TODO rewrite this in pure JS to avoid jQuery dependency.
      for (let key in config) {
        // Bail if user already closed the message before.
        let cmuc = 'conditionalMessageUserClosed' + key;
        if (localStorage.getItem(cmuc) == config[key].hash) {
          continue;
        }
        (function ($, config, key, htmls) {
          queryEndpoint($, config, key, htmls);
        }).call(this, $, config, key, htmls);
      }
    }
  };
})(jQuery, Drupal, drupalSettings);


function queryEndpoint($, config, key, htmls) {
  $.ajax({
    url: Drupal.url("conditional_message_data_output"), success: function (result) {
      // Do not proceed if key not defined. Node deleted?
      if (result[key] == undefined) {
        return;
      }
      // Checks to see if the message should be displayed.  Config = backend logic, Result = frontend logic.
      let check = [];
      // Check and set sessions with localStorage.
      check['session'] = true;
      if (config[key].conditions.includes('session')) {
        let cmrs = 'conditionalMessageReadStatus' + key;
        let readStatus = localStorage.getItem(cmrs);
        if (readStatus !== config[key].hash) {
          check['session'] = false;
        } else {
          localStorage.setItem(cmrs, config[key].hash);
        }
      }
      // Check close button with localStorage.
      check['close'] = true;
      if (config[key].conditions.includes('close') && result[key].close) {
        let cmuc = 'conditionalMessageUserClosed' + key;
        let closeHash = localStorage.getItem(cmuc);
        if (closeHash == config[key].hash) {
          check['close'] = false;
        }
      }
      // Paths conditions.
      check['path'] = true;
      if (config[key].conditions.includes('path')
        && result[key].paths.indexOf(window.location.pathname.substr(config[key].base_path.length - 1)) < 0) {

        check['path'] = false;
      }
      // Content type conditions.
      check['type'] = true;
      if (config[key].conditions.includes('content_type') && result[key].hasOwnProperty('types')) {
        check['type'] = false;
        result[key].types.forEach(function (type) {
          let typeClass = 'page-node-type-' + type;
          if ($('body').hasClass(typeClass)) {
            check['type'] = true;
          }
        });
      }
      // Show message if all checks pass.
      if (config[key].status
        && result[key].display
        && check['session']
        && check['path']
        && check['type']
        && check['close']) {

        // Display the close button only if option to close enabled.
        let closeButton = '';
        if (result[key].close) {
          closeButton = '<span>&times;</span>';
        }

        // Prepare color, either color name or HEX. If HEX color, add hash.
        if (/^([0-9A-F]{3}){1,2}$/i.test(config[key].bg_color)) {
          config[key].bg_color = '#' + config[key].bg_color;
        }
        if (/^([0-9A-F]{3}){1,2}$/i.test(config[key].color)) {
          config[key].color = '#' + config[key].color;
        }

        // Build the message HTML.
        let html = '<div class="conditional-message" data-cm-key="'
          + key +'" style="background-color:'
          + config[key].bg_color + '; color:'
          + config[key].color + ';">' + closeButton
          + config[key].message + '</div>';
        htmls[key] = html;
        // Place the message in the page top or bottom.
        switch (config[key].position) {
          case  'bottom':
            $(config[key].target).append($(htmls[key]).addClass('conditional-message-bottom'));
            break;

          default:
            $(config[key].target).prepend($(htmls[key]).addClass('conditional-message-top'));
        }
        // Close button.
        $('.conditional-message span').on('click', function () {
          let cmKey = $(this).parent().data('cm-key');
          $(this).parent().remove();
          let cmuc = 'conditionalMessageUserClosed' + cmKey;
          if (result[key].close) {
            localStorage.setItem(cmuc, config[key].hash);
          }
        });
      }
    }
  });
}
