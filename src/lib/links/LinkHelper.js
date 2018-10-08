import Registry from '../registry/Registry';
import Matrix from '../helpers/Matrix'
class LinkHelper {
     getCoordinateFromPage(itemId,selectedItem,selectedMtx){
        //the selected item is a Draw item
        let matrix=null
        if (itemId==='*'){
            matrix=selectedMtx;
        }else{
            // let selectedId=selectedItem?selectedItem.id:null;
            // let item=Registry.get(itemId);
            // let itemMatrix=itemId===selectedId?selectedMtx:new Matrix(item.transform)
            // let parent=Registry.get(item.parent);
            // let parentMatrix=parent?parent.id===selectedId?selectedMtx:new Matrix(parent.transform):null;
            matrix=this.getCombineMatrix(itemId,selectedItem?selectedItem.id:'',selectedMtx)
        }

        if (!matrix){
            return {x:0,y:0}
        }
        return {x:matrix.trx,y:matrix.try} ;
    }

     getCombineMatrix(id,selectedId,selectedMtx){
        if(!id)
            return null;

        let item=Registry.get(id);
        let itemMatrix=id===selectedId?selectedMtx:new Matrix(item.transform);
        let parentMatrix=this.getCombineMatrix(item.parent,selectedId,selectedMtx)
        return parentMatrix?parentMatrix.multiply(itemMatrix):itemMatrix;
    }
}
const linkHelperInstance =new LinkHelper();
export default linkHelperInstance;