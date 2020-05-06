/* eslint-disable no-unused-vars */
const { Then } = require("cucumber");
const expect = require("chai").expect;
const scope = require("../support/scope");
const landingPage = require("../pages/LandingPage");
const reportingPage = require("../pages/Reporting");
const helper = require("../support/Helper");
const orderingPage = require("../pages/OrderingPage");
const moment = require("moment-timezone");

let  singleDayitems ;
let  reportingSingleDayitems ;

Then("Click on Reporting tab", async () => {
    await landingPage.clickReportingButton();
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
});


Then("Select All Daily Items in Reporting Page", async () => {

    var daily = await orderingPage.GetSingleDayItems();
    for (var c = 1; c < daily.length; c++) {
        scope.driver.executeScript("arguments[0].scrollIntoView(true);", daily[c]);
        await helper.sleep(500);
        daily[c].click();
    }
});

Then("Select All MultiDay Items in Reporting Page", async () => {
    await helper.sleep(10000);
    var daily = await orderingPage.GetMultiDayItems();
    
    for (var m = 1; m < daily.length; m++) {
        await helper.sleep(500);
        daily[m].click();
    }
});

Then("Wait for Spinner to close", async () => {
    await reportingPage.WaitforReportingSpinnerToClose();
});

Then("Verify the default Date set to OrderWindow Date", async () => {

    var date = await reportingPage.GetCurrentDateFromTextBox();
    var time = parseInt(moment().tz(scope.timeZone).format("HH"));

    if(time >= 10) {
        expect(date).to.be.contains(moment().tz(scope.timeZone).add(1, "days").format("MM/DD/YYYY"));
    } else {
        expect(date).to.be.contains(moment().tz(scope.timeZone).format("MM/DD/YYYY"));
    }
});

Then("Get the all items names and Order Quantity", async () => {
    await orderingPage.ClickOnUpArrow();
    singleDayitems = await orderingPage.GetAllItemsNameAndOrderQty();
    singleDayitems.item.forEach(function (data) {
        console.log("Order Details Page Items : " + data.Name);
        console.log("Order Details Page Order Qty : " + data.OrderQty);
    });
});

Then("Get reporting details by Item for Single day items", async () => {
    reportingSingleDayitems = await reportingPage.GetallSingleDayItems();
    reportingSingleDayitems.item.forEach(function (data) {
        console.log("Ordering Page Items : " + data.Name);
        console.log("Ordering Page OrderQty : " + data.OrderQty);
    });
    
});

Then("Get reporting details by Item for Multiday items", async () => {
    reportingSingleDayitems = await reportingPage.GetallMultiDayItems();
    reportingSingleDayitems.item.forEach(function (data) {
        console.log("Ordering Page Items : " + data.Name);
        console.log("Ordering Page OrderQty : " + data.OrderQty);
    });
    
});

Then("Select the last week date from datepicker", async () => {
    await helper.sleep(10000);
    await reportingPage.WaitForMultiDaySpinnertoClose();
    await reportingPage.ClickDateFromTextBox();
    await helper.sleep(1000);
    var time = moment().add(-2, "days").format("ddd MMM DD YYYY");
    await reportingPage.SelectDate(time);
    await reportingPage.WaitForMultiDaySpinnertoClose();
    var noofRows = await reportingPage.getNoOfRowsinReportingGrid();
    console.log("No of Rows " + noofRows);
    expect(noofRows).to.be.greaterThan(0);
});