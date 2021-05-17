import { container } from "./Context";
import { Context } from "./Context";
import { Component, ComponentBase } from "./Component";
import { List, TimeSpan } from "./Common";


/**
 * 代表一个物体
 */
export interface Stuff extends StuffHooks {
  /**
   * 被渲染器调用的函数 timespan为时间区间
   */
  render(timespan: TimeSpan): void;
  element: HTMLDivElement;
  components: Map<string, Component<any>>;
  //供外部操作的函数
  attachComponent(comp: Component<any>): void;
  context:Context|null;
}
/**
 * 预备 :
 * Component依赖表  拓扑排序后进行遍历
 * entities遍历以记录名字
 */
/**
 * 此类中实现了render函数 对component的render进行了调用
 */

abstract class StuffWithRenderer implements Stuff {
  constructor(
    public element: HTMLDivElement,
    public components: Map<string, Component<any>>
  ) {}
  abstract attachComponent(comp: Component<any>): void;

  context: Context | null = null;
  /**
   * 注册并给与context
   * @param context 注册 给一个context
   */
  beforeRegister(context: Context) {
    this.context = context;
    //已经存在的component需要全部通知到
    for (let a of this.components.values()) {
      a.stuffBeforeRegister && a.stuffBeforeRegister(context);
    }
  }
  render(timespan: TimeSpan): void {
    if (this.context == null) return;
    for (let a of this.components.values()) {
      a.render(timespan);
    }
  }
}
/**
 * 获取element的工具函数 或者可以认为是创建一个渲染节点的工具函数S
 */
function getElement() {
  let ele = document.createElement("div");
  ele.style.position="absolute"
  container?.appendChild(ele);
  return ele;
}
/**
 * 基本的stuff对象
 * 其他stuff都应该继承自这个类
 */
export class StuffBase extends StuffWithRenderer {
  /**
   * 用于操作自己的操作集
   * 
   */
  protected Operations=new StuffOperation(this)
  private waitAttatches: List<Component<any>> = [];
  /**
   * 有待实现 检测是否满足条件 不满足的话就返回false 否则返回true
   * @param comp 组件
   */
  private isRequirementsOk(comp: Component<any>) {
    return true;
  }
  /**
   * 检查是否满足添加 满足直接调用attach 否则加入等待列表
   * 启动一个检查 扫描出等待列表中已经满足的组件
   * @param comp 组件
   */
  private addWaitingComponent(comp: Component<any>) {
    this.waitAttatches.push(comp);
  }
  attachComponent(comp: Component<any>): void {
    //检测是否requirement全部满足 否则放入等待列表
    if (this.isRequirementsOk(comp)) {
      // if (this.context == null) error("此stuff没有初始化");
      //这里应该调用attach函数 其中包括 加入和初始化操作
      if (comp.beforeAttach) comp.beforeAttach(this);
      this.components.set(comp.name, comp);
    } else {
      this.addWaitingComponent(comp);
    }
  }
  constructor() {
    super(getElement(), new Map());
  }
}

export type Name<C> = C extends Component<infer P, any> ? P : never;
/**
 * 获取export类型
 */
export type Export<C extends Component<any,any>> = C extends Component<any, infer P> ? P : never;

//TODO: StuffOperation需要完善 添加更多操作函数
/**
 * 操作stuff的工具函数集
 */
export class StuffOperation {
  constructor(private stuff: Stuff) {}
  get Components() {
    return new Set(this.stuff.components.keys());
  }
  get Context() {
    return this.stuff.context;
  }

  get Element(){
    return this.stuff.element;
  }
  //获取Component
  /**
   *
   * @param compid compid
   */
  getComponent<C extends Component<any>>(compid: Name<C>): Export<C> {
    return this.stuff.components.get(compid)?.exports as Export<C>;
  }
}
/**
 * 构造函数的构造器，可以封装
 */
type StuffBuilder = (...args: any[]) => Object;
// renderer();
// type Before<T extends string>=`before${T}`;
// type Event<Name extends string> = {
//   []: any;
//   [`after${Name}`]: any;
// };
type StuffHooks = {
  beforeRegister?(context: Context): void;
  registered?(): void;
  beforeRender?(): void;
};
