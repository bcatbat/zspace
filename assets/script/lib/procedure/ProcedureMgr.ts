import { error } from '../log/Log';
import { ProcedureBase } from './ProcedureBase';

/**流程管理;一条单通道管线 */
export class ProcedureMgr {
	private procedureMap: Map<string, ProcedureBase> = new Map<string, ProcedureBase>();
	private curProcedure: string = undefined;
	get currentProcedure() {
		return this.curProcedure;
	}
	setProcedure(procName: string, procedure: ProcedureBase) {
		this.procedureMap.set(procName, procedure);
	}
	init(firstProc: string) {
		if (this.procedureMap.has(firstProc)) {
			this.curProcedure = firstProc;
			this.procedureMap.get(firstProc).onStart();
		}
	}
	changeProcedure(procName: string) {
		if (this.procedureMap.has(procName)) {
			this.procedureMap.get(this.curProcedure).onLeave();
			this.curProcedure = procName;
			this.procedureMap.get(procName).onStart();
		} else {
			error('[changeProcedure] 不存在' + procName);
		}
	}
}