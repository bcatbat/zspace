/// <reference path="zzType.ts" />
namespace zz {
  enum BTState {
    Failure,
    Success,
    Continue,
    Abort,
  }

  /**Behavior Tree */
  export class BT {
    public static Root() {
      return new Root();
    }
    public static Sequence() {
      return new Sequence();
    }
    public static Selector(shuffle = false) {
      return new Selector(shuffle);
    }
    public static Call(fn: Function) {
      return new Action(fn);
    }
    public static If(fn: () => boolean) {
      return new ConditionalBranch(fn);
    }
    public static While(fn: () => boolean) {
      return new While(fn);
    }
    public static Condition(fn: () => boolean) {
      return new Condition(fn);
    }
    public static Repeat(count: number) {
      return new Repeat(count);
    }
    public static Wait(seconds: number) {
      return new Wait(seconds);
    }
    public static Terminate() {
      return new Terminate();
    }
    public static Log(msg: string) {
      return new Log(msg);
    }
    public static RandomSequence(weights: number[] = null) {
      return new RandomSequence(weights);
    }
  }

  abstract class BTNode {
    abstract Tick(): BTState;
  }

  abstract class Branch extends BTNode {
    protected activeChild: number = 0;
    protected children: BTNode[] = [];
    public OpenBranch(...children: BTNode[]) {
      this.children.push(...children);
      return this;
    }
    public Children() {
      return this.children;
    }
    public ActiveChild() {
      return this.activeChild;
    }
    public ResetChildren() {
      this.activeChild = 0;
      this.children.forEach(v => {
        if (v instanceof Branch) {
          v.ResetChildren();
        }
      });
    }
  }

  abstract class Decorator extends BTNode {
    protected child: BTNode;
    public Do(child: BTNode) {
      this.child = child;
      return this;
    }
  }
  class Sequence extends Branch {
    public Tick(): BTState {
      let childState = this.children[this.activeChild].Tick();
      switch (childState) {
        case BTState.Success:
          this.activeChild++;
          if (this.activeChild == this.children.length) {
            this.activeChild = 0;
            return BTState.Success;
          } else {
            return BTState.Continue;
          }
        case BTState.Failure:
          this.activeChild = 0;
          return BTState.Failure;
        case BTState.Continue:
          return BTState.Continue;
        case BTState.Abort:
          this.activeChild = 0;
          return BTState.Abort;
      }
    }
  }

  class Selector extends Branch {
    public constructor(shuffle: boolean) {
      super();
      if (shuffle) {
        let n = this.children.length;
        while (n > 1) {
          n--;
          let k = int(Math.random() * (n + 1));
          let val = this.children[k];
          this.children[k] = this.children[n];
          this.children[n] = val;
        }
      }
    }
    public Tick(): BTState {
      let childState = this.children[this.activeChild].Tick();
      switch (childState) {
        case BTState.Success:
          this.activeChild = 0;
          return BTState.Success;
        case BTState.Failure:
          this.activeChild++;
          if (this.activeChild == this.children.length) {
            this.activeChild = 0;
            return BTState.Failure;
          } else {
            return BTState.Continue;
          }
        case BTState.Continue:
          return BTState.Continue;
        case BTState.Abort:
          return BTState.Abort;
      }
    }
  }

  abstract class Block extends Branch {
    public Tick(): BTState {
      switch (this.children[this.activeChild].Tick()) {
        case BTState.Continue:
          return BTState.Continue;
        default:
          this.activeChild++;
          if (this.activeChild == this.children.length) {
            this.activeChild = 0;
            return BTState.Success;
          }
          return BTState.Continue;
      }
    }
  }

  class Action extends BTNode {
    fn: Function;
    constructor(fn: Function) {
      super();
      this.fn = fn;
    }
    public Tick(): BTState {
      if (this.fn) {
        this.fn();
        return BTState.Success;
      }
    }
    public ToString() {
      return 'Action : ' + this.fn.name;
    }
  }

  class Condition extends BTNode {
    public fn: () => boolean;
    public constructor(fn: () => boolean) {
      super();
      this.fn = fn;
    }
    public Tick(): BTState {
      return this.fn() ? BTState.Success : BTState.Failure;
    }
    public ToString() {
      return 'Conditon : ' + this.fn.name;
    }
  }

  class Wait extends BTNode {
    public seconds: number = 0;
    future: number = -1;
    public constructor(seconds: number) {
      super();
      this.seconds = seconds;
    }
    public Tick(): BTState {
      if (this.future < 0) {
        this.future = Date.now() / 1000 + this.seconds;
      }
      if (Date.now() / 1000 >= this.future) {
        this.future = -1;
        return BTState.Success;
      } else {
        return BTState.Continue;
      }
    }
  }

  class ConditionalBranch extends Block {
    public fn: () => boolean;
    tested: boolean = false;
    public constructor(fn: () => boolean) {
      super();
      this.fn = fn;
    }
    public Tick(): BTState {
      if (!this.tested) {
        this.tested = this.fn();
      }
      if (this.tested) {
        let result = super.Tick();
        if (result == BTState.Continue) {
          return BTState.Continue;
        } else {
          this.tested = false;
          return result;
        }
      } else {
        return BTState.Failure;
      }
    }
    public ToString() {
      return 'ConditionalBranch : ' + this.fn.name;
    }
  }

  class While extends Block {
    public fn: () => boolean;
    public constructor(fn: () => boolean) {
      super();
      this.fn = fn;
    }
    Tick(): BTState {
      if (this.fn()) {
        super.Tick();
      } else {
        // exit the loop
        this.ResetChildren();
        return BTState.Failure;
      }
      return BTState.Continue;
    }
    public ToString() {
      return 'While : ' + this.fn.name;
    }
  }

  export class Root extends Block {
    public isTerminated = false;
    public Tick(): BTState {
      if (this.isTerminated) return BTState.Abort;
      while (true) {
        switch (this.children[this.activeChild].Tick()) {
          case BTState.Continue:
            return BTState.Continue;
          case BTState.Abort:
            this.isTerminated = true;
            return BTState.Abort;
          default:
            this.activeChild++;
            if (this.activeChild == this.children.length) {
              this.activeChild = 0;
              return BTState.Success;
            }
            continue;
        }
      }
    }
  }

  class Repeat extends Block {
    public count = 1;
    currentCount = 0;
    public constructor(count: number) {
      super();
      this.count = count;
    }
    public Tick(): BTState {
      if (this.count > 0 && this.currentCount < this.count) {
        let result = super.Tick();
        switch (result) {
          case BTState.Continue:
            return BTState.Continue;
          default:
            this.currentCount++;
            if (this.currentCount == this.count) {
              this.currentCount = 0;
              return BTState.Success;
            }
            return BTState.Continue;
        }
      }
    }
    public ToString() {
      return 'Repeat Until : ' + this.currentCount + ' / ' + this.count;
    }
  }

  class RandomSequence extends Block {
    m_Weight: number[] = null;
    m_AddedWeight: number[] = null;
    /**
     *
     * @param weight Leave null so that all child node have the same weight
     */
    public constructor(weight: number[] = null) {
      super();
      this.activeChild = -1;
      this.m_Weight = weight;
    }
    public OpenBranch(...children: BTNode[]) {
      let len = children.length;
      this.m_AddedWeight = new Array(len);
      for (let i = 0; i < len; i++) {
        let weight = 0;
        let prevWeight = 0;

        if (this.m_Weight == null || this.m_Weight.length <= i) {
          weight = 1;
        } else {
          weight = this.m_Weight[i];
        }
        if (i > 0) {
          prevWeight = this.m_AddedWeight[i - 1];
        }
        this.m_AddedWeight[i] = weight + prevWeight;
      }
      return super.OpenBranch(...children);
    }
    private PickNewChild() {
      let choice =
        Math.random() * this.m_AddedWeight[this.m_AddedWeight.length - 1];
      for (let i = 0, len = this.m_AddedWeight.length; i < len; i++) {
        if (choice <= this.m_AddedWeight[i]) {
          this.activeChild = i;
          break;
        }
      }
    }
    Tick(): BTState {
      if (this.activeChild == -1) {
        this.PickNewChild();
      }
      let res = this.children[this.activeChild].Tick();
      switch (res) {
        case BTState.Continue:
          return BTState.Continue;
        default:
          this.PickNewChild();
          return res;
      }
    }
    public ToString() {
      return (
        'Random Sequence : ' + this.activeChild + ' / ' + this.children.length
      );
    }
  }

  class Terminate extends BTNode {
    public Tick(): BTState {
      return BTState.Abort;
    }
  }

  class Log extends BTNode {
    msg: string;
    public constructor(msg: string) {
      super();
      this.msg = msg;
    }
    public Tick(): BTState {
      console.log(this.msg);
      return BTState.Success;
    }
  }
}
window.zz = zz;