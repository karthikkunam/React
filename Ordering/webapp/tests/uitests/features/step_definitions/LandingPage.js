const { When, Then } = require("cucumber");
const expect = require("chai").expect;
const scope = require("../support/scope");
const landingPage = require("../pages/LandingPage");
const helper = require("../support/Helper");
const orderingPage = require("../pages/OrderingPage");
var webdriver = require("selenium-webdriver");
let remain = 0;

When("SevenBOSS application launches ISP Landing page", async () => {
    await scope.driver.get(scope.URL);
});

Then("Verify PlaceOrder tile got loaded and it has some data", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    await landingPage.clickPlaceOrderButton();
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    await landingPage.OrderingHeaderLabel().then(function (result) {
        expect(result).to.include(scope.StoreNumber);
        expect(result).to.include("ORDERING");
    });

    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    var c = await orderingPage.GetNoofRows();
    expect(c).to.be.above(0);
    landingPage.clickHomeButton();
});

Then("Verify reporting tile", async () => {
    await landingPage.clickReportingButton();
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    await landingPage.OrderingHeaderLabel().then(function (result) {
        expect(result).to.include(scope.StoreNumber);
        expect(result).to.include("REPORTING");
    });
    await helper.sleep(5000);
    await landingPage.clickHomeButton();
});

Then("Verify Support functions tile", async () => {
    await landingPage.clickSupportFunctionsButton();
    await landingPage.ClickStoreOrderErrors();
    await landingPage.OrderingHeaderLabel().then(function (result) {
        expect(result).to.include(scope.StoreNumber);
        expect(result).to.include("ERRORS");
    });
    return await landingPage.clickHomeButton();
});

Then("Click Place Order from Landing Page to navigate to Order Selection page.", async () => {
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
    await landingPage.clickHomeButton();
    await orderingPage.ReviewPageNoButton();
    await helper.sleep(1000);
    await orderingPage.ReviewPageYesButton();
    await helper.sleep(1000);
    await landingPage.clickPlaceOrderButton();
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);
});

Then("Check Daily order cycle to verify Single Day category items.", async () => {
    await orderingPage.UnSelectMultiDay();
    await orderingPage.ClickNonDailyCheckbox();
});

Then("Select Single Day Category items from Ordering Selection Page and click Continue button.", async () => {
    await orderingPage.SelectFirstSingleDayItem();
    scope.remain = await orderingPage.RemainingToOrder();
    await orderingPage.ClickOnContinueButton();
    await landingPage.WaitforSpinnerToClose();
    await helper.sleep(1000);

    if (scope.remain > 0) {
        var order = await orderingPage.OrderQuantityTextBox();
        expect(await webdriver.WebElement.equals(order, scope.driver.switchTo().activeElement())).to.be.true;
        scope.driver.switchTo().defaultContent();
    }
});

Then("Enter Zero in Order quantity and verify the message", async () => {
    if (scope.remain > 0) {
        await helper.sleep(1000);
        var order = await orderingPage.OrderQuantityTextBox();
        order.sendKeys("0");
        order.sendKeys(webdriver.Key.ENTER);
        orderingPage.ClickReviewAndFinalizeButton();
        await helper.sleep(1000);
        orderingPage.ReviewPageNoButton();
        await helper.sleep(1000);
    }
    else {
        await helper.sleep(1000);
        await orderingPage.ClickOnSubmitButton();
        await helper.sleep(1000);
        await landingPage.WaitforSpinnerToClose();
        await helper.sleep(1000);
    }
});

Then("Click on Home Button to open SevenBOSS home page", async () => {
    await landingPage.clickHomeButton();
    await helper.sleep(1000);
});


