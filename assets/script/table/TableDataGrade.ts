import { zz } from "../zz";
export interface TableDataGrade extends zz.TableBase{
/**年级ID*/
id:number;
/**年级*/
name:string;
/**升级消耗知识*/
costKnowledge:number;
/**升级消耗分数*/
costScore:number;
/**达到考试*/
examId:number;
}