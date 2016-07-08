/*!
 * Bootstrap Fileselect v1.2.1
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
                    'numberOfFiles': 'The number of uploadable files is limited to [num] file(s)',
                    'fileExtensions': 'The files are restricted to following file extensions: [ext]',
                    'fileSize': 'The file size is limited to [size]',
                }
            },
            'de': {
                'browse': 'Durchsuchen',
                'rules': {
                    'numberOfFiles': 'Die Anzahl der hochladbaren Dateien ist limitiert auf [num] Datei(en)',
                    'fileExtensions': 'Die Dateien sind eingeschränkt auf folgende Dateierweiterungen: [ext]',
                    'fileSize': 'Die Grösse ist eingeschränkt auf [size] pro Datei',
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
            allowedFileSize: false,
            allowedFileExtensions: false,
            allowedNumberOfFiles: false,
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

            if (this.validateNumberOfFiles(files) && this.valiateFileExtensions(files) && this.validateFileSize(files)) {
                this.$labelInput.val(label);
                return true;
            }
            this.$fileInput.val(null);
            return false;
        },
        loadConfig: function () {
            var config = $.extend({}, this.defaults, this.options, this.metadata);
            if (typeof config.allowedFileExtensions === 'string') {
                config.allowedFileExtensions = config.allowedFileExtensions.split(',');
            }
            return config;
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
        validateNumberOfFiles: function (files) {
            if (this.config.allowedNumberOfFiles && files.length > parseInt(this.config.allowedNumberOfFiles)) {
                alert(this.translations.rules.numberOfFiles.replace('[num]', this.config.allowedNumberOfFiles));
                return false;
            }
            return true;
        },
        valiateFileExtensions: function (files) {
            var result = true;
            if (this.config.allowedFileExtensions) {
                $.each(files, $.proxy(function (i, file) {
                    var fileExtension = file.name.replace(/^.*\./, '').toLowerCase();
                    if ($.inArray(fileExtension, this.config.allowedFileExtensions) === -1) {
                        alert(this.translations.rules.fileExtensions.replace('[ext]', this.config.allowedFileExtensions.join(', ')));
                        result = false;
                        return result;
                    }
                }, this));
            }
            return result;
        },
        validateFileSize: function (files) {
            var result = true;
            if (this.config.allowedFileSize) {
                $.each(files, $.proxy(function (i, file) {
                    if (file.size > this.config.allowedFileSize) {
                        alert(this.translations.rules.fileSize.replace('[size]', Math.round(this.config.allowedFileSize / 1024 / 1024) + 'MB'));
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
