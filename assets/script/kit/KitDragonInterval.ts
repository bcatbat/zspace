const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Kit/KitDragonInterval')
export default class KitDragonInterval extends cc.Component {
	private dragonDisplay: dragonBones.ArmatureDisplay;
	@property() interval: number = 2;
	onLoad() {
		this.dragonDisplay = this.getComponent(dragonBones.ArmatureDisplay);
		this.dragonDisplay.playTimes = 1;
		let animationName = this.dragonDisplay.animationName;
		this.dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimComplete, this);
		this.dragonDisplay.playAnimation(animationName, 1);
	}
	private onAnimComplete() {
		this.scheduleOnce(() => {
			let animationName = this.dragonDisplay.animationName;
			this.dragonDisplay.playAnimation(animationName, 1);
		}, this.interval);
	}
}
