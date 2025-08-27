// Import required modules
const wd = require('wd'); // WebDriver client for Node.js
const assert = require('assert'); // Node.js built-in assertion module
const { execSync } = require('child_process'); // Optional: For running system commands (not used here)

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

    // UI/UX Test: Screen Orientation Handling(Test Case ID: 003)
    await driver.waitForElementById('com.google.android.apps.messaging:id/secondary_action_button',20000).click();
    execSync('adb shell settings put system accelerometer_rotation 1');

    //Rotate to Landcsape
    await driver.setOrientation("LANDSCAPE");
    const landscapeOrientation = await driver.getOrientation();
    console.log("Current Orientation:", landscapeOrientation);
    assert.strictEqual(landscapeOrientation, "LANDSCAPE", `Expected LANDSCAPE but got ${landscapeOrientation}`);
    
    //Rotate to Potrait
    await driver.setOrientation("PORTRAIT");
    const portraitOrientation = await driver.getOrientation();
    console.log("Current Orientation:", portraitOrientation);
    assert.strictEqual(portraitOrientation, "PORTRAIT", `Expected PORTRAIT but got ${portraitOrientation}`);    

    } catch (err) {
    // Log if any error occurs during the test
    console.error('Unable to rotate screen', err);
  } finally {
    // Quit the session
    await driver.quit();
  }
}

// Execute the test
main();