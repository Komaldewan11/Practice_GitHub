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
    // Initialize the session with desired capabilities and with Low Battery
    await driver.init(config);
    await driver.setImplicitWaitTimeout(5000);

    // Performance Test: Mark as unread on Low Battery (Test Case ID: 004)
    execSync(`adb -s emulator-5554 shell dumpsys battery set status 3`);        // battery status to "discharging"
    execSync(`adb -s emulator-5554 shell dumpsys battery set level 4`);         // charge level to 4%.
    execSync(`adb -s emulator-5554 shell dumpsys battery unplug`);              // unplugged from a charger
    console.log("Battery level set to 4%");

    await driver.waitForElementById('com.google.android.apps.messaging:id/secondary_action_button',20000).click();
    await driver.sleep(20000);
    //Long Press
    await driver.execute('mobile: longClickGesture', {
    x: 630,
    y: 330,
    duration: 2000
    });
    await driver.sleep(5000);
  
    //Setting message as "Mark as Unread"
    const moreOptions = await driver.waitForElementByAccessibilityId("More options", 5000);
    await moreOptions.click();
    const markUnread = await driver.waitForElementByXPath(
      '//android.widget.TextView[@resource-id="com.google.android.apps.messaging:id/title" and @text="Mark as unread"]', 5000);
    await markUnread.click();

    await driver.setImplicitWaitTimeout(3000);
    const unreadBadge = await driver.waitForElementById
    ('com.google.android.apps.messaging:id/unread_badge_view_with_message_count_stub', 5000);
    const displayed = await unreadBadge.isDisplayed();
    assert.strictEqual(displayed, true, 'Unread badge should be visible');

    console.log("Message successfully marked as unread");

    } catch (err) {
    // Log if any error occurs during the test
    console.error('Unable to mark message as unread', err);
  } finally {
     try {
      execSync(`adb -s emulator-5554 shell dumpsys battery reset`);
      console.log("Battery status reset to default");
    } catch (resetErr) {
      console.error("Failed to reset battery state:", resetErr);
    }
    // Quit the session
    await driver.quit();
  }
}

// Execute the test
main();