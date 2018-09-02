const request=require("sync-request")
const normalRequest=require("request")
let fs=require("fs")
let sleep = require("sleep")

let db={}
let badCities=[]
normalRequest.get("http://localhost:3000/cities",function(error,response,body){
    let cities=JSON.parse(body)//.filter((n)=>!n.includes(",AR") || n.includes("Buenos Aires")).slice(0,100)
    db["cities"]={"data":cities}
    db["weather"]={}
    for (city of cities){
        console.log("Voy a traer:")
        console.log(city)
        try{
            db["weather"][city]={}
            let niceCity=encodeURIComponent(city)
            let res=request("GET","http://localhost:3000/weather/"+niceCity+"/current")
            db["weather"][city]["current"]=JSON.parse(res.getBody("utf8"))

            let res2=request("GET","http://localhost:3000/weather/"+niceCity+"/forecast")
            db["weather"][city]["forecast"]=JSON.parse(res2.getBody("utf8"))
            console.log(db)
        }catch(e){
            badCities.push(city)
        }
       
        console.log(Object.keys(db["weather"]).length,cities.length)

       fs.writeFileSync("./db.json",JSON.stringify(db,null,4),"utf-8")
       fs.writeFileSync("./badCities.json",JSON.stringify(badCities,null,4),"utf-8")
    }
    
})


