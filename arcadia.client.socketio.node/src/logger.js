module.exports = {
  log: message => {
    console.log(`${new Date().toISOString()} - ${message}`);
  },
  error: (mesage, trace) => {
    console.error(`${new Date().toISOString()} - ${message}: ${trace | ''}`);
  },
}
