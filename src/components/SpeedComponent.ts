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
  R=tf.tensor2d([
    [1,0,0,0],
    [0,1,0,0],
    [0,0,0,0],
    [0,0,0,1]
  ])
  //+匀速直线运动
  T=(t:number)=>tf.tensor2d([
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]).mul(t)
  //+力与加速度
  M=(m:number)=>tf.tensor2d([
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,1],
    [0,0,0,0]
  ]).mul(1/m)
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
