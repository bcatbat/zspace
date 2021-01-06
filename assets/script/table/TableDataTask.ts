import { zz } from "../zz";
export interface TableDataTask extends zz.TableBase{
/**任务ID*/
id:number;
/**任务归属*/
mainType:number;
/**接取类型*/
subType:number;
/**任务内容*/
des:string;
/**任务条件类型*/
condType:number;
/**任务条件数值*/
condValue:number;
/**前置任务*/
preId:string;
/**奖励*/
award:string;
}