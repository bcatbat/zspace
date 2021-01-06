import RopeFragment from './RopeFragment';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeContainer extends cc.Component {
  @property(cc.Node) handleNd: cc.Node = null;
  @property(cc.Float) length: number = 12;
  @property(cc.SpriteFrame) fragmentSpriteFrame: cc.SpriteFrame = undefined;
  @property(cc.Float) fragNumber: number = 32;
  private ropeNode: cc.Node = null;
  private ropeArr: RopeFragment[] = [];
  private graphic: cc.Graphics = null;
  public oriPos: cc.Vec2 = null;
  public hdPos: cc.Vec2 = null;
  @property() canDrag: boolean = true;
  @property() isFixed: boolean = true;
  @property() needDraw: boolean = false;
  @property() handleRotate: boolean = true;
  public callbackHandlerDragEnd: Function = undefined;

  onLoad() {
    this.ropeNode = this.node;
    this.graphic = this.ropeNode.getComponent(cc.Graphics);
    this.handleNd.zIndex = 10;
    this.oriPos = cc.v2(this.handleNd.position.x, this.handleNd.position.y);
  }
  onEnable() {
    this.handleNd.on(cc.Node.EventType.TOUCH_START, this.onHdTouchMove, this);
    this.handleNd.on(cc.Node.EventType.TOUCH_MOVE, this.onHdTouchMove, this);
    this.handleNd.on(cc.Node.EventType.TOUCH_END, this.onHdTouchEnd, this);
    this.handleNd.on(cc.Node.EventType.TOUCH_CANCEL, this.onHdTouchEnd, this);
  }
  onDisable() {
    this.handleNd.off(cc.Node.EventType.TOUCH_START, this.onHdTouchMove, this);
    this.handleNd.off(cc.Node.EventType.TOUCH_MOVE, this.onHdTouchMove, this);
    this.handleNd.off(cc.Node.EventType.TOUCH_END, this.onHdTouchEnd, this);
    this.handleNd.off(cc.Node.EventType.TOUCH_CANCEL, this.onHdTouchEnd, this);
  }

  start() {
    this.createRopes();

    this.reset();
  }
  createRopes() {
    for (let i = 0; i < this.fragNumber; i++) {
      let nd = new cc.Node();
      this.ropeNode.addChild(nd, 1, `rope${i}`);
      let rope = nd.addComponent(RopeFragment);
      this.ropeArr.push(rope);
      rope.addComponent(cc.Sprite).spriteFrame = this.fragmentSpriteFrame;
    }
    let hdRope = this.handleNd.getComponent(RopeFragment);
    this.ropeArr.push(hdRope);
  }
  initRopesPos() {
    let angle = 0;
    let length = this.length;
    for (let i = 0; i < this.fragNumber + 1; i++) {
      let rope = this.ropeArr[i];
      if (i == 0) {
        rope.init(0, 0, length, angle);
      } else {
        let last = this.ropeArr[i - 1];
        let pos_last_tar = last.getPosTar();
        rope.init(
          pos_last_tar.x,
          pos_last_tar.y,
          length,
          angle - i,
          i == this.fragNumber ? (this.handleRotate ? true : false) : true
        );
      }
    }
  }

  reset() {
    if (this.ropeArr.length == 0) return;
    this.initRopesPos();
    this.hdPos = this.oriPos;
    this.flag_update = true;
    this.update(0);
    this.flag_update = false;
  }

  private flag_update: boolean = false;
  update(dt: number) {
    if (!this.flag_update) return;

    let len = this.ropeArr.length;
    for (let i = len - 1; i >= 0; i--) {
      let rope = this.ropeArr[i];
      if (i == len - 1) {
        rope.calcCur(this.hdPos);
      } else {
        let last = this.ropeArr[i + 1];
        rope.calcCur(last.getPosCur());
      }
      rope.calcTar();
    }

    // fixed
    if (this.isFixed) {
      this.ropeArr[0].setPosCur(cc.Vec2.ZERO);
      for (let i = 1; i < len; i++) {
        let cur = this.ropeArr[i];
        let last = this.ropeArr[i - 1];
        cur.calcCur(last.getPosCur());
        cur.calcTar();
      }
    }

    //draw
    if (this.needDraw) {
      this.graphic.clear();
      for (let i = 1; i < len; i++) {
        let rope = this.ropeArr[i];
        let pos_cur = rope.getPosCur();
        let pos_tar = rope.getPosTar();
        this.graphic.moveTo(pos_cur.x, pos_cur.y);
        this.graphic.lineTo(pos_tar.x, pos_tar.y);
        // this.graphic.circle(pos_cur.x, pos_cur.y, 1);
        this.graphic.stroke();
      }
    }
  }

  private onHdTouchMove(ev: cc.Event.EventTouch) {
    if (!this.canDrag) return;
    this.flag_update = true;
    this.hdPos = this.node.convertToNodeSpaceAR(ev.getLocation());
  }
  private onHdTouchEnd(ev: cc.Event.EventTouch) {
    if (!this.canDrag) return;
    this.callbackHandlerDragEnd?.();
    this.flag_update = false;
  }
}
