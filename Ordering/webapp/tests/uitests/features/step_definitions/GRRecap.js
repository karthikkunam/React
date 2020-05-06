const { Then } = require("cucumber");
const GRrecapPage  = require("../pages/GR-Recap");
const LandingPage  = require("../pages/LandingPage");
const orderingPage  = require("../pages/OrderingPage");

const helper = require("../support/Helper");
const moment = require("moment");
const expect = require("chai").expect;
const scope = require("../support/scope");

var webdriver = require("selenium-webdriver");
var Datasetup = require("../support/DataSetup");
const By = webdriver.By;
let selectedItem;
let itemDetails;
let AutoApprovalInfo =null;

Then("Click on the GR-recap Button", async () =>  {
    await LandingPage.WaitforSpinnerToClose();
    await GRrecapPage.ClickGRrecapButton();
    await LandingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
});

Then("Click on the Order Remaining Item Only Button", async () =>  {
    await orderingPage.ToggleReminingItemsButton();
    await helper.sleep(1000);
}); 

Then("Select the first available Non-Daily GR item and Verify remaining Items to Order", async () =>  {
    console.log("You are in GR items Order Landing Page");
    await orderingPage.GetNonDailyItems().then(async (gritems)=> {
        //console.log("nonDaily GR Items: " + gritems.length);    
        for(var i=0;i<gritems.length;i++) {
            var text = await gritems[i].getText();
             
            if(text.includes(" - GR")) {
                console.log("Clicked on GR Category Item *****************   : " + text);
                scope.driver.executeScript("arguments[0].scrollIntoView(true);",  gritems[i]);
                await helper.sleep(500);
                gritems[i].click();
                 
                break;
            }
        }
    });
});

Then("Verify Cursor is defaulted to first Order Qty box", async () =>  {
    console.log("Cursor is defaulted to first Order Qty  .....");
    //var ques = await orderingPage.Question1();
    var ques = await orderingPage.OrderQuantityTextBox();
    expect(await webdriver.WebElement.equals(ques[0], scope.driver.switchTo().activeElement())).to.be.true;
    scope.driver.switchTo().defaultContent();
    await helper.sleep(1000);
});

Then ("Verify First item in details page is expanded by default", async () => {
    
    // var expand = await orderingPage.OrderQuantityTextBoxExpanded();
    // //expect(await webdriver.WebElement.equals(expand, scope.driver.switchTo().activeElement())).to.be.true;
    // scope.driver.switchTo().defaultContent();
    // await helper.sleep(1000);
    //var totalOrder = await orderingPage.GetTotalOrderedQuantity();
    var itemCount = await orderingPage.GetItemsExpandedCount();
    expect(itemCount).to.be.equal(1);
    console.log("Item expanded by default");    
});

Then("Verify GR Recap page validations for BoH, OnO, Status Approved, Order Qty# value and User Edited", async () => {
    console.log("You are in GR Recap Page");
    await orderingPage.GetGRRecapPageItems().then(async (gritems)=> {
        console.log("nonDaily GR Items: " + gritems.length);    
        for(var i=0;i<gritems.length;i++) {
            var GRItemtext = await gritems[i].getText();
            console.log("nonDaily GR Category Item: " + GRItemtext);
                
            if(GRItemtext.includes(selectedItem)) {
                //if(GRItemtext.includes("7-S Water 20z")) {
                console.log("nonDaily GR selectedItem: " + selectedItem);
                await helper.sleep(500);
                    
                var d = await gritems[i].findElements(By.xpath("..//..//td")).then(async (ele1) => {
                    var approved = await ele1[1].getText();
                    var Boh =  await ele1[3].getText();
                    var OnO = await  ele1[4].getText();
                    var OrdQty = await ele1[5].findElement(By.tagName("input")).then(function(ele) {
                        return ele.getAttribute("value");
                    });
                    var OrdQtyStyle = await ele1[5].findElement(By.tagName("input")).then(function(ele) {
                        return ele.getAttribute("style");
                    });
                    
                    expect(approved).to.be.equal("Approved", "Item status in GR Recap page is not Approved");
                    itemDetails =  await Datasetup.GetNonDailyGRItemDetails(selectedItem);
                    // console.log("API Boh Value:" + itemDetails.totalBalanceOnHandQty);
                    // console.log("API OnO Value:" + itemDetails.pendingDeliveryQty);
                    // console.log("API OnO Value:" + itemDetails.untransmittedOrderQty);
                    //console.log("Boh Value in GR Recap page for"+ selectedItem +": " + Boh);
                    expect(Boh).to.be.equal(itemDetails.totalBalanceOnHandQty.toString(), "BoH qty is not matched");
                    //console.log("Ono value in GR Recap page for"+ selectedItem +": "  + OnO);
                    expect(OnO).to.be.equal(itemDetails.pendingDeliveryQty.toString(),"OnO qty is not matched");
                    //console.log("untransmitted Order Qty value in GR Recap page for"+ selectedItem +": "  + OrdQty);
                    expect(OrdQty).to.be.equal(itemDetails.untransmittedOrderQty.toString(),"untransmitted Order Qty is not matched");
                    //console.log("Order Qty Style for"+ selectedItem +": "  + OrdQtyStyle);
                    expect(OrdQtyStyle).to.be.equal("color: rgb(236, 37, 38);","RGB Style for User Edited does not match");
                    return ele1[4].getText();
                });
                    
                break;
            }
        }
    });
});

Then("Click on Recalculate Button", async () =>  {
    await GRrecapPage.ClickGrrecalculate();
    await LandingPage.WaitforSpinnerToClose();
    await helper.sleep(10000);
});

Then("Verify last recalculated time was present", async () =>  {
    var hour = moment().tz(scope.timeZone).format("HH");
    var min = moment().tz(scope.timeZone).format("mm");
    var recalctime = await GRrecapPage.GRlastrecalicultedTime();
    var recal = recalctime.split(":");
    //expect(recal[0]).to.be.equal(hour, "Recalculate Hour is not matched");
    //expect(recal[1]).to.be.at.least(min,"Recalculate Minute is not matched");
    
    if (min == "00" || min == "01" )
    {
        expect(recal[0]).to.have.any.keys(hour,hour-1, "00");
        expect(recal[1]).to.have.any.keys(min,"59","58");
    }
    else
    {
        expect(recal[0]).to.be.equal(hour, "Recalculate Hour is not matched");
        expect(recal[1]-1).to.be.at.most(min,"Recalculate Minute is not matched");
    }
});

Then("Select First item in GR recap Grid", async () =>  {
    await GRrecapPage.SelectFirstItem();
    await helper.sleep(1000);
});

Then("Verify Auto Approval Is ON", async () =>  {
    return await scope.driver.findElement(By.xpath("//*[@id='vertical-tab-one']/div[3]/div[1]//div[2]//span[2]")).then(async (ele) => {
        var t = await ele.getText();
      
        console.log("time " + t);
        expect(t).to.be.equal("ON", "Auto Approval is not set to ON");
        return t;       
    });
    
});

Then("Click on GRRecap Dropdown Button", async () =>  {
    // await GRrecapPage.ClickonGRrecapDropDown();
    scope.driver.findElement(By.xpath("//*[@id='vertical-tab-one']/div[3]/div[1]/div[3]/div[1]/div[1]/div/div/div[1]/div")).click();
    await helper.sleep(20000);
});

Then("Click on Category and item description header", async () =>  {
    await GRrecapPage.ClickCategoryItemDescriptionLabel();
    await helper.sleep(1000);
});

Then("Verify that all the items got selected and Approve button is enabled", async () =>  {
    var chkboxes = await GRrecapPage.GetAllCheckBoxes();
    console.log("No. of chexkboxes " + chkboxes.length);
    for(var i=0;i<chkboxes.length; i++) {
        var sts = await chkboxes[i].isSelected();
        // await chkboxes[i].click();
        console.log("chexkbox status " + sts);
    }

    chkboxes = await GRrecapPage.GetAllCheckBoxes();

    for(var j=2;j<chkboxes.length; j++) {
        scope.driver.executeScript("arguments[0].scrollIntoView(true);",  chkboxes[j]);
        await helper.sleep(1000);
        await chkboxes[j].click();
        await helper.sleep(1000);
        console.log("count  - " + j);
    }

    await helper.sleep(20000);
});
//DELETE - For testing
// Then("Verify Cursor if defaulted to first question ", async () =>  {
//     // if(remain > 0 || remainingOrderStatus === false) {
//     console.log("Start .....");
//     var ques = await orderingPage.Question1();
//     expect(await webdriver.WebElement.equals(ques, scope.driver.switchTo().activeElement())).to.be.true;
//     scope.driver.switchTo().defaultContent();
//     await helper.sleep(1000);
//     console.log("....Done");
//     // }
// });
Then("Enter Order Quantity ONE in the Order text box and click Enter Key for Non-Daily GR items", async () =>  {
    var order = await orderingPage.OrderQuantityTextBox().sendKeys("20");
    var itemName = await orderingPage.NonDailyActiveItemName();
    expect(itemName).not.to.be.an("undefined");
    console.log("item name : "+ itemName);
    itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
    console.log("itemDetails.minimumAllowableOrderQty" + itemDetails.minimumAllowableOrderQty);
    await helper.TypeText(order[0],itemDetails.minimumAllowableOrderQty);
    // for(var i=0;i<order.length;i++) {
    //     var val =await orderingPage.GetOrderQuantity(i);
    //     if(val == "" || val == null) {
    //         order = order[i];
    //         scope.driver.executeScript("arguments[0].scrollIntoView(true);",  order);
    //         await helper.sleep(1000);
    //         order.click();
    //         await helper.sleep(1000);
    //         var itemName = await orderingPage.NonDailyActiveItemName();
    //         expect(itemName).not.to.be.an("undefined");
    //         console.log("item name : "+ itemName);
    //         itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
    //         console.log("itemDetails.minimumAllowableOrderQty" + itemDetails.minimumAllowableOrderQty);
    //         await helper.TypeText(order,itemDetails.minimumAllowableOrderQty);
    //         break;
    //     }
    // }
});
Then("Enter Projected Forecast sales Quantity TWENTY in the Order text box and hit Enter Key", async () => {
    //await GRrecapPage.GetQuestion1Answer();
    await GRrecapPage.EnterProjForeSalesValue();
    var ord = scope.driver.findElement(By.id("input-0"));
    ord.sendKeys(webdriver.Key.ENTER);
    await helper.sleep(2000);
    var modalDlgText = await orderingPage.ModalDialogText();
    if(modalDlgText && modalDlgText.includes("The order quantity is not a multiple of LDU")) {
        await orderingPage.LduMinQuantitySelector();
    } 
    else if(modalDlgText && modalDlgText.includes("Order quantity is less than the MIN quantity")) {
        await orderingPage.orderMinQty();
    } 
    else if(modalDlgText && modalDlgText.includes("Order quantity exceeds the MAX quantity")) {
        await orderingPage.orderMinQty();
    } 
    await helper.sleep(3000);
    
    //break;
    //  return await helper.findElementsByName(OrderQuantitySelector).sendKeys("20");
    // var itemName = await orderingPage.NonDailyActiveItemName();
    // expect(itemName).not.to.be.an("undefined");
    // console.log("item name : "+ itemName);
    // itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
    // console.log("itemDetails.minimumAllowableOrderQty" + itemDetails.minimumAllowableOrderQty);
    // await helper.TypeText(order[0],itemDetails.minimumAllowableOrderQty);
    // for(var i=0;i<order.length;i++) {
    //     var val =await orderingPage.GetOrderQuantity(i);
    //     if(val == "" || val == null) {
    //         order = order[i];
    //         scope.driver.executeScript("arguments[0].scrollIntoView(true);",  order);
    //         await helper.sleep(1000);
    //         order.click();
    //         await helper.sleep(1000);
    //         var itemName = await orderingPage.NonDailyActiveItemName();
    //         expect(itemName).not.to.be.an("undefined");
    //         console.log("item name : "+ itemName);
    //         itemDetails = await Datasetup.GetNonDailyItemDetails(itemName);
    //         console.log("itemDetails.minimumAllowableOrderQty" + itemDetails.minimumAllowableOrderQty);
    //         await helper.TypeText(order,itemDetails.minimumAllowableOrderQty);
    //         break;
    //     }
    // }
});
Then("Verify GR Items Formula validations for BoH, OnO, MoH, Inventory and OrderQty values", async () => {
  
    var itemName = await orderingPage.GetActiveItemName();
    var total = await orderingPage.GetNonDailyGRFormulaTotalText();
    // expect(total).to.be.equal(itemDetails.totalBalanceOnHandQty);
    console.log("item Name :" + itemName);
    expect(itemName).not.to.be.an("undefined");
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    expect(total).to.be.equal(itemDetails.totalBalanceOnHandQty.toString(),"BoH qty is not matched");
    var min = await orderingPage.GetNonDailyGRMinBoxText();
    expect(min).to.be.equals(itemDetails.minimumOnHandQty.toString(),"MOH is not matched");
    var pendingDelivery = await orderingPage.GetNonDailyGRPendingDeliveryQty();
    expect(pendingDelivery).to.be.equal(itemDetails.pendingDeliveryQty.toString(),"OnOrder qty is not matched");
    var forecast = await orderingPage.GetNonDailyGRForecastText();
    expect(forecast).to.be.equal("200", "Projected Forecast sales is not matched");
    var qty = await orderingPage.GetOrderQuantity(0);
    console.log("GR itemDetailsOrderQty: " + qty);
    //Below validations for final Value fail for LDU,Min, Max Qty values
    //var final = (parseInt("20") + parseInt(min)) - (parseInt(total) + parseInt(pendingDelivery));
    //expect(qty).to.be.equal(final.toString());
    var estimatedFormulaCalOrder = (parseInt("200") + parseInt(min)) - (parseInt(total) + parseInt(pendingDelivery));
    var estimated = await orderingPage.GetNonDailyGROrderText();
    //expect(estimated).to.be.equal(qty);
    expect(estimated.toString()).to.be.equal(estimatedFormulaCalOrder.toString(), "Estimated Formula Calculation value doesn't match");
});
Then("Validate MaxAllowable Order Qty in order textbox and click on Enter Key for GR Item", async () => {
    var eleme = await scope.driver.findElement(By.name("untransmittedOrderQty"));
    eleme.click();
    await helper.sleep(500);
    eleme = await scope.driver.findElement(By.name("untransmittedOrderQty"));
    eleme.sendKeys(webdriver.Key.CONTROL + "a");
    eleme.sendKeys(webdriver.Key.DELETE);
    await helper.sleep(500);
    var itemName = await orderingPage.GetActiveItemName();
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    console.log("itemDetails.maximumAllowableOrderQty  :" + itemDetails.maximumAllowableOrderQty);
           
    eleme.sendKeys(itemDetails.maximumAllowableOrderQty+1);
    //expect(eleme).to.be.equal(itemDetails.maximumAllowableOrderQty, "Maximum allowable Order Qty not matched");
    await helper.sleep(500);
    eleme.sendKeys(webdriver.Key.ENTER);
    await helper.sleep(500);
});

Then("Enter number Min number in order textbox and click on Enter Key for GR Item", async () => {
    var eleme = await scope.driver.findElement(By.name("untransmittedOrderQty"));
    eleme.click();
    await helper.sleep(500);
    eleme = await scope.driver.findElement(By.name("untransmittedOrderQty"));
    eleme.sendKeys(webdriver.Key.CONTROL + "a");
    eleme.sendKeys(webdriver.Key.DELETE);
    await helper.sleep(500);
    var itemName = await orderingPage.GetActiveItemName();
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    console.log("itemDetails.minimumAllowableOrderQty  :" + itemDetails.minimumAllowableOrderQty);
           
    eleme.sendKeys(itemDetails.minimumAllowableOrderQty - 1 );
    await helper.sleep(500);
    eleme.sendKeys(webdriver.Key.ENTER);
    await helper.sleep(500);
    //check for default value chnages to api value
});

Then("Verify Ordered Qty value in Review and Finalize page", function () {
    helper.sleep(500);
    //scope.driver.findElement(By.xpath("//*[@id='review-toggler']/i")).click();
    helper.sleep(500);
    var eleme =  scope.driver.findElement(By.name("untransmittedOrderQty"));
    console.log(eleme.getText());
    helper.sleep(500);
});

Then("Get the required GR Item details from the Service", async () => {
    var itemName = await orderingPage.GetActiveItemName();
    console.log("GR Item Name: " + itemName);
    expect(itemName).not.to.be.empty;
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    //WIll be using below GR Recap Page validations
    selectedItem = itemDetails.itemLongName;
    console.log("itemDetails_START");
    console.log(itemDetails);
    console.log("itemDetails_END");
});

Then("Click on Review and Finalize Button", async () => {
    //if(remain > 0 || remainingOrderStatus === false) {
    await orderingPage.ClickReviewAndFinalizeButton();
    await helper.sleep(1000);
    //}
});

Then("Get the Max allowable qty from services", async () => {
    var itemName = await orderingPage.GetActiveItemName();
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    console.log("itemDetails.maximumAllowableOrderQty  :" + itemDetails.maximumAllowableOrderQty);  
    
});

Then("Get the min allowable qty from services", async () => {
    var itemName = await orderingPage.GetActiveItemName();
    itemDetails = await Datasetup.GetNonDailyGRItemDetails(itemName);
    console.log("itemDetails.minimumAllowableOrderQty  :" + itemDetails.minimumAllowableOrderQty);
   
});

Then("user check the status and updated the OrderQty max", async () => {
    var order=  await scope.driver.findElement(By.xpath("//*[@id='vertical-tab-one']/div[3]/div[2]/div/div/table[1]/tbody[2]/tr/td[2]"));
    console.log("itemDetai val  :" + order.getText());
    if(order.getText()=="Approved"){
        await scope.driver.findElement(By.xpath("//*[@id='vertical-tab-one']/div[3]/div[2]/div/div/table[1]/tbody[2]/tr/td[1]")).click();
        var eleme = await scope.driver.findElement(By.name("untransmittedOrderQty"));
        eleme.sendKeys(webdriver.Key.CONTROL + "a");
        eleme.sendKeys(webdriver.Key.DELETE);
        await helper.sleep(500);
        itemDetails = await Datasetup.GetNonDailyGRItemDetails("untransmittedOrderQty");
        console.log("itemDetails.maximumAllowableOrderQty  :" + itemDetails.untransmittedOrderQty);
    
        eleme.sendKeys(itemDetails.untransmittedOrderQty+1);
        await helper.sleep(500);
        eleme.sendKeys(webdriver.Key.ENTER);
        await helper.sleep(500);
    }
});

Then("Click in Home Button in GR Recap page and verify the popup", async () => {
    AutoApprovalInfo = await orderingPage.AutoApproval();
    await helper.sleep(1000);
    console.log("AutoApprovalInfo: "+ AutoApprovalInfo);
    await LandingPage.clickHomeButton();
    await helper.sleep(1000);
    if (AutoApprovalInfo && AutoApprovalInfo == "OFF")
    {
        //for AutoApproval OFF
        var text = await orderingPage.ModalText();
        var modalTitle = await orderingPage.ModalTitle();    
        var OrdIncompleteNoBtn = await orderingPage.OrderIncompleteNoButton();
        var OrdIncompleteYesBtn = await orderingPage.OrderIncompleteYesButton();
        var OrdIncompleteYesBtnBgColor = await orderingPage.OrderIncompleteYesButtonBckGrndClr();
        expect(modalTitle).to.be.contains("Approval Needed");
        expect(text).to.contains("Are you sure you want to exit? Not all of your orders have been approved", "GR Recap page  Modal Text message is not matched");
        expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
        expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
        expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","On Home Click: RGB Style for OrdIncompleteYesBtnBgColor does not match");
        await orderingPage.ReviewPageNoButton();
    }
    else{
        //code handler for AutoApproval ON
    }
});

Then("Click On Close Button in GR Recap page and Verify pop up message", async () => {
    AutoApprovalInfo = await orderingPage.AutoApproval();
    await helper.sleep(1000);
    console.log("Close Btn - AutoApprovalInfo: "+ AutoApprovalInfo);
    await orderingPage.ClickPreviousButton();
    await helper.sleep(1000);
    if (AutoApprovalInfo && AutoApprovalInfo == "OFF")
    {
        var text = await orderingPage.ModalText();
        var modalTitle = await orderingPage.ModalTitle();    
        var OrdIncompleteNoBtn = await orderingPage.OrderIncompleteNoButton();
        var OrdIncompleteYesBtn = await orderingPage.OrderIncompleteYesButton();
        var OrdIncompleteYesBtnBgColor = await orderingPage.OrderIncompleteYesButtonBckGrndClr();
    
        if (text && text.includes("Are you sure you want to exit?")) {
            expect(modalTitle).to.be.contains("Approval Needed");
            expect(text).to.contains("Are you sure you want to exit? Not all of your orders have been approved", "GR Recap page  Modal Text message is not matched");
            expect(OrdIncompleteNoBtn).to.be.contains("No, Stay On Page");
            expect(OrdIncompleteYesBtn).to.be.contains("Yes, Exit");
            expect(OrdIncompleteYesBtnBgColor).to.be.equal("rgba(236, 37, 38, 1)","GR Recap page: On Close Button click: RGB Style for YesExit Btn Background Color does not match");
        }
        else {
            //await orderingPage.ReviewPageNoButton();
        }
    }
});
Then("Validate Tapping YES upon Close Button click, returns user to Order Landing page", async () => {
    
    if (AutoApprovalInfo && AutoApprovalInfo == "OFF")
    {
        await orderingPage.ReviewPageYesButton();
        await helper.sleep(1000);
        //var orderingCycle = driver.findElement(By.className("orderingCycle"));
        //expect(orderingCycle).not.to.be.null;
    }
    var orderLandingdetails = await scope.driver.getCurrentUrl();
    expect(orderLandingdetails).to.include("7boss/order/landing");
});
Then("Validate Tapping YES on Home Button click, returns user to Ordering Home", async () => {
    
    if (AutoApprovalInfo && AutoApprovalInfo == "OFF")
    {
        await LandingPage.clickHomeButton();
        await helper.sleep(1000);
        await orderingPage.ReviewPageYesButton();
        await helper.sleep(1000);
    }
    var orderLandingdetails = await scope.driver.getCurrentUrl();
    expect(orderLandingdetails).to.include("7boss/order/home");
});