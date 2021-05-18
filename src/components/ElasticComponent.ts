/**
 *  弹力的实现
 * 处理物体之间的弹力，对于地面等，可以放一个物体到下面，作为弹力面
 * 基于：力学组件 接触检测组件
 */


import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff } from "../Stuff";
import { Rank, Tensor1D } from "@tensorflow/tfjs-core";
import { assert } from "ts-pystyle";
import { MechanicsComponent } from "./MechanicsComponent";
//需要有一个“shape”的类来表示具体的形状
//如通过顶点定义 shape=set of points
//或通过html content来定义 一个shape就是一个 element


//shape体系通过抽象类来定义
// 即 Shape  -> 圆  方块等
//具体实现
/**
 * 弹性系数
 */
export class ElasticComponent extends ComponentBase<"elastic"> {
    //弹性系数 1则为完全弹性体  碰撞为完全弹性碰撞
    elpar = 0.4;
    name: "elastic" = "elastic";
    /**
     * 进行一次弹性操作
     */
    bounce=(axis:Tensor1D)=>{
        assert(axis.shape[0]==3)
        //沿着轴进行一次弹性操作
        //1. 这个轴是反弹的中心轴 一般由两个向量叉乘得到
        //2. 反弹的结果是运动方向沿这个轴方向的分量出现反向（就是投影）
        //计算步:1. 得到运动向量 v 2. 计算v在axis的投影t（v点乘axis/axis的norm得到投影长度 并乘 axis的单位向量（axis/axis的norm得到）得到投影向量） 
        //3.计算v-t 得到除了t分量之外的运动向量 vx  4. 用vx+（-t) 得到最终的运动向量  3 4步合并为  v-2t
        //考虑到弹性系数不是1  所以 应该是 v-t+(-t*el)=v-t-(t*el)=v-(1+el)*t
        if(this.Stuff){
            let mech=this.Stuff.getComponent<MechanicsComponent>("mechanics");
            //3d
            let v=mech.getState("V")
            assert(axis.norm().asScalar().arraySync()!=0,"错误，轴不能为0")
            //计算t
            let t=v.mul(axis).sum().div(axis.norm()).mul(axis.div(axis.norm()))
            assert(t.norm().asScalar().arraySync()!=0,"错误，不能与速度方向垂直")
            //计算 v-2t
            let ret=v.sub(t.mul(1+this.elpar)) as Tensor1D;
            assert(ret.rank==1,"计算结果中维度错误 ，请调试:"+ret.rank)
            // ret.print()
            // t.print()
            //设为当前速度
            mech.setState(null,ret)
        }
       
    }
    exports = {
        bounce:this.bounce
    };
    beforeAttach(stuff: Stuff) {
        super.beforeAttach(stuff);
    }
    render(timespan: TimeSpan): void {
        // console.log(this.stuff);
        if (this._stuff == null) return;
        //碰撞检测
    }
}
