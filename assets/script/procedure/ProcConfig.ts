import { Config } from '../const/Config';
import { StoKey } from '../const/StoKey';

import { zz } from '../zz';
import { ProcEnum } from './ProcEnum';

export default class ProcConfig extends zz.ProcedureBase {
	onStart() {
		zz.log('[Procedure] Config, onStart');
		this.requestConfig();
		zz.proc.changeProcedure(ProcEnum.Load);
	}
	onLeave() {
		zz.log('[Procedure] Config, onLeave');
	}

	private requestConfig() {
		console.time('RequestConfig');
		this.loadDataLocal();
	}
	private loadDataLocal() {
		Config.requestOver = true;
		let jsonStr: string = zz.sto.getString(StoKey.configPowerData) || '';
		if (jsonStr.length > 0) {
			let json = JSON.parse(jsonStr);
			Config.powerData = json;
		}
		zz.model.power.outerUpdateConfig();
	}
}
