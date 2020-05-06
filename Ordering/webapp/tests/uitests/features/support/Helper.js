const webdriver = require("selenium-webdriver");
const scope = require("../support/scope");

const By = webdriver.By;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const TypeText = async (element, text) => {
    element.sendKeys(webdriver.Key.CONTROL + "a");
    element.sendKeys(webdriver.Key.DELETE);
    await sleep(500);
    element.sendKeys(text);
    element.sendKeys(webdriver.Key.ENTER);
    await sleep(500);
};

const ClearText = async (element) => {
    element.sendKeys(webdriver.Key.CONTROL + "a");
    element.sendKeys(webdriver.Key.DELETE);
    await sleep(500);
    element.sendKeys(webdriver.Key.ENTER);
    await sleep(500);
};

const findElementById = async (selector) => {
    try {
        return await scope.driver.findElement(By.id(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementByClassName = async (selector) => {
    try {
        return await scope.driver.findElement(By.className(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementByCss = async (selector) => {
    try {
        return await scope.driver.findElement(By.css(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementByName = async (selector) => {
    try {
        return await scope.driver.findElement(By.name(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementByXpath = async (selector) => {
    try {
        return await scope.driver.findElement(By.xpath(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementsById = async (selector) => {
    try {
        return await scope.driver.findElements(By.id(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementsByClassName = async (selector) => {
    try {
        return await scope.driver.findElements(By.className(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementsByCss = async (selector) => {
    try {
        return await scope.driver.findElements(By.css(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementsByName = async (selector) => {
    try {
        return await scope.driver.findElements(By.name(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

const findElementsByXpath = async (selector) => {
    try {
        return await scope.driver.findElements(By.xpath(selector)).then(function (webElement) {
            return webElement;
        }, function (err) {
            if (err instanceof webdriver.error.NoSuchElementError) {
                return null;//it was not found
            } else {
                webdriver.promise.rejected(err);
            }
        });
    } catch(exception) {
        console.log("Failed to find the Selector: " + selector + ":" + exception);
    }
};

module.exports = {
    sleep,
    TypeText,
    ClearText,
    findElementById,
    findElementByClassName,
    findElementByCss,
    findElementByName,
    findElementByXpath,
    findElementsById,
    findElementsByClassName,
    findElementsByCss,
    findElementsByName,
    findElementsByXpath
};