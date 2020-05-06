var fs = require("fs");
var path = require("path");
var sanitize = require("sanitize-filename");
const { After, Before, AfterAll, BeforeAll } = require("cucumber");
const scope = require("./scope");
const logging = require("./logging");
const moment = require("moment");

BeforeAll(async () => {
    if (scope.driver && scope.platform == "CHROME") {
        await scope.driver.close();
        setTimeout(() => { scope.driver.close(); }, 6000);
    }
});


Before(async () => {
    await scope.driver.executeScript("performance.clearMeasures();");
    await scope.driver.executeScript("performance.clearMarks();");
    await scope.driver.executeScript("console.clear();");
});
  

After(async (scenario) => {
    if(scenario.result.status === "failed") {
        var myObj = { status: "FAIL", credible: "false", team: "7BOSS", project: "Web",eventType:"TestcaseFinished", platform: scope.platform, name:scenario.pickle.name, module: "ordering" };
        logging.LogActivity("scenario with name " + scenario.pickle.name + " is failed",myObj);
        return scope.driver.takeScreenshot().then(async (screenshot) => {
            const decodedImage = new Buffer(screenshot.replace(/^data:image\/png;base64,/, ""), "base64");
            var time = moment().format("MMDDHHmmSS");
            fs.writeFile(path.join("screenshots", sanitize(scenario.pickle.name + "_" + time + ".png").replace(/ /g,"_")), decodedImage, "base64", async(err) => {
                if(err) console.log(err);
            });
            //scenario.attach(decodedImage, "image/png");
        });
    }
    else
    {
        myObj = { status: "PASS", credible: "false", team: "7BOSS", project: "Web", eventType:"TestcaseFinished", platform: scope.platform, name:scenario.pickle.name, module: "ordering" };
        logging.LogActivity("scenario with name " + scenario.pickle.name + " is passed",myObj);
    }
});

AfterAll(async () => {
    // If there is a browser window open, then close it
    if (scope.driver && scope.platform == "CHROME") await scope.driver.close();
//      setTimeout(() => { scope.driver.close(); }, 3000);
});

