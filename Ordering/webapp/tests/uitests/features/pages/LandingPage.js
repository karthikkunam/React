
var scope = require("../support/scope");
var webdriver = require("selenium-webdriver");
const helper = require("../support/Helper");
var until = webdriver.until;
const By = webdriver.By;

//const PlacdeOrderSelector = '.isp-home-img-ordering';
const PlacdeOrderSelector = "landing";
const ReportingSelector = "report";
const SupportFunctionsSelector = "store-function";
const HomeButtonSelector = "vertical-tab-one-tab";
const OrderingHeaderSelector = "ordering-heading";
const StoreOrderErrorsSelector = "supportfunctions/storeordererrors";
const SpinnerSelector = "item-detail-spinner";
const MaskSelector = ".modal .fade";
const homePageSpinner = "ordering-home-spinner";

const clickPlaceOrderButton = async () => {
    scope.driver.wait(until.elementLocated(By.name(PlacdeOrderSelector)));
    return await scope.driver.findElement(By.name(PlacdeOrderSelector)).click();
};

const clickReportingButton = async () => {
    scope.driver.wait(until.elementLocated(By.name(ReportingSelector)));
    return await scope.driver.findElement(By.name(ReportingSelector)).click();
};

const clickSupportFunctionsButton = async () => {
    scope.driver.wait(until.elementLocated(By.name(SupportFunctionsSelector)));
    return await scope.driver.findElement(By.name(SupportFunctionsSelector)).click();
};

const clickHomeButton = async () => {
    scope.driver.wait(until.elementLocated(By.id(HomeButtonSelector)));
    return await scope.driver.findElement(By.id(HomeButtonSelector)).click();
};

const OrderingHeaderLabel = async () => {
    scope.driver.wait(until.elementLocated(By.className(OrderingHeaderSelector)));
    return await scope.driver.findElement(By.className(OrderingHeaderSelector)).getText().then(function (text) {
        return text;
    });
};

const ClickStoreOrderErrors = async () => {
    scope.driver.wait(until.elementLocated(By.name(StoreOrderErrorsSelector)));
    return await scope.driver.findElement(By.name(StoreOrderErrorsSelector)).click();
};

const ItemDetailsSpinnerToClose = async () => {
    try {
        await scope.driver.wait(() => {
            return scope.driver.findElements(By.className(SpinnerSelector)).then(function (found) {
                //console.log( " Spinner - : " + found.length);
                return found.length === 0;
            });
        }, 180000, "The element should disappear");

    }
    catch (message) {
        //console.log(error);
    }
};

const WaitForHomePageSpinnertoClose = async () => {
    try {
        await scope.driver.wait(() => {
            return scope.driver.findElements(By.className(homePageSpinner)).then(function (found) {
                //console.log( " Spinner - : " + found.length);
                return found.length === 0;
            });
        }, 180000, "The element should disappear");

    }
    catch (message) {
        //console.log(error);
    }
};

const WaitForMaskToClose = async () => {

    try {
        await scope.driver.wait(() => {
            return scope.driver.findElements(By.css(MaskSelector)).then(function (foundmask) {
                helper.sleep(500);
                //console.log("mask " + foundmask.length);
                return foundmask.length === 0;
            });
        }, 180000, "The element should disappear");

    }
    catch (message) {
        //console.log(error);
    }
};

const WaitforSpinnerToClose = async () => {
    await helper.sleep(2000);
    await WaitForHomePageSpinnertoClose();
    await ItemDetailsSpinnerToClose();
    await WaitForMaskToClose();
};

module.exports = {
    clickPlaceOrderButton,
    clickReportingButton,
    clickSupportFunctionsButton,
    clickHomeButton,
    OrderingHeaderLabel,
    ClickStoreOrderErrors,
    WaitforSpinnerToClose,
    ItemDetailsSpinnerToClose
};