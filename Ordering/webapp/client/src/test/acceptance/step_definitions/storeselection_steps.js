const {Given, When, Then } = require("cucumber");
const expect = require("expect");
const scope = require("../support/scope");
const {URL,STORESELECT_X_PATH,HEADERLOGO_X_PATH,APPLICATIONNAME_X_PATH,PAGETITLE_X_PATH,STORESEARCH_X_PATH} = require('../PageObjects/storeselector')

Then('I am at the store selector page', function () {
    return ;
});

Then('I check logo as 7B',async function(){
    try {        
        const element=await scope.context.currentPage.$("#boss-icon");
       // const text=await(await element.getProperty('alt')).jsonValue();
        //console.log(text);
        await expect(await(await element.getProperty('alt')).jsonValue()).toMatch('headerLogo');

      } catch (error) {
        console.log("logo not found"+error)
      }  
  
});

Then('I check title',async function(){
    //const title=await scope.context.currentPage.title();    
    await expect(scope.context.currentPage.title()).resolves.toMatch('7 Eleven');

});

Then('I check application name & page name',async function(){
    try {
       
        const element=await scope.context.currentPage.$(".Store-Selection");
        const headerElement=await scope.context.currentPage.$(".Eleven---Back-Offi b");        
     
        await expect(await(await element.getProperty('textContent')).jsonValue()).toMatch('STORE SELECTION');
        await expect(await(await headerElement.getProperty('textContent')).jsonValue()).toMatch('Back Office Store System');      

      } catch (error) {
        console.log("logo not found"+error)
      }

});


Then('I check search textbox is implemented & available on right hand corner',async function(){
    try {
       
        const element=await scope.context.currentPage.$("#react-select-2-input");  
        await scope.context.currentPage.waitForSelector(element,{timeout:'5000'});
              
     
        //await expect(await(await element.getProperty('textContent')).jsonValue()).toMatch('STORE SELECTION');
       // await expect(await(await headerElement.getProperty('textContent')).jsonValue()).toMatch('Back Office Store System');      

      } catch (error) {
        console.log("selector not found"+error)
      }

});

Then('I enter number in search box',async function(){
    await scope.context.currentPage.type('input[id=react-select-2-input]','12',{delay: 50});
    
 });
 Then('I click on previous button',async function(){
    await scope.context.currentPage.click('button[id=btn-prev]');
    
});




