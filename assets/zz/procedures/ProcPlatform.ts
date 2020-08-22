import { ProcEnum } from './ProcEnum';
export default class ProcPlatform extends zz.ProcBase {
  onStart() {
    zz.log('[Procedure] Platform, onStart');
    zz.proc.changeProcedure(ProcEnum.Game);
  }
  onLeave() { 
    zz.log('[Procedure] Platform, onLeave');
  }
}
