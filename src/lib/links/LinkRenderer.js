import React,{Component} from 'react'
import Link from './Link'
import Registry from '../registry/Registry';
import Matrix from '../helpers/Matrix'


class LinkRenderer extends Component{
    constructor(props){
        super(props)
        this.renderLink=this.renderLink.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.props.links!==nextProps.links ||
               this.props.selection!==nextProps.selection


    }  
    getCoordinates(link){
        let start=Registry.get(link.start);
        let outputIndex= start.outputs? start.outputs.indexOf(link.output):0;
        let startTr=start==this.props.selection.item && this.props.selection.matrix?this.props.selection.matrix:new Matrix(start.transform)
        let end=Registry.get(link.end);
        let endTr=end==this.props.selection.item&& this.props.selection.matrix?this.props.selection.matrix:new Matrix(end.transform)
        let inputIndex=end.inputs? end.inputs.indexOf(link.input):0;
        let  stCoor= {x:startTr.trx+start.w-10,y:startTr.try+outputIndex*15+42} ;
        let  enCoor= {x:endTr.trx+10,y:endTr.try+inputIndex*15+42} ;
        return {start:stCoor,end:enCoor};
    }

  

    renderLink(){                         
        let result=null
       
        if (this.props.links){
            result=this.props.links.map((item,index)=>{
                let coordinates=this.getCoordinates(item)
                return  <Link   key={index} start={coordinates.start} end={coordinates.end}  
                                creating={item.end=='*'} item={item} selected={item==this.props.selection.item}
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