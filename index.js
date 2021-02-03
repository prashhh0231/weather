const http=require("http");
const fs=require("fs");
var requests=require("request");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal, orgVal) =>
{
    let temperature = tempVal.replace("{%temp%}",(orgVal.main.temp).toFixed(0)-273);
    temperature =  temperature.replace("{%tempmin%}",(orgVal.main.temp_min).toFixed(0)-273);
    temperature =  temperature.replace("{%tempmax%}",(orgVal.main.temp_max).toFixed(0)-273);
    temperature =  temperature.replace("{%city%}",orgVal.name);
    temperature =  temperature.replace("{%country%}",orgVal.sys.country);
    temperature =  temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    
    return temperature;


}
const server=http.createServer((req,res)=>{
    if(req.url == "/")
    {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Amravati&appid=f86f0133e3d13e34246516b95921b270"
            )
        .on("data",(chunk)=>{
            const objData = JSON.parse(chunk.toString());
            const arrayData =[objData];
            // console.log(arrayData[0].main.temp);
            const realTimeData = arrayData.map((val) => replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData.main.temp);
        })
        .on("end",(err)=>{
            if(err) return console.log("connection err",err);
            // console.log("end");
            res.end();
        });
    }
});
server.listen(8000,"127.0.0.1");