import { zz } from "../zz";
export interface TableDataActivity extends zz.TableBase{
/**id*/
id:number;
/**活动类型*/
type:number;
/**显示值*/
value:number;
/**描述文字*/
des:string;
/**奖励*/
award:string;
}