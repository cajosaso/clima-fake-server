const request=require("sync-request")
const normalRequest=require("request")
let fs=require("fs")
let sleep = require("sleep")

let db={}
normalRequest.get("http://localhost:3000/cities",function(error,response,body){
    let cities=JSON.parse(body).filter((n)=>!n.includes(",AR"))
    db["cities"]=cities
    db["weather"]={}
    for (city of cities){
        console.log("Voy a traer:")
        console.log(city)
        db["weather"][city]={}
        let niceCity=city.split(" ").join("%20")
        /*
        request.get("http://localhost:3000/weather/"+niceCity+"/current",function(e,r,b){
            console.log(e)
            console.log(r)
            w[city]["current"]=b
            console.log(w[city])
        })
        */
        let res=request("GET","http://localhost:3000/weather/"+niceCity+"/current")
        db["weather"][city]["current"]=JSON.parse(res.getBody("utf8"))

        let res2=request("GET","http://localhost:3000/weather/"+niceCity+"/forecast")
        db["weather"][city]["forecast"]=JSON.parse(res2.getBody("utf8"))
        console.log(db)
        /*
        request.get("http://localhost:3000/weather/"+niceCity+"/forecast",function(e,r,b){
            w[city]["forecast"]=b
            console.log(w[city])
        })
        sleep.sleep(15)
        */
       console.log(Object.keys(db["weather"]).length,cities.length)
    }
    fs.writeFileSync("./db.json",JSON.stringify(db,null,4),"utf-8")
})


