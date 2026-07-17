const https = require('https');

const hash = '0xd7f28048575eead8851d024ead087913957dfb4fd1a02b4d1573f5352a5a2be3';
const url = `https://api.signature.openchain.xyz/v1/lookup?event=${hash}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Result:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Error parsing:', e.message);
      console.log('Data:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
