//call the plugin on page load
$(function () { $.responsiveImageLoader(); });
(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "responsiveImageLoader",
            defaults = {};

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        images: [],
        currentWidth: null,

        init: function () {
            var plugin = this;
            plugin.loadData();
            plugin.checkImages($(window).innerWidth());
            
            
            //set window resize event to load bigger images if needed
            var resizeTimer;
            $(window).resize(function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () { plugin.checkImages($(window).innerWidth()); }, 200);
            });
        },
        loadData: function () {
            
            //loop trough all attributes to find matching images and sizes and create an array
            //also load image on current window width
            var plugin = this;
            $(".responsive-image").each(function () {
                var $this = $(this);
                $this.data = [];
                $this.currentLoadedWidth = -1;
                var attributesFound = false;
                $.each(this.attributes, function (i, attr) {
                    if (/^data-ri-[0-9]*-.*$/.test(attr.name)) {
                        attributesFound = true;
                        var data = new Object();
                        var regex = /data-ri-([0-9]*)-(.*)/;
                        var match = regex.exec(attr.name);
                        if (match != null) {
                            data.width = match[1];
                            if (!$this.type) $this.type = match[2];
                            data.url = attr.value;
                            $this.data[$this.data.length] = data;
                        }
                    };
                });
                plugin.images[plugin.images.length] = $this;
            });
        },
        checkImages: function (windowWidth) {
            for (var i = 0; i < this.images.length; i++) {
                var image = this.images[i];
                var type = image.type;
                var url = "";
                var loadWidth = 0;
                for (var u = 0; u < image.data.length; u++) {
                    var data = image.data[u];
                    if (windowWidth > data.width && windowWidth > image.currentLoadedWidth) {
                        loadWidth = data.width;
                        url = data.url;
                    }
                }
                if (url != "") this.updateImages(image, type, url, loadWidth);
            }
        }, 
        updateImages: function (image, type, url, loadWidth) {
            image.currentLoadedWidth = loadWidth;
            if (type == "src") {
                if (image.attr("src") != url) image.attr("src", url);
            } if (type == "background") {
                var url = "url('" + url + "')";
                if (image.css("background-image") != url) image.css("background-image", url);
            }
        },

    });


    $[pluginName] = function (options) {
        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new Plugin(options));
        }
    };

})(jQuery, window, document);
