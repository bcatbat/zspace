import { zz } from '../zz';
import { ProcEnum } from './ProcEnum';
export default class ProcPlatform extends zz.ProcedureBase {
	onStart() {
		zz.log('[Procedure] Platform, onStart');
		zz.proc.changeProcedure(ProcEnum.Game);
	}
	onLeave() {
		zz.log('[Procedure] Platform, onLeave');
	}
}
