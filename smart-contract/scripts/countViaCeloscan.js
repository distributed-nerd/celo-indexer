import https from 'https';

const TOKEN_ADDRESS = "0x9a0bF6f79dea39D66D0E8F01B1ABf32725C7F86f";

function fetchCeloscan(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log("Fetching transaction count from Celoscan...\n");
  console.log("Token Address:", TOKEN_ADDRESS);
  
  // Fetch normal transactions to the contract
  const txUrl = `https://api.celoscan.io/api?module=account&action=txlist&address=${TOKEN_ADDRESS}&startblock=0&endblock=99999999&sort=asc`;
  
  try {
    const txData = await fetchCeloscan(txUrl);
    
    if (txData.status === "1") {
      console.log(`\nTotal transactions to contract: ${txData.result.length}`);
    } else {
      console.log("No transactions found or API error");
    }
    
    console.log(`\nView all transactions on Celoscan:`);
    console.log(`https://celoscan.io/token/${TOKEN_ADDRESS}`);
    console.log(`https://celoscan.io/address/${TOKEN_ADDRESS}#tokentxns`);
    
  } catch (error) {
    console.error("Error fetching from Celoscan:", error.message);
    console.log("\nAlternatively, check manually at:");
    console.log(`https://celoscan.io/token/${TOKEN_ADDRESS}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
