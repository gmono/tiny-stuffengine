import { StuffBase } from "../Stuff";
import { TimeSpan } from "../Common";
import { ShapeComponent } from "../components/ShapeComponent";
import { RenderPropsComponent } from "../components/RenderPropsComponent";
import * as tf from "@tensorflow/tfjs";
import { ColorChange } from "../index";
import { MechanicsComponent } from "../components/MechanicsComponent";
import { tensor, zeros } from "@tensorflow/tfjs";

export class TestStuff extends StuffBase {
  constructor() {
    super();
    this.attachComponent(new RenderPropsComponent());
    this.attachComponent(new ColorChange());
    this.attachComponent(new MechanicsComponent())
    let mech=this.Operations.getComponent<MechanicsComponent>("mechanics")
    mech.setX(tensor([100,100,100]),zeros([3]),tensor([0,0,0]),tensor([0,2000,0]))
  }
  render(time: TimeSpan) {
    super.render(time);
    let rend=this.Operations.getComponent<RenderPropsComponent>("render")
    rend.setSize(tensor([100,100]))
    let prop = this.Operations.getComponent<RenderPropsComponent>("render");
    // prop.setPosition(tf.randomNormal([3], 200, 10));
    // prop.setRotate(tf.randomNormal([1], 180, 10).asScalar().arraySync());
    let pos=rend.getPosition().arraySync() as number[]
    if(pos[1]>500){
      let mech=this.Operations.getComponent<MechanicsComponent>("mechanics")
      mech.setX(tensor([mech.getState("Pos").arraySync()[0],500,0]),mech.getState("V").mul([0,-0.85,0]).as1D(),null,null)
    }
  }
}
