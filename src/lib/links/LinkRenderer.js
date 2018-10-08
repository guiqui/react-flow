import React,{Component} from 'react'
import Link from './Link'
import LinkHelper from './LinkHelper'
import Registry from '../registry/Registry';
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
               this.props.selectedMtx!==nextProps.selectedMtx ||
               this.props.command!==nextProps.command


    }  
    getConnector(connectorId,selection,selectedMtx){
        let connector=Registry.get(connectorId)
       // let side=connector?connector.side:ConnectorSides.TYPE_RIGHT;
       let side=connector.side
        let coord=LinkHelper.getCoordinateFromPage(connectorId,this.props.selectedItem,this.props.selectedMtx)
        return {cor:coord,side:side};
    }
    renderLink(){                         
        let result=null
        if (this.props.links){
            result=this.props.links.map((item,index)=><Link key={index} start={this.getConnector(item.start,this.props.selectedItem,this.props.selectedMtx)} 
            end={this.getConnector(item.end,this.props.selectedItem,this.props.selectedMtx)} creating={item.end=='*'} item={item} selected={item==this.props.selectedItem}
            color={item.color}/>)
        }
        return result;
    }

    render(){


       return (<g>{this.renderLink()}</g>)
    }
}

export default LinkRenderer;