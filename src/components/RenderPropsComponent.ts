import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";
import { Tensor, Tensor1D, zeros } from "@tensorflow/tfjs-core";
import { assert } from "ts-pystyle";
/**
 * 用于设置一个元素的渲染属性
 * 如 位置 pos  大小 方向等 这些属性会被设置到核心element上
 */
export class RenderPropsComponent extends ComponentBase<"render"> {
  name: "render" = "render";
  position:number[]=zeros([3]).arraySync() as number[];
  exports = {
      setPosition:(pos:number[])=>{
          assert(pos.length==3)
          this.position=pos;
      }
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
    //渲染
    if(this.Stuff){
        let ele=this.Stuff.Element;
        let pos=this.position;
        ele.style.transform=`translate(${pos[0]}px ${pos[1]}px ${pos[2]}px)`
    }
  }
}
