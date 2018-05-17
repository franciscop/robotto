const gpio = require('./gpio');

const groupByType = arr => arr.reduce(function(types, item) {
  const type = typeof item;
  if (!types[type]) types[type] = [];
  types[type].push(item);
  return types;
}, {});

const motorTypes = {
  drivedir: speed => {
    return [parseInt(Math.abs(speed) * 1023), Math.sign(speed) === 1 ? 1 : 0];
  }
};

// https://gist.github.com/gre/1650294
const timing = {
  linear: t => t,
  easeInQuad: t => t*t,
  easeOutQuad: t => t*(2-t),
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  easeInCubic: t => t*t*t,
  easeOutCubic: t => (--t)*t*t+1,
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  easeInQuart: t => t*t*t*t,
  easeOutQuart: t => 1-(--t)*t*t*t,
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  easeInQuint: t => t*t*t*t*t,
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
};



class Motor {
  // The constructor for the pins
  constructor (...args) {

    // Extract the pins and the settings from the arguments
    const { number: pins = [], object: settings = [] } = groupByType(args);

    // Any of the available settings
    this.settings = Object.assign({
      speed: 0,
      acceleration: 0.1,
      reverse: false,
      type: 'drivedir',
      timing: 'easeInOutQuad'
    }, ...settings);

    // The current speed in percentage as a float [-1, 1]
    this.speed = this.settings.speed;

    // The pins where the motor is attached
    this.pins = pins;

    // Maps the new speed to pin outputs
    this.speedToPins = motorTypes[this.settings.type];
  }

  // Speed [-1, 1]
  to (value = 0) {
    const target = value;
    this.speeds = [];
    const timingFunction = timing[this.settings.timing];
    const fps = 20;
    for (let i = 1; i <= fps; i++) {
      // Call the timing function with the current, target and position [0, 1]
      const perc = timingFunction(i / fps);
      this.speeds.push(target * perc + this.speed * (1 - perc));
    }
    this.run();
  }

  run () {
    // Only update it when there's something to update it to
    if (!this.speeds.length) return;

    const objFromPins = (data, value, i) => ({ ...data, [this.pins[i]]: value });
    const speed = this.speeds.shift();
    const update = this.speedToPins(speed).reduce(objFromPins, {});
    if (this.listeners && this.listeners.change) {
      this.listeners.change.forEach(cb => cb({ speed, ...update }));
    }
    Object.entries(update).map(([pin, value]) => gpio(+pin).to(+value));
    this.speed = speed;
    setTimeout(() => this.run(), 100);
  }

  on (type = 'change', cb) {
    this.listeners = this.listeners || {};
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(cb);
  }
}

module.exports = (...args) => new Motor(...args);






// // [positive] + [bounded 0-100] + [rounded to INT]
// const bound = val => Math.floor(Math.min(Math.max(Math.abs(val), 0), 100));
//
// // Define the ground
// module.exports = (speedPin, dirPin) => {
//
//   // Speed is from -100 to 100
//   return async speed => {
//
//     // Whether the wheel goes forward or backwards
//     const forward = Math.sign(speed) === 1;
//
//     // An int from 0 to 100
//     const magnitude = bound(speed);
//
//     // Execute the action on both pins
//     return Promise.all([
//       gpio(dirPin)[forward ? 'on' : 'off'](),
//       gpio(speedPin).to(magnitude * 1023 / 100)
//     ]);
//   };
// };
