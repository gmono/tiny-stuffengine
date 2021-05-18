import { Stuff } from "./Stuff";
import { List, TimeSpan } from "./Common";
import type { Component } from "./Component";
export const container = document.querySelector("#app") as HTMLElement;
//配置app
container?.addEventListener("scroll",(e)=>{
  container.style.transform="scale(0.5)"
})


export type RenderEndHandler=(time:TimeSpan)=>Promise<void>;
export class Context {
  /**
   * stuff列表
   */
  listofStuff: List<Stuff> = [];
  register(stuff: Stuff) {
    stuff.beforeRegister != null && stuff.beforeRegister(this);
    this.listofStuff.push(stuff);
  }
  //渲染完成监听函数
  renderEndEvents=[] as RenderEndHandler[];
  //工具函数 以后转移到ContextOperation中
  getStuffWithComponents(comps:string[]){
    return this.listofStuff.filter(v=>{
      //搜索每个组件 如果出现一个组件搜索不到就失败
      let now=true;
      for(let a of comps){
        //对一个组件执行搜索
        let searchok=false;
        for(let t of v.components){
          if(t[1].name==a){
            searchok=true;
            break;
          }
        }
        //
        if(searchok==false){
          //如果出现一个组件找不到  整个失败
          now=false;
          break;
        }
      }
      return now;
    })
  }
}
