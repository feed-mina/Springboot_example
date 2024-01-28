/*!
FullCalendar Bootstrap 4 Plugin v6.0.0
Docs & License: https://fullcalendar.io/docs/bootstrap4
(c) 2022 Adam Shaw
*/
FullCalendar.Bootstrap = (function (exports, internal$1, core) {
    'use strict';

    class BootstrapTheme extends internal$1.Theme {
    }
    BootstrapTheme.prototype.classes = {
        root: 'fc-theme-bootstrap',
        table: 'table-bordered',
        tableCellShaded: 'table-active',
        buttonGroup: 'btn-group',
        button: 'btn btn-primary',
        buttonActive: 'active',
        popover: 'popover',
        popoverHeader: 'popover-header',
        popoverContent: 'popover-body',
    };
    BootstrapTheme.prototype.baseIconClass = 'fa';
    BootstrapTheme.prototype.iconClasses = {
        close: 'fa-times',
        prev: 'fa-chevron-left',
        next: 'fa-chevron-right',
        prevYear: 'fa-angle-double-left',
        nextYear: 'fa-angle-double-right',
    };
    BootstrapTheme.prototype.rtlIconClasses = {
        prev: 'fa-chevron-right',
        next: 'fa-chevron-left',
        prevYear: 'fa-angle-double-right',
        nextYear: 'fa-angle-double-left',
    };
    BootstrapTheme.prototype.iconOverrideOption = 'bootstrapFontAwesome'; // TODO: make TS-friendly. move the option-processing into this plugin
    BootstrapTheme.prototype.iconOverrideCustomButtonOption = 'bootstrapFontAwesome';
    BootstrapTheme.prototype.iconOverridePrefix = 'fa-';

    var css_248z = ".fc-theme-bootstrap a:not([href]){color:inherit}";
    internal$1.injectStyles(css_248z);

    var plugin = core.createPlugin({
        name: '@fullcalendar/bootstrap',
        themeClasses: {
            bootstrap: BootstrapTheme,
        },
    });

    var internal = {
        __proto__: null,
        BootstrapTheme: BootstrapTheme
    };

    internal$1.globalPlugins.push(plugin);

    exports.Internal = internal;
    exports["default"] = plugin;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, FullCalendar.Internal, FullCalendar);
