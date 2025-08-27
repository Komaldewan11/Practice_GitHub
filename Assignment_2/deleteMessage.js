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

    // Functionality 3: Sending a Message (Test Case ID: 005)
    await driver.waitForElementById('com.google.android.apps.messaging:id/secondary_action_button',20000).click();
    await driver.sleep(20000);

    //Long Press to select First Message
    await driver.execute('mobile: longClickGesture', {
    x: 630,
    y: 330,
    duration: 2000
    });
    await driver.sleep(5000);

    await driver.elementByXPath(
        '(//android.view.ViewGroup[@resource-id="com.google.android.apps.messaging:id/swipeableContainer"])[2]').click();    
    const deleteMessage = await driver.waitForElementById('com.google.android.apps.messaging:id/action_delete', 5000);
    await deleteMessage.click();

    //Validate Result
    console.log('Messages deleted successfully!');
    } catch (err) {
    // Log if any error occurs during the test
    console.error('Selected messages not deleted', err);
  } finally {
    // Quit the session
    await driver.quit();
  }
}

// Execute the test
main();