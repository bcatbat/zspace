import { SoundEnum } from '../const/SoundEnum';
import { zz } from '../zz';

const { ccclass, property, menu } = cc._decorator;

const DragConstraint = cc.Enum({
  None: 0,
  Horizontal: 1,
  Vertical: 2,
});

@ccclass
@menu('Kit/DragHandler')
export default class DragHandler extends cc.Component {
  @property({ type: cc.Enum(DragConstraint), displayName: '约束' })
  constraint = DragConstraint.None;

  @property({ displayName: '开始点击音效' }) efx: string = '';

  cbStart: Function = null;
  cbMove: Function = null;
  cbEnd: Function = null;

  onEnable() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onDragStartEvt, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onDragMoveEvt, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onDragEndEvt, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onDragEndEvt, this);
  }
  onDisable() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onDragStartEvt, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onDragMoveEvt, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onDragEndEvt, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onDragEndEvt, this);
  }
  private _offsetTouch: cc.Vec2 = null;
  private onDragStartEvt(ev: cc.Event.EventTouch) {
    // if (this.efx) zz.sound.playSound(this.efx);
    // else zz.sound.playSound(SoundEnum.btn);
    zz.sound.playSound(SoundEnum.btn);
    this.node.zIndex = 1;
    var pos = ev.getLocation();
    this._offsetTouch = pos.sub(cc.v2(this.node.x, this.node.y));
    this.cbStart?.(ev);
  }
  private onDragMoveEvt(ev: cc.Event.EventTouch) {
    var pos = ev.getLocation();
    if (this.constraint != DragConstraint.Vertical)
      this.node.x = pos.x - this._offsetTouch.x;
    if (this.constraint != DragConstraint.Horizontal)
      this.node.y = pos.y - this._offsetTouch.y;
    this.cbMove?.(ev);
  }
  private onDragEndEvt(ev: cc.Event.EventTouch) {
    // if (this.efx) zz.sound.stopSound(this.efx);
    // else zz.sound.stopSound(SoundEnum.btn);
    zz.sound.playSound(SoundEnum.btn);
    this.node.zIndex = 0;
    this.node.scale = 1;
    this.cbEnd?.(ev);
  }
}
