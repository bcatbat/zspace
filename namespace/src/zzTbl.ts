/// <reference path="zzUtils.ts" />
/// <reference path="zzLog.ts" />
namespace zz {
  export interface TableBase {
    id: string | number;
  }
  class TableMgr {
    private allTables: Map<string, Map<number | string, TableBase>> = null;

    public constructor() {
      this.allTables = new Map<string, Map<number, any>>();
    }
    public async loadConfig<T extends { id: string }>(
      tableType: string,
      bundleName: string
    ) {
      if (this.allTables.has(tableType)) {
        this.allTables.set(tableType, new Map<number, any>());
      }
      try {
        let bundle = await utils.getBundle(bundleName);
        const jsonAsset_1 = await new Promise<cc.JsonAsset>(
          (resolveFn, rejectFn) => {
            bundle.load(tableType, (err, jsonAsset: cc.JsonAsset) => {
              err ? rejectFn(err) : resolveFn(jsonAsset);
            });
          }
        );
        let jsonObj = jsonAsset_1.json;
        let tableMap = new Map<any, any>();
        for (let k in jsonObj) {
          let obj = JSON.parse(JSON.stringify(jsonObj[k])) as T;
          tableMap.set(obj.id, obj);
        }
        this.allTables.set(tableType, tableMap);
        bundle.release(tableType);
      } catch (err_1) {
        error('[Table] loading error! table:' + tableType + '; err:' + err_1);
      }
    }

    /**
     * TableComponent：获取表所有数据
     * @param tableType 数据表类型名称
     */
    public getTable(tableType: string) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType);
      }
      return null;
    }

    /**
     * TableComponent：获取表数据项目
     * @param tableType 数据表类型名称
     * @param key 数据表id
     */
    public getTableItem(tableType: string, key: string | number) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType).get(key);
      } else {
        console.error(
          '[Table] GetTableItem Error! tableType:' + tableType + '; key:' + key
        );
        return null;
      }
    }

    /**
     * TableComponent：表是否存在数据项目
     * @param tableType 数据表类型名称
     * @param key 数据表id
     */
    public hasTableItem(tableType: string, key: string | number) {
      if (this.allTables.has(tableType)) {
        return this.allTables.get(tableType).has(key);
      } else {
        console.error(
          '[Table] HasTableItem Error! tableType' + tableType + '; key:' + key
        );
        return false;
      }
    }
  }
  /**表格管理 */
  export const table = new TableMgr();
}
