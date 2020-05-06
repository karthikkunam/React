const sendmail = require("sendmail")({silent: true});
const moment = require("moment-timezone");

sendmail({
    from: "do-not-reply@7-11.com",
    to: "gopalkrishna.ponugupati@7-11.com",
    subject: "Ordering UI Automation Report - " + moment().format("MM-DD-YYYY"),
    html: "Ordering UI Automation Report - " + moment().format("MM-DD-YYYY"),
    attachments: [
        {   
            filename: "report.html",
            path: "reporter\\cucumber_reporter.html"
        }]
}, function (err) {
    console.log(err && err.stack);
});