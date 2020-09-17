import { ProcEnum } from './ProcEnum';
import { EventType } from '../constValue/EventType';
import { zMdl } from '../GameEntry';
import { ConstText } from '../constValue/ConstText';

export default class ProcLoad extends zz.ProcBase {
  onStart() {
    zz.log('[Procedure] Load, onStart');
    //TODO 此处增加公用资源bundle的加载;
    this.LoadTables();
  }
  onLeave() {
    zz.log('[Procedure] Load, onLeave');
  }

  async LoadTables() {
    let tableArr = [];
    zz.event.fire(EventType.LoadingPage, true, 0, ConstText.loading_table);
    for (let i = 0, len = tableArr.length; i < len; i++) {
      await zz.table.loadConfig(tableArr[i]);
      zz.event.fire(
        EventType.LoadingPage,
        true,
        (i + 1) / len,
        ConstText.loading_table
      );
    }
    this.LoadTableComplete();
  }

  /**
   * 加载Json配置表结果事件
   * @param isSuccess 是否成功
   * @param tableName 数据类名称
   * @param args 透传参数
   */
  LoadTableComplete() {
    zMdl.loadData();
    zz.proc.changeProcedure(ProcEnum.Res);
  }
}
