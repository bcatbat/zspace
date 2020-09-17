import { TableEnum } from '../tables/TableEnum';
import { TableMission } from '../tables/TableMission';
import { EventType } from '../constValue/EventType';

/**
 * 关卡数据模型;
 * @description 关卡只会从头开始,不需要中途保存载入;
 */
export default class Mission {
  constructor() {
    this.loadMissionData(1);
  }

  private parseTableData() {
    let tbl = zz.table.getTable(TableEnum.Mission);
    tbl.forEach((v: TableMission, k) => {
      if (!this.missionDataMap.has(v.missionId)) {
        this.missionDataMap.set(v.missionId, []);
      }
      this.missionDataMap.get(v.missionId).push(v);
    });
  }
  public getCurrentMissionData() {
    let missionId = this.curId + '';
    return this.getMissionDataById(missionId);
  }
  public getMissionDataById(missionId: string) {
    return this.missionDataMap.get(missionId);
  }
  /**Map<关卡号, 物品数据列表> */
  private missionDataMap: Map<string, TableMission[]> = new Map<
    string,
    TableMission[]
  >();

  public loadMissionData(missionId: number) {
    this.curId = missionId;
    this.parseTableData();
  }
  private curId: number = 1;
  public get cur() {
    return this.curId;
  }

  //#region 分数
  private m_score: number = 0;
  public get score() {
    return this.m_score;
  }
  public addScore(val: number) {
    this.m_score += val;
    this.updateUIScore();
  }
  public hasEnoughScore(val: number) {
    return this.m_score >= val;
  }
  public useScore(val: number) {
    if (this.hasEnoughScore(val)) {
      this.m_score -= val;
      this.updateUIScore();
      return true;
    } else {
      return false;
    }
  }
  private updateUIScore() {
    zz.event.fire(EventType.UpdateUIScore);
  }
  //#endregion

  private loadSto() {}
  private saveSto() {}
}
