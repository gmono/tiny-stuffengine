import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";
//需要有一个“shape”的类来表示具体的形状
//如通过顶点定义 shape=set of points
//或通过html content来定义 一个shape就是一个 element

class Shape {
  element: HTMLDivElement = document.createElement("div");
}

class Rect extends Shape {}

//shape体系通过抽象类来定义
// 即 Shape  -> 圆  方块等
//具体实现
/**
 * 支持设置大小 当前只支持矩形
 * 之后会考虑用内部添加svg节点来设置形状
 */
export class ShapeComponent extends ComponentBase<"shape"> {
  height = 100;
  width = 100;
  name: "shape" = "shape";
  exports = {
    setSize: ({ height = 0, width = 0 }) => {
      if (this._stuff == null) return;
      this.height = height;
      this.width = width;
      this._stuff.element.style.height = height++ + "px";
      this._stuff.element.style.width = width++ + "px";
    },
    getSize: () => {
      return { height: this.height, width: this.width };
    }
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
  }
}
