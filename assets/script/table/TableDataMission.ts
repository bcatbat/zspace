import { zz } from "../zz";
export interface TableDataMission extends zz.TableBase{
/**关卡号*/
id:number;
/**关卡UI名称*/
name:string;
/**章节号*/
chapter:number;
/**章节名称*/
chapterName:string;
/**关卡标题*/
title:string;
/**关卡描述长*/
description1:string;
/**关卡描述短*/
description2:string;
/**作弊按钮文字*/
hint:string;
/**关卡奖励*/
award:string;
}