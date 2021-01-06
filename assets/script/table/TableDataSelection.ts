import { zz } from "../zz";
export interface TableDataSelection extends zz.TableBase{
/**评优ID*/
id:number;
/**评优名字*/
name:string;
/**年级ID*/
grade:number;
/**消耗成绩*/
cost:number;
/**荣誉获取百分比*/
honorRate:number;
/**参考书获取百分比*/
bookRate:number;
/**每日免费次数*/
freeCount:number;
/**恢复一次的在线时间*/
countDownTime:number;
}