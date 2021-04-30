import { TimeSpan } from "../Common";
import { ComponentBase } from "../Component";
import { Stuff } from "../Stuff";

/**
 * 支持设置大小
 */
export class MechanicsComponent extends ComponentBase<"mechanics"> {
  x = 0;
  y = 0;
  name: "mechanics" = "mechanics";
  exports = {
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
