(function (window, $) {

    var Fileselect = function (fileInput, options) {
        this.$fileInput = $(fileInput);
        this.options = options;
        this.metadata = this.$fileInput.data();
        this.$inputGroup = $('<div>', {class: "input-group"});
        this.$inputGroupBtn = $('<label>', {class: 'input-group-btn'});
        this.$browseBtn = $('<span>');
        this.$labelInput = $('<input>', {type: 'text', class: 'form-control', readyonly: true});
        this.translations = {
            'en': {
                'browse': 'Browse',
                'filelimit': 'Only [num] file(s) allowed'
            },
            'de': {
                'browse': 'Durchsuchen',
                'filelimit': 'Nur [num] Datei(en) erlaubt'
            },
        };
    };
    Fileselect.prototype = {
        defaults: {
            browseBtnClass: 'btn btn-primary',
            browseIcon: '<i class="fa fa-fw fa-folder-open"></i>',
            limit: false,
            extensions: ['jpeg']
        },
        init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this.translations = this.loadTranslation();

            this.$fileInput
                    .hide()
                    .after(this.$inputGroup);

            this.$inputGroup
                    .append(this.$inputGroupBtn, this.$labelInput);

            this.$inputGroupBtn
                    .append(this.$browseBtn)
                    .append(this.$fileInput);

            this.$browseBtn
                    .addClass(this.config.browseBtnClass)
                    .text(this.translations.browse)
                    .append(' &hellip;');

            if (this.config.browseIcon) {
                this.$browseBtn.prepend(this.config.browseIcon + ' ');
            }

            this.$fileInput.on('change', $.proxy(this.changeEvent, this));

            return this;
        },
        loadTranslation: function () {
            var userLanguage = navigator.language || navigator.userLanguage;
            if ($.inArray(userLanguage, ['en', 'de', 'fr']) === -1) {
                userLanguage = 'en';
            }
            return this.translations[userLanguage];
        },
        changeEvent: function (e) {

            var files = this.$fileInput[0].files,
                    label = $.map(files, function (file) {
                        return file.name;
                    }).join(', ');

            if (this.config.limit) {
                if (files.length > parseInt(this.config.limit)) {
                    alert(this.translations.filelimit.replace('[num]', this.config.limit));
                    this.$fileInput.val(null);
                    return false;
                }
            }

            if (this.config.extensions) {
                $.each(files, function (i, file) {
                    if ((new RegExp('(' + this.config.extensions.join('|').replace(/\./g, '\\.') + ')$')).test(file) === false) {
                        alert('this.translations.filelimit.replac');
                        return false;
                    }
                    console.log(file);
                });
            }

            this.$labelInput.val(label);
        }
    };
    Fileselect.defaults = Fileselect.prototype.defaults;
    $.fn.fileselect = function (options) {
        return this.each(function () {
            new Fileselect(this, options).init();
        });
    }
    ;
    window.Fileselect = Fileselect;
})(window, jQuery);
