/**
 * Created by sulvto on 16-4-7.
 */
app.controller('mainController', function () {
    function Send() {
        var files = document.getElementById("file").files;
        var sendFiles = [];
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];
            sendFiles.push({
                "name": file.name,
                "path": file.path,
                "size": file.size,
                "type": file.type
            });
        }
        ipcRenderer.send('asynchronous-message', {
            "files": sendFiles,
            "to": document.getElementById("email").value,
            "config": config
        });
    }
});