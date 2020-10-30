interface String {
  /**
   * 字符串替换; 全体版本;
   * @param search 替换前
   * @param replace 替换后
   */
  replaceAll(search: string, replace: string): string;
}

declare namespace cc {
  interface Component{}
  interface Node {
    /**
     * 获取相对路径节点上的组件
     * @param type component类型
     * @param path 相对于节点的路径
     * @returns {T}
     */
    findCom<T extends Component>(type: { prototype: T }, ...path: string[]): T;
    /**
     * 获取相对路径上的节点; 记住cc是通过遍历获取的;
     * @param path 相对路径
     * @returns {cc.Node}
     */
    findNode(...path: string[]): cc.Node;
  }
}

interface Array<T> {
  /**TS版的foreach,[immutable];若callback有返回值,中断并返回此值 */
  forEachLeft<U>(callback: (element: T, index: number) => U | undefined): void;
  /**TS版的forEachRight,[immutable];若callback有返回值,中断并返回此值 */
  forEachRight<U>(callback: (element: T, index: number) => U | undefined): void;
  /**TS版intersperse,[immutable];在数组元素中插入指定元素,长度1及以下的不做处理; */
  intersperse(element: T): T[];
  /**TS版本countWhere,[immutable]; 返回符合predicate要求的元素数量 */
  countWhere(predicate: (x: T, i: number) => boolean): number;
  /**TS版本elementAt; 可负数; */
  eleAt(offset: number): T | undefined;
  /**TS版本compact,[immutable]; 压缩数组,移除falsy元素 */
  compact(): T[];
  /**TS版本addRange,to数组mutable;from数组immutable;添加一个数组的一段内容 */
  addRange(from: readonly T[] | undefined, start?: number, end?: number): T[];
}
