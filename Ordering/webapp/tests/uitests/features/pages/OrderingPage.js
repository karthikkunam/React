/* eslint-disable no-unused-vars */
const helper = require("../support/Helper");
var scope = require("../support/scope");
var webdriver = require("selenium-webdriver");
const expect = require("chai").expect;
const until = webdriver.until;
const By = webdriver.By;
const actions = webdriver.Actions;
const DailyCheckboxSelector = "singleDay";
const CategoryTableSelector = "category-table";
const MultiDayCheckboxSelector = "multiDay";
const NonDailyCheckboxSelector = "nonDaily";
const singleDayItemSelector = ".coloring-stripe-Singleday label";
const ContinueButtonSelector = "btn-next";
const OrderQuantitySelector = "untransmittedOrderQty";
const ReviewAndFinalizeSelector = "enter-on-review";
const ReviewPageNoButtonSelector = "review-page-no";
const ModalBodySelector = "modal-body";
const GRAutoApproval = "gr-on-off";
const ReviewPageYesButtonSelector = "review-page-yes";
const ReviewPageYesButtonSelectorOrdIncomplete = "review-page-yes-updated";
const ReviewPageModalMessageSelector = "modal-body";
const ReviewPageModalMssgTitleSelector = "modal-title";
const submitButtonSelector = "enter-on-submit";
const DeliveredByLabelSelector = "deliver-mb";
const SubmittedByLabelSelector = "order-mb";
const DailyTrendDatesSelector = "item-row-daily";
const WeeklyTrendDatesSelector = "item-row-weekly";
const ToggleRemainingOrdersSelector = "react-toggle-track";
const ToggleRemainingOrderStateSelector = "react-toggle--checked";
const ModalCloseButtonSelector = "orderMin";
const ActiveItemSelector = ".item-name-active > u";
const CarriedRadioButtonSelector = "Carried-desktop";
const AllRadioButtonSelector = "All-desktop";
const UpArrowSelector = "fa-angle-up";
const DownArrowSelector = "fa-angle-down";
const PreviousButtonSelector = "btn-prev";
const Question1Selector = "box-qnty-0";
const Question2Selector = "box-qnty-1";
const Question3Selector = "box-qnty-2";
const Question4Selector = "box-qnty-3";
const ItemCountSelector = "review-items-count";
const modalWindowSelector = "modal-content";
const MultiDayFirstItemSelector = "multi-day-cat-0";
const MultiDayAllItemsSelector = ".coloring-stripe-Multiday label";
const NonDailyAllItemsSelector = ".coloring-stripe-Nondaily label";
const FormulaTotalSelector = "total";
const FormulaNextDaySellSelector = "sellexp";
const FormulaInventorySelector = "inventory";
const FormulaEstimatedSelector = "estimation";
const FormulaNextTwoDaysSellSelector = "sell";
const pendingDeliverySelector = "non-daily-inventory";
const NonDailyRemainingOrderQtySelector = ".category-table > table > thead > tr > .cusRemNonDay";
const DailyRemainingOrderQtySelector = ".category-table > table > thead > tr > .cusRemSingleDay";
const DailyAvailableOrderQtySelector = "//*[@class='container']/tr/td[3]";
const MultiDayRemainingOrderQtySelector = ".category-table > table > thead > tr > .cusRemMultiDay";
const NonDailyTotalBoxSelector = "totalbox";
const NonDailyMinBoxSelector = "minbox";
const LduMinQtySelector = "btn-ldu-min";
const LduMaxQtySelector = "btn-ldu-max";
const NonDailyOrderSelector = "non-daily-order";
const NonDailyInventorySelector = "inventory-val";
const NonDailyForecastSelector = ".forecast-content .ono-val";
const OrderMinqtySelctor = "orderMin";
const ChooseDeriredMaxQtySelector = "btn-default";
const TooltipSelectorSelector = ".item-detail-info";		
const itemNameSelector = "item-name";		
const SalesForecastDataSelector = ".item-row-weekly .item-row-daily-body";
const OrderQuantitySelectorExpanded = "fa-angle-up";
const NonDailyGRAllItemsSelector = ".gr-item-text label";

//preceding-sibling

const ClickDailyCheckbox = async () => {
    return await helper.findElementByName(DailyCheckboxSelector).then(function (sibling) {
        return sibling.findElement(By.xpath("following-sibling::*")).click();
    });
};

const SelectMultiDay = async () => {
    return await helper.findElementByName(MultiDayCheckboxSelector).then(async (sibling) => {
        return await sibling.findElement(By.xpath("following-sibling::*")).click();
    });

};

const ClickNonDailyCheckbox = async () => {
    return await helper.findElementByName(NonDailyCheckboxSelector).then(function (sibling) {
        return sibling.findElement(By.xpath("following-sibling::*")).click();
    });

};

const GetSingleDayItems = async () => {
    return await helper.findElementsByCss(singleDayItemSelector);
};

const ClickOnContinueButton = async () => {
    return await helper.findElementById(ContinueButtonSelector).then(function (cButton) {
        return cButton.click();
    });
};

const GetNoofRows = async () => {
    return await helper.findElementByClassName(CategoryTableSelector).then(function (sibling) {
        return sibling.findElements(By.tagName("table")).then(function (table) {
            return table.length;
        });
    });
};

const OrderQuantityTextBox = async () => {
    return await helper.findElementsByName(OrderQuantitySelector);
};

const GetOrderQuantity = async (ind) => {
    return await helper.findElementsByName(OrderQuantitySelector).then(async (ele) => {
        try
        {
            if(ele[ind] == undefined)
            {
                return 0;
            }
            return ele[ind].getAttribute("value");
        }
        catch(ex)
        {
            console.log("may be it is a blocked item");
            return 0;
        }
    });
};

const OrderQuantityTextBoxExpanded = async () => {
    return await helper.findElementByClassName(OrderQuantitySelectorExpanded);
};

const ClickReviewAndFinalizeButton = async () => {
    return await helper.findElementById(ReviewAndFinalizeSelector).then(function (webElement) {
        return webElement.click();
        // eslint-disable-next-line no-unused-vars
    }, function (err) {
        return null;
    });
};

const ReviewPageNoButton = async () => {
    return await helper.findElementByClassName(ReviewPageNoButtonSelector).then(function (webElement) {
        if (webElement) {
            return webElement.click();
        } else {
            expect(webElement).to.not.equals("null", "Unable to find the element");
        }
    });
};

const ModalText = async () => {
    return await helper.findElementByClassName(ReviewPageModalMessageSelector).then(function (messgae) {
        if (messgae) {
            return messgae.getText();
        } else {
            expect(messgae).to.not.equals("null", "Unable to find the element");
        }
    });
};

const ModalTitle = async () => {
    return await helper.findElementByClassName(ReviewPageModalMssgTitleSelector).then(function (message) {
        if (message) {
            return message.getText();
        } else {
            expect(message).to.not.equals("null", "Unable to find the Modal Title element");
        }
    });
};

const OrderIncompleteNoButton = async () => {
    return await helper.findElementByClassName(ReviewPageNoButtonSelector).then(function (message) {
        if (message) {
            return message.getText();
        } else {
            expect(message).to.not.equals("null", "Unable to find the No Button element");
        }
    });
};

const OrderIncompleteYesButton = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelector).then(function (message) {
        if (message) {
            return message.getText();
        } else {
            expect(message).to.not.equals("null", "Unable to find the Yes Button element");
        }
    });
};

const OrderIncompleteYesButtonBckGrndClr = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelector).then(function (message) {
        if (message) {
            return message.getCssValue("background-color");
        } else {
            expect(message).to.not.equals("null", "Unable to find the Yes Button element");
        }
    });
};

const OrderIncompleteYesButtonOnRevFinClick = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelectorOrdIncomplete).then(function (message) {
        if (message) {
            return message.getText();
        } else {
            expect(message).to.not.equals("null", "Unable to find the Yes Button element");
        }
    });
};

const OrdIncompleteProceedBtnBckGrndClr = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelectorOrdIncomplete).then(function (message) {
        if (message) {
            return message.getCssValue("background-color");
        } else {
            expect(message).to.not.equals("null", "Unable to find the Yes Button element");
        }
    });
};

const ReviewPageYesButton = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelector).then(function (webElement) {
        if (webElement) {
            return webElement.click();
        } else {
            expect(webElement).to.not.equals("null", "Unable to find the element");
        }
    });
};

const ReviewPageYesUpdatedButton = async () => {
    return await helper.findElementByClassName(ReviewPageYesButtonSelectorOrdIncomplete).then(function (webElement) {
        if (webElement) {
            return webElement.click();
        } else {
            expect(webElement).to.not.equals("null", "Unable to find the element");
        }
    });
};

const ClickOnSubmitButton = async () => {
    return await helper.findElementById(submitButtonSelector).then(function (submitButton) {
        return submitButton.click();
    });
};

const OrderSubmitDate = async () => {
    return await helper.findElementByClassName(SubmittedByLabelSelector).then(function (txt) {
        return txt.getText();
    });

};

const OrderDeliverDate = async () => {
    return await helper.findElementByClassName(DeliveredByLabelSelector).then(function (dd) {
        return dd.getText();
    });
};

const DailyTrendDates = async () => {
    var DailyTrend = {
        Trend: []
    };

    return await helper.findElementsByClassName(DailyTrendDatesSelector).then(async (txt1) => {
        for(var i=0;i<txt1.length;i++) {
            var d = await txt1[i].getText();
            var data = d.split("\n");
            if (data[0] !== "") {
                var jsonData = {};
                jsonData["Date"] = data[0];
                jsonData["Temp"] = data[1];
                jsonData["Delivered"] = data[2];
                jsonData["Sales"] = data[3];
                jsonData["WriteOff"] = data[4];
                DailyTrend.Trend.push(jsonData);
            }
        }
        return DailyTrend;
    });
};

const WeeklyTrendDates = async () => {
    var WeeklyTrend = {
        Trend: []
    };

    return await helper.findElementsByClassName(WeeklyTrendDatesSelector).then(async (txt1) => {
        for(var i=0;i<txt1.length;i++) {
            var d = await txt1[i].getText();
            var data = d.split("\n");
            if (data[0] !== "") {
                var jsonData = {};
                jsonData["Date"] = data[0];
                jsonData["Temp"] = data[1];
                jsonData["Delivered"] = data[2];
                jsonData["Sales"] = data[3];
                jsonData["WriteOff"] = data[4];
                WeeklyTrend.Trend.push(jsonData);
            }
        }
        return WeeklyTrend;
    });
};

const WeeklyTrendDatesforMultiDayItem = async () => {
    var WeeklyTrendDatesforMultiDayItem = {
        Trend: []
    };

    return await helper.findElementsByCss(".body-background-multi .item-row-weekly").then(async (txt2) => {
        for(var i=0;i<txt2.length;i++) {
            var d = await txt2[i].getText();
            var data = d.split("\n");
            if (data[0] !== "") {
                var jsonData = {};
                jsonData["Date"] = data[0];
                jsonData["Temp"] = data[1];
                jsonData["Delivered"] = data[2];
                jsonData["Sales"] = data[3];
                jsonData["WriteOff"] = data[4];
                WeeklyTrendDatesforMultiDayItem.Trend.push(jsonData);
            }
        }
        return WeeklyTrendDatesforMultiDayItem;
    });
};

const Next2DaysWeeklyTrendDatesforMultiDayItem = async () => {

    var WeeklyTrend = {
        Trend: []
    };

    return await helper.findElementsByCss(".body-background-multi-trend .item-row-weekly").then(async (txt2) => {
        for(var i=0;i<txt2.length;i++) {
            var d = await txt2[i].getText();
            var data = d.split("\n");
            if (data[0] !== "") {
                var jsonData = {};
                jsonData["Date"] = data[0];
                jsonData["Temp"] = data[1];
                jsonData["Delivered"] = data[2];
                jsonData["Sales"] = data[3];
                jsonData["WriteOff"] = data[4];
                WeeklyTrend.Trend.push(jsonData);
            }
        }
        return WeeklyTrend;
    });
};

const ToggleReminingItemsButton = async () => {
    return await helper.findElementByClassName(ToggleRemainingOrdersSelector).then(function (remainingItemsButton) {
        return remainingItemsButton.click();
    });
};

const GetOrderRemainingItemsState = async () => {
    try {
        var result = await helper.findElementByClassName(ToggleRemainingOrderStateSelector);
        return await result.getAttribute("class");
    }
    catch (error)
    {
        return false;
    }
};

const ModalDialogText = async () => {		
    return await helper.findElementByClassName(ModalBodySelector).then(async (body) => {		
        if (body) {		
            return await body.getText();		
        } 		
    }, function (err) {		
        return null;		
    });		
};

const AutoApproval = async () => {		
    return await helper.findElementByClassName(GRAutoApproval).then(async (ele) => {
        return await ele.getText();
    });		
};

const CloseModalPopup = async () => {
    return await helper.findElementById(ModalCloseButtonSelector).then(function (closeButton) {
        return closeButton.click();
    });
};

const GetActiveItem = async () => {		
    return await helper.findElementByCss(ActiveItemSelector);		
};	

const GetActiveItemName = async () => {
    return await helper.findElementByCss(ActiveItemSelector).then(async (dremOrderQty) => {
        return dremOrderQty.getText();
    });
};

const ClickOnCarriedRadioButton = async () => {
    return await helper.findElementById(CarriedRadioButtonSelector).then(function (closeButton) {
        return closeButton.click();
    });
};

const ClickOnAllRadioButton = async () => {
    return await helper.findElementById(AllRadioButtonSelector).then(function (closeButton) {
        return closeButton.click();
    });
};

const ClickOnUpArrow = async () => {
    return await helper.findElementByClassName(UpArrowSelector).then(function (element) {
        return element.click();
    });
};

const ClickOnDownArrow = async (index) => {		
    return await helper.findElementsByClassName(DownArrowSelector).then(function (element) {		
        return element[index].click();		
    });		
};

const ClickPreviousButton = async () => {
    return await helper.findElementById(PreviousButtonSelector).then(function (closeButton) {
        return closeButton.click();
    });
};

const Question1 = async () => {
    return await helper.findElementById(Question1Selector);
};

const Question2 = async () => {
    return await helper.findElementById(Question2Selector);
};

const Question3 = async () => {
    return await helper.findElementById(Question3Selector);
};

const Question4 = async () => {
    return await helper.findElementById(Question4Selector);
};

const GetitemCount = async () => {
    return await helper.findElementByClassName(ItemCountSelector).then(function (itemd) {
        return itemd.getText();
    });
};

const GetitemCount1 = async () => {
    let total = 0;
    return await helper.findElementByClassName(ItemCountSelector).then(async (itemd) => {
        for (var i = 0; i < itemd.length; i++) {
            var d = await itemd[i].getText();
            total = parseInt(total) + parseInt(d);
        }
        return total;
    });
};

const GetModalWindow = async () => {
    return await helper.findElementByClassName(modalWindowSelector);
};

const SelectFirstMultiDayItem = async () => {
    return await helper.findElementById(MultiDayAllItemsSelector).then(function (closeButton) {
        return closeButton.click();
    });
};

const GetMultiDayItems = async () => {
    return await helper.findElementsByCss(MultiDayAllItemsSelector);
};

const GetNonDailyItems = async () => {
    return await helper.findElementsByCss(NonDailyAllItemsSelector);
};

const GetNonDailyItemsPjSales = async () => {
    return await helper.findElementsByXpath("//*[@id='vertical-tab-one']/div[5]/div");
};


const GetGRRecapPageItems = async () => {
    return await helper.findElementsByCss(NonDailyGRAllItemsSelector);
};

const GetFormulaTotalText = async () => {
    return await helper.findElementByName(FormulaTotalSelector).then(function (total) {
        if(total) {		
            return total.getAttribute("value");		
        } else {		
            return null;		
        }
    });
};

const GetNonDailyFormulaTotalText = async () => {
    return await helper.findElementByName("totalbox").then(function (total) {
        return total.getAttribute("value");
    }, function (err) {
        return null;
    });
};

const GetFormulaNextDayExpQtyText = async () => {
    return await helper.findElementByName(FormulaNextDaySellSelector).then(function (nextdaysell) {
        return nextdaysell.getAttribute("value");
    });
};

const GetFormulaNextTwoDaysSellExpText = async () => {
    return await helper.findElementByName(FormulaNextTwoDaysSellSelector).then(function (ele) {
        return ele.getAttribute("value");
    });

};

const GetFormulaInventoryText = async () => {
    return await helper.findElementsByName(FormulaInventorySelector).then(function (inv) {
        return inv[1].getAttribute("value");
    });
};

const GetFormulaEstimatedText = async () => {
    return await helper.findElementByName(FormulaEstimatedSelector).then(function (ele) {
        return ele.getAttribute("value");
    });
};

const GetQuestion1Answer = async () => {
    return await helper.findElementById(Question1Selector).then(function (ele) {
        return ele.getAttribute("value");
    });

};

const GetQuestion2Answer = async () => {
    return await helper.findElementById(Question2Selector).then(function (ele) {
        return ele.getAttribute("value");
    });
};

const GetQuestion3Answer = async () => {
    return await helper.findElementById(Question3Selector).then(function (ele) {
        return ele.getAttribute("value");
    });
};

const GetQuestion4Answer = async () => {
    return await helper.findElementById(Question4Selector).then(function (ele) {
        return ele.getAttribute("value");
    });
};

const GetNonDailyPendingDeliveryQty = async () => {
    return await helper.findElementByClassName(pendingDeliverySelector).then(async (webElement) => {
        var val = await webElement.getText();
        console.log(" Pending Delivery value ******************** : " + val);
        return val;
    }, function (err) {
        return 0;
    });
};

const GetTotalRemainingOrdersForNonDaily = async () => {
    let ntotal = 0;
    return await helper.findElementsByCss(NonDailyRemainingOrderQtySelector).then(async (ndremOrderQty) => {
        for (var i = 0; i < ndremOrderQty.length; i++) {
            var d = await ndremOrderQty[i].getText();
            ntotal = parseInt(ntotal) + parseInt(d);
        }
        return ntotal;
    },
    function (err) {
        return null;
    });
};

const GetTotalRemainingOrdersForMultiDay = async () => {
    var total = 0;
    return await helper.findElementsByCss(MultiDayRemainingOrderQtySelector).then(async (remOrderQty) => {
        for (var i = 0; i < remOrderQty.length; i++) {
            var d = await remOrderQty[i].getText();
            total = parseInt(total) + parseInt(d);
        }
        return total;
    },
    function (err) {
        return null;
    });
};

const GetTotalRemainingOrdersForDaily = async () => {
    let dtotal = 0;
    return await helper.findElementsByCss(DailyRemainingOrderQtySelector).then(async (dremOrderQty) => {
        for (var i = 0; i < dremOrderQty.length; i++) {
            var d = await dremOrderQty[i].getText();
            dtotal = parseInt(dtotal) + parseInt(d);
        }
        return dtotal;
    },
    function (err) {
        return null;
    });
};

const GetTotalAvilableOrdersForDaily = async () => {
    let dtotal = 0;
    return await helper.findElementsByCss(DailyRemainingOrderQtySelector).then(async (dremOrderQty) => {
        for (var i = 0; i < dremOrderQty.length; i++) {
            var avilable = dremOrderQty[i];
            var d = await avilable.findElement(By.xpath("preceding-sibling::td[1]")).then(function (ele1) {
                return ele1.getText();
            });
            dtotal = parseInt(dtotal) + parseInt(d);
        }
        return dtotal;
    },
    function (err) {
        return null;
    });
};

const GetTotalAvilableOrdersForNonDaily = async () => {
    let dtotal = 0;
    return await helper.findElementsByCss(NonDailyRemainingOrderQtySelector).then(async (dremOrderQty) => {
        for (var i = 0; i < dremOrderQty.length; i++) {
            var avilable = dremOrderQty[i];
            var d = await avilable.findElement(By.xpath("preceding-sibling::td[1]")).then(function (ele1) {
                return ele1.getText();
            });
            dtotal = parseInt(dtotal) + parseInt(d);
        }
        return dtotal;
    },
    function (err) {
        return null;
    });
};

const GetNonDailyTotalBox = async () => {
    return await helper.findElementByName(NonDailyTotalBoxSelector).then(async (totalBox) => {
        return totalBox.getText();
    },
    function (err) {
        return null;
    });
};

const GetNonDailyTotalBoxText = async () => {
    return await helper.findElementByName(NonDailyTotalBoxSelector).then(async (totalBox) => {
        return totalBox.getText();
    },
    function (err) {
        return null;
    });
};

const GetNonDailyMinBoxText = async () => {
    return await helper.findElementByName(NonDailyMinBoxSelector).then(async (minBox) => {
        return minBox.getAttribute("value");
    },
    function (err) {
        return null;
    });
};

const GetNonDailyForecastText = async () => {
    return await helper.findElementByCss(NonDailyForecastSelector).then(async (minBox) => {
        return minBox.getText();
    },
    function (err) {
        return null;
    });
};


const GetNonDailyInventoryText = async () => {
    return await helper.findElementByClassName(NonDailyInventorySelector).then(async (minBox) => {
        return minBox.getText();
    },
    function (err) {
        return null;
    });
};

const GetNonDailyOrderText = async () => {
    return await helper.findElementByClassName(NonDailyOrderSelector).then(async (minBox) => {
        return minBox.getText();
    },
    function (err) {
        return null;
    });
};

const LduMinQuantitySelector = async () => {
    return await helper.findElementById(LduMinQtySelector).then(async (lduDialog) => {
        return await lduDialog.click();
    });
};

const orderMinQty = async () => {
    return await helper.findElementById(OrderMinqtySelctor).then(async (lduDialog) => {
        return await lduDialog.click();
    });
};

const ChooseDesiredMaxQty = async () => {
    return await helper.findElementById(ChooseDeriredMaxQtySelector).then(async (lduDialog) => {
        return await lduDialog.click();
    });
};

const GetFormulaques1 = async() => 
{
    return await helper.findElementById("box-qnty-1").then(function(total)
    {
        return total.getAttribute("value");
    });
};

const GetFormulaques2 = async() => 
{
    return await helper.findElementById("box-qnty-2").then(function(total)
    {
        return total.getAttribute("value");
    },
    function(err) {
        console.log(err);
        return null;
    });
};

const GetFormulaNextCarryOver = async() => {
    return await helper.findElementByName(FormulaInventorySelector).then(function(carryover) {
        return carryover.getAttribute("value");
    }, function(err) {
        console.log(err);
        return null;
    });
};

const GetTooltipText = async (element) => {	
    await scope.driver.actions().click(element).perform();		
    await helper.sleep(1000);		
    var toolTipText = {		
    };		
    return await helper.findElementsByCss(TooltipSelectorSelector).then(async (tooltip) => {		
        for(var i=0;i<tooltip.length; i++) {		
            var text = await tooltip[i].getText();	
            
            console.log(text);

            if(text.includes("Item Description")) {		
                if(text.split(":")[1] != "") {		
                    toolTipText["ItemDescription"] = text.split(":")[1];		
                    console.log("ItemDescription1111: "+ toolTipText["ItemDescription"]);
                } else {		
                    toolTipText["ItemDescription"] = "undefined";		
                }		
            } else if(text.includes("UPC")) {		
                if(text.split(":")[1] != "") {		
                    toolTipText["UPC"] = text.split(":")[1];	
                    console.log("UPC11111: " + toolTipText["UPC"]);	
                } else {		
                    toolTipText["UPC"] = "undefined";		
                }		
            } else if(text.includes("Item Number")) {		
                if(text.split(":")[1] != "") {		
                    toolTipText["ItemNumber"] = text.split(":")[1];		
                    console.log("ItemNumber1111: " + toolTipText["ItemNumber"]);
                } else {		
                    toolTipText["ItemNumber"] = "undefined";		
                }		
            } else if(text.includes("Store Rank")) {		
                if(text.split(":")[1] != "") {		
                    toolTipText["storeRank"] = text.split(":")[1];		
                } else {		
                    toolTipText["storeRank"] = "undefined";		
                }		
            } else if(text.includes("Market Rank")) {		
                if(text.split(":")[1] != "") {		
                    toolTipText["marketRank"] = text.split(":")[1];		
                } else {		
                    toolTipText["marketRank"] = null;		
                }		
            } else if(text.includes("Registration")) {		
            		
                if(text.split(":")[1].trim() == "C") {		
                    toolTipText["registrationStatus"] = "Carry";		
                } else if(text.split(":")[1].trim() == "U") {		
                    toolTipText["registrationStatus"] = "Unregistered";		
                }		
                else {		
                    toolTipText["registrationStatus"] = "Non Carry";		
                }		
            } else if(text.includes("Retail")) {		
                toolTipText["retailPrice"] = text.split(":")[1];		
            } else if(text.includes("Billback")) {		
                if(text.split(":")[1].trim() == "No") {		
                    toolTipText["isBillBackAvailable"] = false;		
                } else {		
                    toolTipText["isBillBackAvailable"] = true;  		
                }		
            } else if(text.includes("Status")) {		
                toolTipText["itemStatus"] = text.split(":")[1];	
            } else if(text.includes("Day Lead")) {		
                toolTipText["leadTime"] = text.split(" ")[0];
                toolTipText["shelfLife"] = text.split(" ")[3];
                console.log("leadTime: "+ toolTipText["leadTime"]);
                console.log("shelfLife: "+  toolTipText["shelfLife"]);
            }		
        }		
        return toolTipText;		
    },		
    function (err) {		
        return null;		
    });		
};

const MoveCursor = async (element) => {		
    return await scope.driver.actions().mouseMove(element, 100,100).perform();		
};
	
const GetAllItemsNameAndOrderQty = async() => {		
    var singleDayitems = {		
        item: []		
    };	
    return await helper.findElementsByClassName(itemNameSelector).then(async(singleDayItems) => {		
        for(var i= 0;i <singleDayItems.length; i++ ) {		
            var sitem = {};		
            sitem["Name"] = await singleDayItems[i].getText();		
            sitem["OrderQty"] = await GetOrderQuantity(i);		
            singleDayitems.item.push(sitem);		
        }		
        return singleDayitems;		
    }, function(err) {		
        return null;		
    });		
};

const GetReviewCount = async() => {
    var total=0;
    return await helper.findElementsByClassName(ItemCountSelector).then(async(itemd)=> {
        for(var i=0;i<itemd.length;i++) {
            var d = await itemd[i].getText();
            total = parseInt(total) + parseInt(d);
        }
        return total;
    });
};

const GetItemsExpandedCount = async() => {
    var total=0;
    return await helper.findElementsByClassName(OrderQuantitySelectorExpanded).then(async(itemd)=> {
        for(var i=0;i<itemd.length;i++) {
            //var d = await itemd[i].getText();
            total = parseInt(total) + 1;
            console.log("Items Expanded Count:", total);
        }
        return total;
    });
};

const GetNonDailyGRMinBoxText = async () => {
    return await helper.findElementByName(NonDailyMinBoxSelector).then(async (minBox) => {
        return minBox.getAttribute("value");
    },
    function (err) {
        return null;
    });
};

const GetNonDailyGRPendingDeliveryQty = async () => {
    return await helper.findElementByClassName(pendingDeliverySelector).then(async (webElement) => {
        var val = await webElement.getText();
        console.log(" OnO Pending delivery value : " + val);
        return val;
    }, function (err) {
        return 0;
    });
};

const GetNonDailyGRForecastText = async () => {
    return await helper.findElementByCss(NonDailyForecastSelector).then(async (ProjF) => {
        return ProjF.getText();
    },
    function (err) {
        return null;
    });
};

const GetNonDailyGROrderText = async () => {
    return await helper.findElementByClassName(NonDailyOrderSelector).then(async (Order) => {
        return Order.getText();
    },
    function (err) {
        return null;
    });
};

const GetNonDailyGRFormulaTotalText = async () => {
    return await helper.findElementByName("totalbox").then(function (total) {
        return total.getAttribute("value");
    }, function (err) {
        return null;
    });
};

module.exports = {
    ClickDailyCheckbox,
    GetNoofRows,
    ClickNonDailyCheckbox,
    GetSingleDayItems,
    ClickOnContinueButton,
    OrderQuantityTextBox,
    ClickReviewAndFinalizeButton,
    ReviewPageNoButton,
    ModalText,
    ReviewPageYesButton,
    ClickOnSubmitButton,
    OrderSubmitDate,
    OrderDeliverDate,
    SelectMultiDay,
    DailyTrendDates,
    ToggleReminingItemsButton,
    GetOrderRemainingItemsState,
    WeeklyTrendDates,
    ModalDialogText,
    CloseModalPopup,
    ClickOnCarriedRadioButton,
    ClickOnAllRadioButton,
    ClickOnUpArrow,
    ClickOnDownArrow,
    ClickPreviousButton,
    Question1,
    Question2,
    Question3,
    Question4,
    GetitemCount,
    GetModalWindow,
    GetOrderQuantity,
    SelectFirstMultiDayItem,
    GetFormulaTotalText,
    GetFormulaNextDayExpQtyText,
    GetFormulaNextTwoDaysSellExpText,
    GetFormulaInventoryText,
    GetFormulaEstimatedText,
    GetQuestion1Answer,
    GetQuestion2Answer,
    GetQuestion3Answer,
    GetQuestion4Answer,
    GetNonDailyPendingDeliveryQty,
    GetMultiDayItems,
    WeeklyTrendDatesforMultiDayItem,
    Next2DaysWeeklyTrendDatesforMultiDayItem,
    GetNonDailyItems,
    GetTotalRemainingOrdersForNonDaily,
    GetTotalRemainingOrdersForMultiDay,
    GetTotalRemainingOrdersForDaily,
    GetNonDailyTotalBox,
    GetNonDailyTotalBoxText,
    GetNonDailyMinBoxText,
    GetNonDailyFormulaTotalText,
    GetTotalAvilableOrdersForDaily,
    GetActiveItemName,
    GetTotalAvilableOrdersForNonDaily,
    LduMinQuantitySelector,
    GetNonDailyForecastText,
    GetNonDailyInventoryText,
    GetNonDailyOrderText,
    orderMinQty,
    GetitemCount1,
    ChooseDesiredMaxQty,
    GetFormulaques1,
    GetFormulaques2,
    GetFormulaNextCarryOver,
    GetReviewCount,
    GetTooltipText,		
    GetActiveItem,		
    MoveCursor,		
    GetAllItemsNameAndOrderQty,
    OrderQuantityTextBoxExpanded,
    GetItemsExpandedCount,
    GetNonDailyGRMinBoxText,
    GetNonDailyGRPendingDeliveryQty,
    GetNonDailyGROrderText,
    GetNonDailyGRFormulaTotalText,
    GetNonDailyGRForecastText,
    GetGRRecapPageItems,
    GetNonDailyItemsPjSales,
    ModalTitle,
    OrderIncompleteNoButton,
    OrderIncompleteYesButton,
    ReviewPageYesButtonSelectorOrdIncomplete,
    OrderIncompleteYesButtonOnRevFinClick,
    OrderIncompleteYesButtonBckGrndClr,
    OrdIncompleteProceedBtnBckGrndClr,
    DailyAvailableOrderQtySelector,
    GRAutoApproval,
    AutoApproval,
    ReviewPageYesUpdatedButton
};
