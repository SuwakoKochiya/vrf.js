"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = require("big.js");
const ecvrf_1 = require("./ecvrf");
const sortition_1 = require("./sortition");
const utils_1 = require("./utils");
function getAverangeResult(fn, times = 1) {
    let sum = 0;
    for (let i = 0; i < times; i++) {
        sum += fn();
    }
    return (sum / times).toFixed(2);
}
console.log('C(5,0)', sortition_1.combination(new big_js_1.Big(5), new big_js_1.Big(0)).toString());
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
            const [pub, pri] = utils_1.generatePair();
            const { proof, value } = ecvrf_1.vrf(pub, pri, utils_1.B([12]));
            const j = sortition_1.getVotes(value, new big_js_1.Big(w), new big_js_1.Big(p));
            j.gt(0) && count++;
            // easierCheckVote(vrf, new Big(w), new Big(p)) && count++
        }
        return count;
    }, 10);
    console.log('   count: ', a, '\t->', c);
}
