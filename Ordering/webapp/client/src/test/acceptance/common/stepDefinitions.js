const scope = require("../support/scope");
//  puppeteer@1.9.0
let { ElementHandle } = require( "puppeteer/lib/ExecutionContext" );
// puppeteer@1.12 
if ( ElementHandle === undefined ) {
  ElementHandle = require( "puppeteer/lib/JSHandle" ).ElementHandle;
}


const typeUserId = async (ID_X_PATH, ID_X_VALUE) => {
    await scope.context.currentPage.type(ID_X_PATH, ID_X_VALUE,{delay: 50});
};

const typePassword = async (PASSWORD_X_PATH, PASSWORD_X_VALUE) => {
    await scope.context.currentPage.type(PASSWORD_X_PATH, PASSWORD_X_VALUE,{delay: 50});
};

const clickSubmit = async (SUBMIT_X_PATH) => {
    await scope.context.currentPage.click(SUBMIT_X_PATH);
};

const login  = async (ID_X_PATH, ID_X_VALUE, PASSWORD_X_PATH, PASSWORD_X_VALUE, SUBMIT_X_PATH) => {
    await typeUserId(ID_X_PATH, ID_X_VALUE);
    await typePassword(PASSWORD_X_PATH, PASSWORD_X_VALUE);
    await clickSubmit(SUBMIT_X_PATH);  
};

const getElement = async (elementClassOrId) => {
    const element = await scope.context.currentPage.$(elementClassOrId);
    return element; 
}


const getCurrentPageUrl = () => {
    return scope.context.currentPage._target._targetInfo.url;
}

const waitForElementToLoad = async (selector) => {
  await scope.context.currentPage.waitForSelector(selector)
}


const getElementListByClass = async () => {
  const elementList = await scope.context.currentPage.evaluate((myclass) => {
    let data = [];
    let elements = document.getElementsByClassName(myclass);
    for (var element of elements)
        data.push(element.textContent);
    return data;
  });
  return elementList;
}


/**
 * Set value on a select element
 * @param {string} value
 * @returns {Promise<Undefined>}
 */
ElementHandle.prototype.select = async function( value ) {
  await this._page.evaluateHandle( ( el, value ) => {
      const event = new Event( "change", { bubbles: true });
      event.simulated = true;
      el.querySelector( `option[value="${ value }"]` ).selected = true;
      el.dispatchEvent( event );
  }, this, value );
};

/**
 * Check if element is visible in the DOM
 * @returns {Promise<Boolean>}
 **/
ElementHandle.prototype.isVisible = async function(){
  return (await this.boundingBox() !== null);
};

/**
 * Get element attribute
 * @param {string} attr
 * @returns {Promise<String>}
 */
ElementHandle.prototype.getAttr = async function( attr ){
  const handle = await this._page.evaluateHandle( ( el, attr ) => el.getAttribute( attr ), this, attr );
  return await handle.jsonValue();
};

/**
 * Get element property
 * @param {string} prop
 * @returns {Promise<String>}
 */
ElementHandle.prototype.getProp = async function( prop ){
  const handle = await this._page.evaluateHandle( ( el, prop ) => el[ prop ], this, prop );
  return await handle.jsonValue();
};


ElementHandle.prototype.isDisabled = async (selector) => {
    const isDisabled = await scope.context.currentPage.$eval(selector, (button) => {
        return button.disabled  
    })
    return isDisabled;
}




module.exports = {
    typeUserId,
    typePassword,
    clickSubmit,
    login,
    getElement,
    getCurrentPageUrl,
    waitForElementToLoad,
    getElementListByClass
}

