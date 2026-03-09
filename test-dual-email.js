require('dotenv').config();
const { testEmailProviders } = require('./src/lib/email');

testEmailProviders().then(result => {
  if (result.success) {
    console.log('🎉 Email system is working!');
    process.exit(0);
  } else {
    console.log('💥 Email system failed');
    process.exit(1);
  }
});
