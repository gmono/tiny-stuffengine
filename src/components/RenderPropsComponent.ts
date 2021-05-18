import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";
import { Tensor, tensor1d, Tensor1D, zeros } from "@tensorflow/tfjs-core";
import { assert } from "ts-pystyle";

export type AngleUnit="deg"|"rad";
/**
 * 用于设置一个元素的渲染属性
 * 如 位置 pos  大小 方向等 这些属性会被设置到核心element上
 */
export class RenderPropsComponent extends ComponentBase<"render"> {
  name: "render" = "render";
  position=zeros([3])
  size=zeros([2])
  rotate=zeros([3])
  rotateUnit:AngleUnit="deg"
  exports = {
      setPosition:(pos:Tensor1D)=>{
          assert(pos.shape[0]==3)
          this.position=pos.clone();
      },
      getPosition:():Readonly<Tensor1D>=>{
        return this.position as Tensor1D;
      },
      setSize:(size:Tensor1D)=>{
        assert(size.shape[0]==2)
        this.size=size.clone();
      },
      /**
       * =rotateZ 2d旋转
       * @param size 大小
       * @param unit 单位
       */
      setRotate:(size:number,unit:AngleUnit="deg")=>{
        this.exports.setAxisRotate(tensor1d([0,0,size]),unit)
      },
      /**
       * 3d旋转，分别为 XYZ 的旋转角 
       * @param sizes 大小 [x,y,z]
       * @param unit 单位
       */
      setAxisRotate:(sizes:Tensor1D,unit:AngleUnit="deg")=>{
        this.rotate=sizes.clone();
        this.rotateUnit=unit;
      }
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
    // console.log(this)
    //渲染
    if(this.Stuff){
        let ele=this.Stuff.Element;
        let pos=this.position.arraySync() as number[];
        let size=this.size.arraySync() as number[];
        let rotate=this.rotate.arraySync() as number[]
        let runit=this.rotateUnit;
        //大小
        ele.style.height=`${size[0]}px`
        ele.style.width=`${size[1]}px`
        ele.style.willChange="transform"
        //旋转和位移
        let transform=`translate(${pos[0]}px,${pos[1]}px) rotateX(${rotate[0]}${runit}) rotateY(${rotate[1]}${runit}) rotateZ(${rotate[2]}${runit})`
        
        ele.style.transform=transform;


    }
  }
}
