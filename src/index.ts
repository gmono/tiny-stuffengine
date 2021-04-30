import dayjs from "dayjs";
import { delay, list, int, error } from "ts-pystyle";
import { ComponentBase } from "./Component";
import { Stuff, StuffBase } from "./Stuff";
import { List, TimeSpan } from "./Common";
export const container = document.querySelector("#app");

export class Context {
  /**
   * stuff列表
   */
  listofStuff: List<Stuff> = [];
  register(stuff: Stuff) {
    stuff.beforeRegister != null && stuff.beforeRegister(this);
    this.listofStuff.push(stuff);
  }
}

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
      console.log(timespan);
      // console.log(baseContext);
    }
  }
}

//具体实现
/**
 * 支持设置大小
 */
class ShapeComponent extends ComponentBase<
  "shape",
  {
    setSize(args: { height?: number; width?: number }): void;
  }
> {
  height = 100;
  width = 100;
  x = 0;
  y = 0;
  name: "shape" = "shape";
  exports = {
    setSize: ({ height = 0, width = 0 }) => {
      if (this._stuff == null) return;
      this.height = height;
      this.width = width;
      this._stuff.element.style.height = height++ + "px";
      this._stuff.element.style.width = width++ + "px";
    },
    getSize: () => {
      return { height: this.height, width: this.width };
    },
    setPosition: ({ x = 0, y = 0 }) => {
      this.x = x;
      this.y = y;
    },
    getPosition: () => {
      return { x: this.x, y: this.y };
    }
  };
  render(timespan: TimeSpan): void {
    // console.log(this.stuff);
    if (this._stuff == null) return;
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
    console.log(color);
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
    console.log(color);
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
  baseContext.register(TestBuilder({ height: 100, width: 100 }));
  renderer();
}
let temp = document.querySelector("button");
temp && (temp.onclick = main);
