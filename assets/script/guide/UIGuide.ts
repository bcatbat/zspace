import { setSwallowTouch } from '../lib/utils/Utils';
import { TableDataGuide } from '../table/TableDataGuide';
import { zz } from '../zz';

const { ccclass, property } = cc._decorator;

type GuideType =
	/**目标有;目标事件有;目标高亮有;蒙版黑;蒙版事件无;蒙版吞没 */
	| 'click'
	/**目标有;目标事件无;目标高亮有;蒙版黑;蒙版事件有;蒙版吞没 */
	| 'pass'
	/**目标无;目标事件无;目标高亮无;蒙版黑;蒙版事件有;蒙版吞没 */
	| 'txt'
	/**目标有;目标事件无;目标高亮无;蒙版透明;蒙版事件有;蒙版穿透 */
	| 'hint';

@ccclass
export default class UIGuide extends zz.UIBase {
	@property(cc.Node) highlightNode: cc.Node = undefined;
	@property(cc.Mask) mask: cc.Mask = undefined;
	@property(cc.Node) screenNode: cc.Node = undefined;
	@property(cc.Node) penNode: cc.Node = undefined;

	//#region dialog
	@property(cc.Node) dialogNode: cc.Node = undefined;
	@property() dialogElements: boolean = false;
	@property({
		type: cc.Label,
		visible: function () {
			return this.dialogElements;
		},
	})
	roleLabel: cc.Label = undefined;
	@property({
		type: cc.Node,
		visible: function () {
			return this.dialogElements;
		},
	})
	namePanelNode: cc.Node = undefined;
	@property({
		type: cc.Label,
		visible: function () {
			return this.dialogElements;
		},
	})
	contentLabel: cc.Label = undefined;
	@property({
		type: cc.Sprite,
		visible: function () {
			return this.dialogElements;
		},
	})
	roleSprite: cc.Sprite = undefined;
	@property({
		type: cc.SpriteFrame,
		visible: function () {
			return this.dialogElements;
		},
	})
	roleSfArr: cc.SpriteFrame[] = [];
	//#endregion

	private tableData: TableDataGuide = undefined;
	private target: cc.Node = undefined;
	onLoad() {
		this.screenNode.on(cc.Node.EventType.TOUCH_START, this.onSceenTouch, this);
	}
	onDestroy() {
		this.screenNode.targetOff(this);
	}
	onOpen(args: any[]) {
		this.tableData = args[0];
		this.target = args[1];
		switch (this.tableData.type as GuideType) {
			case 'click':
				/**目标有;目标事件有;目标高亮有;蒙版黑;蒙版事件无;蒙版吞没 */
				this.highlightNode.active = true;
				this.mask.node.active = true;
				this.screenNode.active = false;
				this.screenNode.opacity = 110;
				if (!this.target) {
					zz.error('[UIGuide] click型必须有目标');
				}
				break;
			case 'pass':
				/**目标有;目标事件无;目标高亮有;蒙版黑;蒙版事件有;蒙版吞没 */
				this.highlightNode.active = true;
				this.mask.node.active = true;
				this.screenNode.active = true;
				this.screenNode.opacity = 0;
				zz.setSwallowTouch(this.screenNode, true);
				if (!this.target) {
					zz.error('[UIGuide] pass型必须有目标');
				}
				break;
			case 'txt':
				/**目标无;目标事件无;目标高亮无;蒙版黑;蒙版事件有;蒙版吞没 */
				this.highlightNode.active = false;
				this.mask.node.active = true;
				this.screenNode.active = true;
				this.screenNode.opacity = 110;
				zz.setSwallowTouch(this.screenNode, true);
				break;
			case 'hint':
				/**目标有;目标事件无;目标高亮无;蒙版透明;蒙版事件有;蒙版穿透 */
				this.highlightNode.active = true;
				this.mask.node.active = false;
				this.screenNode.active = true;
				this.screenNode.opacity = 0;
				zz.setSwallowTouch(this.screenNode, false);
				if (!this.target) {
					zz.error('[UIGuide] hint型必须有目标');
				}
				break;
		}
		// dialog
		this.dialogNode.active = !!this.tableData.content;
		this.dialogNode.y = -400;
		// dialog_role
		let roleId = this.tableData.narratorId;
		this.roleSprite.spriteFrame = this.roleSfArr[roleId];
		// dialog_label
		this.roleLabel.string = this.tableData.narrator;
		this.startTyping();
		// dialog_role_position
		if (this.tableData.narratorId == 0) {
			this.roleSprite.node.x = -210;
			this.roleLabel.node.x = -210;
			this.namePanelNode.x = -210;
		} else {
			this.roleSprite.node.x = 210;
			this.roleLabel.node.x = 210;
			this.namePanelNode.x = 210;
		}
		// highlight target
		if (this.target) {
			if (this.tableData.type == 'click') {
				let btn = this.target.getComponent(cc.Button);
				if (btn) {
					// this.target.on('click', this.onTargetClick, this);
				} else {
					// this.target.on(cc.Node.EventType.TOUCH_START, this.onTargetTouchStart, this);
				}
				this.highlightNode.on('click', this.onBtnHighlightClick, this);
			}
			let pw = this.target.convertToWorldSpaceAR(cc.v2());
			let pc = this.node.convertToNodeSpaceAR(pw);
			// mask size
			this.highlightNode.anchorX = this.target.anchorX;
			this.highlightNode.anchorY = this.target.anchorY;
			this.highlightNode.width = this.target.width * 0.9;
			this.highlightNode.height = this.target.height * 0.9;
			this.highlightNode.position = cc.v3(pc);
			this.highlightNode.active = true;
			// pen position
			this.penNode.x = (0.5 - this.highlightNode.anchorX) * this.highlightNode.width;
			this.penNode.y = (0.5 - this.highlightNode.anchorY) * this.highlightNode.height;
			// mask sprite
			let tarSprite = this.target.getComponent(cc.Sprite) || this.target.getComponentInChildren(cc.Sprite);
			this.mask.spriteFrame = tarSprite.spriteFrame;
		} else {
			this.highlightNode.active = false;
		}
		zz.sdk.hideBanner();
	}
	private typingIntervalId: number = 0;
	private startTyping() {
		if (this.typingIntervalId > 0) {
			this.stopTyping();
		}
		if (!this.tableData.content) {
			return;
		}
		this.contentLabel.string = '';
		let prog = 0;
		let len = this.tableData.content.length;
		this.typingIntervalId = zz.setInterval(() => {
			prog++;
			if (!this.tableData) {
				zz.log('[UIGuide] error: intervalId=' + this.typingIntervalId);
				return;
			}
			this.contentLabel.string = this.tableData.content.slice(0, prog);
			if (prog >= len) {
				this.stopTyping();
			}
		}, 1);
		// zz.log('[UIGuide] interval start:' + this.typingIntervalId);
	}
	private stopTyping() {
		zz.clearInterval(this.typingIntervalId);
		// zz.log('[UIGuide] interval clear:' + this.typingIntervalId);
		this.typingIntervalId = 0;
		this.contentLabel.string = this.tableData.content;
	}

	private onSceenTouch() {
		zz.log(`[UIGuide] screen click`);
		this.stopTyping();
		if (this.tableData) {
			this.nextStep();
		}
		this.clearStepData();
	}
	onBtnHighlightClick(ev: cc.Event.EventTouch) {
		zz.log(`[UIGuide] mask click`);
		this.stopTyping();
		if (this.target && this.tableData) {
			this.highlightNode.off('click', this.onBtnHighlightClick, this);
			this.nextStep();
			let btn = this.target.getComponent(cc.Button);
            //此处处理终究有些问题;触摸事件无法获知;只能按需的传入部分参数
			if (btn) {
                btn.clickEvents.forEach(handler => {
					handler.emit([{ target: this.target }, handler.customEventData]);
				});
			} else {
				this.target.emit(cc.Node.EventType.TOUCH_START, { target: this.target });
			}
		}
		this.clearStepData();
	}

	private nextStep() {
		zz.model.guide.nextGuide();
	}
	private clearStepData() {
		this.target = null;
		this.tableData = null;
	}
}
