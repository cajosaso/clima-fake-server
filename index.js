const jsonServer=require("json-server")
const server=jsonServer.create()
const router=jsonServer.router("db.json")
const middleware=jsonServer.defaults()



const db=require("./db")
function acceptedBy(query,name){
    return RegExp(query.toLocaleLowerCase()).test(name.toLocaleLowerCase())
}
server.get('/cities/search/:query', (req, res) =>{
    try{
        let cities=db.cities;
        console.log(cities)
        let begin=cities.filter((name)=>acceptedBy("^"+req.params.query,name))
        begin=begin.sort()

        let others=cities.filter((name)=>acceptedBy(req.params.query,name))
        others=others.filter((o)=>{
            return begin.indexOf(o)<0
        }).sort()

        console.log(begin,others)

        
        res.json([].concat(begin,others))

    }catch(e){
        res.sendStatus(500)
    }
    
})


server.use(router)
server.listen(process.env.port || 3010, () => {
  console.log('JSON Server is running')
})