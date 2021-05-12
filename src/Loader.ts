//加载器 允许通过描述构建场景

import { Component } from "./Component";
import { StuffBase } from "./Stuff";





//stuff loader 通过描述数组构建一个stuff
//


const registeredComponents=new Map<string,Component<any>>();
function registerComponent(comp:Component<any>){
    if(registeredComponents.has(comp.name)){
        console.warn("重复的名称:",comp.name)
    }
    registeredComponents.set(comp.name,comp);
}
/**
 * 构造一个stuff
 * @param componentNames 组件序列
 */
function buildStuff(componentNames:string[]){
    let ret=new StuffBase();
    for(let a of componentNames){
        if(registeredComponents.has(a)){
            let c=registeredComponents.get(a)
            c&&ret.attachComponent(c)
        }
        else{
            console.warn(`不存在component:${a}`)
        }
    }
}

/**
 * 
 * @param stuffList stuff的名字列表
 */
function buildContext(stuffList:string[]){

}

/**
 * 资源包的定义：定义stuff component resource  并确定他们的引用
 * 游戏包的定义：定义场景中有那些stuff,每个stuff的属性如何(传入构造函数)
 * 
 * 如
 * (stuff TestStuff a of (height 100) (width 100))
 * (stuff )
 * (when (equal? a.height 100) (set! a.width a.height))
 */