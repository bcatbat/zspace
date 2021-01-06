import { UIEnum } from '../const/UIParams';
import { zz } from '../zz';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProcGame extends zz.ProcedureBase {
	onStart() {
		zz.log('[Procedure] Game, onStart');
		zz.ui.openUI({
			uiName: UIEnum.UIMain,
			openArgs: [3],
			progressArgs: { showProgressUI: true, closeLoadingOnFinish: true },
		});
	}
	onLeave() {
		zz.log('[Procedure] Game, onLeave');
	}
}
