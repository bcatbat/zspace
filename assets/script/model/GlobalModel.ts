import { ModelTag } from '../const/ModelTag';
import { int } from '../lib/type/ValueType';
import { zzTbl } from '../manager/zzTbl';
import { TableDataGlobal } from '../table/TableDataGlobal';
import { TableEnum } from '../table/TableEnum';
import { zz } from '../zz';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class GlobalModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public TAG: ModelTag = ModelTag.global;
	protected STOKEY: string = '';
	loadData(): void {
		this.cheatPer = int(this.getGlobalTableData('cheatPer').value) / 100;
		this.cheatLmt = int(this.getGlobalTableData('cheatLmt').value) / 100;
		this.selBuffPer = int(this.getGlobalTableData('selectPer').value) / 100;
		this.selBuffLmt = int(this.getGlobalTableData('selectLmt').value) / 100;
		// this.studyDuration = zz.float(this.getGlobalTableData('studyDuration').value);
		this.studyDuration = 10;
		this.selRoundDuration = int(this.getGlobalTableData('selectTime').value);
	}
	private getGlobalTableData(key: string) {
		return zzTbl.getTableItem(TableEnum.Global, key) as TableDataGlobal;
	}
	private cheatPer: number = 0;
	private cheatLmt: number = 0;
	private selBuffPer: number = 0;
	private selBuffLmt: number = 0;
	private selRoundDuration: number = 0;
	private studyDuration: number = 0;
	/**获取考试作弊每次增加的比率 */
	public getCheatPer() {
		return this.cheatPer;
	}
	/**获取考试作弊的最大增加比率 */
	public getCheatLmt() {
		return this.cheatLmt;
	}
	/**获得考试作弊的最大次数 */
	public getCheatMaxCount() {
		return Math.ceil(this.cheatLmt / this.cheatPer);
	}
	/**获取评优每轮增加比率 */
	public getSelectionBuffPer() {
		return this.selBuffPer;
	}
	/**获取评优增益上限 */
	public getSelectionBuffLmt() {
		return this.selBuffLmt;
	}
	/**获得评优增益的最大次数 */
	public getSelectionBuffMaxCount() {
		return Math.ceil(this.selBuffLmt / this.selBuffPer);
	}
	/**学习时长(s) */
	public getStudyDuration() {
		return this.studyDuration;
	}

	/**获取评优玩法每轮的时间(s) */
	public getSelectionRoundDuration() {
		return this.selRoundDuration;
	}
	/**获取评优最大轮数 */
	public getSelectionRoundMax() {
		//TEMP 需要读表
		return 5;
	}
	private courseUnlockArr: number[] = undefined;
	/**获取课程解锁的关卡数组 */
	public getCourseUnlockMissionArr() {
		if (!this.courseUnlockArr) {
			this.courseUnlockArr = this.getGlobalTableData('courseUnlock')
				.value.split(',')
				.map(v => int(v));
		}
		return this.courseUnlockArr;
	}
	public getTabExamUnlockMission() {
		return zz.int(this.getGlobalTableData('examUnlock').value);
	}
	public getTabSelectionUnlockMission() {
		return zz.int(this.getGlobalTableData('selectionUnlock').value);
	}
}
