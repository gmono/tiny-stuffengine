import { TimeSpan } from "../Common";
import { ComponentBase } from "../Component";
import { Stuff } from "../Stuff";
import * as tf from "@tensorflow/tfjs"
import { tensor, Tensor1D, Tensor2D } from "@tensorflow/tfjs";
import { error } from "ts-pystyle";
import { RenderPropsComponent } from "./RenderPropsComponent";

/**
 * 支持设置大小
 */
export class MechanicsComponent extends ComponentBase<"mechanics"> {

  name: "mechanics" = "mechanics";
  //转移矩阵E与状态矩阵X 下一步状态矩阵Xn-1
  //E=R+T+M
  //定点
  // R=tf.tensor2d([
  //   [1,0,0,0],
  //   [0,1,0,0],
  //   [0,0,0,0],
  //   [0,0,0,1]
  // ])
  // //+匀速直线运动
  // T=(t:number)=>tf.tensor2d([
  //   [0,1,0,0],
  //   [0,0,1,0],
  //   [0,0,0,0],
  //   [0,0,0,0]
  // ]).mul(t)
  // //+力与加速度
  // M=(m:number)=>tf.tensor2d([
  //   [0,0,0,0],
  //   [0,0,0,0],
  //   [0,0,0,1],
  //   [0,0,0,0]
  // ]).mul(1/m)
  //转移矩阵和质量
  m=1
  E=(t:number)=>tf.tensor2d([
    [1,t,0,0],
    [0,1,t,0],
    [0,0,0,1/this.m],
    [0,0,0,1]
  ])
  //状态矩阵
  X=tf.zeros([4,3]) as Tensor2D
  //加力 如果设置力就要清空X中的最后一行
  addF=(F:tf.Tensor1D)=>{
    if(F.shape[0]!=3) return;
    this.X=this.X.add(tensor([
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [...F.arraySync()]
    ]))
  }
  setF=(F:tf.Tensor1D)=>{
    //使用boardcast乘法 设置最后一行为0 然后addF
    this.X=this.X.mul(tf.tensor2d([
      [1,1,0]
    ]))
    this.addF(F);
  }

  setXState=(x:Tensor1D|null=null,v:Tensor1D|null=null,a:Tensor1D|null=null,F:Tensor1D|null=null)=>{
    if([x,v,a,F].filter(v=>v==null||v.shape[0]==3).length==4){
      //1
      x=x??this.X.slice(0,1).as1D()
      v=v??this.X.slice(1,1).as1D()
      a=a??this.X.slice(2,1).as1D()
      F=F??this.X.slice(3,1).as1D()
      this.X=tf.stack([x,v,a,F]) as Tensor2D
      // console.log(this.X.arraySync())
    }else error("错误,维度错误")
  }
  getState=(type:"Pos"|"V"|"ACC"|"F"):Tensor1D=>{
    switch(type){
      case "Pos":
        return this.X.slice(0,1).as1D()
      case "V":
        return this.X.slice(1,1).as1D()
      case "ACC":
        return this.X.slice(2,1).as1D()
      case "F":
        return this.X.slice(3,1).as1D()
    }
  }
  /**
   * 计算下一个状态
   * @param t 时间 单位 秒
   * */
  toNext(t:number){
    //通过转移矩阵
    const e=this.E(t);
    // e.print()
    this.X=e.matMul(this.X)  as Tensor2D
    // console.log("x:",this.X.arraySync())
    // this.X.print()
  }

  exports = {
    getState:this.getState,
    setF:this.setF,
    addF:this.addF,
    setState:this.setXState,
    /**
     * 设置物体的质量
     * @param m 质量 千克
     * @returns 无
     */
    setM:(m:number)=>this.m=m,
    getM:()=>this.m
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
    //计算下一个状态
    if(timespan==null) return;
    //毫秒转换为秒
    this.toNext(timespan/1000)
    //渲染位置
    let x=this.X.slice(0,1).as1D()
    // console.log(x.arraySync())
    if(this.Stuff){
      let render=this.Stuff.getComponent<RenderPropsComponent>("render")
      render.setPosition(x)
    }
  }
}
