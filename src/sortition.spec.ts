import { Big } from 'big.js';
import { vrf } from './ecvrf';
import { combination, getVotes } from './sortition';
import { B, generatePair } from './utils';

function getAverangeResult(fn: () => number, times = 1) {
  let sum = 0;
  for (let i = 0; i < times; i++) {
    sum += fn();
  }
  return (sum / times).toFixed(2);
}

console.log('C(5,0)', combination(new Big(5), new Big(0)).toString());

// 持币量
const w = 1;
// 总币量
const W = 10;

// 希望多少人被选出来
for (let a = 1; a <= 10; a++) {
  const p = a / W;

  const c = getAverangeResult(() => {
    let count = 0;
    for (let i = 0; i < 10; i++) {

      const [pub, pri] = generatePair();

      const { proof, value } = vrf(pub, pri, B([12]));

      const j = getVotes(value, new Big(w), new Big(p));
      j.gt(0) && count++;

      // easierCheckVote(vrf, new Big(w), new Big(p)) && count++
    }
    return count;
  }, 10);

  console.log('   count: ', a, '\t->', c);
}

