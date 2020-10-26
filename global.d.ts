interface String {
  /**
   * 字符串替换; 全体版本;
   * @param search 替换前
   * @param replace 替换后
   */
  replaceAll(search: string, replace: string): string;
}

namespace cc {
  interface Node {
    findCom<T extends Component>(type: { prototype: T }, ...path: string[]): T;
    findNode(...path: string[]): cc.Node;
  }
}
