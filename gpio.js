const { exec } = require('mz/child_process');

const modes = [];

const handle = pin => ({
  on: async () => {
    if (!modes[pin] || modes[pin] !== 'out') {
      await exec(`gpio mode ${pin} out`);
      modes[pin] = 'out';
    }
    await exec(`gpio write ${pin} 1`);
  },
  off: async () => {
    if (!modes[pin] || modes[pin] !== 'out') {
      await exec(`gpio mode ${pin} out`);
      modes[pin] = 'out';
    }
    await exec(`gpio write ${pin} 0`);
  },
});

module.exports = (pin, mode = 'out') => handle(pin);

module.exports.all = async () => {
  console.log(await exec(`gpio readall`));
};
