import React from 'react'
import AssetFactory from 'appHelpers/factory/AssetFactory'
import {ObjectTypes} from 'store/domain/ObjectDefinition'
import PageRenderer from '../view/page/PageRenderer'
import ContainerRenderer from '../view/ContainerRenderer'
import ActionRenderer from '../action/ActionRenderer'


 class RendererFactory{
    render(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onDropIteminPage,onAddLink){

        switch(item.objType){
            case ObjectTypes.TYPE_DRAW_ITEM:
                return this.renderItem(item,index,selectedItem,transform,box,doObjectMouseDown)
            case ObjectTypes.TYPE_PAGE:
                return this.renderPage(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onDropIteminPage)
            case ObjectTypes.TYPE_CONTAINER:
                return this.renderContainer(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onDropIteminPage)
            case ObjectTypes.TYPE_ACTION:
            case ObjectTypes.TYPE_REDUCER:
                return this.renderAction(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onAddLink)
        }
    }



    renderPage(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onDropIteminPage){
        let w=item.w;
        let h=item.h;
        if (box && item==selectedItem){
            w=box.w
            h=box.h
        }
        

        return ( <PageRenderer key={index}  item={item}  
                                         transform={transform} 
                                         w={w} 
                                         h={h}
                                         id={item.id}
                                         selectedItem={selectedItem} 
                                         selectedBox={box}
                                         command={command} 
                                         selectedTr={newTrans} 
                                         children={item.data}
                                         onDropIteminPage={onDropIteminPage}
                                         doObjectMouseDown={doObjectMouseDown}/>)
 
     }
    renderContainer(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onDropIteminPage){
        let w=item.w;
        let h=item.h;
        if (box && item==selectedItem){
            w=box.w
            h=box.h
        }
        

        return ( <ContainerRenderer key={index}  item={item}  
                                         transform={transform} 
                                         w={w} 
                                         h={h}
                                         id={item.id}
                                         selectedItem={selectedItem} 
                                         selectedBox={box}
                                         command={command} 
                                         selectedTr={newTrans} 
                                         children={item.data}
                                         onDropIteminPage={onDropIteminPage}
                                         doObjectMouseDown={doObjectMouseDown}/>)
 
     }


    renderItem(item,index,selectedItem,transform,box,doObjectMouseDown){
        let objBox= item==selectedItem?box:null;
        return  AssetFactory.build(item,index,doObjectMouseDown,transform,objBox)
 
     }

    renderAction(item,index,selectedItem,transform,newTrans,command,box,doObjectMouseDown,onAddLink){
        let w=item.w;
        let h=item.h;
        if (box && item==selectedItem){
            w=box.w
            h=box.h
        }
        return ( <ActionRenderer key={index}  item={item}  
                                         transform={transform} 
                                         w={w} 
                                         h={h}
                                         id={item.id}
                                         selectedItem={selectedItem} 
                                         selectedBox={box}
                                         command={command} 
                                         selectedTr={newTrans} 
                                         onAddLink={onAddLink}
                                         doObjectMouseDown={doObjectMouseDown}/>)
 
     }


}
let instance =new RendererFactory();
export default instance;