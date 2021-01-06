import { zz } from "../zz";
export interface TableDataGuide extends zz.TableBase{
/**ID*/
id:number;
/**下一条ID*/
next:number;
/**片段入口*/
sectionIn:string;
/**片段关闭*/
sectionOut:string;
/**前置片段*/
preSection:string;
/**引导目标*/
target:string;
/**引导类型样式*/
type:string;
/**引导目标说明*/
targetDes:string;
/**引导文字*/
content:string;
/**解说人*/
narrator:string;
/**解说人代号*/
narratorId:number;
}