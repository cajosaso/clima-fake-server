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
        let cities=db.cities.data;
        console.log(cities)
        let begin=cities.filter((name)=>acceptedBy("^"+req.params.query,name))
        begin=begin.sort()

        let others=cities.filter((name)=>acceptedBy(req.params.query,name))
        others=others.filter((o)=>{
            return begin.indexOf(o)<0
        }).sort()

        console.log(begin,others)

        
        res.json({data:[].concat(begin,others)})

    }catch(e){
        res.sendStatus(500)
        console.log(e)
    }
    
})

server.get('/weather/:city/forecast', (req, res) =>{
    let entry=db["weather"][req.params.city]["forecast"]
    let forecasts=entry["forecast"]
    let shallowForecasts=forecasts.map((tkr)=>{
        let ret={}
        if(tkr["noon"]){
            ret = {
                "noonDay":tkr.noon.day,
                "noonTime":tkr.noon.time,
                "noonTemp":tkr.noon.temp,
                "noonHumidity":tkr.noon.humidity,
                "noonIcon":tkr.noon.icon
            }
        }else{
            ret = {
                "noonDay":null,
                "noonTime":null,
                "noonTemp":null,
                "noonHumidity":null,
                "noonIcon":null
            }
        }

        ret.midnightDay=tkr.midnight.day
        ret.midnightTime=tkr.midnight.time
        ret.midnightHumidity=tkr.midnight.humidity
        ret.midnightIcon=tkr.midnight.icon
        ret.midnightTemp=tkr.midnight.temp

        return ret

    })
    res.send({now:entry["now"],forecast:shallowForecasts})
})


server.use(router)
server.listen(process.env.PORT || 3010, () => {
    console.log('JSON Server is running')
})
