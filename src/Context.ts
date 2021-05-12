import { Stuff } from "./Stuff";
import { List } from "./Common";
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
