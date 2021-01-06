import { GradeStoData, LifeUpgradeConditionState } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { TableDataGrade } from '../table/TableDataGrade';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class GradeModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.grade;
	protected readonly STOKEY: string = StoKey.gradeStoData;
	protected data: GradeStoData;
	loadData(): void {
		this.data = zzSto.getObject<GradeStoData>(this.STOKEY);

		this.data = {
			...{
				gradeId: 1,
			},
			...this.data,
		};
	}

	/**检测升级条件 */
	public checkUpgradeCondition(): LifeUpgradeConditionState {
		let tblData = this.getGradeTableData();
		if (!tblData.examId) {
			return LifeUpgradeConditionState.Limit;
		}
		let curExamId = this.mgr.exam.getTopExamId();
		if (tblData.examId > curExamId) {
			return LifeUpgradeConditionState.Exam;
		}
		let curKnowledge = this.mgr.point.getKnowledgeCurrent();
		if (tblData.costKnowledge > curKnowledge) {
			return LifeUpgradeConditionState.Knowledge;
		}
		let curScore = this.mgr.point.getScoreCurrent();
		if (tblData.costScore > curScore) {
			return LifeUpgradeConditionState.Score;
		}
		return LifeUpgradeConditionState.OK;
	}
	/**尝试升级,得到结果 */
	public upgrade() {
		let checkRes = this.checkUpgradeCondition();
		if (checkRes == LifeUpgradeConditionState.OK) {
			let tblData = this.getGradeTableData();
			this.mgr.point.decKnowledge(tblData.costKnowledge);
			this.mgr.point.decScore(tblData.costScore);
			this.mgr.task.updateTaskCounter(10, this.data.gradeId == 1 ? 2 : 1);
			this.data.gradeId += 1;
			this.onDataChanged();
			let unlockCourseType = this.mgr.study.checkUnlockByGradeId(this.data.gradeId);
			if (unlockCourseType) {
				this.mgr.study.unlockCourse(unlockCourseType);
			}
		}
		return checkRes;
	}
	/**读表Grade;默认当前等级 */
	public getGradeTableData(gradeId?: number) {
		return zzTbl.getTableItem(TableEnum.Grade, gradeId || this.data.gradeId) as TableDataGrade;
	}
	/**获取当前等级 */
	public getGradeId() {
		return this.data.gradeId;
	}
	/**获取等级的两端的值 */
	public getGradeRegion() {
		return [1, zzTbl.getTable(TableEnum.Grade).size];
	}
}
