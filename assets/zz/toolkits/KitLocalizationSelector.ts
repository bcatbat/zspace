const { ccclass, menu, disallowMultiple, property } = cc._decorator;
@ccclass
@menu('Kits/LocalizationSelector')
@disallowMultiple
export default class KitLocalizationSelector extends cc.Component {
  static langType: number = 0;
  @property(cc.SpriteFrame) simple_chinese: cc.SpriteFrame = undefined;
  @property(cc.SpriteFrame) traditional_chinese: cc.SpriteFrame = undefined;
  onLoad() {
    if (KitLocalizationSelector.langType == 0) {
      this.getComponent(cc.Sprite).spriteFrame = this.simple_chinese;
    }

    let sp = this.getComponent(cc.Sprite);
    switch (KitLocalizationSelector.langType) {
      case 0:
        sp.spriteFrame = this.simple_chinese;
        break;
      case 1:
        sp.spriteFrame = this.traditional_chinese;
      default:
        break;
    }
  }
}
1;
