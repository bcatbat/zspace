const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@requireComponent(cc.PhysicsCollider)
@menu('Kit/ContactHandler')
export default class ContactHandler extends cc.Component {
	onLoad() {
		this.node.getComponent(cc.RigidBody).enabledContactListener = true;
	}
	/**只在两个碰撞体开始接触时被调用一次 */
	callbackBeginContact: (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) => void = undefined;
	/**只在两个碰撞体结束接触时被调用一次 */
	callbackEndContact: (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) => void = undefined;
	/**每次将要处理碰撞体接触逻辑时被调用 */
	callbackPreSolve: (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) => void = undefined;
	/**每次处理完碰撞体接触逻辑时被调用 */
	callbackPostSolve: (contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) => void = undefined;
	// 只在两个碰撞体开始接触时被调用一次
	onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
		this.callbackBeginContact?.(contact, selfCollider, otherCollider);
	}

	// 只在两个碰撞体结束接触时被调用一次
	onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
		this.callbackEndContact?.(contact, selfCollider, otherCollider);
	}

	// 每次将要处理碰撞体接触逻辑时被调用
	onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
		this.callbackPreSolve && this.callbackPreSolve(contact, selfCollider, otherCollider);
	}

	// 每次处理完碰撞体接触逻辑时被调用
	onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
		this.callbackPostSolve && this.callbackPostSolve(contact, selfCollider, otherCollider);
	}
}
