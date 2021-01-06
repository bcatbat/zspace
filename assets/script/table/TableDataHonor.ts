import { zz } from "../zz";
export interface TableDataHonor extends zz.TableBase{
/**荣誉ID*/
id:number;
/**荣誉名字*/
name:string;
/**荣誉描述*/
des:string;
/**所属年级*/
grade:number;
/**来源*/
srcType:number;
/**考试类型*/
examType:number;
/**权重*/
weight:number;
/**增益效果*/
buff:string;
}