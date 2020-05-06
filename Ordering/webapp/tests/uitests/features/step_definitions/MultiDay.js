/* eslint-disable no-unused-vars */
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
let count= 0;
// let itemDetails;

Then("Check only Multi Day checkbox for selecting Multi day item", async () => {
    await helper.sleep(1000);
    await orderingPage.ClickDailyCheckbox();
    await orderingPage.ClickNonDailyCheckbox();
});

Then("Select the first avilable multiday item and Verify remaing Items to Order", async () =>  {
    scope.remain = await orderingPage.GetTotalRemainingOrdersForMultiDay();
    remainingOrderStatus = Boolean(await orderingPage.GetOrderRemainingItemsState());
    await helper.sleep(1000);

    if(scope.remain == 0 && remainingOrderStatus == true) {
        await orderingPage.ToggleReminingItemsButton();
        await orderingPage.ClickOnAllRadioButton();
        //totalAvilableItems = await orderingPage.GetTotalAvilableOrdersForNonDaily();
        // eslint-disable-next-line require-atomic-updates
        scope.remain = await orderingPage.GetTotalRemainingOrdersForMultiDay();
    }
    var multi = await orderingPage.GetMultiDayItems();
    for(var c =1 ;c<multi.length;c++) {
        scope.driver.executeScript("arguments[0].scrollIntoView(true);",  multi[c]);
        await helper.sleep(500);
        multi[c].click();
    }
  
    //expect(remain).to.be.above(0,"There are no items to order");
});

Then("Verify Cursor if defaulted to first question", async () =>  {
    // if(remain > 0 || remainingOrderStatus === false) {
    var ques = await orderingPage.Question1();
    expect(await webdriver.WebElement.equals(ques, scope.driver.switchTo().activeElement())).to.be.true;
    scope.driver.switchTo().defaultContent();
    await helper.sleep(1000);
    // }
});

Then("Verify Cursor if defaulted to Order textBox", async () =>  {
    //if(remain > 0 || remainingOrderStatus === false) {
    var orderquant = await orderingPage.OrderQuantityTextBox();
    expect(await webdriver.WebElement.equals(orderquant[0], scope.driver.switchTo().activeElement())).to.be.true;
    scope.driver.switchTo().defaultContent();
    await helper.sleep(1000);
    // await helper.ClearText(orderquant[0]);
    //  await helper.TypeText(orderquant[0],"40");

    // }
});

Then("Update Order quantity ONe in the Order text box", async () =>  {
    // if(remain > 0 || remainingOrderStatus === false) {
    var orderquant = await orderingPage.OrderQuantityTextBox();
    // expect(await webdriver.WebElement.equals(orderquant[1], scope.driver.switchTo().activeElement())).to.be.true;
    //  scope.driver.switchTo().defaultContent();
    await helper.sleep(1000);
    await helper.ClearText(orderquant[0]);
    await helper.TypeText(orderquant[0],"1");
    
    // }
});

Then("Update Order quantity for second item", async () =>  {
    // if(remain > 0 || remainingOrderStatus === false) {
    var orderquant = await orderingPage.OrderQuantityTextBox();
    // expect(await webdriver.WebElement.equals(orderquant[1], scope.driver.switchTo().activeElement())).to.be.true;
    //  scope.driver.switchTo().defaultContent();
    await helper.sleep(1000);
    await helper.ClearText(orderquant[1]);
    await helper.TypeText(orderquant[1],"10");
    
    // }
});

Then("Enter Order Quantity ONE in the Order text box and click Enter Key for multiday", async () =>  {
    
    //if(remain > 0 || remainingOrderStatus === false) {
    var order = await orderingPage.OrderQuantityTextBox();
    for(var i=0;i<order.length;i++) {
        var val =await orderingPage.GetOrderQuantity(i);
        if(val == "" || val == null) {
            var eleme =order[i];
            scope.driver.executeScript("arguments[0].scrollIntoView(true);",  eleme);
            eleme.click();
            await helper.sleep(1000);
            var elemeNew = await scope.driver.findElement(By.id("input-" + i));
            var itemName = await orderingPage.GetActiveItemName();
            expect(itemName).not.to.be.empty;
            itemDetails = await Datasetup.GetMultiDayItemDetails(itemName);
            await helper.TypeText(elemeNew,itemDetails.minimumAllowableOrderQty);
            break;
        }
    }
});

Then("Verify multiday the Items Ordered count matches", async() => {
    var itemCount = await orderingPage.GetitemCount1();
    expect(itemCount).to.be.contains(count);
});

Then("Verify the Formula1", async () =>  {
    var total = await orderingPage.GetFormulaTotalText();
    expect(total).to.be.equal("40");
    var nextDay = await orderingPage.GetFormulaNextDayExpQtyText();
    expect(nextDay).to.be.equal("30");
    var next2Days = await orderingPage.GetFormulaNextTwoDaysSellExpText();
    expect(next2Days).to.be.equal("20");
    var inventory = await orderingPage.GetFormulaInventoryText();
    var pedingDelivary = await orderingPage.GetPendingDeliveryQty();
    
    if(pedingDelivary == "0") {
        expect(inventory).to.be.equal("10");
    } else {
        expect(inventory).to.be.equal(pedingDelivary);
    }

    expect(inventory).to.be.equal("10");
    var estmated = await orderingPage.GetFormulaEstimatedText();
    expect(estmated).to.be.equal("10");
});


Then("Answer all the questions", async () => {
    var ques1 = await orderingPage.Question1();
    var ques2 = await orderingPage.Question2();
    var ques3 = await orderingPage.Question3();
    var ques4 = await orderingPage.Question4();
  
    await helper.ClearText(ques1);
    await helper.ClearText(ques2);
    await helper.ClearText(ques3);
    await helper.ClearText(ques4);

    await helper.TypeText(ques1,"40");
    var total = await orderingPage.GetFormulaTotalText();
    expect(total).to.be.null;
    await helper.TypeText(ques2,"20");
    total = await orderingPage.GetFormulaTotalText();
    expect(total).to.be.null;
    await helper.TypeText(ques3,"30");
    total = await orderingPage.GetFormulaTotalText();
    expect(total).to.be.null;
    await helper.TypeText(ques4,"20");

    var qty = await orderingPage.GetOrderQuantity(0);
    //var pendingDelivary = await orderingPage.GetNonDailyPendingDeliveryQty();
    //var final = parseInt("10") - parseInt(pendingDelivary);
    //expect(qty).to.be.equal(final.toString());
    var estmated = await orderingPage.GetFormulaEstimatedText();
    expect(estmated).to.be.equal(qty);
});

Then("Verify the Formula", async () =>  {
    var total = await orderingPage.GetFormulaTotalText();
    var estmated = await orderingPage.GetFormulaEstimatedText();
    var nextDay = await orderingPage.GetFormulaNextDayExpQtyText();
    var next2Days = await orderingPage.GetFormulaNextTwoDaysSellExpText();
    var inventory = await orderingPage.GetFormulaInventoryText();
    var Carryoveritem = await orderingPage.GetFormulaNextCarryOver();
    var totalvalue = await orderingPage.GetFormulaTotalText();
    var actualcarryover = totalvalue - nextDay;

    //validate largest # between sell and Expire
    var value1 = await orderingPage.GetFormulaques1();
    var value2 = await orderingPage.GetFormulaques2();

    if(value1 > value2) {
        expect(value1 == nextDay).true;
    } else {
        expect(value2 == nextDay).true;
    }
    // validate carryover and order quanity calculated correctly
    expect(actualcarryover == Carryoveritem).true;
    var actualorderquanity = next2Days - actualcarryover;
    expect(actualorderquanity == estmated).true;
});



Then("Verify the default values for all questions for first item", async () =>  {
    expect(orderingPage.GetQuestion1Answer()).to.be.empty;
    expect(orderingPage.GetQuestion2Answer()).to.be.empty;
    expect(orderingPage.GetQuestion3Answer()).to.be.empty;
    expect(orderingPage.GetQuestion4Answer()).to.be.empty;
});

Then("Answer the questions with special characters", async () => {

    var ord = scope.driver.findElement(By.id("input-0"));
    ord.sendKeys(webdriver.Key.ENTER);

    var ques1 = await orderingPage.Question1();
    var ques2 = await orderingPage.Question2();
    var ques3 = await orderingPage.Question3();
    var ques4 = await orderingPage.Question4();

    await helper.TypeText(ques1,"*");
    await helper.TypeText(ques2,"&");
    await helper.TypeText(ques3,"#");
    await helper.TypeText(ques4,"@");

    var q1 = await orderingPage.GetQuestion1Answer();
    var q2 = await orderingPage.GetQuestion2Answer();
    var q3 = await orderingPage.GetQuestion3Answer();
    var q4 = await orderingPage.GetQuestion4Answer();

    expect(q1).to.be.equal("");
    expect(q2).to.be.equal("");
    expect(q3).to.be.equal("");
    expect(q4).to.be.equal("");

    var qty = await orderingPage.GetOrderQuantity(1);
    expect(qty).to.be.empty;
});


Then("Answer the questions with Zero", async () => {

    var ord = scope.driver.findElement(By.id("input-1"));
    ord.sendKeys(webdriver.Key.ENTER);
    await helper.sleep(5000);

    var ques1 = await orderingPage.Question1();
    var ques2 = await orderingPage.Question2();
    var ques3 = await orderingPage.Question3();
    var ques4 = await orderingPage.Question4();

    await helper.TypeText(ques1,"0");
    await helper.TypeText(ques2,"0");
    await helper.TypeText(ques3,"0");
    await helper.TypeText(ques4,"0");

    var q1 = await orderingPage.GetQuestion1Answer();
    var q2 = await orderingPage.GetQuestion2Answer();
    var q3 = await orderingPage.GetQuestion3Answer();
    var q4 = await orderingPage.GetQuestion4Answer();

    expect(parseInt(q1)).to.be.equals(0);
    expect(parseInt(q2)).to.be.equals(0);
    expect(parseInt(q3)).to.be.equals(0);
    expect(parseInt(q4)).to.be.equals(0);

    var orderqtyInputBoxes = await orderingPage.OrderQuantityTextBox();

    if(orderqtyInputBoxes.length > 1) {
        var qty = await orderingPage.GetOrderQuantity(2);
    }
    else
    {
        qty = await orderingPage.GetOrderQuantity(0); 
    }

    expect(parseInt(qty)).to.be.equals(0);
});

Then("Verify the Weekly Trend for last {string} weeks for Multiday Item", async (weeks) =>  {
    var weeklyTrend = await orderingPage.WeeklyTrendDatesforMultiDayItem();

    weeklyTrend.Trend.forEach( function(dayData) {
        expect(dayData.Date).to.be.equal(moment().tz(scope.timeZone).add(1, "days").add(-weeks, "weeks").format("MM/DD"));
     
        if(dayData.Delivered !== "-") {
            expect(dayData.Delivered).to.match(/^[0-9]+$/);   
        }

        if(dayData.Sales !== "-") {
            expect(dayData.Sales).to.match(/^[0-9]+$/);   
        }

        if(dayData.WriteOff !== "-") {
            expect(dayData.WriteOff).to.match(/^[0-9]+$/);  
        }

        if(dayData.Temp !== "-/-") {
            expect(dayData.Temp.split("/")[0]).to.match(/^[0-9]+$/);
            expect(dayData.Temp.split("/")[1]).to.match(/^[0-9]+$/);
        }
     
        weeks = weeks-1;
    });

});

Then("Enter Multiday Order Quantity as {string} all the items", async (string) => {
    count = 0;
    var order = await orderingPage.OrderQuantityTextBox();

    for(var i=0;i<order.length;i++) {
        var elem = scope.driver.findElement(By.id("input-" + i));
        await helper.sleep(500);
        scope.driver.executeScript("arguments[0].scrollIntoView(true);",  elem);
        await helper.sleep(500);

        var itemName = await orderingPage.GetActiveItemName();
        itemDetails = await Datasetup.GetMultiDayItemDetails(itemName);
        elem.sendKeys(webdriver.Key.CONTROL + "a");
        elem.sendKeys(webdriver.Key.DELETE);
        var enterQty = "";

        if(itemDetails.ldu != "1") {
            enterQty = parseInt(itemDetails.ldu);
            elem.sendKeys(enterQty); 

        } else {
            enterQty = parseInt(itemDetails.minimumAllowableOrderQty) + parseInt(string);
            elem.sendKeys(enterQty);
        }

        elem.sendKeys(webdriver.Key.ENTER);
        count = count + parseInt(enterQty);
        //await helper.sleep(1000);
    }
});

Then("Verify the Next day Weekly Trend for last {string} weeks for Multiday Item", async (weeks) =>  {
    var weeklyTrend = await orderingPage.Next2DaysWeeklyTrendDatesforMultiDayItem();
    weeklyTrend.Trend.forEach( function(dayData) {
        expect(dayData.Date).to.be.equal(moment().tz(scope.timeZone).add(2, "days").add(-weeks, "weeks").format("MM/DD"));
     
        if(dayData.Delivered !== "-") {
            expect(dayData.Delivered).to.match(/^[0-9]+$/);   
        }

        if(dayData.Sales !== "-") {
            expect(dayData.Sales).to.match(/^[0-9]+$/);   
        }

        if(dayData.WriteOff !== "-") {
            expect(dayData.WriteOff).to.match(/^[0-9]+$/);  
        }

        if(dayData.Temp !== "-/-") {
            //expect(dayData.Temp).to.match(/^[0-9][0-9]+$\/^[0-9][0-9]+$/); 
            expect(dayData.Temp.split("/")[0]).to.match(/^[0-9]+$/);
            expect(dayData.Temp.split("/")[1]).to.match(/^[0-9]+$/);
        }
     
        weeks = weeks-1;
    });
});

Then("Click in Home Button and verify the popup for Multiday Item", async () => {
    await landingPage.clickHomeButton();
    await helper.sleep(1000);
    var text = await orderingPage.ModalText();
    if (scope.remain > 0) {
        expect(text).to.be.contains("have not been ordered");
    } else {
        expect(text).to.be.contains("Are you sure you want to exit?");
    }

    await orderingPage.ReviewPageYesButton();
});