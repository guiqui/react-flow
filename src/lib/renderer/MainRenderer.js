import React,{Component} from 'react'
import ActionRenderer from './action/ActionRenderer'



class MainRenderer extends Component{
    constructor (props){
        super(props)
        this.cache=null;   
    }

    calculateCache=(data)=>{
        return data?data.map( (item,index)=>{
            return this.dorender(item,index,item.transform)
        }):[]
    }

    componentWillUpdate(nextProps, nextState) {
        if ((nextProps.data!==this.props.data)){
            this.cache=null;
        }
      }


    onDragOver(e){
        e.preventDefault();
    }
    onDragDrop=(e)=>{
        console.log('notify Drop')
        e.stopPropagation();
        this.props.onDropIteminPage(e,this.props.item)
    }

    onMouseUpShell=(side)=>{
          //  DrawComander.cmp_update_connector(this.props.item,side);
    }


    dorender(item,index,transform){
        let w=item.w;
        let h=item.h;
        if (this.props.selectedBox && item==this.props.selectedItem){
            w=box.w
            h=box.h
        }
        return ( <ActionRenderer key={index}  item={item}  
                                         transform={transform} 
                                         w={w} 
                                         h={h}
                                         id={item.id}
                                         onAddLink={this.props.onAddLink}
                                         doObjectMouseDown={this.props.doObjectMouseDown}/>)
    }

    renderItems=()=>{
        
        if (!this.cache){
            this.cache=this.calculateCache(this.props.data);
        }
        
        if ( this.props.selectedChild){
            let itemtoRender=this.props.selectedChild
            let selectedIndex =this.props.data.indexOf(itemtoRender)
            let transform=this.props.selectedChild.id==this.props.selectedItem.id?this.props.selectedTr:itemtoRender.transform;
            this.cache[selectedIndex]=this.dorender(itemtoRender,selectedIndex,transform)
        }
        return [...this.cache]
    }

    render(){
        return (this.renderItems())
    }
}




export default  MainRenderer;