import { zz } from "../zz";
export interface TableDataStudy extends zz.TableBase{
/**ID*/
id:number;
/**课程*/
course:number;
/**年级ID*/
grade:number;
/**课时*/
lesson:number;
/**课程描述*/
des:string;
/**学习升级消耗知识*/
cost:number;
/**知识产出*/
output:number;
/**冷却时间出现间隔*/
cdInterval:number;
/**冷却时长*/
cdDuration:number;
}