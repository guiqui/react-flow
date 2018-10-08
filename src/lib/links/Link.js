import React,{Component} from 'react'
// import {ConnectorSides} from 'store/domain/ObjectDefinition'
// import DrawComander from 'store/comander/DrawComander'


const CASE_VERTICAL   =111;
const CASE_MIXED_H_V  =112;  
const CASE_MIXED_V_H  =113;  
const CASE_HORIZONTAL =114;

const SIDE_VERTICAL   =111;
const SIDE_HORIZONTAL  =112;  


class Link extends Component{
    constructor(props){
        super(props);
        this.calculatePath=this.calculatePath.bind(this);
        this.onMouseDown=this.onMouseDown.bind(this)
        this.linkCoordinates=this.linkCoordinates.bind(this)
    }

    getCase(sideA,sideB){
        // let A = sideA==ConnectorSides.TYPE_UP || sideA==ConnectorSides.TYPE_DOWN ?SIDE_VERTICAL:SIDE_HORIZONTAL;
        // let B = sideB==ConnectorSides.TYPE_UP || sideB==ConnectorSides.TYPE_DOWN ?SIDE_VERTICAL:SIDE_HORIZONTAL;
        // if (A!=B){
        //     return A==SIDE_VERTICAL?CASE_MIXED_V_H:CASE_MIXED_H_V ;
        // }else{
        //     return A==SIDE_VERTICAL?CASE_VERTICAL:CASE_HORIZONTAL ;
        // }
        return SIDE_VERTICA
    }

    calculatePath(coodinate){
        return `M${this.props.start.cor.x} ${this.props.start.cor.y}  ${coodinate.cpt1.x} ${coodinate.cpt1.y} ${coodinate.cpt2.x} ${coodinate.cpt2.y} ${this.props.end.cor.x} ${this.props.end.cor.y}`;
    }


    linkCoordinates(){
        let cpt1={x:0,y:0}
        let cpt2={x:0,y:0}
        let middle=0;
        let posCase = this.getCase(this.props.start.side,this.props.end.side)
        switch(posCase){
            case CASE_VERTICAL   :
                middle=this.props.start.cor.y+((this.props.end.cor.y-this.props.start.cor.y)/2)
                cpt1={x:this.props.start.cor.x,y:middle}
                cpt2={x:this.props.end.cor.x,y:middle}
                break
            case CASE_MIXED_H_V      :  
                cpt1={x:this.props.end.cor.x,y:this.props.start.cor.y}
                cpt2=cpt1;
                break
            case CASE_MIXED_V_H      :  
                cpt1={x:this.props.start.cor.x,y:this.props.end.cor.y}
                cpt2=cpt1;
                break
            case CASE_HORIZONTAL :
                middle=this.props.start.cor.x+((this.props.end.cor.x-this.props.start.cor.x)/2)
                cpt1={x:middle,y:this.props.start.cor.y}
                cpt2={x:middle,y:this.props.end.cor.y}
            break


        }
        return {cpt1:cpt1,cpt2:cpt2}
    }
    getMessageCoord(coor){
        let middle=0;

        //Solo en y por ahora
        if(coor.cpt1.y==coor.cpt2.y){
            return coor.cpt1.y
        }
        if(coor.cpt1.y<coor.cpt2.y){
            middle=(coor.cpt2.y-coor.cpt1.y)/2;
            return coor.cpt1.y+middle
        }else{
            middle=(coor.cpt1.y-coor.cpt2.y)/2;
            return coor.cpt2.y+middle
        }
    }
    onMouseDown(e){
     //   DrawComander.cmp_selectItem(this.props.item)
    }

    render(){
        let stroke =this.props.selected?'#ee63f3':this.props.color//'#7ED321'
        let middleCoor=this.linkCoordinates();
        let messageCoorY=this.getMessageCoord(middleCoor)
        return (<g    pointerEvents={this.props.creating?"none":"all"} >   
            <path d={this.calculatePath(middleCoor)} stroke={stroke}  strokeLinejoin="round" fill="transparent" strokeWidth="3"   markerEnd="url(#arrow)" onMouseDown={this.onMouseDown} />    
            {/* <rect x={middleCoor.cpt1.x-50} y={messageCoorY-10} width='100' height='20' stroke={stroke}  fill='white' strokeWidth="2" rx="10" ry="10" onMouseDown={this.onMouseDown}/>   
            <text x={middleCoor.cpt1.x} y={messageCoorY+3} style={{"textAnchor":"middle"}} fontSize="11" fill='black'  xmlSpace="preserve">{this.props.item.label}</text> */}
            <circle cx={this.props.start.cor.x} cy={this.props.start.cor.y} r="6" fill='white'  stroke={stroke} strokeWidth="2" />    
            {/* <circle cx={this.props.end.cor.x} cy={this.props.end.cor.y} r="6" fill='white' stroke={stroke} strokeWidth="2"   />   */}
        </g>)
    }
}

export default Link;