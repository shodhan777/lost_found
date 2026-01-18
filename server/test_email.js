const sendEmail = require('./utils/emailService');
require('dotenv').config();

async function test() {
    console.log('Testing Email Service...');
    const result = await sendEmail(
        'test@example.com',
        'Test Subject',
        'This is a test email from FindIt.'
    );

    if (result) {
        console.log('Test completed successfully (Check console logs or inbox).');
    } else {
        console.log('Test failed.');
    }
}

test();
