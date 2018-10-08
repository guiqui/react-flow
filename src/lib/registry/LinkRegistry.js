
class LinkRegistry{
    constructor(){
        this.linkStart={}
        this.linkEnds={}
    }

    addStart(id,link){
        this.createAdd(id,link,this.linkStart)
        console.log(`Add Start ${id}`)
        console.log(`Add Start ${this.linkStart[id].length}`)
    }
   
    addEnd(id,link){
        this.createAdd(id,link,this.linkEnds)
    }

    createAdd(id,item,list){
        if (id=='*')
            return;
        if (!list[id])
            list[id]=[]
        let idx = list[id].indexOf(item);
        if (idx==-1)
            list[id].push(item)
    }

    removeLink(link){
      //  this.removeFromList(link.start,link,this.linkStart)
      //  this.removeFromList(link.end,link,this.linkEnds)
    }

    removeFromList(id,item,list){
        if (!list[id])
            return;
        let idx = list[id].indexOf(item);
        if (idx !=-1)
            list[id].splice(idx,1)    
    }

    getStart(id){
        return this.linkStart[id]
    }
    getEnd(id){
        return this.linkEnds[id]
    }

}
const instance=new LinkRegistry();
export default instance;