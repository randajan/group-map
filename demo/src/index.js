
import { info, log } from "@randajan/simple-lib/web";
import { MapSet } from "../../dist/esm/index.mjs";

const sm = new MapSet();
sm.set('users', 1)
  .set('users', 2)
  .set('orders', 'A42');

console.log(sm.get('users')); // → { name: 'Alice' }

for (const [g, k, v] of sm) {
  console.log(g, k, v);
}