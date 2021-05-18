/**
 * 引力组件 物体之间的引力
 */


/**
 *  弹力的实现
 * 处理物体之间的弹力，对于地面等，可以放一个物体到下面，作为弹力面
 * 基于：力学组件 接触检测组件
 */


import { ComponentBase } from "../Component";
import { List, TimeSpan } from "../Common";
import { Stuff, StuffOperation } from "../Stuff";
import { Rank, Tensor, Tensor1D, tidy, zeros } from "@tensorflow/tfjs-core";
import { assert } from "ts-pystyle";
import { MechanicsComponent } from "./MechanicsComponent";
import { RenderPropsComponent } from "./RenderPropsComponent";
import { tensor } from "@tensorflow/tfjs";
//需要有一个“shape”的类来表示具体的形状
//如通过顶点定义 shape=set of points
//或通过html content来定义 一个shape就是一个 element


//shape体系通过抽象类来定义
// 即 Shape  -> 圆  方块等
//具体实现
/**
 * 弹性系数
 */
export class GravityComponent extends ComponentBase<"gravity"> {
    //弹性系数 1则为完全弹性体  碰撞为完全弹性碰撞
    //中心点位置 这个由shape组件提供
    //质量 这个由力学组件提供
    name: "gravity" = "gravity";
    //万有引力常量
    G = 6.67e-11
    //临时变量 每次render清除
    nowUseGravity = zeros([3]) as Tensor1D
    /**
    * 施加一个重力的力 这个力会累积 并在下次渲染的前被清除
    * @param g 施加一个重力
    */
    useGravity = (g: Tensor1D) => {
        assert(g.shape[0] == 3)
        this.nowUseGravity = this.nowUseGravity.add(g)
    }
    applyGravity = () => {
        let mech = this.Stuff?.getComponent<MechanicsComponent>("mechanics");
        if (mech) {
            mech.addF(this.nowUseGravity);
        }
    }
    clearGravity = () => {
        if (this.nowUseGravity != null) {
            //删除之前应用的重力
            if (this.Stuff) {
                let mech = this.Stuff.getComponent<MechanicsComponent>("mechanics");
                // this.nowUseGravity.print()

                mech.addF(this.nowUseGravity.mul(-1))
            }
            //初始化重力
            this.nowUseGravity.dispose();
            this.nowUseGravity = zeros([3])
        }
        else {
            //如果本来没有重力
            this.nowUseGravity = zeros([3])
        }
    }
    exports = {
        setG: (v: number) => {
            this.G = v
        }
    };
    beforeAttach(stuff: Stuff) {
        super.beforeAttach(stuff);
    }
    render(timespan: TimeSpan): void {
        // console.log(this.stuff);
        if (this._stuff == null) return;

        //这里计算其余所有物体对本物体的影响
        //通过context获取所有拥有这个组件的stuff
        if (this.Stuff != null && this.Stuff.Context) {

            this.clearGravity();
            //开始
            let context = this.Stuff.Context;
            let gstuff = context.getStuffWithComponents(["gravity"]);
            let mech = this.Stuff.getComponent<MechanicsComponent>("mechanics")
            let m = mech.getM()
            //获取中心点 目前直接用pos
            let shape = this.Stuff.getComponent<RenderPropsComponent>("render")
            let center = shape.getPosition()
            let G = this.G
            // debugger;
            for (let s of gstuff) {
                if (s == this._stuff) continue;
                //s是目标物体 计算到目标物体的力
                //计算从物体s到本物体的向量
                let opera = new StuffOperation(s);
                // let gr = opera.getComponent<GravityComponent>("gravity")
                let srender = opera.getComponent<RenderPropsComponent>("render");
                let smech = opera.getComponent<MechanicsComponent>("mechanics")
                let FP = tidy(() => {
                    //计算r
                    let spos = srender.getPosition() as Tensor1D;
                    //这是从本物体指向目标的向量 引力的大小是对等的
                    let atb = spos.sub(center);
                    let atb_norm = atb.div(atb.norm())
                    let r = atb.norm();
                    //目标质量
                    let M = smech.getM()
                    //计算引力大小 之前这里计算出来是斥力 这里直接乘-1来修正 具体原因不明 可能是atb计算错误
                    let F = tensor(G * (m * M)).div((r.pow(2)))
                    //乘单位
                    let FP = F.mul(atb_norm) as Tensor1D;
                    assert(FP.rank == 1, "重力维度错误")
                    return FP;
                })
                this.useGravity(FP)
            }
            this.applyGravity()
            //开始计算重力 公式 
        }


    }
}
