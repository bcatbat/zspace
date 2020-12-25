import { EventMgr } from './zzEvt';
import { ProcedureMgr } from './zzProc';
import { ResMgr } from './zzRes';
import { SceneMgr } from './zzScene';
import { SoundMgr } from './zzSound';
import { StorageMgr } from './zzSto';
import { TableMgr } from './zzTbl';
import { UIMgr } from './zzUI';

export * as bt from './zzBehaviorTree';
export * from './zzLog';
export * from './zzPool';
export * from './zzStructure';
export * from './zzType';
export * as utils from './zzUtils';
export * from './zzUI';

/**事件管理 */
export const event = new EventMgr();
/**流程管理 */
export const proc = new ProcedureMgr();
/**动态资源管理 */
export const res = new ResMgr();
/**场景管理 */
export const scene = new SceneMgr();
/**声音管理 */
export const sound = new SoundMgr();
/**存储管理 */
export const sto = new StorageMgr();
/**表格管理 */
export const table = new TableMgr();
/**UI管理 */
export const ui = new UIMgr();