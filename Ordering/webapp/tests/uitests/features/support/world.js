/* eslint-disable no-undef */
const { setWorldConstructor, setDefaultTimeout } = require("cucumber");
const { existsSync, mkdirSync } = require("fs");
var webdriver = require("selenium-webdriver");
var scope  = require("./scope");
// eslint-disable-next-line no-unused-vars
var path = require("chromedriver").path;
var chrome = require("selenium-webdriver/chrome");
const until = webdriver.until;
const By = webdriver.By;
var platform =  "CHROME"; //process.env.PLATFORM || "CHROME";
const config = require("./Config.json");
const logging = require("selenium-webdriver/lib/logging");

var buildAndroidDriver = function() {
    return new Builder().
        usingServer("http://localhost:4723/wd/hub").
        withCapabilities({
            platformName: "Android",
            platformVersion: "9",
            deviceName: "emulator-5554",
            browserName: "Chrome"
        }).
        build();
};

var buildIosDriver = function(){
    return new Builder().
        usingServer("http://localhost:4723/wd/hub").
        withCapabilities({
            platformName: "iOS",
            platformVersion: "10.0",
            deviceName: "iPhone 6",
            browserName: "safari"
        }).
        build();
};

var buildChromeDriver = function() {
    //var service = new chrome.ServiceBuilder(path).build();
    //chrome.setDefaultService(service);

    var options = new chrome.Options();
    options.addArguments("--window-size=1040,800");
    options.excludeSwitches("enable-automation");
    options.addArguments("incognito");
    options.excludeSwitches("load-extension");
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");

    // if(process.env.headless  == "true") {
    //     options.addArguments("--headless");
    // }
    
    // FOr logging Console and performance errors
    var prefs = new webdriver.logging.Preferences();
    prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
    prefs.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.WARNING);
    options.setLoggingPrefs(prefs);
   
    //Start browser in Maximized mode using below option
    //options.addArguments("start-maximized");

    //Disable pop ups using below option
    //options.addArguments("disable-popup-blocking");

    //disable developer extension using below option
    //options.addArguments("chrome.switches","–disable-extensions");

    //security warning is disabled using below option
    //options.addArguments("test-type");

    return new webdriver.Builder().
        withCapabilities(options.toCapabilities()).build();
};

switch(platform) {
case "ANDROID":
    var driver = buildAndroidDriver();
    break;
case "IOS":
    driver = buildIosDriver();
    break;
default:
    driver = buildChromeDriver();
    
}

var getDriver = function() {
    return driver;
};

const World = function() {

    var defaultTimeout = 60000;
    var screenshotPath = "screenshots";
    scope.context = {};
    scope.webdriver = webdriver;
    scope.driver = driver;
    scope.platform = platform;
    const currentEnv = process.env.ENVIRONMENT || process.env.Environment; 

    console.log(currentEnv);

    config.environments.forEach(function(env) {
        if(env.Environment == "QA") {
            scope.URL = env.BOSSURL + env.StoreNo + "/" + env.UserId;
            scope.API = env.APIURL;
            scope.APIKEY = env.APIKEY;
            scope.StoreNumber = env.StoreNo;
            scope.timeZone = env.TimeZone;
        }
    });
 
    console.log(scope.URL);
    
    if(!existsSync(screenshotPath)) {
        mkdirSync(screenshotPath);
    }

    scope.driver.get(scope.URL);

    scope.waitFor = function(cssLocator, timeout) {
        var waitTimeout = timeout || defaultTimeout;
        return driver.wait(function() {
            return  until.elementsLocated(By.className(cssLocator));
        }, waitTimeout);
    };
};

setWorldConstructor(World);
setDefaultTimeout(600 * 1000);
module.exports.World = World;
module.exports.getDriver = getDriver;
