const {Given, Then } = require("cucumber");
const expect = require("expect");
const scope = require("../support/scope");
const {SUBMIT_X_PATH,ID_X_PATH, PASSWORD_X_PATH} = require('../PageObjects/login')
const common = require('../common/stepDefinitions')
//const { LoginHomePage } = require("../Scripts/Loginscript");


Given('I am at the login page', function () {
    // Write code here that turns the phrase above into concrete actions
    return ;
});

Then('I enter invalid ID',async function(){
    // await scope.context.currentPage.type(ID_X_PATH, '60',{delay: 50});
    await common.typeUserId(ID_X_PATH, 60)
    await common.typePassword(PASSWORD_X_PATH, 711291)
    // await scope.context.currentPage.type(PASSWORD_X_PATH, '71',{delay: 50});
});

Then('I enter invalid Password',async function(){
//    await scope.context.currentPage.type(ID_X_PATH, '40',{delay: 50});
//    await scope.context.currentPage.type(PASSWORD_X_PATH, '711290',{delay: 50});
    await common.typeUserId(ID_X_PATH, 40)
    await common.typePassword(PASSWORD_X_PATH, 711290)
 });

Then('I enter valid credentials',async function(){
    await scope.context.currentPage.type(ID_X_PATH, '41',{delay: 50});
    await scope.context.currentPage.type(PASSWORD_X_PATH, '711291',{delay: 50});
    //await LoginHomePage();
    //await Clickonstore();
});

Then('I click on Submit button',async function(){
    // await scope.context.currentPage.click(SUBMIT_X_PATH);
    await common.clickElement(SUBMIT_X_PATH);
    //
});

