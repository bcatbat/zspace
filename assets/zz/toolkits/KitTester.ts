const { ccclass, property } = cc._decorator;

@ccclass
export default class KitTester extends cc.Component {
  onLoad() {
    let key = 'fefefwfwfwef';
    zz.sto.saveObject(key, [1213, 231]);
    let res = zz.sto.getObject<number[]>(key);
    zz.log(res);
  }
}

function assert(condition, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
