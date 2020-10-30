/// <reference path="zzLog.ts" />
namespace zz {
  /**流程管理;一条单通道管线 */
  class ProcedureMgr {
    private procedureMap: Map<string, ProcBase> = new Map<string, ProcBase>();
    private curProcedure: string = undefined;
    get currentProcedure() {
      return this.curProcedure;
    }
    setProcedure(procName: string, procedure: ProcBase) {
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
  export abstract class ProcBase {
    abstract onStart(): void;
    abstract onLeave(): void;
  }

  /**流程管理 */
  export const proc = new ProcedureMgr();
}
