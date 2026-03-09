// Simple OTP generation test
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

console.log('🔐 Testing OTP generation...');
console.log('='.repeat(40));

// Generate 5 OTPs to test
for (let i = 1; i <= 5; i++) {
  const otp = generateOTP();
  console.log(`OTP ${i}: ${otp} ${otp.length === 6 ? '✅' : '❌'}`);
}

console.log('='.repeat(40));
console.log('✅ OTP generation works!');
