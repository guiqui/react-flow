import React,{ Component } from "react";
import MainRenderer from './renderer/MainRenderer'
import RubberBand from './rubberBand/RubberBand'
import Consts from './helpers/ViewPortConst'
import SpacialHelper from './helpers/SpacialHelper'
import ViewPortController from './helpers/ViewPortController'
import LinkManager from './links/LinkManager'
import Matrix from './helpers/Matrix'
import {ObjectTypes} from './Consts'
//import Registry from 'store//';



class BackGround extends Component{

    shouldComponentUpdate(nextProps, nextState){
        return false
    }

    render(){
        return (
            <svg x='0' y='0' width="100%" height="100%">
                <g>
                    <defs>
                        <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <rect width="80" height="80" fill="url(#smallGrid)"/>
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="silver"/>  
                    <rect width="100%" height="100%" fill="url(#grid)" /> 
                </g>
            </svg>
            )
    }
}


class Flow extends Component{
    
    constructor(props){
        super(props);

        //Bind functions
        this.doMouseMove=this.doMouseMove.bind(this)
        this.doGlobalMouseDown=this.doGlobalMouseDown.bind(this)
        this.doMouseUp=this.doMouseUp.bind(this)
        this.doMouseWheel=this.doMouseWheel.bind(this)
        this.doObjectMouseDown=this.doObjectMouseDown.bind(this)
        this.pan=this.pan.bind(this);
        this.zoom=this.zoom.bind(this);
        this.applyMatrix=this.applyMatrix.bind(this)
        this.doRubberMouseDown=this.doRubberMouseDown.bind(this);
        this.setDraggingPosition=this.setDraggingPosition.bind(this);
        this.onDragOver=this.onDragOver.bind(this)
        this.onDrop=this.onDrop.bind(this)
        this.onDropIteminPage=this.onDropIteminPage.bind(this)
        this.updateSelectedItem=this.updateSelectedItem.bind(this)
        this.addItem=this.addItem.bind(this)
        //Init Controllers
        this.viewPortController=new ViewPortController();

        //Initialization of state
        this.state={dragging:false,
                        viewportMtx: new Matrix(this.props.viewportMtx),
                        viewportTr:'1,0,0,1,0,0',
                        selectedMtx:null,
                        selectedTr:'',
                        parentMtx:null,
                        box:null
                    }
        ///LOCAL VARIABLES 
        this.draggingPositionX=0;
        this.draggingPositionY=0;
        this.mode= Consts.MODE_GLOBAL_PAN;
    }


    //Component update taking care of adding and removing global mouse listeners
    componentDidUpdate(prevprops, state) {
        if (this.state.dragging && !state.dragging) {
          document.addEventListener('mousemove', this.doMouseMove)
          document.addEventListener('mouseup', this.doMouseUp)
        } else if (!this.state.dragging && state.dragging) {
          document.removeEventListener('mousemove', this.doMouseMove)
          document.removeEventListener('mouseup', this.doMouseUp)
        }

        if (prevprops.selectedItem!=this.props.selectedItem||
            (this.props.selectedItem && this.props.selectedItem.positionHasChange)){

            this.updateSelectedInfo(this.props.selectedItem)
            if( this.props.selectedItem)
                this.props.selectedItem.positionHasChange=false;
        }
    }

    //////////////////////
    /// MOUSE DOWN  /////
    /////////////////////
    
    //When we click anywhere that is not an Object or the rubberband
    doGlobalMouseDown(e){
        if (e.button === 0){
            this.setDraggingPosition(e)
            this.setState({dragging:true})
            this.mode=Consts.MODE_GLOBAL_PAN;
        }
    }

    doObjectMouseDown(e,parent,item){

        e.stopPropagation();
        this.setDraggingPosition(e)
        this.setState({dragging:true})
        if (this.props.onSelectItem)
            this.props.onSelectItem(parent,item);
      //  this.updateSelectedInfo(parent,item)
        this.mode=Consts.MODE_RUBER_BAND_MOVE;  


    }  

    updateSelectedInfo(item){
        if (!item){
            this.setState({
                selectedMtx:new Matrix(),
                selectedTr:'1,0,0,1,0,0',
                parentMtx:null,
                parentBox:null,
                item:item,
                parent:null
            } )
            return
        }
        let selectedMtx=null

        if  ((item.objType===ObjectTypes.TYPE_LINK)){
            selectedMtx=new Matrix(item.transform);
            this.setState({
                selectedMtx:selectedMtx,
                selectedTr:selectedMtx.matrixToText(),
                parentMtx:null,
                parentBox:null,
                item:item,
                parent:null,
            } )
            return
        }


        selectedMtx=new Matrix(item.transform);

        let box={id:item.id,x:0,y:0,w:item.w,h:item.h}
        this.setState({
                viewportTr:this.state.viewportMtx.matrixToText(),
                selectedMtx:selectedMtx,
                selectedTr:item.matrix,
                box:box,
                item:item,
            

            }   
        )

    }


    doRubberMouseDown(e,mode,item){
        e.stopPropagation();
        this.setDraggingPosition(e)
        this.setState({dragging:true})
        this.mode=mode; 
        if (mode===Consts.MODE_RUBER_ADD_LINK_LEFT || mode===Consts.MODE_RUBER_ADD_LINK_RIGHT)
        {
            let x=e.clientX-this.refs.container.offsetLeft;
            let y=e.clientY-this.refs.container.offsetTop;
            let coor=SpacialHelper.coordinatesGlobalToLocal(x,y,this.state.viewportMtx)
            let side = mode===Consts.MODE_RUBER_ADD_LINK_LEFT?ConnectorSides.TYPE_LEFT:ConnectorSides.TYPE_RIGHT;
            this.mode=Consts.MODE_RUBER_BAND_MOVE; 
            let linkposition=`1,0,0,1,${coor.x},${coor.y}`
            let data={objType:ObjectTypes.TYPE_LINK,startItem:item,startSide:side,transform:linkposition};
            this.props.onAddItem(data,parent)
        }
    }

    ///////////////////////
    /// MOUSE EVENTS  ////
    /////////////////////

    doMouseMove(e){
       if(this.state.dragging){
            e.stopPropagation();
            let x=e.clientX-170//this.refs.container.offsetLeft;
            let y=e.clientY-57//this.refs.container.offsetTop;

            let deltaX=this.draggingPositionX-x
            let deltaY=this.draggingPositionY-y

            switch(this.mode){
            case  Consts.MODE_GLOBAL_PAN:
                this.pan(deltaX,deltaY);
                break;
            case Consts.MODE_RUBER_BAND_MOVE:
                if (this.state.isManaged)
                    return
                this.updateSelectedItem(SpacialHelper.moveObject(deltaX,deltaY,this.state));
                break;
            case Consts.MODE_RUBER_BAND_ROTATE:
                if (this.state.isManaged || this.state.isContainer)
                    return
                this.updateSelectedItem(SpacialHelper.rotateObject(x,y,this.draggingPositionX,this.draggingPositionY,this.state));
                break;
            
            case Consts.MODE_RUBER_BAND_RESIZE_UL     :
            case Consts.MODE_RUBER_BAND_RESIZE_UR     :
            case Consts.MODE_RUBER_BAND_RESIZE_DL     :
            case Consts.MODE_RUBER_BAND_RESIZE_DR     :
                let newState= SpacialHelper.resizeObject(deltaX,deltaY,this.mode,this.state)
                if (this.state.isContainer){
                     //mark to refresh
                    //recalculate Layout
                    LayoutHelper.calculate(this.state.item);
                    this.state.item.w=newState.box.w
                    this.state.item.h=newState.box.h
                }
                   
                if (this.state.isManaged) {
                  
                    this.state.item.w=newState.box.w;
                    this.state.item.h=newState.box.h;
                    this.state.item.isDirty=true
                    LayoutHelper.calculate(this.state.parent)
                    newState.matrix=new Matrix(this.state.item.transform)
                }
            
                this.updateSelectedItem(newState);
                break;
            }

            this.setDraggingPosition(e)
        }
    }    


    doMouseUp(e){
        this.setState({dragging:false})
        if (this.props.selectedItem && this.props.onChangeProperty)
            this.props.onChangeProperty(this.props.selectedItem,'position',{transform:this.state.selectedTr,box:this.state.box})

    }

    doMouseWheel(e){
        e.preventDefault();
        let cx=e.clientX-this.refs.container.offsetLeft;
        let cy=e.clientY-this.refs.container.offsetTop;
        let scale =e.deltaY>0?1.05 :0.95;
        this.zoom(scale,cx,cy) 
    }

    //////////////////////
    /// KEY EVENTS  /////
    /////////////////////

    
    ownEvent(e){
        e.preventDefault();
        e.stopPropagation();
    }

    ////////////////////////////
    //   DRAG & DROP EVENTS  //
    //////////////////////////

    onDragOver(e){
        e.preventDefault();
    }

    onDrop(e){
        let objType=parseInt(e.dataTransfer.getData('objtype'))
        if (objType ==ObjectTypes.TYPE_PAGE 
            || objType ==ObjectTypes.TYPE_ACTION 
            ||objType ==ObjectTypes.TYPE_REDUCER ){
            let x=e.clientX-this.refs.container.offsetLeft;
            let y=e.clientY-this.refs.container.offsetTop;
            let coor=SpacialHelper.coordinatesGlobalToLocal(x,y,this.state.viewportMtx,null)
            let matrix= `1, 0, 0, 1, ${coor.x}, ${coor.y}`
            this.addItem(e,null,matrix)
        }
     }
     onDropIteminPage(e,parent){
        let parentMtx=SpacialHelper.getCombineMatrix(parent.id)
        let x=e.clientX-this.refs.container.offsetLeft;
        let y=e.clientY-this.refs.container.offsetTop;
        let coor=SpacialHelper.coordinatesGlobalToLocal(x,y,this.state.viewportMtx,parentMtx)
        let matrix= `1, 0, 0, 1, ${coor.x}, ${coor.y}`
        this.addItem(e,parent,matrix)
     }

     addItem(e,parent,matrix){
        let type=parseInt(e.dataTransfer.getData('type'))
        let subtype=e.dataTransfer.getData('subtype')
        let objType=parseInt(e.dataTransfer.getData('objtype'))
        let name=e.dataTransfer.getData('name')
        let data={name:name,
                  type:type,
                  objType:objType,
                  subtype:subtype,
                  transform:matrix};
        this.props.onAddItem(data,parent)
     }
    ////////////////////////////
    //   OBJECT CONTROLLER  //
    //////////////////////////



    updateSelectedItem(newState){
        let matrix=newState.matrix;
        newState.box?newState.box.id=this.state.box.id:null;
        let box=newState.box?newState.box:this.state.box;
        this.setState({
            selectedMtx:matrix,
            selectedTr:matrix.matrixToText(),
            box:box
        })
    }
  
    //////////////////////////
    // VIEW PORT ZOOM & PAN //
    /////////////////////////

    pan(dx, dy) {     	
        this.viewPortController.pan(dx, dy,this.state.viewportMtx) 
        this.applyMatrix(); 
    }

    zoom(scale,cx,cy) { 
        this.viewPortController.zoom(scale,cx,cy,this.state.viewportMtx) 
        this.applyMatrix();
    }

    applyMatrix(){
        let newMatrix = this.state.viewportMtx.matrixToText();
        this.setState({
            viewportTr:newMatrix
        })
    }

    ///////////////////////
    //    HELPERS     //
    /////////////////////
    setDraggingPosition(e){
        // this.draggingPositionX=e.clientX-this.refs.container.offsetLeft;
        // this.draggingPositionY=e.clientY-this.refs.container.offsetTop;

        this.draggingPositionX=e.clientX-170;
        this.draggingPositionY=e.clientY-57
    }

    render(){
        
        return (<div ref="container"   onDragOver={this.onDragOver} onDrop={this.onDrop} style={{position:'relative',userSelect: 'none',width:'100%', height:'100%',outline:0 }} tabIndex="0" >  

                    <div id='viewport' ref="mainSvg" x={0} y={0} width="100%"   style={{position:'relative', userSelect: 'none',height:'100%' }}  
                        onMouseDown={this.doGlobalMouseDown} 
                        onWheel = {this.doMouseWheel}>
                         <div style={{transform:`matrix(${this.state.viewportTr})`,position:'absolute'}}> 
                            <MainRenderer   
                                         selectedItem={this.props.selectedItem} 
                                         selectedTr={this.state.selectedTr} 
                                         selectedBox={this.state.box} 
                                         data={this.props.data} 
                                         doObjectMouseDown={this.doObjectMouseDown} 
                                         onDropIteminPage={this.onDropIteminPage}
                                         onAddLink={this.doRubberMouseDown}/>
                              
                        </div>
                       <svg id="LinkManager"   style={{pointerEvents:'none',position:'absolute'}}
                                            width="100%"
                                            height="100%">


                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4"
                                        orient="auto-start-reverse">
                                        <path d="M 0 0 L 10 5 L 0 10 z"  strokeLinejoin="round"  />
                                </marker>
                            </defs>
                            <g  transform={`matrix(${this.state.viewportTr})`}>
                            <LinkManager  links={this.props.links} containers={this.props.data} 
                                        selectedItem={this.props.selectedItem} 
                                        command={this.props.selectedItem?this.props.selectedItem.command:null} 
                                        connectors={this.props.selectedItem?this.props.selectedItem.connectors:null} 
                                        selectedMtx={this.state.selectedMtx}/> 
                            </g>
                        </svg>        
                        
                       {this.props.selectedItem&&this.props.selectedItem.objType!=ObjectTypes.TYPE_LINK ?
                        (<RubberBand  
                            selectedItem={this.props.selectedItem}
                            viewport={this.state}
                            doRubberMouseDown={this.doRubberMouseDown}/>):null}
                       <BackGround /> 
                       
                    </div>
                </div>
            )
    }
}

export default Flow;