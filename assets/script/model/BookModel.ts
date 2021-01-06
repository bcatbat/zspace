import { ConstText } from '../const/ConstText';
import { BookStoData, LifeBookState } from '../const/ConstType';
import { ModelTag } from '../const/ModelTag';
import { StoKey } from '../const/StoKey';
import { randomIndexFromWeight } from '../lib/utils/Utils';
import { zzSto } from '../manager/zzSto';
import { zzTbl } from '../manager/zzTbl';
import { TableDataBook } from '../table/TableDataBook';
import { TableEnum } from '../table/TableEnum';
import ModelBase from './ModelBase';
import ModelMgr from './ModelMgr';

export default class BookModel extends ModelBase {
	constructor(mgr: ModelMgr) {
		super(mgr);
	}
	public readonly TAG: ModelTag = ModelTag.book;
	protected readonly STOKEY: string = StoKey.bookStoData;
	protected data: BookStoData = undefined;
	loadData(): void {
		this.data = zzSto.getObject<BookStoData>(this.STOKEY);
		const defaultVal: BookStoData = {
			repository: {},
		};
		this.data = {
			...defaultVal,
			...this.data,
		};

		this.updateKnowledgeLootPool();
	}
	/**读取Book表 */
	public getBookTableData(bookId: number) {
		return zzTbl.getTableItem(TableEnum.Book, bookId) as TableDataBook;
	}
	/**筛选Book列表; */
	public getBookList(courseType: number, bookType: number) {
		return (Array.from(zzTbl.getTable(TableEnum.Book).values()) as TableDataBook[]).filter(td => td.course == courseType && td.type == bookType);
	}
	/**获得已拥有(可装备或可解锁)的Book列表 */
	public getBookListOwn(courseType: number, bookType: number) {
		return this.getBookList(courseType, bookType).filter(td => this.data.repository[td.id] >= 0);
	}
	/**解析书本 */
	public getBookBuffs(bookId: number) {
		let tbl = this.getBookTableData(bookId);
		return this.mgr.buff.parseBuffs(tbl.buff);
	}
	/**筛选,可用的,指定出处类型和年级的 */
	private getSrcTypePool(srcType: number, gradeId: number) {
		return Array.from(zzTbl.getTable(TableEnum.Book).values()).filter(
			(tbl: TableDataBook) => tbl.srcType == srcType && this.data.repository[tbl.id] == undefined && tbl.grade <= gradeId
		) as TableDataBook[];
	}
	/**获取辅导书出处文字 */
	public getBookSourceStr(td: TableDataBook) {
		switch (td.srcType) {
			case 1:
				return ConstText.bookSrc1 + td.srcValue;
			case 2:
				return ConstText.bookSrc2;
			case 3:
				return ConstText.bookSrc3;
			case 4:
				return ConstText.bookSrc4;
			default:
				return '';
		}
	}
	/**池;知识积累解锁;减少筛选次数; */
	private knowledgePool: TableDataBook[];
	/**初始化,或获取新书时刷新 */
	public updateKnowledgeLootPool() {
		this.knowledgePool = this.getSrcTypePool(1, this.mgr.grade.getGradeId());
	}
	/**获取知识积累奖励的辅导书 */
	public rollLootKnowledge() {
		if (this.knowledgePool[0]) {
			let knowledge = this.mgr.point.getKnowledgeHistory();
			let grade = this.mgr.grade.getGradeId();
			return this.knowledgePool.filter(td => td.srcType == 1 && td.srcValue <= knowledge && td.grade <= grade);
		}
		return [];
	}
	/**获取考试奖励的辅导书 */
	public rollLootExam(srcRate: number) {
		return this.rollByWeight(2, srcRate);
	}
	private rollByWeight(srcType: number, srcRate: number) {
		let roll = Math.random() < srcRate;
		if (roll) {
			//无年级限定
			let pool = this.getSrcTypePool(srcType, this.mgr.grade.getGradeId());
			let sel = randomIndexFromWeight(pool.map(tbl => tbl.srcValue));
			if (sel > -1) {
				return pool[sel];
			}
		}
		return undefined;
	}

	/**获取任务奖励的辅导书 */
	public rollLootTask(bookId: number) {
		if (this.data.repository[bookId] == undefined) {
			return this.getBookTableData(bookId);
		}
		return undefined;
	}
	/**获取评优奖励的辅导书 */
	public rollLootSelection(srcRate: number) {
		return this.rollByWeight(3, srcRate);
	}
	/**获得新书;仅在辅导书获得页中调用; 返回false表示已获得 */
	public receiveNewBook(bookData: TableDataBook) {
		if (bookData == undefined) {
			return false;
		}
		return this.receiveNewBookById(bookData.id);
	}
	/**获得新书; 返回false表示已获得 */
	public receiveNewBookById(bookId: number) {
		if (this.data.repository[bookId] == undefined) {
			this.data.repository[bookId] = 0;
			this.updateKnowledgeLootPool();
			return true;
		}
		return false;
	}
	/**书解锁了没 */
	public isBookUnlock(bookId: number) {
		return this.data.repository[bookId] == 1;
	}
	/**书获得了没 */
	public isBookReceived(bookId: number) {
		return this.data.repository[bookId] != undefined;
	}
	/**解锁辅导书 */
	public unlockBook(bookId: number): 'ok' | 'pointLack' | 'notHave' {
		if (this.data.repository[bookId] == undefined) {
			return 'notHave';
		}

		if (this.mgr.point.decKnowledge(this.getBookTableData(bookId).unlock)) {
			this.data.repository[bookId] = 1;
			this.accUnlock();
			this.onDataChanged();
			return 'ok';
		} else {
			return 'pointLack';
		}
	}
	public accUnlock() {
		this.mgr.task.updateTaskCounter(26);
	}
	/**获取辅导书状态;注:无法得知是否装备 */
	public getBookState(bookId: number): LifeBookState {
		let repo = this.data.repository[bookId];
		if (repo == undefined) {
			return LifeBookState.notGet;
		}
		if (repo == 0) {
			return LifeBookState.lock;
		}
		return LifeBookState.wait;
	}
}
