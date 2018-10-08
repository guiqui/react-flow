import LinkRegistry from './LinkRegistry'

test('Adding object to registry',()=>{
    LinkRegistry.addStart('1',{id:1,name:'First Element'})
    let result=LinkRegistry.getStart('1');
    expect(result).toHaveLength(1);
})

