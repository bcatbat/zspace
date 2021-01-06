/**全局计时器 */
export type GameTimerData = {
	/**总游戏时长(s) */
	tolTime: number;
	/**总登录天数 */
	tolDate: number;
	/**登录次数 */
	loginCount: number;
	/**最后一次记录的时间戳 */
	lastTime: number;
	/**最后一次记录日期 */
	lastDate: number;
};
/**活动条目的状态 */
export enum ActivityItemState {
	todo = 0,
	wait = 1,
	got = 2,
}
/**活动存储数据 */
export type ActivityStoData = {
	/**任务状态;undefined未完成;1完成未领取;2领取 */
	[activiyId: number]: ActivityItemState;
};
/**辅导书状态 */
export enum LifeBookState {
	/**未获取 */
	notGet = 0,
	/**装备中 */
	learning = 1,
	/**未解锁 */
	lock = 2,
	/**可用 */
	wait = 3,
}
/**辅导书槽数据 */
export type BookSlotStoData = {
	/**共有4类,分别分别代表4个装备槽 */
	/**辅导书id;0代表无 */
	bookId: number;
	/**是否新书; falsy为否,1为是*/
	newHint?: number;
};
/**课程槽数据 */
export type CourseStoData = {
	// /**课程类型;即Study表中的course */
	// courseType: number;
	/**课本id;0为无;一次只能学习一本;即Study表中的id */
	courseId: number;
	/**辅导书槽位;从1开始,不用0 */
	bookSlots: {
		[bookIndex: number]: BookSlotStoData;
	};
};
/**学习系统的数据 */
export type StudyStoData = {
	/**课程槽;用1到9,不用0;若无则未解锁 */
	[courseType: number]: CourseStoData;
};
/**辅导书数据 */
export type BookStoData = {
	/**辅导书仓库; */
	repository: {
		/**undefined未获得;0未解锁;1已解锁 */
		[bookId: number]: 0 | 1;
	};
};
/**考试状态 */
export enum ExamState {
	todo = 0,
	doing = 1,
	over = 2,
}
/**考试数据 */
export type ExamStoData = {
	/**考试次数记录;undefined表示无记录,0表示已解锁,余为次数 */
	history: {
		[examId: number]: number;
	};
	/**已通过的最高级别考试 */
	topId: number;
	/**正在进行的考试数据 */
	underway: {
		examId: number;
		begTime: number;
		cheatCount: number;
	};
	/**功能解锁 */
	unlock: number;
};
/**年级数据 */
export type GradeStoData = {
	/**当前等级(年级);用1-7,舍0 */
	gradeId: number;
};
/**年级升级状态 */
export enum LifeUpgradeConditionState {
	OK = 0,
	Exam = 1,
	Score = 2,
	Knowledge = 3,
	Limit = 4,
}
/**荣誉数据 */
export type HonorStoData = {
	/**荣誉仓库 */
	[honorId: number]: number;
};
/**关卡数据 */
export type MissionStoData = {
	/**当前关卡号;用于一直闯关 */
	cur: number;
	/**已通关关卡id集合 */
	pass: { [missionId: number]: number };
	/**章节进度;0/undefined为尚未解锁;其余情况为关卡号 */
	chapterProgress: { [missionId: number]: number };
};
/**点数数据 */
export type PointStoData = {
	/**知识点 */
	knowledge: number;
	/**成绩点 */
	score: number;
	/**累积知识点 */
	knowledgeHistory: number;
	/**累积成绩点 */
	scoreHistory: number;
};
/**体力存储数据 */
export type PowerStoData = {
	num: number;
	isNewbee: boolean;
	loginDate: number;
};
export enum TaskState {
	/**未领取 */
	todo = 0,
	/**接取,进行中,未完成 */
	doing = 1,
	/**接取,已完成,未领取奖励 */
	wait = 2,
	/**已完成奖励 */
	done = 3,
}
export type TaskStoItemData = {
	/**截止日期;过期不候 */
	deadline: number;
	/**任务状态 */
	state: TaskState;
	/**任务计数器 */
	acc: number;
};
/**任务数据 */
export type TaskStoData = {
	[taskId: number]: TaskStoItemData;
	history: { [condType: number]: number };
};

export enum LifeTabName {
	TabSelection = 0,
	TabExam = 1,
	TabMission = 2,
	TabStudy = 3,
	TabTask = 4,
}

export enum LifeSelectionState {
	/**准备开始,选择 */
	todo = 0,
	/**奋斗中,有轮数 */
	doing = 1,
	/**奋斗歇息一下,是弹窗 */
	wait = 2,
	/**出结果了,等待确认 */
	done = 3,
}
/**评优数据 */
export type SelectionStoData = {
	/**剩余次数 */
	[selectionid: number]: number;
	/**更新日期 */
	date: number;
	/**评优过程 */
	state: LifeSelectionState;
	/**获得增益的次数 */
	buffCount: number;
	/**当前评优的id;state==todo时为0 */
	currentSelId: number;
	/**评优轮数;state==todo时为0;state==done时为-1*/
	roundIndex: number;
	/**当前轮数的分数 */
	roundScore: number;
	/**功能解锁 */
	unlock: number;
};
/**新手引导数据 */
export type GuideStoData = {
	/**每一段引导的状态; 1为已完成 */
	[sectionId: string]: number;
};

/**统计数据; 定义:
 * * 1:   闯关X次
 * * 2:   七日签到X次
 * * 3:   在线奖励X次
 * * 4:   辅助闯关X次
 * * 5:   跳关X次
 * * 6:   学习课程X次（课程升级）
 * * 7:   收取X次知识
 * * 8:   参加X次考试
 * * 9:   参会X次评优
 * * 10:  升学至X年级（X直接填年级ID）
 * * 11:  闯关至XX关（填写关卡ID）
 * * 12:  知识累计获得XXXX
 * * 13:  成绩累计获得XXXX
 * * 14:  获得X个考试荣誉
 * * 15:  获得X个评优荣誉
 * * 16:  参加X次班级评优
 * * 17:  参加X次校级评优
 * * 18:  参加X次区级评优
 * * 19:  参加X次市级评优
 * * 20:  参加X次省级评优
 * * 21:  参加X次全国评优
 * * 22:  参加X次期中考试
 * * 23:  参加X次期末考试
 * * 24:  提升5次考试超常发挥
 * * 25:  参与5轮评优PK
 * * 26:  学习X次辅导书（计算解锁辅导书，重复学习不算）
 */
export type RecordStoData = {
	[recordId: number]: number;
};

export const LifeCourseName = {
	1: '语文',
	2: '数学',
	3: '英语',
	4: '历史',
	5: '地理',
	6: '政治',
	7: '生物',
	8: '物理',
	9: '化学',
};

/**任务条件类型,参考用 */
export const LifeTaskCondType = {
	1: '闯关X次',
	2: '七日签到X次',
	3: '在线奖励X次',
	4: '辅助闯关X次',
	5: '跳关X次',
	6: '学习课程X次（课程升级）',
	7: '收取X次知识',
	8: '参加X次考试',
	9: '参会X次评优',
	10: '升学至X年级（X直接填年级ID）',
	11: '闯关至XX关（填写关卡ID）',
	12: '知识累计获得XXXX',
	13: '成绩累计获得XXXX',
	14: '获得X个考试荣誉',
	15: '获得X个评优荣誉',
	16: '参加X次班级评优',
	17: '参加X次校级评优',
	18: '参加X次区级评优',
	19: '参加X次市级评优',
	20: '参加X次省级评优',
	21: '参加X次全国评优',
	22: '参加X次期中考试',
	23: '参加X次期末考试',
	24: '提升X次考试超常发挥',
	25: '参与X轮评优PK',
	26: '学习X次辅导书（计算解锁辅导书，重复学习不算）',
};
