// Import required modules
const wd = require('wd'); // WebDriver client for Node.js
const assert = require('assert'); // Node.js built-in assertion module

const PORT = 4723; // Default Appium server port

// Desired capabilities for the Appium session
const config = {
  platformName: 'Android',
  deviceName: 'emulator-5554', 
  appPackage: 'com.google.android.apps.messaging', // Message app package
  appActivity: '.ui.ConversationListActivity', 
  automationName: 'UiAutomator2' 
};

// Create a remote WebDriver session
const driver = wd.promiseChainRemote('127.0.0.1', PORT);

// Main function to run the test
async function main() {
  try {
    // Initialize the session with desired capabilities
    await driver.init(config);
    await driver.setImplicitWaitTimeout(5000);

    // Functional Test 1: Sending a Message (Test Case ID: 001)
    await driver.waitForElementById('com.google.android.apps.messaging:id/secondary_action_button',20000).click();
    const startChat = await driver.elementById('com.google.android.apps.messaging:id/start_chat_fab');
    await startChat.click();
    const toField = await driver.waitForElementByXPath('//android.widget.EditText'); 
    await toField.sendKeys("+15673459876");
    await driver.waitForElementByXPath('//android.widget.TextView[contains(@text, "Send to")]', 5000).click();
    await driver.sleep(2000);

    //Type text message
    const typeMessage = await driver.waitForElementById('com.google.android.apps.messaging:id/compose_message_text', 5000);
    await typeMessage.sendKeys("Hi, How are you?");
    const sendMessage = await driver.waitForElementByXPath("//android.view.View[@content-desc='Send SMS']", 5000);
    await sendMessage.click();

    //Validate Result
    console.log('Message Sent Successfully!');
    } catch (err) {
    // Log if any error occurs during the test
    console.error('Unable to send message -Test failed!', err);
  } finally {
    // Quit the session
    await driver.quit();
  }
}

// Execute the test
main();