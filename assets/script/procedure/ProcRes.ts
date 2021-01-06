import { ConstText } from '../const/ConstText';
import { UIEnum } from '../const/UIParams';
import { zz } from '../zz';
import { ProcEnum } from './ProcEnum';

export default class ProcRes extends zz.ProcedureBase {
	async onStart() {
		zz.log('[Procedure] Res, onStart');
		// 预载主页相关页面
		let list = [UIEnum.UIMain];
		for (let i = 0, len = list.length; i < len; i++) {
			zz.loadingPage(true, i / len, ConstText.loading_entity);
			await zz.ui.preloadUI(list[i]);
		}
		zz.loadingPage(true, 1, ConstText.loading_preload);
		zz.proc.changeProcedure(ProcEnum.Platform);
	}

	onLeave() {
		zz.log('[Procedure] Res, onLeave');
	}
}
