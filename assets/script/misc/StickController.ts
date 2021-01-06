const { ccclass, property } = cc._decorator;

@ccclass
export default class StickController extends cc.Component {
	private radius = 100;

	private stickNode: cc.Node = undefined;
	public output: cc.Vec2 = cc.v2();
	onLoad() {
		this.stickNode = this.node.getChildByName('stick');
		this.node.width = this.node.height = this.radius * 2;
		this.node.children[0].opacity = 255;
		this.node.children[1].opacity = 0;
	}
	onEnable() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchEventStart, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchEventStart, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEventEnd, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEventEnd, this);
	}
	onDisable() {
		this.node.targetOff(this);
	}

	update() {}

	onTouchEventStart(ev: cc.Event.EventTouch) {
		this.node.children[0].opacity = 0;
		this.node.children[1].opacity = 255;
		let pos = this.node.convertToNodeSpaceAR(ev.getLocation());
		let len = pos.mag();
		let nml = pos.normalize();
		if (len >= this.radius) {
			this.stickNode.position = cc.v3(this.output.mul(this.radius));
			this.output = nml;
		} else {
			this.stickNode.position = cc.v3(this.output.mul(len));
			this.output = nml.mul(len / this.radius);
		}
	}
	onTouchEventEnd(ev: cc.Event.EventTouch) {
		this.node.children[0].opacity = 255;
		this.node.children[1].opacity = 0;
		this.stickNode.position = cc.v3();
		this.output = cc.v2();
	}
}
