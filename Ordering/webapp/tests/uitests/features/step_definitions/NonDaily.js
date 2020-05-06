/* eslint-disable no-unused-vars */
const { When, Then } = require("cucumber");
const expect = require("chai").expect;
const scope = require("../support/scope");
const helper = require("../support/Helper");
const orderingPage = require("../pages/OrderingPage");
var webdriver = require("selenium-webdriver");
var Datasetup = require("../support/DataSetup");
const By = webdriver.By;
const landingPage = require("../pages/LandingPage");

let remainingOrderStatus = true;
let itemDetails;
let totalAvilableItems = 0;

Then("Check only Non-Daily checkbox for selecting Non-Daily item", async () => {
    await orderingPage.ClickDailyCheckbox();
    await orderingPage.SelectMultiDay();
});

Then("Select the first avilable Non-Daily item and Verify remaing Items to Order", async () =>  {
    scope.remain = await orderingPage.GetTotalRemainingOrdersForNonDaily();
    remainingOrderStatus = Boolean(await orderingPage.GetOrderRemainingItemsState());
    totalAvilableItems =scope.remain;

    if(scope.remain == 0 && remainingOrderStatus == true) {
        await orderingPage.ToggleReminingItemsButton();
        await orderingPage.ClickOnAllRadioButton();
        totalAvilableItems = await orderingPage.GetTotalAvilableOrdersForNonDaily();
        // eslint-disable-next-line require-atomic-updates
        scope.remain = await orderingPage.GetTotalRemainingOrdersForNonDaily();
    }

    await orderingPage.GetNonDailyItems().then(async(nonDailyitems) => {
        for(var i=1;i <nonDailyitems.length; i++) {
            var name = await nonDailyitems[i].getText();
            if(!name.includes(" - GR")) {
                scope.driver.executeScript("arguments[0].scrollIntoView(true);",  nonDailyitems[i]);
                nonDailyitems[i].click();
            }
        }
    });
});

Then("Answer the question on forecast sales", async () => {
    var ques = await orderingPage.Question1();
    var itemName = await orderingPage.GetActiveItemName();
    expect(itemName).not.to.be.an("undefined");
    itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);

    await helper.ClearText(ques);
    var userQty =Math.floor((Math.random() * 40) + 1);
    await helper.TypeText(ques,userQty);
    //await orderingPage.LduZeroQuantitySelector();
   
    var total = await orderingPage.GetNonDailyFormulaTotalText();
    // expect(total).to.be.equal(itemDetails.totalBalanceOnHandQty);

    var min = await orderingPage.GetNonDailyMinBoxText();
    expect(min).to.be.equals(itemDetails.minimumOnHandQty.toString(),"MOH is not matched");

    var pendingDelivary = await orderingPage.GetNonDailyPendingDeliveryQty();
    expect(pendingDelivary).to.be.equal(itemDetails.pendingDeliveryQty.toString(),"OnOrder qty is not matched");

    var forecast = await orderingPage.GetNonDailyForecastText();
    expect(forecast).to.be.equal(userQty.toString(), "Forecast sales is not matched");

    await helper.sleep(2000);
    var qty = await orderingPage.GetOrderQuantity(0);
    var lduText = await orderingPage.ModalDialogText(); 

    if(lduText && lduText.includes("The order quantity is not a multiple of LDU")) {
        await orderingPage.LduMinQuantitySelector();
    } 
    else if(lduText && lduText.includes("Order quantity is less than the MIN quantity")) {
        await orderingPage.orderMinQty();
    } 
    else if(lduText && lduText.includes("Order quantity exceeds the MAX quantity")) {
        await orderingPage.orderMinQty();
    } 

    var final = (parseInt(userQty) + parseInt(min)) - (parseInt(total) + parseInt(pendingDelivary));
    
    console.log("final" + final );
    console.log("userQty" + userQty );
    console.log("min" + min );
    console.log("total" + total );
    console.log("pendingDelivary" + pendingDelivary );

    if(final < 0) {
        final = "0";
    }

    expect(qty).to.be.equal(final.toString(),"Order Quantity is not matched" + qty + " == " + final);
    //var estmated = await orderingPage.GetNonDailyOrderText();
    //expect(estmated).to.be.equal(qty);
});

Then("Verify the Weekly Trend for last {string} weeks for Non_daily Item", async (weeks) =>  {
    var weeklyTrend = await orderingPage.WeeklyTrendDates();

    weeklyTrend.Trend.forEach( function(dayData) {
        expect(dayData.Date).to.be.equal("FP" + weeks);
     
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

Then("Enter Order Quantity ONE in the Order text box and click Enter Key for Non-Daily items", async () =>  {
    var order = await orderingPage.OrderQuantityTextBox();
    for(var i=0;i<order.length;i++) {
        var val =await orderingPage.GetOrderQuantity(i);
        if(val == "" || val == null) {
            order = order[i];
            scope.driver.executeScript("arguments[0].scrollIntoView(true);",  order);
            order.click();
            var itemName = await orderingPage.GetActiveItemName();
            expect(itemName).not.to.be.an("undefined");
            itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
            await helper.TypeText(order,itemDetails.minimumAllowableOrderQty);
            await helper.sleep(2000);
            
            var lduText = await orderingPage.ModalDialogText();

            if(lduText && lduText.includes("The order quantity is not a multiple of LDU")) {
                await orderingPage.LduMinQuantitySelector();
            } 
            else if(lduText && lduText.includes("Order quantity is less than the MIN quantity")) {
                await orderingPage.orderMinQty();
            } 
            else if(lduText && lduText.includes("Order quantity exceeds the MAX quantity")) {
                await orderingPage.orderMinQty();
            } 
            break;
        }
    }
});

Then("Verify that we will get modal popup with No. of items not ordered", async () =>  {
    if(scope.remain > 0 ) {
        await helper.sleep(2000);
        var minimumOrder = await orderingPage.ModalDialogText();
        expect(minimumOrder).to.contains("have not been ordered", "Minimum Order quantity is not matched");
    }
});

Then("Verify that Order Landing page got opened and Remaining to Order was decreased by one for Non-Daily Items", async () =>  {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(5000);
    var newRemain = await orderingPage.GetTotalRemainingOrdersForNonDaily();
    if(scope.remain > 0) {
        expect(newRemain).to.be.lessThan(scope.remain);
    } else {
        expect(newRemain).to.be.equal("0");
    }
});
