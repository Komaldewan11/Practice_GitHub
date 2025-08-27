// Import required modules
const wd = require('wd'); // WebDriver client for Node.js
const assert = require('assert'); // Node.js built-in assertion module
const { execSync } = require('child_process'); // Optional: For running system commands

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
    
    // Functional Test 2: Receiving a Message (Test Case ID: 002)
    execSync(`adb -s emulator-5554 emu sms send +16755567890 "Test message from emulator"`);
    console.log("SMS sent to emulator");

    await driver.waitForElementById('com.google.android.apps.messaging:id/secondary_action_button',20000).click();

    const newMessage = await driver.waitForElementByXPath(
      '//android.widget.TextView[@resource-id="com.google.android.apps.messaging:id/conversation_snippet" and @text="Test message from emulator"]', 10000);
    assert.ok(newMessage, "Message not found in UI");
    console.log("Message found in conversation list");

    } catch (err) {
    // Log if any error occurs during the test
    console.error("Failed to receive SMS", err);
  } finally {
    // Quit the session
    await driver.quit();
  }
}

// Execute the test
main();