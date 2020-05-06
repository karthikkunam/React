const {Given, When, Then } = require("cucumber");
const expect = require("expect");
const scope = require("../support/scope");
const stepDefinitions = require('../common/stepDefinitions')
const utils = require('../common/util');
const pageObj = require('../PageObjects/orderLandingPage');
const commonObj = require('../common/pageObjects');


Given('I am at the order landing page',async () => {
    //Login to the application is on hooks
    return;
});

Then('Validate cycle-type counts for Carried & All items', async () => {
    //Call the API for the data and pass the resource url
    let orderInfo = await utils.getDataApi(commonObj.BFF_ORDERING_API)
    //Extract the data from the API
    await utils.sleep(4000)
    const dailyRemainingCarried = orderInfo.body[0].singleDay.Carried.OrderCount;
    const dailyAvailableCarried = orderInfo.body[0].singleDay.Carried.itemCounts;
    const dailyRemainingAll = orderInfo.body[0].singleDay.All.OrderCount;
    const dailyAvailableAll = orderInfo.body[0].singleDay.All.itemCounts;
    const multidayRemainingCarried = orderInfo.body[0].multiDay.Carried.OrderCount;
    const multidayAvailableCarried = orderInfo.body[0].multiDay.Carried.itemCounts;
    const multidayRemainingAll = orderInfo.body[0].multiDay.All.OrderCount;
    const multidayAvailableAll = orderInfo.body[0].multiDay.All.itemCounts;
    const nondailyRemainingCarried = orderInfo.body[0].nonDaily.Carried.OrderCount;
    const nondailyAvailableCarried = orderInfo.body[0].nonDaily.Carried.itemCounts;
    const nondailyRemainingAll = orderInfo.body[0].nonDaily.All.OrderCount;
    const nondailyAvailableAll = orderInfo.body[0].nonDaily.All.itemCounts;

    //Extract the data from the page and compare against API
    await stepDefinitions.waitForElementToLoad(pageObj.DAILY_COUNT_LABEL_TEXT);
    const dailyCarriedElement = await stepDefinitions.getElement(pageObj.DAILY_COUNT_LABEL_TEXT);
    const dailyCarriedValue = await (await dailyCarriedElement.getProperty('textContent')).jsonValue();
    expect(dailyCarriedValue).toBe(`${dailyRemainingCarried}/${dailyAvailableCarried} left to order`)
    await stepDefinitions.waitForElementToLoad(pageObj.MULTI_DAY_COUNT_LABEL_TEXT);
    const multidayCarriedElement = await stepDefinitions.getElement(pageObj.MULTI_DAY_COUNT_LABEL_TEXT);
    const multidayCarriedValue = await (await multidayCarriedElement.getProperty('textContent')).jsonValue();
    expect(multidayCarriedValue).toBe(`${multidayRemainingCarried}/${multidayAvailableCarried} left to order`)
    await stepDefinitions.waitForElementToLoad(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyCarriedElement = await stepDefinitions.getElement(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyCarriedValue = await (await nondailyCarriedElement.getProperty('textContent')).jsonValue();
    expect(nondailyCarriedValue).toBe(`${nondailyRemainingCarried}/${nondailyAvailableCarried} left to order`)

    //Switch to All items 
    const allItems = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await allItems.click(); 

    //Extract the data from the page and compare against API
    await stepDefinitions.waitForElementToLoad(pageObj.DAILY_COUNT_LABEL_TEXT);
    const dailyAllElement = await stepDefinitions.getElement(pageObj.DAILY_COUNT_LABEL_TEXT);
    const dailyAllValue = await (await dailyAllElement.getProperty('textContent')).jsonValue();
    expect(dailyAllValue).toBe(`${dailyRemainingAll}/${dailyAvailableAll} left to order`)
    await stepDefinitions.waitForElementToLoad(pageObj.MULTI_DAY_COUNT_LABEL_TEXT);
    const multidayAllElement = await stepDefinitions.getElement(pageObj.MULTI_DAY_COUNT_LABEL_TEXT);
    const multidayAllValue = await (await multidayAllElement.getProperty('textContent')).jsonValue();
    expect(multidayAllValue).toBe(`${multidayRemainingAll}/${multidayAvailableAll} left to order`)
    await stepDefinitions.waitForElementToLoad(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyAllElement = await stepDefinitions.getElement(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyAllValue = await (await nondailyAllElement.getProperty('textContent')).jsonValue();
    expect(nondailyAllValue).toBe(`${nondailyRemainingAll}/${nondailyAvailableAll} left to order`)

    //Switch back to Carried items to prepare for next steps
    await allItems.click(); 
});

When('I click on Guided Replenishment recap', async () => { 
    await stepDefinitions.waitForElementToLoad(pageObj.GR_BUTTON);   
    const grButton = await stepDefinitions.getElement(pageObj.GR_BUTTON);
    await grButton.click();
});

Then('It sends me to Guided Replenishment recap page', async () => {
    utils.sleep(2000);
    let currentPageUrl = stepDefinitions.getCurrentPageUrl();
    expect(currentPageUrl.indexOf('GR')).toBeGreaterThan(-1)
}) 

When('I click on order by vendor button', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.ORDER_VENDOR_BUTTON)
    const button = await stepDefinitions.getElement(pageObj.ORDER_VENDOR_BUTTON)
    await button.click();
})

Then('Order by vendor button is activated', async () => {
    const button = await stepDefinitions.getElement(pageObj.ORDER_VENDOR_BUTTON)
    const isDisabled = await button.isDisabled(pageObj.ORDER_VENDOR_BUTTON)
    expect(isDisabled).toBe(false);
})

When('I uncheck Non-daily', async () => {
    const nonDailyElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_NONDAILY);
    await nonDailyElement.click();
})

Then('Order by vendor button is deactivated', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.ORDER_VENDOR_BUTTON)
    const button = await stepDefinitions.getElement(pageObj.ORDER_VENDOR_BUTTON)
    const isDisabled = await button.isDisabled(pageObj.ORDER_VENDOR_BUTTON)
    expect(isDisabled).toBe(true);

    //I check Non-Daily back to prepare for next steps
    const nonDailyElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_NONDAILY);
    await nonDailyElement.click();
})

Then('I should see the color coded bars', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_NONDAILY)
    const nonDailyColorStripe = await stepDefinitions.getElement(pageObj.COLORING_STRIP_NONDAILY);
    expect(nonDailyColorStripe != undefined && nonDailyColorStripe != null).toBe(true)
})

Then('All cycle types are selected by default', async () => {
    const nonDailyElement = await stepDefinitions.getElement(pageObj.NON_DAILY_CHECKBOX);
    const nonDailyIsPresent = await (await nonDailyElement.getProperty('checked')).jsonValue();
    expect(nonDailyIsPresent).toBe(true)
    const multidayElement = await stepDefinitions.getElement(pageObj.MULTI_DAY_CHECKBOX);
    const multidayIsPresent = await (await multidayElement.getProperty('checked')).jsonValue();
    expect(multidayIsPresent).toBe(true)
    const dailyElement = await stepDefinitions.getElement(pageObj.DAILY_CHECKBOX);
    const dailyIsPresent = await (await dailyElement.getProperty('checked')).jsonValue();
    expect(dailyIsPresent).toBe(true)
})

Then('Order remaining items toggle is OFF', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.REMAINING_ITEMS_TOGGLE)
    const toggleElem = await stepDefinitions.getElement(pageObj.REMAINING_ITEMS_TOGGLE);
    const toggle = await toggleElem.getAttr('class');
    const isChecked = toggle.indexOf('checked');
    expect(isChecked).toBe(-1);
})

When('I click on the toggle', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.REMAINING_ITEMS_TOGGLE)
    const toggleElem = await stepDefinitions.getElement(pageObj.REMAINING_ITEMS_TOGGLE);
    await toggleElem.click();
})

Then('Order remaining items toggle is ON', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.REMAINING_ITEMS_TOGGLE)
    const toggleElem = await stepDefinitions.getElement(pageObj.REMAINING_ITEMS_TOGGLE);
    const toggle = await toggleElem.getAttr('class');
    const isChecked = toggle.indexOf('checked');
    expect(isChecked).toBeGreaterThan(-1)

    //Switch toggle back off to prepare for next steps
    await toggleElem.click();
})

Then('Categories should have a color coded bar on the left side', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_NONDAILY)
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_MULTIDAY)
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_SINGLE_DAY)

    const nonDailyElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_NONDAILY);
    expect(nonDailyElement).not.toEqual(null)
    const multidayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_MULTIDAY);
    expect(multidayElement).not.toEqual(null)
    const singleDayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_SINGLE_DAY);
    expect(singleDayElement).not.toEqual(null)

})

Then('All Groups should be collapsed by default' , async () => {
    await utils.sleep(9000)
    const elem = await stepDefinitions.getElement(pageObj.ARROW_FOR_ALL_GROUPS);
    await elem.click();
    
    const className = await elem.getAttr('class');
    expect(className.indexOf(pageObj.ARROW_UP)).toBeGreaterThan(-1)

    const data = await scope.context.currentPage.$$eval('table tbody', tbodys => tbodys.map((tbody) => {
        return tbody.innerHTML;
    }))
    expect(data.length).toBe(0)
})

When('I click on the arrow button on the right', async () => {
    const elem = await stepDefinitions.getElement(pageObj.ARROW_FOR_ALL_GROUPS);
    await elem.click();
})


Then('Categories will display under Groups', async () => {
    const elem = await stepDefinitions.getElement(pageObj.ARROW_FOR_ALL_GROUPS);
    const className = await elem.getAttr('class');
    expect(className.indexOf(pageObj.ARRO_DOWN)).toBeGreaterThan(-1)

    const data = await scope.context.currentPage.$$eval('table tbody', tbodys => tbodys.map((tbody) => {
        return tbody.innerHTML;
    }))
    expect(data.length).toBeGreaterThan(0)
})    


Then('Store number should have 5 digits', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.STORE_INFO);
    const storeInfo = await scope.context.currentPage.$eval(pageObj.STORE_INFO, el => el.innerText );
    const storeInfoArray = storeInfo.split(' ')
    const storeNumber = storeInfoArray[1];
    expect(storeNumber.length).toBe(5)
})


When('Deselect Daily and Multi day cycle types', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_MULTIDAY)
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_SINGLE_DAY)
    const singleDayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_SINGLE_DAY);
    await singleDayElement.click();
    const multiDayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_MULTIDAY);
    await multiDayElement.click();
})

Then('The remaining categories are non-daily and GR', async () => {
    //Pull list of groups from API
    const dailyOrderData = await utils.getDataApi(commonObj.ORDER_DETAIL_API);
    const grGroups = dailyOrderData['GUIDED REPLENISHMENT'];
    const nonDaily = dailyOrderData['NON-DAILY'];

    //Create a list with group names. Non-Daily and GR needs to be grouped together
    let groupNamesFromAPI = [];
    grGroups.forEach(element => {
        groupNamesFromAPI.push(`${element.name} - GR`)
    });

    nonDaily.forEach(element => {
        groupNamesFromAPI.push(element.name)
    })

    //Switching to All items
    await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
    const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await carried.click(); 

    //Pull list of group names from the page
    let groupNamesFromPage = [];
    const groupNamesList = await scope.context.currentPage.$$('table thead tr td label')

    for (const group of groupNamesList) {
        let name = await group.getProperty('innerText');
        name = await name.jsonValue();

        groupNamesFromPage.push(name);
    }

    //Sort both lists so we can compare
    groupNamesFromPage = groupNamesFromPage.sort(function (a, b) {
        return a.localeCompare(b)
    })

    groupNamesFromAPI = groupNamesFromAPI.sort(function (a, b) {
        return a.localeCompare(b)
    })

    expect(groupNamesFromPage).toEqual(groupNamesFromAPI)

    //Select Daily and Multi-Day back to prepare for next steps
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_MULTIDAY)
    await stepDefinitions.waitForElementToLoad(pageObj.COLORING_STRIP_SINGLE_DAY)
    const singleDayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_SINGLE_DAY);
    await singleDayElement.click();
    const multiDayElement = await stepDefinitions.getElement(pageObj.COLORING_STRIP_MULTIDAY);
    await multiDayElement.click();
})

Then('Counts should match the total of GR and non-daily groups', async () => {
    //Pull total number of GR and non-daily items from API
    const dailyOrderData = await utils.getDataApi(commonObj.ORDER_DETAIL_API);
    const grGroups = dailyOrderData['GUIDED REPLENISHMENT'];
    const nonDaily = dailyOrderData['NON-DAILY'];

    let totalNumberFromApi = 0;
    grGroups.forEach(group => {
        group.categories.forEach(category => {
            totalNumberFromApi = totalNumberFromApi + category.items.length
        })
    });

    nonDaily.forEach(group => {
        group.categories.forEach(category => {
            totalNumberFromApi = totalNumberFromApi + category.items.length
        })
    })

        //Switching to All items
    await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
    const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await carried.click(); 

    //Pull the total number of items for non-daily from the page
    await stepDefinitions.waitForElementToLoad(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyAllElement = await stepDefinitions.getElement(pageObj.NON_DAILY_COUNT_LABEL_TEXT);
    const nondailyAllValue = await (await nondailyAllElement.getProperty('textContent')).jsonValue();
    let totalNumberFromPage = (nondailyAllValue.split(' ')[0].split('/'))[1];
    expect(parseInt(totalNumberFromPage)).toBe(totalNumberFromApi)

    //Switch back to carried to prepare for next step
    await carried.click(); 
})

Then('GR groups should have "-GR" suffix to the group name', async () => {
        //Pull list of groups from API
        const dailyOrderData = await utils.getDataApi(commonObj.ORDER_DETAIL_API);
        const grGroups = dailyOrderData['GUIDED REPLENISHMENT'];
    
        //Create a list with group names. Non-Daily and GR needs to be grouped together
        let groupNamesFromAPI = [];
        grGroups.forEach(element => {
            groupNamesFromAPI.push(`${element.name} - GR`)
        });

        //Switching to All items
        await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
        const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
        await carried.click(); 


        //Pull list of group names from the page
        let groupNamesFromPage = [];
        await stepDefinitions.waitForElementToLoad('table thead tr td label')
        const groupNamesList = await scope.context.currentPage.$$('table thead tr td label')

        for (const group of groupNamesList) {
            let name = await group.getProperty('innerText');
            name = await name.jsonValue();

            if(name.indexOf('GR') > -1) {
                groupNamesFromPage.push(name);
            }
        }

        //Sort both lists so we can compare
        groupNamesFromPage = groupNamesFromPage.sort(function (a, b) {
            return a.localeCompare(b)
        })

        groupNamesFromAPI = groupNamesFromAPI.sort(function (a, b) {
            return a.localeCompare(b)
        })

        expect(groupNamesFromPage).toEqual(groupNamesFromAPI)

        //Switch back to carried to prepare for next step
        await carried.click(); 
})


Then('Status indicator and status text should be present and match', async () => {
    const statusList = [];
    await stepDefinitions.waitForElementToLoad('table thead tr td:nth-child(5)');

    //Switching to All items
    await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
    const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await carried.click(); 

    //Pull the list of CATEGORY elements from the page
    const listOfCategories = await scope.context.currentPage.$$('table tbody tr td:nth-child(5)')

    //Loop throught the list to check the status indicator (img) and status text
    for (const element of listOfCategories) {
            let statusText = await element.getProperty('innerText');
            statusText = await statusText.jsonValue();

            const statusIndicatorImg = await element.$('img')
            let src = await statusIndicatorImg.getAttr('src');

            if(statusText == pageObj.PENDING_STATUS) {
                expect(src).toBe(pageObj.STATUS_ICON_CLOCK)
            }

            if(statusText == pageObj.COMPLETE_STATUS) {
                expect(src).toBe(pageObj.STATUS_ICON_TICK)
            }
    }


    //Pull the list of GROUPS elements from the page
    const listOfGroups = await scope.context.currentPage.$$('table thead tr td:nth-child(5)')

    //Loop throught the list to check the status indicator (img) and status text
    for (const element of listOfGroups) {
            let statusText = await element.getProperty('innerText');
            statusText = await statusText.jsonValue();

            const statusIndicatorImg = await element.$('img')
            let src = await statusIndicatorImg.getAttr('src');

            if(statusText == pageObj.PENDING_STATUS) {
                expect(src).toBe(pageObj.STATUS_ICON_CLOCK)
            }

            if(statusText == pageObj.COMPLETE_STATUS) {
                expect(src).toBe(pageObj.STATUS_ICON_TICK)
            }
    }

        //Switch back to carried to prepare for next step
        await carried.click(); 
})


Then('Continue button should be deactivated', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.CONTINUE_BUTTON)
    const button = await stepDefinitions.getElement(pageObj.CONTINUE_BUTTON)
    const isDisabled = await button.isDisabled(pageObj.CONTINUE_BUTTON)
    expect(isDisabled).toBe(true);
})

When('I select a group', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    await firstGroup.click()
})

Then('Continue button will become available', async () => {
    await stepDefinitions.waitForElementToLoad(pageObj.CONTINUE_BUTTON)
    const button = await stepDefinitions.getElement(pageObj.CONTINUE_BUTTON)
    const isDisabled = await button.isDisabled(pageObj.CONTINUE_BUTTON)
    expect(isDisabled).toBe(false);

    //Deselect the group again to prepare for next step
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    await firstGroup.click()
})

Then('The list of categories is desplayed in alphabetical order', async () => {
    await stepDefinitions.waitForElementToLoad('table tbody tr td label input')
    
    //Switching to All items
    await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
    const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await carried.click(); 

    const elementList = await scope.context.currentPage.$$('table tbody tr td label')

    //Create a list that has as a key the group and values list of categories for that group
    const listOfGroups = new Map();
    for (const element of elementList) {
        let inputElem = await element.$('input');
        let value = await inputElem.getProperty('value')
        value = await value.jsonValue();

        let text = await element.getProperty('innerText');
        text = await text.jsonValue();

        if(!listOfGroups.has(value)) {
            listOfGroups.set(value, [])
        }
        listOfGroups.get(value).push(text);

    }

    //sort the list alphabetically and then compare with the order of categories on the page. 
    //Expect to be the same since categories on the page should be ordered
    for(i = 0; i < listOfGroups.length; i++) {
        let unOrderedList = listOfGroups[i];
        let orderedList = listOfGroups[i].sort(function (a, b) {
            return a.localeCompare(b)
        })
        expect(unOrderedList).toEqual(orderedList)
    }

    //Switch back to carried to prepare for next step
    await carried.click(); 
})

Then('All categories should be selected automatically', async () => {
    //Switching to All items
    await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
    const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
    await carried.click(); 

    const elementList = await scope.context.currentPage.$$('table:nth-child(1) tbody tr td label input')
    for (const element of elementList) {
        let checked = await element.getProperty('checked');
        checked = await checked.jsonValue();

        expect(checked).toBe(true)
    }

    //Clear the selection before moving to next step
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    await firstGroup.click()
    await carried.click(); 

})


When('I select all categories for a particular group', async () => {
    await stepDefinitions.waitForElementToLoad('table:nth-child(1) tbody tr td label')
    const elementList = await scope.context.currentPage.$$('table:nth-child(1) tbody tr td label')

    for (const element of elementList) {
        await element.click();
    }
})

Then('The group should be selected automatically', async () => {
    const group = await scope.context.currentPage.$$('table:nth-child(1) thead tr td label input')
    let checked = await group[0].getProperty('checked');
    checked = await checked.jsonValue();
    expect(checked).toBe(true)

    //Clear the selection before moving to next step
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    await firstGroup.click()
})

When('I select two groups', async () => {
    await utils.sleep(8000)
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
    await firstGroup.click()
    await stepDefinitions.waitForElementToLoad(pageObj.FIRST_MULTIDAY_GROUP_ON_PAGE);
    let secondGroup = await stepDefinitions.getElement(pageObj.FIRST_MULTIDAY_GROUP_ON_PAGE);
    await secondGroup.click()
})

Then('Should be two groups and all their categories selected', async () => {
        //Switching to All items
        await stepDefinitions.waitForElementToLoad(pageObj.ITEMS_TO_ORDER)
        const carried = await stepDefinitions.getElement(pageObj.ITEMS_TO_ORDER);
        await carried.click(); 

        //Pull categories for the first group selected
        const firstElementList = await scope.context.currentPage.$$('table:nth-child(1) tbody tr td label input')
        for (const element of firstElementList) {
            //Verify if all categories are "checked"
            let checked = await element.getProperty('checked');
            checked = await checked.jsonValue();
    
            expect(checked).toBe(true)
        }
    
        //Pull categories for the second group selected
        const secondElementList = await scope.context.currentPage.$$('table:nth-child(2) tbody tr td label input')
        for (const element of secondElementList) {
            //Verify if all categories are "checked"
            let checked = await element.getProperty('checked');
            checked = await checked.jsonValue();
    
            expect(checked).toBe(true)
        }

        //Clear the selection before moving to next step
        await stepDefinitions.waitForElementToLoad(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
        let firstGroup = await stepDefinitions.getElement(pageObj.FIRST_SINGLEDAY_GROUP_ON_PAGE);
        await firstGroup.click()
        await stepDefinitions.waitForElementToLoad(pageObj.FIRST_MULTIDAY_GROUP_ON_PAGE);
        let secondGroup = await stepDefinitions.getElement(pageObj.FIRST_MULTIDAY_GROUP_ON_PAGE);
        await secondGroup.click()

})




//---------------Examples----------
// const elh = await page.$(`#testTarget`);
// console.log( await elh.isVisible());
// console.log( await elh.getAttr("class"));
// console.log( await elh.getProp("innerHTML"));
// console.log(await elh.isDisabled(pageObj.ORDER_VENDOR_BUTTON))
// const text = await scope.context.currentPage.$eval('table tbody tr td label', el => el.innerText );


//------- Scenario: Validate Groups/Category feature is implemented--------
// await stepDefinitions.waitForElementToLoad('input[name=fresh-bakery]')
// const test = await stepDefinitions.getElement('#vertical-tab-one > div:nth-child(3) > div.cat-table-resize > div > table:nth-child(1) > tbody > tr > td.col-5.col-sm-5.col-md-3.text-left > label > input[type="checkbox"]');
// // await test.click();
// await utils.sleep(2000)
// const nonDailyIsPresent = await (await test.getProperty('checked')).jsonValue();
// expect(nonDailyIsPresent).toBe(true)
// const test2 = await test.getProp('innerHTML')
// console.log(test2)
// const test3 = test2.indexOf('after');
// console.log(test3)



// const listOfInputs = [];
// const dataTest = await scope.context.currentPage.$$('table tbody tr td label input')

// for (const element of dataTest) {
//     let input = {};

//     let value = await element.getProperty('value');
//     value = await value.jsonValue();

//    let checked = await element.getProperty('checked');
//     checked = await checked.jsonValue();

//     input.value = value;
//     input.checked = checked;
//     listOfInputs.push(input);
// }

// console.log(listOfInputs.length)
// console.log(listOfInputs)


// #vertical-tab-one > div:nth-child(3) > div.cat-table-resize > div > table:nth-child(6) > tbody:nth-child(3) > tr > td.col-3.col-sm-3.col-md-2.text-left > img