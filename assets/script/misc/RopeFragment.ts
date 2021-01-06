const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeFragment extends cc.Component {
  private pos_tar: cc.Vec2;
  private pos_cur: cc.Vec2;
  private length: number;
  private angle: number;
  private needRotate = false;

  init(x: any, y: number, length: number, angle: number, needRotate = true) {
    this.pos_cur = cc.v2(x, y);
    this.length = length;
    this.angle = angle;
    this.needRotate = needRotate;
    this.calcTar();
  }

  calcTar() {
    let dx = this.length * Math.cos(this.angle);
    let dy = this.length * Math.sin(this.angle);
    this.pos_tar = this.pos_cur.add(cc.v2(dx, dy));
  }

  calcCur(tar: cc.Vec2) {
    let dir = tar.sub(this.pos_cur).normalizeSelf();
    this.angle = Math.atan2(dir.y, dir.x);
    dir = dir.mul(-1 * this.length);
    this.pos_cur = tar.add(dir);

    this.node.position = cc.v3(this.pos_cur);
    if (this.needRotate) this.node.angle = (this.angle / Math.PI) * 180 - 90;
    else this.node.angle = 0;
  }

  getPosCur() {
    return this.pos_cur;
  }
  getPosTar() {
    return this.pos_tar;
  }
  setPosCur(pos: cc.Vec2) {
    this.pos_cur = pos;
    this.calcTar();
  }
}
