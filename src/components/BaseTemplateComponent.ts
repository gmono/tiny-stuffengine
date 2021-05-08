import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";
/**
 * 用于设置一个元素的渲染属性
 * 如 位置 pos  大小 方向等 这些属性会被设置到核心element上
 */
export class RenderPropsComponent extends ComponentBase<"shape"> {
  name: "shape" = "shape";
  exports = {

  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
  }
}
