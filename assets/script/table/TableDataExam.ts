import { zz } from "../zz";
export interface TableDataExam extends zz.TableBase{
/**考试ID*/
id:number;
/**考试名*/
name:string;
/**年级ID*/
grade:number;
/**考试类型*/
type:number;
/**考试次数*/
count:number;
/**解锁的id*/
nextId:number;
/**考试时间*/
duration:number;
/**解锁所需知识积累*/
unlock:number;
/**知识消耗*/
cost:number;
/**最低分*/
scoreL:number;
/**最高分*/
scoreH:number;
/**荣誉获取百分比*/
honorRate:number;
/**参考书获取百分比*/
bookRate:number;
}