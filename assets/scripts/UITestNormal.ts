import { ConstText } from '../zz/constValue/ConstText';
import { EventType } from '../zz/constValue/EventType';

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITestNormal extends zz.UIBase {
  @property(cc.Label) contentLb: cc.Label = undefined;

  onOpen(args: any[]) {
    this.contentLb.string = args[0];
  }

  onBtnYes() {
    zz.event.fire(EventType.Tip, ConstText.test_1);
  }
  onBtnNo() {
    zz.ui.closeUI(this.node.name);
  }
}
