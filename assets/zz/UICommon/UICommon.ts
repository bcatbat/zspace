import { EventType } from '../constValue/EventType';
const { ccclass, property } = cc._decorator;

@ccclass
export default class UICommon extends zz.UIBase {
  onLoad() {    
    this.InitLabelTip();
    this.InitLoadNode();
    zz.event.register(EventType.Tip, this, this.ShowLabelTip);
    zz.event.register(EventType.LoadingPage, this, this.LoadNodeMgr);
  }
  onDestroy() {
    zz.event.delAllRegister(this);
  }

  //#region 简单提示
  private tipPool: cc.NodePool = null;
  @property(cc.Node) LabelTipNode: cc.Node = null;
  farPos: cc.Vec2 = new cc.Vec2(2000, 0);
  //#endregion
  //#region 简单类型提示：富文本
  InitLabelTip() {
    let prefab = this.LabelTipNode.getChildByName('tipItemPrefab');
    this.tipPool = new cc.NodePool();
    for (let i = 0; i < 5; i++) {
      let nd = cc.instantiate(prefab);
      this.tipPool.put(nd);
    }
  }
  private createTip() {
    if (this.tipPool.size() == 0) {
      let prefab = this.LabelTipNode.getChildByName('tipItemPrefab');
      let nd = cc.instantiate(prefab);
      this.tipPool.put(nd);
    }
    return this.tipPool.get();
  }

  private lastY: number = 0;
  private lastT: number = 0;
  private lineDist: number = 50;
  private timeInterval: number = 300;
  ShowLabelTip(content: string, duration: number = 1.0) {
    // 防止同时多行tip干扰;
    let t = Date.now();
    let y = 0;
    if (t - this.lastT > this.timeInterval) {
      y = 0;
    } else {
      y = this.lastY - this.lineDist;
    }
    this.lastY = y;
    this.lastT = Date.now();
    let nd = this.createTip();
    nd.parent = this.LabelTipNode;
    nd.position = cc.v3(0, y, 0);
    nd.getComponentInChildren(cc.RichText).string = content;
    let bg = nd.getChildByName('bg');
    bg.width = bg.getChildByName('tipRichText').width + 60;
    cc.tween(nd)
      .by(duration, { y: 200 }, { progress: null, easing: 'quadOut' })
      .call(() => {
        this.tipPool.put(nd);
      })
      .start();
  }

  //#endregion

  //#region 加载界面
  @property(cc.Node) loadNode: cc.Node = undefined;
  private loadProgBar: cc.ProgressBar;
  private valLabel: cc.Label;
  private desLabel: cc.Label;
  //#endregion
  //#region 加载界面
  InitLoadNode() {
    this.loadProgBar = this.loadNode.children[0].getComponent(cc.ProgressBar);
    this.loadNode.active = false;
    this.valLabel = this.loadNode.children[1].children[0].getComponent(
      cc.Label
    );
    this.desLabel = this.loadNode.children[1].children[1].getComponent(
      cc.Label
    );
  }

  LoadNodeMgr(isOpen: boolean, prog: number, desTxt: string) {
    if (isOpen) {
      this.loadNode.active = true;
      this.loadProgBar.progress = prog;
      this.valLabel.string =
        (prog * 100 > 100 ? 100 : prog * 100).toFixed() + '%';
      this.desLabel.string = desTxt;
    } else {
      this.loadNode.active = false;
    }
  }
  //#endregion
}
