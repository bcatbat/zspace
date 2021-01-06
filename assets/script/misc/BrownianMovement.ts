const { ccclass, property } = cc._decorator;

@ccclass
export default class BrownianMovement extends cc.Component {

    private dir: cc.Vec2 = cc.v2(1, 0);

    @property(cc.Float) private updateInterval: number = 1;
    @property(cc.Float) private turnInterval: number = 3;
    @property(cc.Float) private speed: number = 10;
    private tick_update: number = 0;
    private tick_turn: number = 0;

    private lmt_l: number = 0;
    private lmt_r: number = 0;
    private lmt_u: number = 0;
    private lmt_d: number = 0;
    start() {
        this.lmt_l = -this.node.parent.width / 2;
        this.lmt_r = -this.lmt_l;
        this.lmt_u = this.node.parent.height / 2;
        this.lmt_d = -this.lmt_u;
    }

    update(dt: number) {
        this.tick_update += dt;
        this.tick_turn += dt;
        if (this.tick_update > this.updateInterval) {
            this.tick_update = 0;
            this.node.position = this.node.position.add(cc.v3(this.dir).mul(this.speed));
            this.checkBound();
        }
        if (this.tick_turn > this.turnInterval) {
            this.tick_turn = 0;
            this.turn();
        }
    }

    private turn() {
        cc.Vec2.random(this.dir);

    }
    private checkBound() {
        if (this.node.x < this.lmt_l || this.node.x > this.lmt_r) {
            this.dir = cc.v2(-this.dir.x, this.dir.y);
            console.log('turn horizontal');

        }
        if (this.node.y > this.lmt_u || this.node.y < this.lmt_d) {
            this.dir = cc.v2(this.dir.x, -this.dir.y);
            console.log('turn vertical');

        }
    }
}
