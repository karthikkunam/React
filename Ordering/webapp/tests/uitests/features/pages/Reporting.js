
const helper = require("../support/Helper");
const scope = require("../support/scope");
var webdriver = require("selenium-webdriver");
const By = webdriver.By;
const landingPage = require("../pages/LandingPage");

const DatePickerText = "date-picker-text-box";
const DailySpinner = "daily-spinner";
const MultiSpinner = "item-detail-spinner";
const singleDayItemSelector = "tr-cat";


const GetCurrentDateFromTextBox = async() => {
    return await helper.findElementByClassName(DatePickerText).then(function(date) {
        return date.getAttribute("value");
    }, function() {
        return null;
    });
};

const ClickDateFromTextBox = async() => {
    return await helper.findElementByClassName(DatePickerText).then(function(date) {
        return date.click();
    }, function() {
        return null;
    });
};

const SelectDate= async(text) => {
    return await helper.findElementsByClassName("DayPicker-Day").then(function(dates)  {
        for(var i=0;i <dates.length; i++) {
            return dates[i].getAttribute("aria-label").then(async(label) => { 
                if(label) {
                    text = text.replace(/\s/g, "");
                    label = label.replace(/\s/g, "");
                    if(label.includes(text)) {
                        await dates[i].click();
                        await helper.sleep(5000);
                        return true;
                    }
                }
            });
        }
    }, function() {
        return null;
    });
};

const WaitForDailySpinnertoClose = async () => {
    try {
        await scope.driver.wait(() => {
            return scope.driver.findElements(By.className(DailySpinner)).then(function (found) {
                return found.length === 0;
            });
        }, 180000, "The element should disappear");

    }
    catch (message) {
        //console.log(error);
    }
};

const WaitForMultiDaySpinnertoClose = async () => {
    try {
        await scope.driver.wait(() => {
            return scope.driver.findElements(By.className(MultiSpinner)).then(function (found) {
                return found.length === 0;
            });
        }, 180000, "The element should disappear");

    }
    catch (message) {
        //console.log(error);
    }
};

const WaitforReportingSpinnerToClose = async () => {
    await helper.sleep(2000);
    await WaitForDailySpinnertoClose();
    await landingPage.ItemDetailsSpinnerToClose();
};

const GetallMultiDayItems= async() => {
   
    var singleDayitems = {
        item: []
    };

    return await helper.findElementsByClassName("deatailsTd-first").then(async(Items) => {
        for(var k=0;k<Items.length; k++) {
            var sitem = {};
            sitem["Name"] = await Items[k].findElement(By.className("deatailsTd-other")).then(function(name) {
                return name.getText();
            });

            // await Items[k].findElements(By.className("cat-forecast-period")).then(async(forecast) => {
            //     for(var i=0;i<forecast.length;i++) {
            //         sitem["Forecast" + (parseInt(i)+1)] = await forecast[i].getText();
            //     }
            // });

            sitem["OrderQty"] = await Items[k].findElements(By.tagName("td")).then(async(name) => {
                var length = await name.length;
                console.log("Length of td : " + length);
                return name[length-1].getText();
            });

            singleDayitems.item.push(sitem);
        }
        return singleDayitems;
    }, function() {
        return null;
    });
};


const getNoOfRowsinReportingGrid = async() => {
    return await helper.findElementsByClassName("reporting-cat-item-detail").then(async(Items) => {
        return await Items.length;
    });
};

const GetallSingleDayItems = async() => {
   
    var singleDayitems = {
        item: []
    };

    return await helper.findElementsByClassName(singleDayItemSelector).then(async(Items) => {
        for(var k=0;k<Items.length; k++) {
            var sitem = {};
            sitem["Name"] = await Items[k].findElement(By.className("deatailsTd-other")).then(function(name) {
                return name.getText();
            });

            // await Items[k].findElements(By.className("cat-forecast-period")).then(async(forecast) => {
            //     for(var i=0;i<forecast.length;i++) {
            //         sitem["Forecast" + (parseInt(i)+1)] = await forecast[i].getText();
            //     }
            // });

            sitem["OrderQty"] = await Items[k].findElement(By.className("orderQuantity")).then(function(name) {
                return name.getText();
            });

            singleDayitems.item.push(sitem);
        }
        return singleDayitems;
    }, function() {
        return null;
    });
};

module.exports = {
    GetCurrentDateFromTextBox,
    GetallSingleDayItems,
    WaitforReportingSpinnerToClose,
    GetallMultiDayItems,
    ClickDateFromTextBox,
    WaitForMultiDaySpinnertoClose,
    SelectDate,
    getNoOfRowsinReportingGrid
};