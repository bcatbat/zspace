import { EventType } from '../../script/const/EventType';
import { zz } from '../../script/zz';

const { ccclass, property } = cc._decorator;

@ccclass
export default class UICommon extends zz.UIBase {
	onLoad() {
		this.initLabelTip();
		this.initLoadNode();
		zz.event.register(EventType.Tip, this, this.ShowLabelTip);
		zz.event.register(EventType.LoadingPage, this, this.LoadNodeMgr);
		this.node.zIndex = 99;
	}
	onDestroy() {
		zz.event.delAllRegister(this);
	}

	//#region 简单提示
	private tipPool: cc.NodePool = null;
	@property(cc.Node) LabelTipNode: cc.Node = null;
	farPos: cc.Vec2 = new cc.Vec2(2000, 0);
	initLabelTip() {
		this.LabelTipNode.active = true;
		let prefab = this.LabelTipNode.getChildByName('tipItemPrefab');
		this.tipPool = new cc.NodePool();
		for (let i = 0; i < 5; i++) {
			let nd = cc.instantiate(prefab);
			this.tipPool.put(nd);
		}
	}
	private createTip() {
		if (this.tipPool.size() == 0) {
			let prefab = this.LabelTipNode.getChildByName('tipItemPrefab');
			let nd = cc.instantiate(prefab);
			this.tipPool.put(nd);
		}
		return this.tipPool.get();
	}

	private lastY: number = 0;
	private lastT: number = 0;
	private lineDist: number = 50;
	private timeInterval: number = 300;
	ShowLabelTip(content: string, duration: number = 2.0) {
		// 防止同时多行tip干扰;
		let t = Date.now();
		let y = 0;
		if (t - this.lastT > this.timeInterval) {
			y = 0;
		} else {
			y = this.lastY - this.lineDist;
		}
		this.lastY = y;
		this.lastT = Date.now();
		let nd = this.createTip();
		nd.parent = this.LabelTipNode;
		nd.position = cc.v3(0, y, 0);
		nd.getComponentInChildren(cc.Label).string = content;
		let bg = nd.getChildByName('bg');
		bg.width = bg.children[0].width + 60;
		cc.tween(nd)
			.by(duration, { y: 200 })
			.call(() => {
				this.tipPool.put(nd);
			})
			.start();
	}

	//#endregion

	//#region 加载界面
	@property(cc.Node) loadNode: cc.Node = undefined;
	private loadProgBar: cc.ProgressBar;
	private valLabel: cc.Label;
	private desLabel: cc.Label;
	private handleNode: cc.Node;
	initLoadNode() {
		this.loadProgBar = this.loadNode.children[1].getComponent(cc.ProgressBar);
		this.loadNode.active = false;
		this.valLabel = this.loadNode.children[2].children[0].getComponent(cc.Label);
		this.desLabel = this.loadNode.children[2].children[1].getComponent(cc.Label);
		this.handleNode = this.loadNode.children[1].children[0].children[0];
	}

	LoadNodeMgr(isOpen: boolean, prog: number, desTxt: string) {
		if (isOpen) {
			if (!prog) prog = 0;
			else prog = +prog;
			this.loadNode.active = true;
			this.loadProgBar.progress = prog;
			this.valLabel.string = (prog * 100 > 100 ? 100 : prog * 100).toFixed() + '%';
			this.desLabel.string = !!desTxt ? desTxt : '';
			this.handleNode.x = 618 * prog;
		} else {
			this.loadNode.active = false;
		}
	}
	//#endregion
}