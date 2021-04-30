import { Stuff, StuffOperation } from "./Stuff";
import { Context } from "./index";
import { List, TimeSpan } from "./Common";

type FunctionMap = { [idx: string]: (arg: object) => any };

export interface Component<
  Name extends string,
  Exports extends FunctionMap = {}
> extends ComponentHook {
  //单位 毫秒 代表这一帧相对于上一帧过去的时间
  /**
   * 设置上下文 在初始化时调用一次
   * @param thisStuff 当前的stuff
   * @param thisContext 当前渲染器用的Context 使用ContextOpteration 可以操作context
   */
  render(timespan: TimeSpan): void;
  props: Map<string, any>;
  name: Name;
  /**
   * 导出变量和导出函数 可被其他comp操作
   */
  exports: Exports;
  /**
   * require 的其他comp 用于拓扑排序确定调用顺序
   * 可以使用getComp 的context函数来获取其他comp的export
   */
  requirements: List<string>;
}
type ComponentHook = {
  beforeRender?(): void;
  beforeAttach?(stuff: Stuff): void;
  /**
   * 当attach的stuff在context中将要注册时调用 给出要注册的context
   * @param context 注册的上下文
   */
  stuffBeforeRegister?(context: Context): void;
  attached?(): void;
};
export abstract class ComponentBase<
  Name extends string,
  Exports extends FunctionMap = {}
> implements Component<Name, Exports> {
  abstract exports: Exports;
  abstract render(timespan: TimeSpan): void;
  //内部变量 保存stuff和context
  _stuff: Stuff | null = null;
  _context: Context | null = null;
  //用于操作stuff
  protected Stuff: StuffOperation | null = null;
  protected Context: Context | null = null;
  //attach 初始化stuff包装器
  beforeAttach(thisStuff: Stuff): void {
    this._stuff = thisStuff;
    this.Stuff = new StuffOperation(this._stuff);
    //从stuff处获取Context
  }

  props: Map<string, any> = new Map();
  abstract name: Name;
  requirements: List<string> = [];
}
