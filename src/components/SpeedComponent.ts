import { TimeSpan } from "../Common";
import { ComponentBase } from "../Component";
import { Stuff } from "../Stuff";
import * as tf from "@tensorflow/tfjs"
import { Tensor1D } from "@tensorflow/tfjs";
import { error } from "ts-pystyle";

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
  X=tf.zeros([4,3])
  //加力 如果设置力就要清空X中的最后一行
  addF=(F:tf.Tensor1D)=>{
    if(F.shape[0]!=3) return;
    this.X=this.X.add([
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [...F.arraySync()]
    ])
  }
  setF=(F:tf.Tensor1D)=>{
    //使用boardcast乘法 设置最后一行为0 然后addF
    this.X=this.X.mul(tf.tensor2d([
      [1,1,0]
    ]))
    this.addF(F);
  }

  setXState=(x:Tensor1D,v:Tensor1D,a:Tensor1D,F:Tensor1D)=>{
    if([x,v,a,F].filter(v=>v.shape[0]==3).length==4){
      //1
      this.X=tf.stack([x,v,a,F])
    }else error("错误,维度错误")
  }
  //计算下一个状态

  toNext(t:number){
    //通过转移矩阵
    this.X=this.E(t).matMul(this.X);
  }

  getPosition=()=>{
    this.X.slice
  }
  exports = {
    setPosition(pos:tf.Tensor1D){
      //3维
    },
    setF:this.setF,
    addF:this.addF,
    setX:this.setXState
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
    //计算下一个状态
    if(timespan==null) return;
    this.toNext(timespan)
    //渲染位置
    let x
  }
}
