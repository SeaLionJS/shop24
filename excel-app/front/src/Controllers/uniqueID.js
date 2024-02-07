export default function createID(idNum=0){
    let dt = Math.floor(new Date().getTime()/1000)
    dt+=idNum
    dt+=""
    //console.log(dt)

    let p1 = ""
    let p2 = ""

    for(let i in dt){
        (i%2)? p1 += dt[i] : p2 += dt[i]
    }

    p2 = p2.split("").reverse().join("")
    //console.log(p2 + p1)
    return p2 + p1
}


export function nextID(list=[{id:0}]){
    //console.log(list)
    const ids = []
    list.forEach(e=>{
        ids.push(e.id)
    })

    let res = -1

    for(let i = 1; i <= ids.length+1; i++){
        if(ids.includes(i)) continue
        res = i;
        break;
    }

    return res;
}