var helper = require('sendgrid').mail;
const async = require('async');

function sendEmail(
  parentCallback,
  fromEmail,
  toEmails,
  subject,
  textContent,
  htmlContent
) {
  const errorEmails = [];
  const successfulEmails = [];
  const sg = require('sendgrid')('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');//This API Key needs to be generated from the SendGrid account.
  async.parallel([
    function (callback) {
      // Add to emails
      for (let i = 0; i < toEmails.length; i += 1) {
        // Add from emails
        const senderEmail = new helper.Email(fromEmail);
        // Add to email
        const toEmail = new helper.Email(toEmails[i]);
        // HTML Content
        const content = new helper.Content('text/html', htmlContent);
        const mail = new helper.Mail(senderEmail, subject, toEmail, content);
        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });
        sg.API(request, function (error, response) {
          console.log('SendGrid');
          if (error) {
            console.log('Error response received');
          }
          console.log(response.statusCode);
          console.log(response.body);
          console.log(response.headers);
        });
      }
      // return
      callback(null, true);
    }
  ], function (err, results) {
    console.log('Done');
  });
  parentCallback(null, {
    successfulEmails: successfulEmails,
    errorEmails: errorEmails,
  });
}

module.exports = (app) => {
  app.post('/api/send', function (req, res, next) {
    async.parallel([
      function (callback) {
        sendEmail(
          callback,
          //from mail
          'aman5dav@gmail.com',
          //to emails(is an array)
          ['amandeep.rikhi@cygrp.com'],
          //Subject Line
          'TESTING IT AGAIN',
          'Text Content',
          //Email Body HTML goes here
          '<p style="font-size: 32px;">TESTING IT AGAIN</p>'
        );
      }
    ], function (err, results) {
      res.send({
        success: true,
        message: 'Emails sent',
        successfulEmails: results[0].successfulEmails,
        errorEmails: results[0].errorEmails,
      });
    });
  });
};
