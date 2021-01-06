const { ccclass, property, executeInEditMode, menu, disallowMultiple } = cc._decorator;

/**
 * 自定按钮组件;
 * 状态:变化时间,缩放,灰度,图片;可多选,默认缩放1.05;鼠标进出事件
 * 事件:点击开始触发; 点击释放触发; 点击持续触发;
 */
@ccclass
@executeInEditMode
@menu('Kit/KitButton')
@disallowMultiple
export default class KitButton extends cc.Component {
	private _isEnable: boolean = true;
	@property()
	public get isEnable(): boolean {
		return this._isEnable;
	}
	public set isEnable(v: boolean) {
		this._isEnable = v;
		if (this.enableColor) {
			this.getTarget().color = v ? this.upColor : this.disableColor;
		}
		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = v ? this.upSprite : this.disableSprite;
		}
	}

	@property(cc.Node) target: cc.Node = undefined;

	//#region Zoom Style
	@property() enableZoom: boolean = true;
	@property({
		type: cc.Float,
		visible: function () {
			return this.enableZoom;
		},
	})
	zoomScale: number = 1.05;
	//#endregion

	//#region Color Style
	@property() enableColor: boolean = false;
	@property({
		visible: function () {
			return this.enableColor;
		},
	})
	upColor: cc.Color = cc.Color.WHITE;
	@property({
		visible: function () {
			return this.enableColor;
		},
	})
	downColor: cc.Color = cc.Color.WHITE.fromHEX('#C8C8C8');
	@property({
		visible: function () {
			return this.enableColor;
		},
	})
	hoverColor: cc.Color = cc.Color.WHITE.fromHEX('#E6E6E6');
	@property({
		visible: function () {
			return this.enableColor;
		},
	})
	disableColor: cc.Color = cc.Color.WHITE.fromHEX('#787878C8');
	//#endregion

	//#region Sprite Style
	@property() enableSprite: boolean = false;
	@property({
		type: cc.SpriteFrame,
		visible: function () {
			return this.enableSprite;
		},
	})
	upSprite: cc.SpriteFrame = undefined;
	@property({
		type: cc.SpriteFrame,
		visible: function () {
			return this.enableSprite;
		},
	})
	downSprite: cc.SpriteFrame = undefined;
	@property({
		type: cc.SpriteFrame,
		visible: function () {
			return this.enableSprite;
		},
	})
	hoverSprite: cc.SpriteFrame = undefined;
	@property({
		type: cc.SpriteFrame,
		visible: function () {
			return this.enableSprite;
		},
	})
	disableSprite: cc.SpriteFrame = undefined;
	//#endregion

	//#region trigger event
	@property(cc.Component.EventHandler)
	eventsOnDown: cc.Component.EventHandler[] = [];
	@property(cc.Component.EventHandler)
	eventsOnUp: cc.Component.EventHandler[] = [];
	@property(cc.Component.EventHandler)
	eventHoldingUpdate: cc.Component.EventHandler[] = [];
	//#endregion
	private _isDown: boolean;
	public get isDown(): boolean {
		return this._isDown;
	}
	private _isUp: boolean;
	public get isUp(): boolean {
		return this._isUp;
	}
	onLoad() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

		this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
		this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
	}

	onDestroy() {
		this.node.targetOff(this);
	}
	update(dt: number) {
		if (this.isEnable && this.isDown && this.eventHoldingUpdate.length > 0) {
			this.fireEvent(this.touchEvent, this.eventHoldingUpdate);
		}
	}

	private fireEvent(ev: cc.Event.EventTouch, events: cc.Component.EventHandler[]) {
		events.forEach(handler => {
			handler.emit([ev, handler.customEventData]);
		});
	}
	private getTarget() {
		return this.target ?? this.node;
	}
	private touchEvent: cc.Event.EventTouch = null;
	private onTouchStart(ev: cc.Event.EventTouch) {
		if (!this.isEnable || !this.enabledInHierarchy || this.isDown) return;
		this._isUp = false;
		this._isDown = true;
		if (this.enableZoom) {
			this.getTarget().scale = this.zoomScale;
		}
		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = this.downSprite;
		}
		if (this.enableColor) {
			this.getTarget().color = this.downColor;
		}
		this.touchEvent = ev;
		if (this.eventsOnDown.length > 0) this.fireEvent(ev, this.eventsOnDown);
	}
	private onTouchEnd(ev: cc.Event.EventTouch) {
		if (!this.isEnable || !this.enabledInHierarchy || this.isUp) return;
		this._isUp = true;
		this._isDown = false;
		if (this.enableZoom) {
			this.getTarget().scale = 1;
		}
		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = this.upSprite;
		}
		if (this.enableColor) {
			this.getTarget().color = this.upColor;
		}
		if (this.eventsOnUp.length > 0) this.fireEvent(ev, this.eventsOnUp);
		this.touchEvent = null;
	}
	private onTouchCancel(ev: cc.Event.EventTouch) {
		if (!this.isEnable || !this.enabledInHierarchy || this.isUp) return;
		this._isUp = true;
		this._isDown = false;
		if (this.enableZoom) {
			this.getTarget().scale = 1;
		}
		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = this.upSprite;
		}
		if (this.enableColor) {
			this.getTarget().color = this.upColor;
		}
		this.touchEvent = null;
	}
	private onMouseEnter() {
		if (!this.isEnable || this.isDown || !this.enabledInHierarchy) return;
		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = this.hoverSprite;
		}
		if (this.enableColor) {
			this.getTarget().color = this.hoverColor;
		}
	}
	private onMouseLeave() {
		if (!this.isEnable || !this.enabledInHierarchy || this.isUp) return;

		if (this.enableSprite) {
			let sp = this.getTarget().findCom(cc.Sprite);
			if (sp) sp.spriteFrame = this.upSprite;
		}
		if (this.enableColor) {
			this.getTarget().color = this.upColor;
		}
	}
}
