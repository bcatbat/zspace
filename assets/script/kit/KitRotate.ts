const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Kit/KitRotate')
export default class KitRotate extends cc.Component {
	@property() private t = 5;
	onLoad() {
		this.node.runAction(cc.repeatForever(cc.rotateBy(this.t, 360)));
	}
}
