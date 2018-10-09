import React,{Component} from 'react'
import Link from './Link'
import LinkHelper from './LinkHelper'
import Registry from '../registry/Registry';
import Matrix from '../helpers/Matrix'
import {ObjectTypes} from '../Consts'
// import {ConnectorSides} from 'store/domain/ObjectDefinition'
class LinkRenderer extends Component{
    constructor(props){
        super(props)
        this.renderLink=this.renderLink.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.props.links!==nextProps.links ||
               this.props.selectedItem!==nextProps.selectedItem ||
               this.props.selectedMtx!==nextProps.selectedMtx


    }  
    getCoordinates(link){
        let start=Registry.get(link.start);
        let outputIndex= start.outputs? start.outputs.indexOf(link.output):0;
        let startTr=start==this.props.selectedItem && this.props.selectedMtx?this.props.selectedMtx:new Matrix(start.transform)
        let end=Registry.get(link.end);
        let endTr=end==this.props.selectedItem && this.props.selectedMtx?this.props.selectedMtx:new Matrix(end.transform)
        let inputIndex=end.inputs? end.inputs.indexOf(link.input):0;
        let  stCoor= {x:startTr.trx+start.w-10,y:startTr.try+outputIndex*15+42} ;
        let  enCoor= {x:endTr.trx,y:endTr.try} ;
        return {start:stCoor,end:enCoor};
    }

  

    renderLink(){                         
        let result=null
       
        if (this.props.links){
            result=this.props.links.map((item,index)=>{
                let coordinates=this.getCoordinates(item)
                return  <Link   key={index} start={coordinates.start} end={coordinates.end}  
                                creating={item.end=='*'} item={item} selected={item==this.props.selectedItem}
                                color={'black'}/>
            }
        )}
        return result;
    }

    render(){


       return (<g>{this.renderLink()}</g>)
    }
}

export default LinkRenderer;