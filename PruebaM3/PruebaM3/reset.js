// This script resets the database by copying the contents of 'reset_db.json' to 'db.json'.
// It is useful for restoring the initial state of the database for development or testing.

const fs = require('fs'); // Node.js file system module

// Copy the reset_db.json file to db.json, overwriting the current database
fs.copyFile('reset_db.json', 'db.json', (err) => {
    if (err) {
        // If there is an error during the copy, log it to the console
        console.error('Error resetting the database:', err);
    } else {
        // If successful, log confirmation message
        console.log('Database reset successfully.');
    }
});