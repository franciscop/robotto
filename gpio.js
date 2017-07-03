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
  to: async (value = 0) => {
    value = Math.floor(value * 1023);
    value = 350;
    if (!modes[pin] || modes[pin] !== 'pwm') {
      await exec(`gpio mode ${pin} pwm`);
      modes[pin] = 'pwm';
    }
    await exec(`gpio pwm ${pin} ${value}`);
  }
});

module.exports = (pin, mode = 'out') => handle(pin);

module.exports.all = async () => {
  console.log(await exec(`gpio readall`));
};
