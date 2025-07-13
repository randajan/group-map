
import { info, log } from "@randajan/simple-lib/web";
import GroupMap from "../../dist/esm/index.mjs";

const sm = new GroupMap();
sm.set('users', 1,  { name: 'Alice' })
  .set('users', 2,  { name: 'Bob'   })
  .set('orders', 'A42', { total: 99 });

console.log(sm.get('users', 1)); // → { name: 'Alice' }

for (const [g, k, v] of sm) {
  console.log(g, k, v);
}