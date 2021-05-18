import { StuffBase } from "../Stuff";
import { TimeSpan } from "../Common";
import { ShapeComponent } from "../components/ShapeComponent";
import { RenderPropsComponent } from "../components/RenderPropsComponent";
import * as tf from "@tensorflow/tfjs";
import { ColorChange } from "../index";
import { MechanicsComponent } from "../components/MechanicsComponent";
import { tensor, zeros } from "@tensorflow/tfjs";
import { ElasticComponent } from "../components/ElasticComponent";
import { GravityComponent } from "../components/GravityComponent";

export class TestStuff extends StuffBase {
  constructor(m:number,initV:[number,number,number],initPos:[number,number,number]) {
    super();
    this.attachComponent(new RenderPropsComponent());
    this.attachComponent(new ColorChange());
    this.attachComponent(new MechanicsComponent())
    this.attachComponent(new ElasticComponent())
    this.attachComponent(new GravityComponent())
    let mech = this.Operations.getComponent<MechanicsComponent>("mechanics")
    mech.setState(tensor(initPos), tensor(initV), tensor([0, 0, 0]), tensor([0, 0, 0]))
    mech.setM(m)
    let g = this.Operations.getComponent<GravityComponent>("gravity")

    // g.setG(6000)
  }
  render(time: TimeSpan) {
    super.render(time);
    let rend = this.Operations.getComponent<RenderPropsComponent>("render")
    rend.setSize(tensor([10, 10]))
    // let prop = this.Operations.getComponent<RenderPropsComponent>("render");
    // prop.setPosition(tf.randomNormal([3], 200, 10));
    // prop.setRotate(tf.randomNormal([1], 180, 10).asScalar().arraySync());
    // let pos = rend.getPosition().arraySync() as number[]
    // if (pos[1] < -1000 || pos[1] > 1000) {
    //   let mech = this.Operations.getComponent<MechanicsComponent>("mechanics")
    //   mech.setState(tf.randomUniform([3], 0, 1000), zeros([3]), tensor([0, 0, 0]), tensor([0, 0, 0]))
    //   mech.setM(Math.random() * 1e17)
    // }
    // if (pos[0] < -1000 || pos[0] > 1000) {
    //   let mech = this.Operations.getComponent<MechanicsComponent>("mechanics")
    //   mech.setState(tf.randomUniform([3], 0, 1000), zeros([3]), tensor([0, 0, 0]), tensor([0, 0, 0]))
    //   mech.setM(Math.random() * 1e17)
    // }
  }
}
