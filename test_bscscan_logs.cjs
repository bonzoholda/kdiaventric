const https = require('https');

const address = '0x08e77eAed0e97Ce0cCe08D8Dc05A3875173da402';
// We have several BscScan API keys in query-bscscan-v2.cjs:
const keys = ['YourApiKeyToken', '6K8VIX1F6WFF2DYY4CUIX32X669Z7YIDSU', '123456789'];

function fetchBscscanLogs(apiKey) {
  return new Promise((resolve) => {
    const url = `https://api.bscscan.com/v2/api?chainid=97&module=logs&action=getLogs&fromBlock=117600000&toBlock=latest&address=${address}&apikey=${apiKey}`;
    console.log(`Querying BscScan V2 with key ${apiKey}...`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ status: '0', message: 'JSON_ERROR', error: e.message });
        }
      });
    }).on('error', (err) => {
      resolve({ status: '0', message: 'HTTP_ERROR', error: err.message });
    });
  });
}

async function main() {
  for (const key of keys) {
    const result = await fetchBscscanLogs(key);
    console.log(`Status: ${result.status}, Message: ${result.message}`);
    if (result.status === '1' && Array.isArray(result.result)) {
      console.log(`Successfully fetched ${result.result.length} logs!`);
      console.log(`Sample log:`, JSON.stringify(result.result[0], null, 2));
      break;
    } else {
      console.log(`Failed. Result:`, JSON.stringify(result, null, 2));
    }
  }
}

main().catch(console.error);
