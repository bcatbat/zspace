import { zz } from "../zz";
export interface TableDataBook extends zz.TableBase{
/**辅导书*/
id:number;
/**辅导书名字*/
name:string;
/**年级*/
grade:number;
/**所属科目*/
course:number;
/**辅导书类型*/
type:number;
/**增益*/
buff:string;
/**解锁花费知识*/
unlock:number;
/**出处类型*/
srcType:number;
/**出处数值*/
srcValue:number;
}