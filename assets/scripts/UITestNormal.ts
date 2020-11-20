import { UIEnum } from '../zz/constValue/UIParams';

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITestNormal extends zz.UIBase {
	@property(cc.Label) contentLb: cc.Label = undefined;
	@property(cc.Node) container: cc.Node = undefined;

	onOpen(args: any[]) {
		this.contentLb.string = args[0];
		zz.res.loadRes('test', 'prefab', 'testPrefab1');
	}

	private async testForLoadRes1() {
		let bundle = await zz.utils.getBundle('test');
		for (let i = 0; i < 100; i++) {
			let t = Date.now();
			bundle.load('prefab/testPrefab1', (err, asset) => {
				zz.log(Date.now() - t);
			});
		}
	}
	private async testForLoadRes2() {
		for (let i = 0; i < 100; i++) {
			let t = Date.now();
			zz.res.getRes('test', 'prefab', 'testPrefab1', cc.Prefab);
			zz.log(Date.now() - t);
		}
	}

	onBtnYes() {
		this.testForLoadRes1();
	}
	onBtnNo() {
		this.testForLoadRes2();
	}
	onBtnSub() {
		zz.ui.openUI({ uiName: UIEnum.UITestSub });
	}
}
