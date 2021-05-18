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
  constructor() {
    super();
    this.attachComponent(new RenderPropsComponent());
    this.attachComponent(new ColorChange());
    this.attachComponent(new MechanicsComponent())
    this.attachComponent(new ElasticComponent())
    this.attachComponent(new GravityComponent())
    let mech=this.Operations.getComponent<MechanicsComponent>("mechanics")
    mech.setState(tf.randomUniform([3],0,1000),tf.randomUniform([3],-20,20),tensor([0,0,0]),tensor([0,0,0]))
    mech.setM(1e15)
    let g=this.Operations.getComponent<GravityComponent>("gravity")
    // g.setG(6000)
  }
  render(time: TimeSpan) {
    super.render(time);
    let rend=this.Operations.getComponent<RenderPropsComponent>("render")
    rend.setSize(tensor([10,10]))
    // let prop = this.Operations.getComponent<RenderPropsComponent>("render");
    // prop.setPosition(tf.randomNormal([3], 200, 10));
    // prop.setRotate(tf.randomNormal([1], 180, 10).asScalar().arraySync());
    let pos=rend.getPosition().arraySync() as number[]
    if(pos[1]<0||pos[1]>1000){
      let el=this.Operations.getComponent<ElasticComponent>("elastic");
      el.bounce(tf.tensor([0,1,0]))
    }
    if(pos[0]<0||pos[0]>1000){
      let el=this.Operations.getComponent<ElasticComponent>("elastic");
      el.bounce(tf.tensor([1,0,0]))
    }
  }
}
