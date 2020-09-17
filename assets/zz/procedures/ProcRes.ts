import { ProcEnum } from './ProcEnum';

export default class ProcRes extends zz.ProcBase {
  async onStart() {
    zz.log('[Procedure] Res, onStart');            
    zz.proc.changeProcedure(ProcEnum.Platform);
  }

  onLeave() {
    zz.log('[Procedure] Res, onLeave');
  }
}
