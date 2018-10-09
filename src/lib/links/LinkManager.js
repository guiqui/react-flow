import React,{Component} from 'react'
import LinkRenderer from './LinkRenderer'
 import {ObjectTypes} from '../Consts'
import Registry from '../registry/Registry';
import './LinkManager.css'

class LinkManager extends Component{
    constructor(props){
        super(props)
        this.prepareData=this.prepareData.bind(this);

        this.renderSelected=this.renderSelected.bind(this)
        this.prepareData(props);
    }

    shouldComponentUpdate(nextProps, nextState){

        if(nextProps.links!==this.props.links || 
            nextProps.containers!==this.props.containers||
            nextProps.selectedItem!==this.props.selectedItem){
            this.prepareData(nextProps)
            return true;
        }
        return this.props.selectedMtx!==nextProps.selectedMtx

    }                                    

    prepareData(props){
        this.links=this.separateSelectedLinks(props.selectedItem,props.links);
    }

    separateSelectedLinks(selectedItem,links){
        let selectedId=selectedItem?selectedItem.id:null;
        let result={selected:[],nonSelected:[]}
        if (!links)
            return result;
        if (!selectedId){
            result.nonSelected=links
            return result;
        }
        if (selectedItem.hasOwnProperty('start') &&
        selectedItem.hasOwnProperty('output')){
            let index=links.indexOf(selectedItem)
            let clonelinks=[...links]
            if(index>-1)
                clonelinks.splice(index, 1);
            result.nonSelected=clonelinks;
            result.selected.push(selectedItem)
            return result
        }
       
        ///Look if event its link with the selected item or parent
        for (let i=0;i<links.length;i++){            
            if(this.isSelected(links[i].start,selectedId)||
                this.isSelected(links[i].end,selectedId))
            {
                    result.selected.push(links[i])
            }else{
                result.nonSelected.push(links[i])
            }
        }
        return result;
    }


    isSelected(id,selected){
        if (id===selected)
            return true;
        if(!id)
            return false;
        let item =Registry.get(id)   
        return this.isSelected(item.parent,selected)
         

    }
    



    renderSelected(){
        if (this.props.selectedItem){
            return  <LinkRenderer selectedItem={this.props.selectedItem} command={this.props.command} selectedMtx={this.props.selectedMtx} links={this.links.selected} />
        }
    }


    render(){
        return ( 
            <g>
                <LinkRenderer selectedItem={this.props.selectedItem} links={this.links.nonSelected}   />
               {this.renderSelected()}
            </g>
        )

    }
}
export default LinkManager;