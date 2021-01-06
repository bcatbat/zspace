const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@menu('Kit/ColliderHandler')
@requireComponent(cc.Collider)
export default class ColliderHandler extends cc.Component {
	callbackCollisionEnter: (other: cc.Collider, self: cc.Collider) => void = undefined;
	callbackCollisionStay: (other: cc.Collider, self: cc.Collider) => void = undefined;
	callbackCollisionExit: (other: cc.Collider, self: cc.Collider) => void = undefined;

	onCollisionEnter(other: cc.Collider, self: cc.Collider) {
		this.callbackCollisionEnter?.(other, self);
	}
	onCollisionStay(other: cc.Collider, self: cc.Collider) {
		this.callbackCollisionStay?.(other, self);
	}
	onCollisionExit(other: cc.Collider, self: cc.Collider) {
		this.callbackCollisionExit?.(other, self);
	}
}
