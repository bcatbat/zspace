import { ExamState, ExamStoData } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { TableDataBook } from '../table/TableDataBook';
import { TableDataExam } from '../table/TableDataExam';
import { TableDataHonor } from '../table/TableDataHonor';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import * as timer from '../lib/timer/TimerHelper';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { error } from '../lib/log/Log';
import { clamp, randomInt } from '../lib/utils/Utils';
import { int } from '../lib/type/ValueType';
import { zzUI } from '../manager/zzUI';
import { UIEnum } from '../const/UIParams';
import ModelMgr from './ModelMgr';

export default class ExamModel extends ModelBase {
    constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.exam;
	protected readonly STOKEY: string = StoKey.examStoData;
	protected data: ExamStoData;
	loadData(): void {
		this.data = zzSto.getObject<ExamStoData>(StoKey.examStoData);
		const defaultVal: ExamStoData = {
			history: {},
			topId: 0,
			underway: {
				examId: 0,
				begTime: 0,
				cheatCount: 0,
			},
			unlock: 0,
		};
		this.data = {
			...defaultVal,
			...this.data,
		};

		// 考试进度问题
		let underway = this.data.underway;
		if (underway.begTime > 0 && underway.examId > 0) {
			// 还在考试
			let left = this.getExamLeftTime();
			if (left > 0) {
				// zz.log(`[ExamModel.loadData] 开始计时,剩余时间:${left}ms`);
				this.waitingTimeoutId = timer.setTimeout(() => {
					this.waitForGettingYields(underway.examId);
				}, left);
			} else {
				this.waitForGettingYields(underway.examId);
			}
		} else if (underway.examId > 0) {
			// 考完了,还没领成绩
			this.waitForGettingYields(underway.examId);
		}
	}
	private waitingTimeoutId: number = 0;
	/**读表 */
	public getExamTableData(examId: number) {
		return zzTbl.getTableItem(TableEnum.Exam, examId) as TableDataExam;
	}
	/**某考试的历史次数 */
	public getExamHistoryCount(examId: number) {
		return this.data.history[examId] || 0;
	}
	/**获取当前考试进度;目前最高级的考试id */
	public getTopExamId() {
		return this.data.topId;
	}
	/**获取参考书的概率 */
	public getRateBook(examId: number) {
		return this.getExamTableData(examId).bookRate / 100;
	}
	/**获取荣誉的概率 */
	public getRateHonor(examId: number) {
		return this.getExamTableData(examId).honorRate / 100;
	}
	public isFunctionUnlock() {
		return this.data.unlock == 1;
	}
	public unlockFunction() {
		this.data.unlock = 1;
		this.onDataChanged();
	}
	public checkUnlockByMissionId(missionId: number) {
		let targetId = this.mgr.global.getTabExamUnlockMission();
		return targetId == missionId;
	}
	/**是否解锁 */
	public isUnlock(examId: number) {
		if (this.data.history[examId] == undefined) {
			if (examId == 1) {
				this.data.history[examId] = 0;
				return true;
			}
			let resCond = this.checkUnlockCondition(examId);
			if (resCond == 'ok') {
				this.unlock(examId);
				return true;
			}
			return false;
		} else {
			return true;
		}
	}
	private unlock(examId: number) {
		if (this.checkUnlockCondition(examId) == 'ok') {
			this.data.history[examId] = 0;
			return true;
		}
		return false;
	}
	/**解锁当前年级的第一场考试 */
	public unlockFirstExamOfCurrentGrade() {
		let topId = this.data.topId;
		let nextId = topId + 1;
		let topData = this.getExamTableData(topId);
		let nextData = this.getExamTableData(nextId);
		if (!nextData) {
			return 'lmt';
		}
		let curGradeId = this.mgr.grade.getGradeId();
		if (topData.grade == nextData.grade || nextData.grade != curGradeId) {
			return 'notUpgrade';
		}
		return this.unlock(nextId);
	}

	/**检测解锁条件 */
	public checkUnlockCondition(examId: number): 'ok' | 'point' | 'exam' | 'grade' | 'error' | 'already' {
		if (this.data.history[examId] >= 0) {
			return 'already';
		}
		if (examId == 1) {
			return 'ok';
		}
		let lastId = examId - 1;
		let lastData = this.getExamTableData(lastId);
		const curData = this.getExamTableData(examId);
		let grade = this.mgr.grade.getGradeId();
		if (grade < curData.grade) {
			return 'grade';
		}
		if (lastData.nextId) {
			if (lastData.nextId == examId) {
				let condLastExamCount = lastData.count <= this.getExamHistoryCount(lastId);
				if (!condLastExamCount) {
					return 'exam';
				}
				let condKnowledge = this.mgr.point.hasKnowledgeHistory(curData.unlock);
				if (!condKnowledge) {
					return 'point';
				}
				return 'ok';
			} else {
				error(`[ExamModel.checkUnlockConfition] lastData.nextId!=examId; lastData.nextId=${lastData.nextId},examId=${examId}`);
				return 'error';
			}
		} else {
			let lastGrade = lastData.grade;
			if (lastGrade == grade) {
				return 'grade';
			} else if (lastGrade < grade) {
				return 'ok';
			} else {
				error(`[ExamModel.checkUnlockConfition] lastGrade>grade; lastGrade:${lastGrade},grade:${grade}`);
				return 'error';
			}
		}
	}
	/**获取指定年级的考试数据 */
	public getDatasByGrade(gradeId: number) {
		return Array.from(zzTbl.getTable(TableEnum.Exam).values()).filter((tbl: TableDataExam) => tbl.grade == gradeId) as TableDataExam[];
	}
	/**获取进度条关键点节点 */
	public getProgressPoints(gradeId: number) {
		let tbls = this.getDatasByGrade(gradeId);
		let tol = tbls.length;
		let res: { tbl: TableDataExam; dstProgNum: number }[] = [];
		/**进度条,次数,原始  */
		let srcProgNum = 0;
		let curTbl: TableDataExam = undefined;

		// 累计进度次数; 并返回当前次数
		curTbl = tbls.forEachLeft(tbl => {
			if (this.data.history[tbl.id] >= tbl.count) {
				srcProgNum += tbl.count;
			} else {
				srcProgNum += this.data.history[tbl.id] || 0;
				return tbl;
			}
		});
		curTbl = curTbl || tbls.eleAt(-1);

		/**节点位置,次数,原始 */
		let srcAccNum = 0;
		/**节点位置,次数,转换 */
		let dstAccNum = 0;
		/**进度条,次数,转换 */
		let dstProgNum = 0;
		tbls.forEach((tbl, index, arr) => {
			let cur = {
				tbl: tbl,
				dstProgNum: dstAccNum,
			};
			// 此处进行了换算
			/**节点区间,原始 */
			let d_n = tbl.count;
			/**节点区间,换算 */
			let d_t = Math.log2(d_n) + 5;
			if (tbl == curTbl) {
				if (index < tol - 1) {
					dstProgNum = dstAccNum + ((srcProgNum - srcAccNum) / d_n) * d_t;
				} else {
					dstProgNum = dstAccNum;
				}
			}
			// 最后一个节点不用算
			if (index < tol - 1) dstAccNum += d_t;
			srcAccNum += d_n;
			res.push(cur);
		});
		return {
			/**原始进度数值 */
			srcProgNum: srcProgNum,
			/**换算后进度条位置,prog=dstProgVal/dstTolVal */
			dstProgNum: dstProgNum,
			/**换算后的总进度值 */
			dstTolNum: dstAccNum,
			points: res,
		};
	}
	/**当前考试id是否不用看视频 */
	public isVideoFree(examId: number) {
		// 两次大考要看视频, 其余不看
		return this.getExamTableData(examId).type < 10 || this.data.history[examId] == 0;
	}
	/**开始考试 */
	public startExam(examId: number) {
		const td = this.getExamTableData(examId);
		let cost = td.cost;
		let duration = td.duration;
		if (this.mgr.point.decKnowledge(cost)) {
			this.data.underway.examId = examId;
			this.data.underway.begTime = Date.now();
			this.data.underway.cheatCount = 0;
			this.onDataChanged();
			// zz.log(`[ExamModel.startExam] Time:${new Date().toLocaleTimeString()}`);
			// zz.log(`[ExamModel.startExam] examId:${examId},examName:${td.name},duration${td.duration}`);
			this.waitingTimeoutId = timer.setTimeout(() => {
				this.waitForGettingYields(examId);
			}, duration * 1000);
			return true;
		} else {
			return false;
		}
	}
	/**获取考试状态 */
	public getExamStatus() {
		if (this.data.underway.examId > 0) {
			if (this.data.underway.begTime > 0) {
				return ExamState.doing;
			} else {
				return ExamState.over;
			}
		} else {
			return ExamState.todo;
		}
	}
	/**获取考试剩余时间(ms) */
	public getExamLeftTime() {
		let underway = this.data.underway;
		if (underway.begTime > 0 && underway.examId > 0) {
			let tol = Date.now() - underway.begTime;
			let duration = this.getExamTableData(underway.examId).duration * 1000;
			let left = duration - tol;
			return left;
		} else {
			return 0;
		}
	}
	/**增加作弊次数 */
	public incCheatCount() {
		let lmt = this.mgr.global.getCheatMaxCount();
		if (this.data.underway.cheatCount < lmt) this.accCheat();
		this.data.underway.cheatCount = clamp(this.data.underway.cheatCount + 1, 0, lmt);
		this.onDataChanged();
	}
	/**作弊到极限 */
	public incCheatCountLmt() {
		let src = this.data.underway.cheatCount;
		let dst = this.mgr.global.getCheatMaxCount();
		this.data.underway.cheatCount = dst;
		let d = dst - src;
		if (d >= 0) this.accCheat(d);
		this.onDataChanged();
	}
	/**获取作弊次数 */
	public getCheatCount() {
		return this.data.underway.cheatCount || 0;
	}
	/**获取作弊效果 */
	public getCheatBuff() {
		return this.getCheatCount() * this.mgr.global.getCheatPer();
	}
	/**考完了,等待领成绩单 */
	public waitForGettingYields(examId: number) {
		let td = this.getExamTableData(examId);
		timer.clearTimeout(this.waitingTimeoutId);
		this.waitingTimeoutId = 0;
		// 获取考试成绩之前,不重置作弊次数
		this.output = this.calcYields(examId);
		this.data.underway.begTime = 0;
		this.onDataChanged();
	}
	/**获取考试产出数据 */
	public getYieldData() {
		return this.output;
	}
	/**领取成绩单 */
	public receiveYields() {
		let lastExamId = this.data.underway.examId;
		this.data.history[lastExamId]++;
		// 更新最高数值
		if (this.data.topId < lastExamId) {
			this.data.topId = lastExamId;
		}
		// 解锁下一个
		this.unlock(lastExamId + 1);

		this.data.underway.examId = 0;
		this.data.underway.cheatCount = 0;
		this.accExam();
		let lastTd = this.getExamTableData(lastExamId);
		if (lastTd.type == 10) this.accExamMid();
		if (lastTd.type == 11) this.accExamEnd();
		this.mgr.point.incScore(this.output.score);
		this.mgr.book.receiveNewBook(this.output.book);
		this.mgr.honor.receiveNewHonor(this.output.honor);
		this.output = undefined;
		this.onDataChanged();
	}
	private output: { book: TableDataBook; honor: TableDataHonor; score: number } = undefined;
	/**计算考试产出 */
	private calcYields(examId: number) {
		const tbl = this.getExamTableData(examId);
		let cheatRate = clamp(this.data.underway.cheatCount * this.mgr.global.getCheatPer(), 0, this.mgr.global.getCheatLmt());
		let baseScore = int(randomInt(tbl.scoreL, tbl.scoreH) * (1 + cheatRate));
		let buffHonor = this.mgr.honor.getBuffEffectValue(2);
		let resScore = baseScore + buffHonor;
		return {
			book: this.mgr.book.rollLootExam(this.getRateBook(examId)),
			honor: this.mgr.honor.rollLootExam(this.getRateHonor(examId), tbl.grade, tbl.type),
			score: resScore,
		};
	}

	public accExam() {
		this.mgr.task.updateTaskCounter(8);
	}
	public accExamMid() {
		this.mgr.task.updateTaskCounter(22);
	}
	public accExamEnd() {
		this.mgr.task.updateTaskCounter(23);
	}
	public accCheat(v: number = 1) {
		this.mgr.task.updateTaskCounter(24, v);
	}

	/**给与新手引导步骤充分的钱 */
	public checkGuideExamCost() {
		let firstTd: TableDataExam;
		zzTbl.getTable(TableEnum.Exam).forEach((td: TableDataExam) => {
			if (td && !firstTd) {
				firstTd = td;
				return false;
			}
		});
		let cur = this.mgr.point.getKnowledgeCurrent();
		let need = firstTd.cost - cur;
		if (need > 0) {
			this.mgr.point.incKnowledge(need);
		}
	}
}
