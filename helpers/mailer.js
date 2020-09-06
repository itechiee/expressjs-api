var handlebars = require('handlebars');
var fs = require('fs');
var smtpTransport = require('./mailConfig');
var {readHTMLFile} = require('./utils');

module.exports = {
    sendForgetPasswordMail: function (mailData, res) {
        readHTMLFile(process.cwd() + '/views/template/forget_password.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                username: mailData.username,
                pin: mailData.pin
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: process.env.MAIL_FROM,
                to : mailData.email,
                subject : 'OTP for Forget Password',
                html : htmlToSend
            };
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    throw error;
                    // callback(error);
                }
                smtpTransport.close();
                return res.send(JSON.stringify({"status": 200, "error": null, "response": 'OTP sent successfully' }));
            });
        });
    }
}