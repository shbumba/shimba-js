/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';

    var obj = {
            __settings: {
                pluginLocation: '',
                pluginsPaths: {}
            },
            __plugins: {}
        },
        currentPlugin = undefined,
        selector = undefined,
        errors = {};

    var methodsPrivate = {

        printError: function () {
            var length = 0;
            if (Object.keys) {
                length = Object.keys(errors).length;
            } else {// IE8
                for (var prop in errors) {
                    if (errors.hasOwnProperty(prop)) {
                        length++;
                    }
                }
            }

            if (length) {
                console.error(errors);
                errors = {};
            }

            return false;
        },

        addError: function () {
            if (arguments.length == 2) {
                if (!((arguments[0] !== null) && (typeof(arguments[0]) == 'string'))) {
                    $.error('addError: type 1 arguments is not string');
                } else if (!((arguments[1] !== null) && (typeof(arguments[1]) == 'string'))) {
                    $.error('addError: type 2 arguments is not function');
                } else {
                    if (errors[arguments[0]] === undefined) {
                        errors[arguments[0]] = [];
                    }
                    errors[arguments[0]].push(arguments[1]);

                    return true;
                }
            } else {
                $.error('addError: the number of arguments is not equal to two');
            }
            return false;
        },

        addModule: function () {
            if (arguments !== undefined && arguments.length > 1) {
                switch (arguments.length) {
                    case 2:
                        if (!((arguments[0] !== null) && (typeof(arguments[0]) == 'string'))) {
                            methodsPrivate.addError('addModule', 'type 1 arguments is not string');
                        } else if (!((arguments[1] !== null) && (typeof(arguments[1]) == 'function'))) {
                            methodsPrivate.addError('addModule', 'type 2 arguments is not function');
                        } else {
                            obj.__plugins[arguments[0]] = {};
                            methodsPrivate.setModuleOption(arguments[0], {});
                            methodsPrivate.setModuleCallback.apply(this, arguments);
                        }
                        break;

                    default:
                        methodsPrivate.addError('addModule', 'arguments error');
                }

            } else {
                methodsPrivate.addError('addModule', 'arguments undefined');
            }

            methodsPrivate.printError();

            return obj;
        },

        getModule: function (name) {
            if (!((name !== null) && (typeof(name) == 'string'))) {
                methodsPrivate.addError('getModule', 'type "name" is not string');
            } else if (obj.__plugins[name] === undefined) {
                methodsPrivate.addError('getModule', 'plugin "' + name + '" is not defined');
            } else {
                var sendSelector = selector;

                currentPlugin = name;
                selector = undefined;

                return obj.__plugins[name].callback(sendSelector, methodsPrivate.getModuleOption(name), obj, this);
            }

            methodsPrivate.printError();
        },

        setModuleCallback: function () {
            if (arguments.length == 2) {
                if (!((arguments[0] !== null) && (typeof(arguments[0]) == 'string'))) {
                    methodsPrivate.addError('setModuleCallback', 'type 1 arguments is not string');
                } else if (!((arguments[1] !== null) && (typeof(arguments[1]) == 'function'))) {
                    methodsPrivate.addError('setModuleCallback', 'type 2 arguments is not function');
                } else {
                    if (obj.__plugins[arguments[0]] === undefined) {
                        methodsPrivate.addError('setModuleCallback', 'plugin "' + arguments[0] + '" is not defined');
                    } else {
                        obj.__plugins[arguments[0]].callback = arguments[1];
                        return true;
                    }
                }
            } else {
                methodsPrivate.addError('setModuleCallback', 'the number of arguments is not equal to two');
            }
            methodsPrivate.printError();

            return false;
        },

        setModuleOption: function () {
            if (arguments.length == 2) {
                if (!((arguments[0] !== null) && (typeof(arguments[0]) == 'string'))) {
                    methodsPrivate.addError('setModuleOption', 'type 1 arguments is not string');
                } else if (!((arguments[1] !== null) && ($.isArray(arguments[1]) || (typeof(arguments[1]) == 'object')))) {
                    methodsPrivate.addError('setModuleOption', 'type 2 arguments is not array|object');
                } else {
                    if (obj.__plugins[arguments[0]] === undefined) {
                        methodsPrivate.addError('setModuleOption', 'plugin "' + arguments[0] + '" is not defined');
                    } else {
                        obj.__plugins[arguments[0]].option = arguments[1];
                        return true;
                    }
                }
            } else {
                methodsPrivate.addError('setModuleOption', 'the number of arguments is not equal to two');
            }
            methodsPrivate.printError();

            return false;
        },

        getModuleOption: function (name) {
            if (!((name !== null) && (typeof(name) == 'string'))) {
                methodsPrivate.addError('getModuleOption', 'type "name" is not string');
            } else if (obj.__plugins[name] === undefined) {
                methodsPrivate.addError('getModuleOption', 'plugin "' + name + '" is not defined');
            } else {
                return obj.__plugins[name].option;
            }

            methodsPrivate.printError();

            return false;
        }

    };

    var methodsPublic = {

        module: function () {
            if (arguments !== undefined) {
                switch (arguments.length) {
                    case 1:
                        if (methodsPrivate.setModuleOption(arguments[0], {})) {
                            return methodsPrivate.getModule(arguments[0]);
                        }
                        break;

                    case 2:
                        if ((arguments[1] !== null) && ($.isArray(arguments[1]) || (typeof(arguments[1]) == 'object'))) {
                            if (methodsPrivate.setModuleOption.apply(this, arguments)) {
                                return methodsPrivate.getModule(arguments[0]);
                            }
                        } else {
                            return methodsPrivate.addModule.apply(this, arguments);
                        }
                        break;

                    default:
                        methodsPrivate.addError('module', 'arguments error');
                }
            } else {
                methodsPrivate.addError('module', 'arguments undefined');
            }
            methodsPrivate.printError();
        },

        issetModule: function (name) {
            if (!((name !== null) && (typeof(name) == 'string'))) {
                methodsPrivate.addError('issetModule', 'type "name" is not string');
            } else if (obj.__plugins[name] !== undefined) {
                return true;
            }
            return false;
        },

        setSelectorBlock: function (selector, settings) {

            var selectorThis = (typeof(selector) == 'object' && selector instanceof jQuery) ? selector : $(selector);

            if (selectorThis.length == 0) {
                return false;
            }

            if (selectorThis.length > 1) {
                selectorThis.each(function () {
                    $.shimba($(this)).module(currentPlugin, settings);
                });
                return false;
            }

            return selectorThis;
        },

        settings: function () {
            return obj.__settings;
        },

        clickHandler: function () {
            return ('ontouchstart' in document.documentElement ? "click touchstart touchend" : "click");
        },

        loadScript: function (url, callback) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.async = true;

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    };

    $.shimba = function (varible) {
        var options = {};
        if (varible !== undefined) {
            if (typeof(varible) == 'object') {
                if (varible instanceof jQuery) {
                    selector = varible;
                } else {
                    options = varible;
                }
            } else if (typeof(varible) == 'string') {
                selector = varible;
            } else {
                $.error('error type');
            }
        }

        obj.__settings = $.extend(obj.__settings, options);
        obj = $.extend(obj, methodsPublic);

        return obj;
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }
}));