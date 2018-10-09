import React,{Component} from 'react'
//import {ConnectorSides} from 'store/domain/ObjectDefinition'

//import Consts from 'components/draw/viewPort/helpers/ViewPortConst'
import './ActionRenderer.css'

function InputDiv(props){
    return  <div className="inputItemContainer"> 
                <div className="actionConector"/>
                <div>{props.name}</div>
            </div>
}

function OutputDiv(props){
    return  <div className="outputItemContainer"> 
                <div>{props.item.name}</div>
                <div className="actionConector"  onMouseDown={(event)=>{props.onAddLink(event,props.item)}} />
               
            </div>
}



class ActionRenderer extends Component{
    constructor (props){
        super(props)
    }
    onMouseUpShell=(side)=>{
       // DrawComander.cmp_update_connector(this.props.item,side);
    }

    // onCreateOutputLink(event,item){
    //     DrawComander. 
    // }
    onAddLink=(e,item)=>{
      //  this.props.onAddLink(e,Consts.MODE_RUBER_ADD_LINK_LEFT,item)
    }

    renderOutputs(){
        return this.props.item.outputs? this.props.item.outputs.map((item,index) =><OutputDiv key={index} item={item} onAddLink={this.onAddLink}></OutputDiv>):[]
    }

    renderInputs(){
        return this.props.item.inputs? this.props.item.inputs.map((item,index) =><InputDiv key={index} item={item} onAddLink={this.onAddLink}></InputDiv>):[]
    }

    onEditAction=()=>{
        //EventBroker.sendEvent(EVENT_ACTION_MODAL_SHOW,this.props.item,this)
    }
    onExecuteAction=()=>{
        //console.log('Executing action')
       // EventBroker.sendEvent(EVENT_EXEC_ACTION,this.props.item,this)
    }
    
    render(){
        return ( <div  id={`${this.props.id}`} className="actionContainer" style={{overflow:'hidden',transformOrigin:'0% 0%',top:0,left:0,height:this.props.h,width:this.props.w,position:'absolute',transform: `matrix(${this.props.transform})`}}  onMouseDown={(e)=>this.props.doObjectMouseDown(e,this.props.item)}>
               
                <div className="action-title">
                    <div className="action-title-side" onClick={this.onEditAction}>
                        {/* <SvgIconData color="silver" size={22} icon="ic_settings" /> */}
                    </div>    
                    <div className="action-title-label" >{this.props.item.name}</div>
                    <div className="action-title-side" onClick={this.onExecuteAction}>
                        {/* <SvgIconData color="#7ED321" size={22} icon="ic_play_arrow" /> */}
                    </div>
                </div>
                <div className="action-split-view" >
                    <div className="inputContainer" onMouseUp={(e)=>this.onMouseUpShell(1)}>
                        {this.renderInputs()}

                    </div>
                    <div className="outputContainer" >
                        {this.renderOutputs()}
                    </div>
               </div>
      
                </div>)
    }
}

export default  ActionRenderer;