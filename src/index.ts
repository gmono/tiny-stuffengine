import dayjs from "dayjs";
import { delay, list, int, error } from "ts-pystyle";
import { ComponentBase } from "./Component";
import { StuffBase } from "./Stuff";
import { TimeSpan } from "./Common";
import { ShapeComponent } from "./components/ShapeComponent";
import { RenderPropsComponent } from "./components/RenderPropsComponent";


import * as tf from "@tensorflow/tfjs"
import { Context } from "./Context";
tf.setBackend("cpu")

const baseContext = new Context();

/**
 * 渲染器
 */
async function renderer() {
  //启动循环
  //存在： stuff list ，便利list，并调用stuff的render函数 计算时间差并
  //调用render
 
  let oldtime: dayjs.Dayjs | null = null;
  function getTimeSpan(): TimeSpan {
    if (oldtime == null) {
      oldtime = dayjs();
      return null;
    } else {
      let ntime = dayjs(new Date());
      let ret = ntime.diff(oldtime);
      oldtime = ntime;
      return ret;
    }
  }
  for (;;) {
    await delay(20);
    for (let stuff of baseContext.listofStuff) {
      //计算帧时间差
      let timespan = getTimeSpan();
      stuff.render(timespan);
      // console.log(timespan);
      // console.log(baseContext);
    }
  }
}

class ColorChange extends ComponentBase<"colorchange", {}> {
  exports = {};
  name: "colorchange" = "colorchange";
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
    let color = `hsla(${Math.random() * 360},${Math.random() * 100}%,${
      Math.random() * 100
    }%,${Math.random()})`;
    this._stuff.element.style.backgroundColor = color;
    // console.log(color);
    //调用size来设置
    if (this.Stuff && timespan) {
      let exp = this.Stuff.getComponent<ShapeComponent>("shape");
      let now = exp.getSize();
      now.height += timespan / 10;
      now.width += timespan / 10;
      exp.setSize(now);
    }
  }
}

class Rotate extends ComponentBase<"rotate", {}> {
  exports = {};
  name: "rotate" = "rotate";
  now = 0;
  render(timespan: TimeSpan): void {
    console.log(timespan);
    // console.log(this.stuff);
    if (this._stuff == null) return;
    if (this.now == 360) this.now = 0;
    else this.now += timespan || 1;
    let color = `rotate(${this.now}deg)`;
    this._stuff.element.style.transform = color;
    // console.log(color);
  }
}

class TestStuff extends StuffBase{
  constructor(){
    super()
    this.attachComponent(new RenderPropsComponent());
    let comp = new ShapeComponent();
    comp.width = 100
    comp.height = 100
    this.attachComponent(comp);
    this.attachComponent(new ColorChange());
    
  }
  render(time:TimeSpan){
    super.render(time);
    let prop=this.Operations.getComponent<RenderPropsComponent>("render");
    prop.setPosition(tf.randomNormal([3],200,10))
    prop.setRotate(tf.randomNormal([1],180,10).asScalar().arraySync())
  }
}
/**
 * build一个Stuff
 * 创建stuff还可以使用class继承stuffbase
 */
function TestBuilder(inithw: { height: number; width: number }) {
  let ret = new StuffBase();
  let comp = new ShapeComponent();
  comp.width = inithw.width;
  comp.height = inithw.height;
  // console.log("asd");
  ret.attachComponent(comp);
  ret.attachComponent(new ColorChange());
  ret.attachComponent(new Rotate());
  return ret;
}

function main() {
  // baseContext.register(TestBuilder({ height: 100, width: 100 }));
  baseContext.register(new TestStuff())
  renderer();
}
let temp = document.querySelector("button");
temp && (temp.onclick = main);
