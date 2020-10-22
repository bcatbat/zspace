namespace zz {
  /**
   * 获取相对路径节点上的组件
   * @param type component类型
   * @param node 节点
   * @param path 相对于节点的路径
   */
  export function findCom<T extends cc.Component>(
    type: {
      prototype: T;
    },
    node: cc.Node,
    ...path: string[]
  ): T {
    return findNode(node, ...path).getComponent(type);
  }
  /**
   * 获取相对路径上的节点
   * @param node 基准节点
   * @param path 相对路径
   */
  export function findNode(node: cc.Node, ...path: string[]) {
    return path.reduce(
      (node: cc.Node, name: string) => node.getChildByName(name),
      node
    );
  }
}
