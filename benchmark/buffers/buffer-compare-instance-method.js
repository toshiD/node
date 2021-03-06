'use strict';
const common = require('../common.js');
const v8 = require('v8');

const bench = common.createBenchmark(main, {
  size: [16, 512, 1024, 4096, 16386],
  args: [1, 2, 3, 4, 5],
  millions: [1]
});

function main(conf) {
  const iter = (conf.millions >>> 0) * 1e6;
  const size = (conf.size >>> 0);
  const args = (conf.args >>> 0);
  const b0 = Buffer.alloc(size, 'a');
  const b1 = Buffer.alloc(size, 'a');
  const b0Len = b0.length;
  const b1Len = b1.length;
  var i;

  b1[size - 1] = 'b'.charCodeAt(0);

  // Force optimization before starting the benchmark
  switch (args) {
    case 2:
      b0.compare(b1, 0);
      break;
    case 3:
      b0.compare(b1, 0, b1Len);
      break;
    case 4:
      b0.compare(b1, 0, b1Len, 0);
      break;
    case 5:
      b0.compare(b1, 0, b1Len, 0, b0Len);
      break;
    default:
      b0.compare(b1);
  }
  v8.setFlagsFromString('--allow_natives_syntax');
  eval('%OptimizeFunctionOnNextCall(b0.compare)');
  switch (args) {
    case 2:
      b0.compare(b1, 0);
      bench.start();
      for (i = 0; i < iter; i++) {
        b0.compare(b1, 0);
      }
      bench.end(iter / 1e6);
      break;
    case 3:
      b0.compare(b1, 0, b1Len);
      bench.start();
      for (i = 0; i < iter; i++) {
        b0.compare(b1, 0, b1Len);
      }
      bench.end(iter / 1e6);
      break;
    case 4:
      b0.compare(b1, 0, b1Len, 0);
      bench.start();
      for (i = 0; i < iter; i++) {
        b0.compare(b1, 0, b1Len, 0);
      }
      bench.end(iter / 1e6);
      break;
    case 5:
      b0.compare(b1, 0, b1Len, 0, b0Len);
      bench.start();
      for (i = 0; i < iter; i++) {
        b0.compare(b1, 0, b1Len, 0, b0Len);
      }
      bench.end(iter / 1e6);
      break;
    default:
      b0.compare(b1);
      bench.start();
      for (i = 0; i < iter; i++) {
        b0.compare(b1);
      }
      bench.end(iter / 1e6);
  }
}
