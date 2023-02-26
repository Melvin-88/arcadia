const jsonHttp = require('./modules/httpGetJson.js');

const arcadiaServerURL = process.argv[2] || process.env.GAME_CORE_API_HOST; // ? `http://${process.env.GAME_CORE_API_HOST}:3000/api/v1`
let serial = process.argv[3] || process.env.SERIAL || hardwareSerial();
const secretKey = process.argv[4] || process.env.SECRET || 'arcadia-robots-secret-1';
const demoMode = (process.argv[5] === 'demo' || [1, true, 'true', 'True'].includes(process.env.ROBOT_DEMO_MODE));
const arcadiaChipDistributorURL = process.argv[6] || process.env.CHIP_DISTRIBUTOR_HOST; // ? `http://${process.env.GAME_CORE_API_HOST}:3000`
const ChipsStoragePath = process.argv[7] || process.env.CHIP_STORAGE_PATH || '/storage'; // ? `http://${process.env.GAME_CORE_API_HOST}:3000`

console.log(`Arcadia Server URL ${arcadiaServerURL}`);
console.log(`Serial: ${serial}`);
console.log(`SecretKey ${secretKey}`);
console.log(`demo mode is ${demoMode}`);
console.log(`arcadiaChipDistributorURL is ${arcadiaChipDistributorURL}`);

if (!demoMode) process.exit(0); // exit if it's not an emulator

async function requestChips() {

  console.log(`Trying to register chips at ${arcadiaChipDistributorURL}`);
  await jsonHttp.get(`${arcadiaChipDistributorURL}/chip-registration?serial=${serial}&key=${secretKey}`)
    .then((hostData) => {
      console.log(`host data: ${JSON.stringify(hostData)}`);
    })
    .catch((err) => {
      console.log(err);
      console.log('No server. Retrying in 10 sec');
      return new Promise(resolve => { setTimeout(resolve, 10000)}). then(() => requestChips());
    });
}

requestChips()
  .catch(error => console.error(error))
  .finally(() => process.exit(0));
