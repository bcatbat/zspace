// const { ccclass, menu } = cc._decorator;

// @ccclass
// @menu('Kits/Tester')
// export default class KitTester extends cc.Component {
//   onLoad() {
//     let key = 'fefefwfwfwef';
//     zz.sto.saveObject(key, [1213, 231]);
//     let res = zz.sto.getObject<number[]>(key);
//     zz.log(res);
//     zz.log(key.replaceAll('fe', '121'));
//     [].forEach(v => 0);
//     zz.log(['a', 'b', 'c'].forEachLeft((_, i) => (i == 2 ? i : undefined)));
//     zz.log([1, 2, 3, 5, 5].forEachRight((_, i) => (i == 3 ? i : undefined)));
//     zz.log(['a', 'b', 'c', 'a'].countWhere((x, i) => x == 'a'));
//     zz.log(['a', 'b', 'c'].intersperse('b'));
//     zz.log(['a', 'b', 'c'].eleAt(-2));
//     zz.log([1, 0, 2, 5, 0, 1].compact());
//     zz.log([1, 2, 3].addRange([3, 4, 5, 6], 2));

//     for (let k in [1, 2, 3]) {
//       zz.log(k);
//     }

//     this.node.findCom(cc.Canvas, 'Canvas');
//   }
// }

// function assert(condition, msg?: string): asserts condition {
//   if (!condition) {
//     throw new Error(msg);
//   }
// }
// function foo1(arr: readonly string[]) {
//   arr.slice();
//   // arr.push('hello');
// }
// function foo2(pair: readonly [string, string]) {
//   // pair[1] = '';
// }
