import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";

//具体实现
/**
 * 支持设置大小
 */
export class ShapeComponent extends ComponentBase<"shape"> {
  height = 100;
  width = 100;
  x = 0;
  y = 0;
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
    },
    setPosition: ({ x = 0, y = 0 }) => {
      this.x = x;
      this.y = y;
    },
    getPosition: () => {
      return { x: this.x, y: this.y };
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
