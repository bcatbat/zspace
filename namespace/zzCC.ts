namespace zz {
  /**
   * 获取相对路径节点上的组件
   * @param type component类型
   * @param node 节点
   * @param path 相对于节点的路径
   * @returns {T}
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
   * 获取相对路径上的节点; 记住cc是通过遍历获取的;
   * @param node 基准节点
   * @param path 相对路径
   * @returns {cc.Node}
   */
  export function findNode(node: cc.Node, ...path: string[]): cc.Node {
    return path.reduce(
      (node: cc.Node, name: string) => node.getChildByName(name),
      node
    );
  }

  let tipFn = (msg: string) => {
    warn('没有注入tip方法');
  };
  export function setTipFn(fn: (msg: string) => void) {
    tipFn = fn;
  }
  /**
   * 弹出提示信息文字
   * @param msg 信息文字
   */
  export function tipMsg(msg: string) {
    tipFn(msg);
  }
  String.prototype.replaceAll = function (
    search: string,
    replace: string
  ): string {
    let str: string = this;
    return str.replace(new RegExp(search, 'g'), replace);
  };
  cc.Node.prototype.findCom = function <T extends cc.Component>(
    type: { prototype: T },
    ...path: string[]
  ) {
    let node = this;
    return findCom(type, node, ...path);
  };
  cc.Node.prototype.findNode = function (...path: string[]) {
    let node = this;
    return findNode(node, ...path);
  };
}
