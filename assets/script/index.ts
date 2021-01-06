//#region managers 不要在manager相关脚本中引用zz,只能直接引用具体模块
import { zzEvt } from './manager/zzEvt';
import { zzProc } from './manager/zzProc';
import { zzRes } from './manager/zzRes';
import { zzScene } from './manager/zzScene';
import { zzSound } from './manager/zzSound';
import { zzSto } from './manager/zzSto';
import { zzTbl } from './manager/zzTbl';
import { zzUI } from './manager/zzUI';
import { zzSdk } from './manager/zzSdk';
import { zzMdl } from './manager/zzMdl';

//#endregion

export * from './lib/behaviourTree/BehaviourTree';
export * from './lib/log/Log';
export * from './lib/nodePool/NdPool';
export * from './lib/utils/Utils';
export * from './lib/type/ValueType';
export * from './lib/procedure/ProcedureBase';
export * from './lib/table/TableBase';
export * from './lib/ui/UIBase';
export * from './lib/timer/TimerHelper';
export * from './lib/structures/Index';

export {
	zzEvt as event,
	zzProc as proc,
	zzRes as res,
	zzScene as scene,
	zzSound as sound,
	zzSto as sto,
	zzTbl as table,
	zzUI as ui,
	zzMdl as model,
	zzSdk as sdk,
};
