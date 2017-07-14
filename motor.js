const gpio = require('./gpio');

// [positive] + [bounded 0-100] + [rounded to INT]
const bound = val => Math.floor(Math.min(Math.max(Math.abs(val), 0), 100));


// Define the ground
module.exports = async (speedPin, dirPin) => {

  // Speed is from -100 to 100
  return async speed => {

    // Whether the wheel goes forward or backwards
    const forward = Math.sign(speed) === 1;

    // An int from 0 to 100
    const magnitude = bound(speed);

    // Execute the action on both pins
    return Promise.all([
      gpio(dirPin)[forward ? 'on' : 'off'](),
      gpio(speedPin).to(magnitude)
    ]);
  };
};

// let stable = false;
// module.exports = (a, b, c) => ({
//   forward: async () => {
//     await gpio(a).on();
//     await gpio(b).off();
//     await gpio(c).to(500);
//     stable = 'forward';
//     setTimeout(() => {
//       if (stable === 'forward') {
//         gpio(c).to(400);
//       }
//     }, 1000);
//   },
//   backward: async () => {
//     await gpio(a).off();
//     await gpio(b).on();
//     await gpio(c).to(500);
//     stable = 'backward';
//     setTimeout(() => {
//       if (stable === 'backward') {
//         gpio(c).to(400);
//       }
//     }, 1000);
//   },
//   stop: async () => {
//     await gpio(a).off();
//     await gpio(b).off();
//     stable = false;
//   }
// });
