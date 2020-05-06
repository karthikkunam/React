const { When, Then } = require("cucumber");
const moment = require("moment-timezone");
const expect = require("chai").expect;
const scope = require("../support/scope");
const landingPage = require("../pages/LandingPage");
const helper = require("../support/Helper");
const orderingPage = require("../pages/OrderingPage");
var webdriver = require("selenium-webdriver");
var Datasetup = require("../support/DataSetup");
const By = webdriver.By;

let remainingOrderStatus = true;
let itemDetails;
let count = 0;
let totalAvilableItems = 0;

When("You are in BOSS home page", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    var text = await orderingPage.ModalText();

    if (text && (text.includes("Are you sure you want to exit") || text.includes("Order quantity is less than the MIN quantity"))) {
        await orderingPage.ReviewPageYesButton();
    } else {
        await orderingPage.ReviewPageNoButton();
    }

    await landingPage.clickHomeButton();
    await helper.sleep(1000);	
    text = await orderingPage.ModalText();

    if (text && (text.includes("Are you sure you want to exit") || text.includes("Order quantity is less than the MIN quantity"))) {
        await orderingPage.ReviewPageYesButton();
    } else {
        await orderingPage.ReviewPageNoButton();
    }

    await landingPage.clickHomeButton();
});

Then("Check only Daily checkbox for selecting single day item", async () => {
    await orderingPage.SelectMultiDay();
    await orderingPage.ClickNonDailyCheckbox();
});

Then("Select All Daily Items", async () => {
    
    scope.remain = await orderingPage.GetTotalRemainingOrdersForDaily();
    remainingOrderStatus = Boolean(await orderingPage.GetOrderRemainingItemsState());
    totalAvilableItems = scope.remain;
    
    if (scope.remain == 0 && remainingOrderStatus == true) {
        await orderingPage.ToggleReminingItemsButton();
        await orderingPage.ClickOnAllRadioButton();
        totalAvilableItems = await orderingPage.GetTotalAvilableOrdersForDaily();

        // eslint-disable-next-line require-atomic-updates
        scope.remain = await orderingPage.GetTotalRemainingOrdersForDaily();
    }

    if (remainingOrderStatus == false) {
        totalAvilableItems = await orderingPage.GetTotalAvilableOrdersForDaily();
    }

    var daily = await orderingPage.GetSingleDayItems();
    for (var c = 1; c < daily.length; c++) {
        scope.driver.executeScript("arguments[0].scrollIntoView(true);", daily[c]);
        await helper.sleep(500);
        daily[c].click();
    }
});

Then("Click on Continue Button", async () => {
    await helper.sleep(500);
    await orderingPage.ClickOnContinueButton();
    await helper.sleep(500);
    await landingPage.WaitforSpinnerToClose();
});

Then("Close the Chevron", async () => {
    await helper.sleep(2000);
    await orderingPage.ClickOnUpArrow();
});

Then("Open the Chevron", async () => {
    await helper.sleep(2000);
    await orderingPage.ClickOnDownArrow();
});


Then("Click on No Button", async () => {
    await helper.sleep(500);
    await orderingPage.ReviewPageNoButton();
    await landingPage.WaitforSpinnerToClose();
});

// Then("Get the required Item details from the Service", async () => {
//     var itemName = await orderingPage.GetActiveItemName();
//     console.log("itenm Name" + itemName);
//     expect(itemName).not.to.be.empty;

//     itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
// });

Then("Get the required Item details from the Service for {string}", async (string) => {
    var itemName = await orderingPage.GetActiveItemName();
    expect(itemName).not.to.be.empty;

    if(string == "Daily") {
        itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
    } else if(string == "NonDaily") {
        itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
    } else if(string == "MultiDaily") {
        itemDetails = await Datasetup.GetMultiDayItemDetails(itemName);
    } else if(string == "NonDailyGR") {
        itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    }
});

Then("Verify Tooltip for the Item", async () => {
    var item = await orderingPage.GetActiveItem();
    var tooltipText = await orderingPage.GetTooltipText(item);
    if(itemDetails.storeRank) {
        expect(tooltipText["storeRank"].trim()).to.be.equals(itemDetails.storeRank.toString().trim());
    }

    if(itemDetails.marketRank) {
        expect(tooltipText["marketRank"].trim()).to.be.equals(itemDetails.marketRank.toString().trim());
    }

    expect(tooltipText["registrationStatus"]).to.be.equals(itemDetails.registrationStatus);
    expect(tooltipText["retailPrice"]).to.be.contains(itemDetails.retailPrice);
    //expect(tooltipText["isBillBackAvailable"]).to.be.equals(itemDetails.isBillBackAvailable);
    if(tooltipText["itemStatus"]) {
        expect(tooltipText["itemStatus"].trim()).to.be.equals(itemDetails.itemStatus);
    }

    if(itemDetails.itemLongName) {
        expect(tooltipText["ItemDescription"].trim()).to.be.equals(itemDetails.itemLongName.toString().trim());
    }

    if(itemDetails.leadTime){
        expect(tooltipText["leadTime"]).to.be.equals(itemDetails.leadTime);
    }

    if(itemDetails.shelfLife){
        expect(itemDetails.shelfLife).to.be.contains(tooltipText["shelfLife"].trim());
    }
    expect(tooltipText["UPC"].trim()).to.be.equals(itemDetails.UPC);
    expect(tooltipText["ItemNumber"].trim()).to.be.equals(itemDetails.itemId.toString().trim());
    

    var itemName = await orderingPage.OrderQuantityTextBox();
    await orderingPage.MoveCursor(itemName[0]);
});

Then("Verify Cursor if defaulted to order quantity text box", async () => {
    var order = await orderingPage.OrderQuantityTextBox();
    order = order[0];
    expect(await webdriver.WebElement.equals(order, scope.driver.switchTo().activeElement())).to.be.true;
    scope.driver.switchTo().defaultContent();
});

Then("If remaining Orders are more than Zero, Enter Zero in Order text box then click on Enter Key", async () => {
    var order = await orderingPage.OrderQuantityTextBox();
    for (var i = 0; i < order.length; i++) {
        var val = await orderingPage.GetOrderQuantity(i);
        if (val == "" || val == null) {
            var eleme = order[i];
            scope.driver.executeScript("arguments[0].scrollIntoView(true);", eleme);
            eleme.click();
            await helper.sleep(500);
            try
            {
                var elemeNew = await scope.driver.findElement(By.id("input-" + i));
            } 
            catch(ex) 
            {
                console.log("Error While getting the text");
                continue;
            }

            if(elemeNew == null) {
                continue;
            }

            // var itemName = await orderingPage.GetActiveItemName();
            // expect(itemName).not.to.be.empty;
            // itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
            // console.log("itemDetails.minimumAllowableOrderQty  :" + itemDetails.minimumAllowableOrderQty);
            await helper.TypeText(elemeNew, "0");
            break;
        }
    } 
});

Then("ReOrder the Item with Zero in Order text box then click on Enter Key", async () => {
    //var order = await orderingPage.OrderQuantityTextBox();
    var elemeNew = await scope.driver.findElement(By.id("input-0"));
    await helper.TypeText(elemeNew, "0");

    // for (var i = 0; i < order.length; i++) {
    //     var val = await orderingPage.GetOrderQuantity(i);
    //     if (val == "" || val == null) {
    //         var eleme = order[i];
    //         scope.driver.executeScript("arguments[0].scrollIntoView(true);", eleme);
    //         eleme.click();
    //         await helper.sleep(500);
    //         console.log("Item Number: " + i);
    //         var elemeNew = await scope.driver.findElement(By.id("input-" + i));
    //         // var itemName = await orderingPage.GetActiveItemName();
    //         // expect(itemName).not.to.be.empty;
    //         // itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
    //         // console.log("itemDetails.minimumAllowableOrderQty  :" + itemDetails.minimumAllowableOrderQty);
    //         await helper.TypeText(elemeNew, "0");
    //         break;
    //     }
    // }
    
    scope.driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(function(entries) {
        entries.forEach(function(entry) {
            if(entry.message.includes("submit-order")) {
                //console.log("Network1 - [%s] %s", entry.level.name, entry.message);
            }
        });
    });
  
});


Then("Enter Order quantity for first item in review and finalize page for {string}", async (string) => {
    await landingPage.WaitforSpinnerToClose();
    if(string != "Daily") {
        await orderingPage.ClickOnDownArrow(0);
    }

    var elemeNew = await scope.driver.findElement(By.id("input0-0"));
    // var itemName = await scope.driver.findElements(By.className("review-item-name")).then(async (ele) => {
    //     return await ele[0].getText();
    // });

    // expect(itemName).not.to.be.empty;
    // itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
    // console.log("itemDetails.minimumAllowableOrderQty  :" + itemDetails.minimumAllowableOrderQty);
    await helper.TypeText(elemeNew, "5");
});

Then("Verify that we will get modal popup with Order InComplete order quantity", async () => {
    if (scope.remain > 0) {
        await helper.sleep(1000);
        var text = await orderingPage.ModalText();
        var modalTitle = await orderingPage.ModalTitle();

        let notOrdered = parseInt(scope.remain) - 1;

        // var NoBtn = await orderingPage.ReviewPageNoButton();
        // var YesBtn = await orderingPage.ReviewPageYesButton();
        //       AssertionError: object tested must be an array, an object, or a string, but null given
        if(notOrdered>0){
            var NoBtn = await orderingPage.OrderIncompleteNoButton();
            var YesBtn = await orderingPage.OrderIncompleteYesButtonOnRevFinClick();
        
            var OrdIncompleteProceedBtnBgColor = await orderingPage.OrdIncompleteProceedBtnBckGrndClr();
    
            // var OrdIncompleteYesBtnBgColor = window.getComputedStyle(OrdIncompleteYesBtn).backgroundColor;
            // expect(OrdIncompleteYesBtnBgColor).to.be.equal("color: rgb(0, 128, 96);","RGB Style for OrdIncompleteYesBtnBgColor does not match");
            expect(modalTitle).to.be.contains("ORDER INCOMPLETE");
            expect(text).to.contains("Are you sure you want to proceed? "+ notOrdered + " out of the total " + totalAvilableItems + " have not been ordered", "notOrdered, total Available Items quantity is not matched");
            expect(NoBtn).to.be.contains("No, Stay On Page");
            expect(YesBtn).to.be.contains("Yes, Proceed");
            expect(OrdIncompleteProceedBtnBgColor).to.be.equal("rgba(0, 128, 96, 1)","On Home Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
            await orderingPage.ReviewPageNoButton();
        }
    }
});

Then("Click on Close Button", async () => {
    await orderingPage.CloseModalPopup();
});

Then("Verify that we will get modal popup with Maximum order quantity", async () => {
    // if(scope.remain > 0 || scope.remainingOrderStatus === false) {
    var MaximumOrder = await orderingPage.ModalDialogText();

    expect(MaximumOrder).to.contains("Order quantity exceeds the MAX quantity, should not be more than " + itemDetails.maximumAllowableOrderQty + " units.", "Maximum Order quantity is not matched",MaximumOrder);
    //  }
});

Then("Enter number Max number in order textbox and click on Enter Key", async () => {
    var eleme = await scope.driver.findElement(By.id("input-2"));
    eleme.click();
    await helper.sleep(500);
    eleme = await scope.driver.findElement(By.id("input-2"));
    eleme.sendKeys(webdriver.Key.CONTROL + "a");
    eleme.sendKeys(webdriver.Key.DELETE);
    var itemName = await orderingPage.GetActiveItemName();
    expect(itemName).not.to.be.empty;
    itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
    await helper.sleep(500);
    eleme.sendKeys("9999");
    await helper.sleep(500);
    eleme.sendKeys(webdriver.Key.ENTER);
    await helper.sleep(500);
});

Then("click On YES button on modal pop up", async () => {
    //if(scope.remain > 0 || remainingOrderStatus === false) {
    await orderingPage.ReviewPageYesUpdatedButton();
    await helper.sleep(1000);
    //}
});

Then("Enter Order Quantity ONE in the Order text box and click Enter Key", async () => {
    //if(remain > 0 || remainingOrderStatus === false) {
    scope.driver.manage().logs();
    var order = await orderingPage.OrderQuantityTextBox();
    for (var i = 0; i < order.length; i++) {
        var val = await orderingPage.GetOrderQuantity(i);
        if (val == "" || val == null) {
            var eleme = order[i];
            scope.driver.executeScript("arguments[0].scrollIntoView(true);", eleme);
            eleme.click();
            await helper.sleep(1000);
 
            try
            {
                var elemeNew = await scope.driver.findElement(By.id("input-" + i));
            } 
            catch(ex) 
            {
                console.log("Error While getting the text");
                continue;
            }

            if(elemeNew == null) {
                continue;
            }

            var itemName = await orderingPage.GetActiveItemName();
            expect(itemName).not.to.be.empty;
            itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);
            await helper.TypeText(elemeNew, itemDetails.minimumAllowableOrderQty);

            var lduText = await orderingPage.ModalDialogText();
            await helper.sleep(1000);
    
            if (lduText && lduText.includes("The order quantity is not a multiple of LDU")) {
                await orderingPage.LduMinQuantitySelector();
            }
            else if (lduText && lduText.includes("Choose a desired Order Quantity")) {
                await orderingPage.ChooseDesiredMaxQty();
            }
            else if (lduText && lduText.includes("Order quantity is less than the MIN quantity")) {
                await orderingPage.orderMinQty();
            }
            else if (lduText && lduText.includes("Order quantity exceeds the MAX quantity")) {
                await orderingPage.orderMinQty();
            }
            
            break;
        }
    }
});

Then("Clear the existing order quantity and make sure that we have defaulted to Zero", async () => {
    var order = await orderingPage.OrderQuantityTextBox();
    for (var i = 0; i < order.length; i++) {
        var val = await orderingPage.GetOrderQuantity(i);
        if (val != "" || val != null) {
            var eleme = order[i];
            scope.driver.executeScript("arguments[0].scrollIntoView(true);", eleme);
            eleme.click();
            await helper.sleep(1000);
            // var itemName = await orderingPage.GetActiveItemName();
            // itemDetails = await Datasetup.GetSingleDayItemDetails(itemName);

            try
            {
                var elemeNew = await scope.driver.findElement(By.id("input-" + i));
            } 
            catch(ex) 
            {
                console.log("Error While getting the text");
                continue;
            }

            elemeNew.sendKeys(webdriver.Key.CONTROL + "a");
            elemeNew.sendKeys(webdriver.Key.DELETE);
            await helper.sleep(500);
            elemeNew.sendKeys(webdriver.Key.ENTER);
            await helper.sleep(2000);
            var lduText = await orderingPage.ModalDialogText();

            if (lduText && lduText.includes("Choose a desired Order Quantity")) {
                await orderingPage.ChooseDesiredMaxQty();
            }
            val = await orderingPage.GetOrderQuantity(i);
            expect(val).to.be.equals("0");
            break;
        }
    }
});

Then("Modify the Order quantity for one item in review and finalise page", async () => {
    var initialItemCount = await orderingPage.GetitemCount();
    var initialOrderQty = await orderingPage.GetOrderQuantity(0);
    var finalQty = parseInt(initialOrderQty) + 5;
    var order = await orderingPage.OrderQuantityTextBox();
    await helper.TypeText(order[0], finalQty);
    var finalItemCount = await orderingPage.GetitemCount();
    expect(parseInt(finalItemCount.split(" ")[0])).to.be.equals(parseInt(initialItemCount.split(" ")[0]) + 5);
});


Then("Click on Review and Finalise Button", async () => {
    //if(remain > 0 || remainingOrderStatus === false) {
    await orderingPage.ClickReviewAndFinalizeButton();
    await helper.sleep(1000);
    //}
});

Then("Click on Review and Finalise Button and verify the popup", async () => {
    //if(remain > 0 || remainingOrderStatus === false) {
    await orderingPage.ClickReviewAndFinalizeButton();
    await helper.sleep(1000);
    var text = await orderingPage.ModalText();
    var modalTitle = await orderingPage.ModalTitle();

    // var NoBtn = await orderingPage.ReviewPageNoButton();
    // var YesBtn = await orderingPage.ReviewPageYesButton();
    //       AssertionError: object tested must be an array, an object, or a string, but null given

    var NoBtn = await orderingPage.OrderIncompleteNoButton();
    var YesBtn = await orderingPage.OrderIncompleteYesButtonOnRevFinClick();
    
    console.log("RF: Modal Title message text: " +modalTitle);
    console.log("RF: Modal message text: " +text);
    console.log("RF: scope.remain value: " + scope.remain);
    console.log("RF: totalAvilableItems value: " + totalAvilableItems);

    console.log("RF: No Button: " + NoBtn);
    console.log("RF: Yes Button: " + YesBtn);

    // var OrdIncompleteYesBtnBgColor = window.getComputedStyle(OrdIncompleteYesBtn).backgroundColor;
    // expect(OrdIncompleteYesBtnBgColor).to.be.equal("color: rgb(0, 128, 96);","RGB Style for OrdIncompleteYesBtnBgColor does not match");
    
    if (scope.remain > 0) {
        expect(modalTitle).to.be.contains("ORDER INCOMPLETE");
        expect(text).to.contains("Are you sure you want to proceed? "+ scope.remain + " out of the total " + totalAvilableItems + " have not been ordered", "Modal Text message is not matched");
        expect(NoBtn).to.be.contains("No, Stay On Page");
        expect(YesBtn).to.be.contains("Yes, Proceed");
        await orderingPage.ReviewPageNoButton();
    } else {
        expect(modalTitle).to.be.contains("Unsaved Items");
        expect(text).to.be.contains("Are you sure you want to exit?");
        await orderingPage.ReviewPageYesButton();
    }

    //}
});

Then("Click On NO button on modal pop up", async () => {
    //if(scope.remain > 0 ) {
    await orderingPage.ReviewPageNoButton();
    await helper.sleep(1000);
    //}
});

Then("Verify the Daily Trend for last {string} days", async (days) => {
    await landingPage.WaitforSpinnerToClose();
    var dailyTrend = await orderingPage.DailyTrendDates();
    var time = parseInt(moment().tz(scope.timeZone).tz(scope.timeZone).format("HH"));
    var historyDays = parseInt(days);

    if ((historyDays == 8 && time >= 10) || (historyDays == 4 && time >= 10)) {
        historyDays = historyDays - 2;
    } else if (historyDays == 10 && time < 10) {
        historyDays = historyDays - 2;
    }
    else {
        historyDays = historyDays - 1;
    }

    dailyTrend.Trend.forEach(function (dayData) {
        expect(dayData.Date).to.be.equal(moment().tz(scope.timeZone).add(-historyDays, "days").format("MM/DD"));

        if (dayData.Delivered !== "-") {
            expect(dayData.Delivered).to.match(/^[0-9]+$/);
        }

        if (dayData.Sales !== "-") {
            expect(dayData.Sales).to.match(/^[0-9]+$/);
        }

        if (dayData.WriteOff !== "-") {
            expect(dayData.WriteOff).to.match(/^[0-9]+$/);
        }

        if (dayData.Temp !== "-/-") {
            //expect(dayData.Temp).to.match(/^[0-9][0-9]+$\/^[0-9][0-9]+$/); 
            expect(dayData.Temp.split("/")[0]).to.match(/^[0-9]+$/);
            expect(dayData.Temp.split("/")[1]).to.match(/^[0-9]+$/);
        }

        historyDays = historyDays - 1;
    });

});

Then("Verify the Weekly Trend for last {string} weeks", async (weeks) => {
    var weeklyTrend = await orderingPage.WeeklyTrendDates();
    //var weeksCount = 0; 
    weeklyTrend.Trend.forEach(function (dayData) {
        if (weeks <= 0) {
            expect(dayData.Date).to.be.equal(moment().tz(scope.timeZone).add(2, "days").add(-weeks, "weeks").format("MM/DD"));

            if (dayData.Delivered !== "-") {
                expect(dayData.Delivered).to.match(/^[0-9]+$/);
            }

            if (dayData.Sales !== "-") {
                expect(dayData.Sales).to.match(/^[0-9]+$/);
            }

            if (dayData.WriteOff !== "-") {
                expect(dayData.WriteOff).to.match(/^[0-9]+$/);
            }

            if (dayData.Temp !== "-/-") {
                //expect(dayData.Temp).to.match(/^[0-9][0-9]+$\/^[0-9][0-9]+$/); 
                expect(dayData.Temp.split("/")[0]).to.match(/^[0-9]+$/);
                expect(dayData.Temp.split("/")[1]).to.match(/^[0-9]+$/);
            }

            weeks = weeks - 1;
        }
    });

});

Then("Click on Submit Button", async () => {
    await landingPage.WaitforSpinnerToClose();
    orderingPage.ClickOnSubmitButton();

    // var scriptToExecute = "var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; var network = performance.getEntries() || {}; return network;";
    // var netData = scope.driver.executeScript(scriptToExecute).toString();
    // var jse = (IJavaScriptExecutor)driver;
    // jse.ExecuteScript("performance.clear()");
    // console.log(netData);
  
    scope.driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE).then(function(entries) {
        entries.forEach(function(entry) {
            if(entry.message.includes("submit-order")) {
                // console.log("Network - [%s] %s", entry.level.name, entry.message);
            }
        });
    });
});

Then("Verify that Order Landing page got opened and Remaining to Order was decreased by one", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(5000);
    var newRemain = await orderingPage.GetTotalRemainingOrdersForDaily();
    if (scope.remain > 0) {
        expect(newRemain).to.be.lessThan(scope.remain);
    } else {
        expect(newRemain.toString()).to.be.equal("0");
    }
});

Then("Disable the Order remaining items only radio button", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(2000);
    await orderingPage.ToggleReminingItemsButton();
});

Then("Order Submit Date", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    var sd = await orderingPage.OrderSubmitDate();
    sd = sd.split(" ")[6];
    var time = parseInt(moment().tz(scope.timeZone).format("HH"));

    if (time >= 10) {
        expect(sd).to.be.equal(moment().tz(scope.timeZone).add(1, "days").format("MM/DD"));
    } else {
        expect(sd).to.be.equal(moment().tz(scope.timeZone).add(0, "days").format("MM/DD"));
    }

});

Then("Verify Order Delivered Date", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    var dd = await orderingPage.OrderDeliverDate();
    dd = dd.split(" ")[7];
    var time = parseInt(moment().tz(scope.timeZone).format("HH"));

    if (time >= 10) {
        expect(dd).to.be.equal(moment().tz(scope.timeZone).add(2, "days").format("MM/DD"));
    } else {
        expect(dd).to.be.equal(moment().tz(scope.timeZone).add(1, "days").format("MM/DD"));
    }
});

Then("Click in Home Button and verify the popup", async () => {
    await landingPage.clickHomeButton();
    await helper.sleep(1000);
    var text = await orderingPage.ModalText();
    var modalTitle = await orderingPage.ModalTitle();

    var OrdIncompleteNoBtn = await orderingPage.OrderIncompleteNoButton();
    var OrdIncompleteYesBtn = await orderingPage.OrderIncompleteYesButton();

    var OrdIncompleteYesBtnBgColor = await orderingPage.OrderIncompleteYesButtonBckGrndClr();

    if (scope.remain > 0) {
        expect(modalTitle).to.be.contains("ORDER INCOMPLETE");
        //expect(text).to.contains("Are you sure you want to exit? "+ notOrdered + " out of the total " + totalAvilableItems + " have not been ordered", "Modal Text message is not matched");
        expect(text).to.contains("Are you sure you want to exit? "+ scope.remain + " out of the total " + totalAvilableItems + " have not been ordered", "Modal Text message is not matched");
        expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
        expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
        expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","On Home Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
        await orderingPage.ReviewPageYesButton();
    } else {
        expect(modalTitle).to.be.contains("Unsaved Items");
        expect(text).to.be.contains("Are you sure you want to exit?");
        expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
        expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
        expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","On Home Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
        await orderingPage.ReviewPageYesButton();
    }
});

Then("Click on All Radio button", async () => {
    await orderingPage.ClickOnAllRadioButton();
});

Then("Click On Previous Button and Verify pop up message", async () => {
    await orderingPage.ClickPreviousButton();
    await helper.sleep(1000);

    var modalTitle = await orderingPage.ModalTitle();
    var text = await orderingPage.ModalText();

    let notOrdered = parseInt(scope.remain) - 1;

    var OrdIncompleteYesBtnBgColor = await orderingPage.OrderIncompleteYesButtonBckGrndClr();
    console.log("On PrevBtn: OrdIncompleteYesBtnBgColor: ", OrdIncompleteYesBtnBgColor);

    // var OrdIncompleteNoBtn = await orderingPage.ReviewPageNoButton();
    // var OrdIncompleteYesBtn = await orderingPage.ReviewPageYesButton();
    // AssertionError: object tested must be an array, an object, or a string, but null given

    var OrdIncompleteNoBtn = await orderingPage.OrderIncompleteNoButton();
    var OrdIncompleteYesBtn = await orderingPage.OrderIncompleteYesButton();


    if (text && text.includes("Are you sure you want to exit?")) {
        if (scope.remain > 0 ){
            expect(modalTitle).to.be.contains("ORDER INCOMPLETE");
            expect(text).to.contains(" have not been ordered", "Modal Text message is not matched");
            expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
            expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
            expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","On Previous Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
            await orderingPage.ReviewPageYesButton();
        }
        else{
            expect(modalTitle).to.be.contains("Unsaved Items");
            expect(text).to.contains("Are you sure you want to exit?");
            expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
            expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
            expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","On Previous Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
            await orderingPage.ReviewPageYesButton();
        }
    }
    else {
        await orderingPage.ReviewPageNoButton();
    }
});

Then("Click On Previous Button and verify that we are in order details page", async () => {
    await orderingPage.ClickPreviousButton();
    await helper.sleep(500);
    var sd = await orderingPage.OrderSubmitDate();
    expect(sd).not.to.be.empty;
    expect(sd).not.to.be.null;
    var details = await scope.driver.getCurrentUrl();
    expect(details).to.include("placeorder");
});

Then("Click On Home Button and verify that we are in ordering page", async () => {
    await helper.sleep(500);
    await landingPage.clickHomeButton();
    await helper.sleep(500);
    var home = await scope.driver.getCurrentUrl();
    expect(home).to.include("home");
});


Then("Enter Order Quantity as {string} all the items", async (string) => {
    count = 0;
    var order = await orderingPage.OrderQuantityTextBox();

    var total = 20;
    if (order.length < 20) {
        total = order.length;
    }

    for (var i = 0; i < total; i++) {
        var elem = await helper.findElementById("input-" + i);
        
        if(elem == null) {
            //console.log("I think this Item is blocked");
            continue;
        }
      
        await helper.sleep(500);
        elem.click();
        await helper.sleep(500);
        elem.sendKeys(webdriver.Key.CONTROL + "a");
        elem.sendKeys(webdriver.Key.DELETE);
        await helper.sleep(1000);
        elem.sendKeys(string);
        await helper.sleep(1000);
        elem.sendKeys(webdriver.Key.ENTER);
        await helper.sleep(1000);

        var lduText = await orderingPage.ModalDialogText();
        await helper.sleep(1000);

        if (lduText && lduText.includes("The order quantity is not a multiple of LDU")) {
            await orderingPage.LduMinQuantitySelector();
        }
        else if (lduText && lduText.includes("Choose a desired Order Quantity")) {
            await orderingPage.ChooseDesiredMaxQty();
        }
        else if (lduText && lduText.includes("Order quantity is less than the MIN quantity")) {
            await orderingPage.orderMinQty();
        }
        else if (lduText && lduText.includes("Order quantity exceeds the MAX quantity")) {
            await orderingPage.orderMinQty();
        }

        await helper.sleep(2000);

        var qty = await orderingPage.GetOrderQuantity(i);
        count = count + parseInt(qty);
    }
});

Then("Verify that Order reaminging Quantity as {string}", async (string) => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    expect(string).to.be.equal("0");
});

Then("Verify the Items Ordered count matches", async() => {
    var itemCount = await orderingPage.GetReviewCount();
    expect(itemCount).to.be.equal(count);
});
