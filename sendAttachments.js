var fs = require('fs');
var nodemailer = require('nodemailer');

exports.create = function (config, to, files) {
    this.callback = null;
    this.transporter = nodemailer.createTransport(config);
    that.files = files;
    this.mailOptions = {
        from: config.auth.user,
        to: to,
        attachments: []
    };
    this.attachmentCount = 0;
    this.addAttachment = function (filename, content) {
        this.mailOptions.attachments.push({'filename': filename, 'content': content});
        this.attachmentCount = this.attachmentCount + 1;
    };

    this.sendMail = function () {
        this.transporter.sendMail(this.mailOptions, this.callback);
    };

    this.readFileAndSend = function () {
        for (var i = 0; i < this.files.length; i++) {
            var that = this;
            var file = this.files[i]
            var fun = function (err, data) {
                that.addAttachment(file.name, data);
                if (that.attachmentCount === that.files.length) {
                    that.sendMail();
                }
            };
            fs.readFile(file.path, 'utf8', fun);
        }
    };

    var that = this;
    return {
        send: function (callback) {
            that.callback = callback;
            that.readFileAndSend();
        }
    }
};


