/*!
 * Bootstrap Fileselect v1.1
 * https://github.com/Neoflow/Bootstrap-Fileselect
 *
 * Released under the MIT license
 * https://github.com/Neoflow/Bootstrap-Fileselect/blob/master/LICENSE.md
 */
(function (window, $) {

    var Fileselect = function (fileInput, options) {
        this.$fileInput = $(fileInput);
        this.options = options;
        this.metadata = this.$fileInput.data();
        this.$inputGroup = $('<div>').addClass('input-group');
        this.$inputGroupBtn = $('<label>').addClass('input-group-btn');
        this.$browseBtn = $('<span>');
        this.$labelInput = $('<input>').attr('type', 'text').attr('readonly', true).addClass('form-control');
        this.translations = {
            'en': {
                'browse': 'Browse',
                'rules': {
                    'limit': 'The number of uploadable files is limited to [num] file(s)',
                    'filelimit': 'The files are restricted to following file extensions: [ext]'
                }
            },
            'de': {
                'browse': 'Durchsuchen',
                'rules': {
                    'limit': 'Die Anzahl der hochladbaren Dateien ist limitiert auf [num] Datei(en)',
                    'extensions': 'Die Dateien sind eingeschränkt auf folgende Dateierweiterungen: [ext]',
                }
            }
        };
    };
    Fileselect.prototype = {
        defaults: {
            browseBtnClass: 'btn btn-primary',
            browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
            limit: false,
            extensions: false,
            language: false
        },
        init: function () {
            this.config = this.loadConfig();
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
                this.$browseBtn.prepend(this.config.browseIcon, '&nbsp;&nbsp;');
            }

            this.$fileInput.on('change', $.proxy(this.changeEvent, this));

            return this;
        },
        changeEvent: function (e) {
            var files = this.$fileInput[0].files,
                    label = $.map(files, function (file) {
                        return file.name;
                    }).join(', ');

            if (this.validateLimit(files) && this.valiateExtensions(files)) {
                this.$labelInput.val(label);
                return true;
            }
            this.$fileInput.val(null);
            return false;
        },
        loadConfig: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            if (typeof this.config.extensions === 'string') {
                this.config.extensions = this.config.extensions.split(',');
            }
        },
        loadTranslation: function () {
            var userLanguage = this.config.language || navigator.language || navigator.userLanguage,
                    translatedLanguages = $.map(this.translations, function (translations, key) {
                        return key;
                    });

            if ($.inArray(userLanguage, translatedLanguages) === -1) {
                userLanguage = 'en';
            }
            return this.translations[userLanguage];
        },
        validateLimit: function (files) {
            if (this.config.limit && files.length > parseInt(this.config.limit)) {
                alert(this.translations.rules.limit.replace('[num]', this.config.limit));
                return false;
            }
            return true;
        },
        valiateExtensions: function (files) {
            var result = true;
            if (this.config.extensions) {
                $.each(files, $.proxy(function (i, file) {
                    var fileExtension = file.name.replace(/^.*\./, '').toLowerCase();
                    if ($.inArray(fileExtension, this.config.extensions) === -1) {
                        alert(this.translations.rules.extensions.replace('[ext]', this.config.extensions.join(', ')));
                        result = false;
                        return result;
                    }
                }, this));
            }
            return result;
        }
    };

    Fileselect.defaults = Fileselect.prototype.defaults;

    $.fn.fileselect = function (options) {
        return this.each(function () {
            new Fileselect(this, options).init();
        });
    };

    window.Fileselect = Fileselect;
})(window, jQuery);
