import { TimeSpan } from "../Common";
import { ComponentBase } from "../Component";
import { Stuff } from "../Stuff";
import * as tf from "@tensorflow/tfjs"

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
  //转移矩阵
  E=(m:number,t:number)=>tf.tensor2d([
    [1,t,0,0],
    [0,1,t,0],
    [0,0,0,1/m],
    [0,0,0,1]
  ])
  //状态矩阵
  X=tf.zeros([4,3])
  //加力 如果设置力就要清空X中的最后一行
  addF(F:tf.Tensor1D){
    if(F.shape[0]!=3) return;
    this.X=this.X.add([
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [...F.arraySync()]
    ])
  }
  exports = {
    setPosition: ({ x = 0, y = 0 }) => {
      this.x = x;
      this.y = y;
    },
    getPosition: () => {
      return { x: this.x, y: this.y };
    },
    setF()
  };
  beforeAttach(stuff: Stuff) {
    super.beforeAttach(stuff);
  }
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
  }
}
