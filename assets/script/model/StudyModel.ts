import { ConstText } from '../const/ConstText';
import { LifeBookState, LifeCourseName, StudyStoData } from '../const/ConstType';
import { EventType } from '../const/EventType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { UIEnum } from '../const/UIParams';
import { int } from '../lib/type/ValueType';
import { clamp, tipMsg } from '../lib/utils/Utils';
import { zzEvt } from '../manager/zzEvt';

import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { zzUI } from '../manager/zzUI';
import * as timer from '../lib/timer/TimerHelper';
import { TableDataBook } from '../table/TableDataBook';
import { TableDataStudy } from '../table/TableDataStudy';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import { error } from '../lib/log/Log';
import { zzSdk } from '../manager/zzSdk';
import ModelMgr from './ModelMgr';

export default class StudyModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.study;
	protected readonly STOKEY: string = StoKey.studyStoData;
	protected data: StudyStoData;
	loadData(): void {
		this.data = zzSto.getObject<StudyStoData>(this.STOKEY);
		const defaultVal: StudyStoData = {};
		this.data = { ...defaultVal, ...this.data };
		// 重启之后重新开始学习
		this.startAllCourse();
	}
	/**读表 */
	public getCourseTableData(courseId: number) {
		return zzTbl.getTableItem(TableEnum.Study, courseId) as TableDataStudy;
	}
	/**获取当前坑位上的课程Id */
	public getCurrentCourseId(courseType: number) {
		return this.data[courseType].courseId;
	}
	/**获取当前坑位上的课程数据 */
	public getCurrentCourseData(courseType: number) {
		return this.getCourseTableData(this.getCurrentCourseId(courseType));
	}
	/**获取下一级的课本 */
	public getCourseDataOfNextLevel(courseId: number) {
		let curData = this.getCourseTableData(courseId);
		let nextData = this.getCourseTableData(courseId + 1);
		if (!nextData) return undefined;
		if (nextData.course != curData.course) return undefined;
		return nextData;
	}
	/**获得课程列表; 显示所有课程*/
	public getCourseList(courseType: number) {
		let currentSto = this.data[courseType];
		let currentTd: TableDataStudy = undefined;
		if (currentSto && currentSto.courseId) {
			currentTd = this.getCourseTableData(currentSto.courseId);
		}

		return (Array.from(zzTbl.getTable(TableEnum.Study).values()) as TableDataStudy[]).filter(td => {
			if (td.course != courseType) return false;
			if (!currentSto || !currentSto.courseId) {
				//当前没课本,就只显示第一课
				return td.course == courseType && td.lesson == 1;
			} else {
				// 有课本
				if (td.grade < currentTd.grade) {
					// 年级低的,显示最后一课
					return td.lesson == 16;
				} else if (td.grade > currentTd.grade) {
					// 年级高的,显示第一课
					return td.lesson == 16;
				} else {
					// 年级相等的时候,取当前id
					return td.id == currentTd.id;
				}
			}
		});
	}
	/**直接升级;带成功判断 */
	public upgrade(courseType: number) {
		let resCond = this.checkUpgradeCondition(courseType);
		if (resCond == 'ok') {
			let courseId = this.data[courseType].courseId;
			let curCourse = this.getCourseTableData(courseId);
			this.mgr.point.decKnowledge(curCourse.cost);
			this.data[courseType].courseId++;
			this.accUpgrade();
			this.onDataChanged();
		}
		return resCond;
	}
	public accUpgrade() {
		this.mgr.task.updateTaskCounter(6);
	}
	/**检测升级条件 */
	public checkUpgradeCondition(courseType: number): 'ok' | 'cost' | 'lmt' | 'grade' {
		let courseId = this.data[courseType].courseId;
		let curCourse = this.getCourseTableData(courseId);
		let nextCourse = this.getCourseTableData(courseId + 1);
		if (!nextCourse) {
			return 'lmt';
		}
		if (nextCourse.course != curCourse.course) {
			return 'lmt';
		}
		if (nextCourse.grade > this.mgr.grade.getGradeId()) {
			return 'grade';
		}
		if (curCourse.cost > this.mgr.point.getKnowledgeCurrent()) {
			return 'cost';
		}
		return 'ok';
	}
	/**检查课程槽是否解锁 */
	public isCourseUnlock(courseType: number) {
		return !!this.data[courseType];
	}
	/**获取关卡解锁条件 */
	public getCourseUnlockCondition(courseType: number) {
		let arr = this.mgr.global.getCourseUnlockMissionArr();
		if (courseType < 8) {
			return {
				type: 'mission',
				val: arr[courseType - 1],
			};
		} else if (courseType == 8) {
			return {
				type: 'grade',
				val: 3,
			};
		} else if (courseType == 9) {
			return {
				type: 'grade',
				val: 5,
			};
		}
	}
	/**解锁课程;而后直接开始学习 */
	public unlockCourse(courseType: number) {
		//放上第一本书
		let firstCourse = (Array.from(zzTbl.getTable(TableEnum.Study).values()) as TableDataStudy[]).forEachLeft(td => {
			if (td.course == courseType) return td;
		});
		const courseId = firstCourse.id;
		this.data[courseType] = this.data[courseType] || {
			courseId: courseId,
			bookSlots: {},
		};
		// 检测已有的课本设置新辅导书标记
		for (let i = 1; i < 5; i++) {
			this.setNewBookHintMark(courseType, i, this.mgr.book.getBookListOwn(courseType, i).length > 0);
		}
		this.startStudy(courseType);
		this.onDataChanged();
		tipMsg(ConstText.courseUnlock + LifeCourseName[courseType]);
	}
	/**开始挂机循环;会重置当前计时器 */
	public startStudy(courseType: number) {
		this.startYieldLoop(courseType);
		this.startCooldownLoop(courseType);
	}
	/**启动所有课程 */
	public startAllCourse() {
		for (let key in this.data) {
			this.startStudy(int(key));
		}
	}
	/**判断课程解锁: 年级*/
	public checkUnlockByMissionId(missionId: number) {
		let courseTypeArr = [1, 2, 3, 4, 5, 6, 7];
		let checkCourse = (courseType: number) => {
			let cond = this.getCourseUnlockCondition(courseType);
			if (missionId == cond.val) {
				if (!this.isCourseUnlock(courseType)) {
					return courseType;
				}
			}
			return undefined;
		};
		return courseTypeArr.forEachLeft(courseType => checkCourse(courseType));
	}
	/**判断课程解锁: 年级 */
	public checkUnlockByGradeId(gradeId: number) {
		let courseTypeArr = [8, 9];
		let checkCourse = (courseType: number) => {
			let cond = this.getCourseUnlockCondition(courseType);
			if (gradeId == cond.val) {
				if (!this.isCourseUnlock(courseType)) {
					return courseType;
				}
			}
			return undefined;
		};
		return courseTypeArr.forEachLeft(courseType => checkCourse(courseType));
	}
	/**产出计时器 */
	private yieldCounter: { [courseType: number]: number } = {};
	/**开启产出循环;不会随升级变更间隔 */
	public startYieldLoop(courseType: number) {
		this.stopYieldLoop(courseType);
		this.yieldCounter[courseType] = timer.setInterval(() => {
			if (!this.cooldownBeg[courseType]) {
				this.yieldPoint(courseType);
			}
		}, this.mgr.global.getStudyDuration() * 1000);
	}
	public yieldPoint(courseType: number) {
		let courseId = this.data[courseType].courseId;
		const tbl = this.getCourseTableData(courseId);
		let outputBase = tbl.output;
		let buffBook = this.getBooksBuffSum(courseType)[1] || 0;
		let buffHonor = this.mgr.honor.getBuffEffectValue(1);
		let res = outputBase + buffBook + buffHonor;
	}
	private stopYieldLoop(courseType: number) {
		timer.clearInterval(this.yieldCounter[courseType]);
	}
	/**是否处在冷却中 */
	private cooldownBeg: { [courseType: number]: number } = {};
	/**冷却计时器 */
	private cooldownCounter: { [courseType: number]: number } = {};
	/**冷却超时 */
	private cooldownTimeout: { [courseType: number]: number } = {};
	/**开启疲劳循环;  */
	public startCooldownLoop(courseType: number) {
		let courseId = this.data[courseType].courseId;
		let tbl = this.getCourseTableData(courseId);
		let cdInterval = tbl.cdInterval * 1000;
		let cdDuration = tbl.cdDuration * 1000;
		this.stopCooldownLoop(courseType);
		this.cooldownCounter[courseType] = timer.setInterval(() => {
			this.cooldownBeg[courseType] = Date.now();
			this.notifyUI(this.TAG);
			this.cooldownTimeout[courseType] = timer.setTimeout(() => {
				this.cooldownBeg[courseType] = 0;
				this.notifyUI(this.TAG);
			}, cdDuration);
		}, cdInterval);
	}
	/**停止疲劳循环;*/
	private stopCooldownLoop(courseType: number) {
		timer.clearInterval(this.cooldownCounter[courseType]);
		timer.clearTimeout(this.cooldownTimeout[courseType]);
		this.notifyUI(this.TAG);
	}
	/**是否处在疲劳中 */
	public isCooldown(courseType: number) {
		return !!this.cooldownBeg[courseType];
	}
	/**获取剩余冷却时间(s) */
	public getCooldownLeftTime(courseId: number) {
		let data = this.getCourseTableData(courseId);
		let courseType = data.course;
		if (this.cooldownBeg[courseType]) {
			let pass = (Date.now() - this.cooldownBeg[courseType]) / 1000;
			let cdDuration = data.cdDuration * 60;
			let left = clamp(cdDuration - pass, 0, cdDuration);
			return left;
		} else {
			return 0;
		}
	}
	/**装书 */
	public installBook(courseType: number, bookId: number) {
		let tbl = this.mgr.book.getBookTableData(bookId);
		if (!this.data[courseType]) {
			//课程还没有解锁
			return 'future';
		}
		if (!this.data[courseType].bookSlots) {
			error(`[StudyModel.installBook,courseType=${courseType},bookId=${bookId}]:理应不会;课程解锁时初始化失败`);
		}
		if (!this.data[courseType].bookSlots[tbl.type]) {
			//之前该槽上没有装备过辅导书;清理新书标记
			this.data[courseType].bookSlots[tbl.type] = { bookId: bookId };
		} else {
			this.data[courseType].bookSlots[tbl.type].bookId = bookId;
		}
		this.onDataChanged();
		return 'ok';
	}
	/**卸书 */
	public uninstallBook(courseType: number, bookType: number) {
		if (!this.data[courseType]) {
			error(`[StudyModel.uninstallBook,courseType=${courseType},bookType=${bookType}]:从未解锁的课程中卸下辅导书`);
			return;
		}
		if (!this.data[courseType].bookSlots) {
			error(`[StudyModel.uninstallBook,courseType=${courseType},bookType=${bookType}]:课程解锁的时候初始化失败`);
			return;
		}
		if (!this.data[courseType].bookSlots[bookType]) {
			error(`[StudyModel.uninstallBook,courseType=${courseType},bookType=${bookType}]:从未使用的辅导书槽上卸载`);
			return;
		}
		this.data[courseType].bookSlots[bookType].bookId = 0;
		this.onDataChanged();
	}
	/**获取当前装备的辅导书 */
	public getBookInstalled(courseType: number, bookType: number) {
		let slots = this.data[courseType].bookSlots;
		if (slots[bookType]) {
			return slots[bookType].bookId || 0;
		} else {
			return 0;
		}
	}
	/**获取辅导书的状态 */
	public getBookState(bookData: TableDataBook) {
		let bookId = bookData.id;
		let courseType = bookData.course;
		let bookType = bookData.type;
		const state = this.mgr.book.getBookState(bookId);
		if (state == LifeBookState.wait) {
			if (!this.data[courseType].bookSlots[bookType]) return LifeBookState.wait;
			if (this.data[courseType].bookSlots[bookType].bookId == bookId) {
				return LifeBookState.learning;
			} else {
				return LifeBookState.wait;
			}
		}
		return state;
	}
	/**获取辅导书总加成 */
	public getBooksBuffSum(courseType: number) {
		let books = this.data[courseType].bookSlots;
		let res: { [buffType: number]: number } = {};
		for (let i = 1; i <= 4; i++) {
			if (books[i]) {
				let bookId = books[i].bookId;
				if (bookId) {
					this.mgr.book.getBookBuffs(bookId).forEach(b => {
						res[b.type] = res[b.type] || 0;
						res[b.type] += b.val;
					});
				}
			}
		}
		return res;
	}
	/**设置辅导书槽位的新书标记 */
	public setNewBookHintMark(courseType: number, bookType: number, isNew: boolean) {
		if (!this.data[courseType]) {
			error(`[StudyModel.setNewBookHintMark] 课程未解锁,无法设置新课本标记,应该在解锁课本的时候有检测`);
			return;
		}
		if (!this.data[courseType].bookSlots) {
			error(`[StudyModel.setNewBookHintMark]:课程解锁的时候初始化失败`);
			return;
		}
		if (!this.data[courseType].bookSlots[bookType]) {
			this.data[courseType].bookSlots[bookType] = { bookId: 0, newHint: 0 };
		}
		this.data[courseType].bookSlots[bookType].newHint = isNew ? 1 : 0;
		this.onDataChanged();
	}
	/**获得辅导书槽的新书标记状态 */
	public getNewHintMarkByBook(courseType: number, bookType: number) {
		if (!this.data[courseType]) {
			return false;
		}
		if (!this.data[courseType].bookSlots) {
			return false;
		}
		if (!this.data[courseType].bookSlots[bookType]) {
			return false;
		}
		return !!this.data[courseType].bookSlots[bookType].newHint;
	}
	/**获得课程槽的新书标记状态 */
	public getNewHintMarkByCourse(courseType: number) {
		for (let bookType = 1; bookType < 5; bookType++) {
			if (this.getNewHintMarkByBook(courseType, bookType)) {
				return true;
			}
		}
		return false;
	}
	/**获得学习标签的新书标记状态 */
	public getNewHintMarkByStudy() {
		for (let courseType = 1; courseType < 10; courseType++) {
			if (this.getNewHintMarkByCourse(courseType)) {
				return true;
			}
		}
		return false;
	}
}
