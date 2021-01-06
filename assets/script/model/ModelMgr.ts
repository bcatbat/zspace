import { log } from '../lib/log/Log';
import ActivityModel from './ActivityModel';
import BookModel from './BookModel';
import BuffModel from './BuffModel';
import ExamModel from './ExamModel';
import GlobalModel from './GlobalModel';
import GradeModel from './GradeModel';
import GuideModel from './GuideModel';
import HonorModel from './HonorModel';
import MissionModel from './MissionModel';
import PointModel from './PointModel';
import PowerModel from './PowerModel';
import SelectionModel from './SelectionModel';
import StudyModel from './StudyModel';
import TaskModel from './TaskModel';

export default class ModelMgr {
	activity = new ActivityModel(this);
	book = new BookModel(this);
	buff = new BuffModel(this);
	exam = new ExamModel(this);
	global = new GlobalModel(this);
	grade = new GradeModel(this);
	honor = new HonorModel(this);
	mission = new MissionModel(this);
	point = new PointModel(this);
	power = new PowerModel(this);
	selection = new SelectionModel(this);
	study = new StudyModel(this);
	task = new TaskModel(this);
	guide = new GuideModel(this);
	constructor() {
		log('[Model] ctor');
	}

	/**
	 * * 注意初始化顺序,谨防依赖问题;
	 * * 不要调用zz和zMdl,以防循环引用问题
	 * * model互相调用使用this.mgr
	 */
	public loadData() {
		this.task.loadData();
		this.activity.loadData();
		this.buff.loadData();
		this.global.loadData();
		this.point.loadData();
		this.grade.loadData();
		this.power.loadData();
		this.mission.loadData();
		this.honor.loadData(); //buff
		this.book.loadData(); //buff
		this.study.loadData(); //book,honor
		this.exam.loadData(); //book,honor;
		this.selection.loadData(); //global,book,honor;
		this.guide.loadData();
	}
}
