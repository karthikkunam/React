var scope = require("../support/scope");
var webdriver = require("selenium-webdriver");
const helper = require("../support/Helper");
var until = webdriver.until;
const By = webdriver.By;
const OrderQuantitySelector = "untransmittedOrderQty";
const GRrecapButtonSelector = "gr-recap";
const GRLastRecalculatedSelector = ".gr-last-recalculated";
const GRFirstItemSelector = "gr-recap-cat-0";
const GrrecalculateSelector = "gr-recalculate";
const CategoryItemDescriptionSelector = "cusCatItemDesc";
const AllCheckboxesSelector = ".gr-group-checkmark";
const Question1Selector="box-qnty-0";
const GRFirstCategorySelector ="gr-recap-cat-0";
const GRCloseBtn = "btn-prev";
const GRApproveBtn = "btn-next";
const GRAutoApprovalState = ".gr-on-off";

const ClickGRrecapButton = async () => {
    scope.driver.wait(until.elementLocated(By.id(GRrecapButtonSelector)));
    return await scope.driver.findElement(By.id(GRrecapButtonSelector)).click();
};

const GRlastrecalicultedTime = async () => {
    scope.driver.wait(until.elementLocated(By.css(GRLastRecalculatedSelector)));
    return await scope.driver.findElement(By.css(GRLastRecalculatedSelector)).then(async (ele) => {
        var t = await ele.getText();
        var st = t.split(" ");
        console.log("Recalcuated Time: " + st[st.length - 1]);
        return st[st.length - 1];
    });
};

const SelectFirstItem = async () => {
    scope.driver.wait(until.elementLocated(By.id(GRFirstItemSelector)));
    return await scope.driver.findElement(By.id(GRFirstItemSelector)).click();
};

const ClickGrrecalculate = async () => {
    scope.driver.wait(until.elementLocated(By.className(GrrecalculateSelector)));
    return await scope.driver.findElement(By.className(GrrecalculateSelector)).click();
};

const ClickonGRrecapDropDown = async () => {
    return await scope.driver.findElement(By.className("promo-container")).then(async (dremOrderQty) => {
        return await dremOrderQty.findElement(By.xpath("..")).then(async (ele5) => {
            return await ele5.findElement(By.xpath("div//div//div//div/div")).then(async (el) => {
                el.click();
                await helper.sleep(2000);
                return el.findElement(By.xpath("..")).click();

            });

        });
    },
        function (err) {
            return null;
        });
};

const ClickCategoryItemDescriptionLabel = async () => {
    scope.driver.wait(until.elementLocated(By.className(CategoryItemDescriptionSelector)));
    return await scope.driver.findElement(By.className(CategoryItemDescriptionSelector)).click();
};

const GetAllCheckBoxes = async () => {
    return await scope.driver.findElements(By.css(AllCheckboxesSelector)).then(async (elements) => {
        return await elements;
    });
};

//EnterProjSalesValue
//const GetQuestion1Answer = async () => {
const EnterProjForeSalesValue = async () => {
    return await helper.findElementById(Question1Selector).then(function (ele) {
         ele.clear();
         return ele.sendKeys("200");
        
    });

};

const OrderQuantityTextBox = async () => {
    return await helper.findElementsByName(OrderQuantitySelector).sendKeys("100");
};
//AM
const clickCloseButton = async() => {
    scope.driver.wait(until.elementLocated(By.className(GRCloseBtn)));
    return await scope.driver.findElement(By.className(GRCloseBtn)).click();
};

const clickApproveButton = async() => {
    scope.driver.wait(until.elementLocated(By.className(GRApproveBtn)));
    return await scope.driver.findElement(By.className(GRApproveBtn)).click();
};
//

module.exports = {
    ClickGRrecapButton,
    GRlastrecalicultedTime,
    SelectFirstItem,
    ClickGrrecalculate,
    ClickonGRrecapDropDown,
    ClickCategoryItemDescriptionLabel,
    GetAllCheckBoxes,
    clickCloseButton,
    clickApproveButton,
    EnterProjForeSalesValue,
    OrderQuantityTextBox
}