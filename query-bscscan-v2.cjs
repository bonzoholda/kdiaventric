const https = require('https');
const fs = require('fs');

const address = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';

function getSource(apiKey) {
  return new Promise((resolve) => {
    const url = `https://api-testnet.bscscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const keys = ['YourApiKeyToken', '6K8VIX1F6WFF2DYY4CUIX32X669Z7YIDSU', '123456789'];
  for (const k of keys) {
    console.log(`Trying with key: ${k}`);
    const res = await getSource(k);
    if (res && res.status === '1' && res.result && res.result[0]) {
      const code = res.result[0].SourceCode;
      if (code) {
        console.log('SUCCESS! Found source code!');
        fs.writeFileSync('ControllerSource.sol', code);
        return;
      }
    }
    console.log('Result:', res);
  }
}
main();
