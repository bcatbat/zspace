// import { ProcEnum } from './ProcEnum';
// import { zMdl } from '../helper/zMdl';
// import { ConstText } from '../constValue/ConstText';

// export default class ProcLoad extends zz.ProcBase {
//   onStart() {
//     zz.log('[Procedure] Load, onStart');
//     this.loadBundles();
//     this.LoadTables();
//   }
//   onLeave() {
//     zz.log('[Procedure] Load, onLeave');
//   }
//   async loadBundles() {}

//   async LoadTables() {
//     let tableArr = ['LevelScene'];
//     zz.loadingPage(true, 0, ConstText.loading_table);
//     for (let i = 0, len = tableArr.length; i < len; i++) {
//       await zz.table.loadConfig(tableArr[i], 'configs');
//       zz.loadingPage(true, (i + 1) / len, ConstText.loading_table);
//     }
//     this.LoadTableComplete();
//   }

//   /**
//    * 加载Json配置表结果事件
//    * @param isSuccess 是否成功
//    * @param tableName 数据类名称
//    * @param args 透传参数
//    */
//   LoadTableComplete() {
//     zMdl.loadData();
//     zz.proc.changeProcedure(ProcEnum.Res);
//   }
// }
