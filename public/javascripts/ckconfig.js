/**
 * Created by jacksay on 27/10/17.
 */
CKEDITOR.editorConfig = function(config){
    config.toolbar = [
            {
                name: 'clipboard',
                items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
            },
            {name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Indent', 'Outdent', '-', 'Blockquote']},
            {name: 'links', items: ['Link', 'Unlink']},
            '/',
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'CopyFormatting', 'RemoveFormat']},
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']}

        ];
}
