'use strict';
tinymce.init({
    selector: '#textTextArea',
    inline: false,
    contextmenu_never_use_native: true,
    toolbar: 'fontsize fontfamily bold italic underline alignleft aligncenter alignright alignjustify outdent indent',
    toolbar_mode: "sliding",
    menubar: false,
    plugins: [ "autosave", "code"],
    height: "100%",
    width: "100%",
    toolbar_persist: true,
    promotion: false,
    resize: false,
    license_key: 'gpl',
    paste_data_images: true,
    paste_remove_styles_if_webkit: false,
    statusbar: false,
    setup: (editor) => {
        editor.addShortcut("meta+q", "clear all", () => {
            allInOneFunction()
        })
    }
});