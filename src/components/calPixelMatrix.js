import { tsConstructorType } from "@babel/types";
import { PassThrough } from "stream";


function calPixelMatrix (flow, origin, start_year=1986, end_year=2008, sort=1){
    var year1 =start_year
    var year2 =end_year
    var d = []
    if (sort === 1){
        d = flow_byDemand(flow,origin, year1, year2)
    }

    mapColor(d)
    console.log(d)
    return  d
}

function flow_byDemand(flow, origin, start_year=1986, end_year=2008){
    var flow_value = [] 
    var rowName =[] 
    var source = [] 
    var year =[] 
    var site =[] 
    var d = [] 

    for (var i=0; i<flow.length;i++){
        for (var j=0; j<flow[i]["value"].length; j++){
            flow_value.push(flow[i]["value"][j])
            rowName.push(flow[i]["name"])
            source.push(flow[i]["source"])
            site.push(flow[i]["site"])
            year.push(start_year+j)

        }
    }
    var [x, y, dx, dy] = calCoordinate(flow, origin, start_year, end_year)
    for (var i =0; i<x.length; i++){
        d.push({"x":x[i], "y": y[i], "dx": dx, "dy": dy, "flow_value": flow_value[i], "source": source[i], "site":site[i], "rowName": rowName[i], "color": "", "year":year[i]})
    }
    return d
}

function calCoordinate(flow, origin, start_year, end_year){
    var space = 0
    var y0 = origin["y"]
    var x = []
    var y = []
    var dx = 30
    var dy = dx
    var num_scenarios = Object.keys(flow).length

    for (var i=0; i<flow.length; i++){
        var x0 = origin["x"]
        for(var j=start_year; j<=end_year; j++){
            x.push(x0)
            x0 = x0 + dx + space
        }
    }
    
    for (var i=0; i<flow.length; i++){
        for(var j=start_year; j<=end_year; j++){
            y.push(y0)
        }
        y0 = y0 + dy + space
    }

    // console.log("x=", x)
    console.log("y=", y)

    return [x, y, dx, dy]
}


function mapColor(d){
    var base_color = {
        "Municipal": [27,158,119], 
        "Agriculture": [217,95,2], 
        "Agriculture2": [117,112,179], 
        "Industrial": [231,41,138], 
        "PowerPlant": [102,166,30], 
        "Indian": [230,171,2]}  
    var[max_value, min_value] = findRange(d)
    // console.log(base_color["Municipal"][0])
    d.forEach(pixel=> {     
        for (var i=0; i<3; i++){
            pixel["color"]= pixel["color"] +" "+ (255 - (pixel["flow_value"]-min_value[pixel["site"]])*(255-base_color[pixel["site"]][i])/(max_value[pixel["site"]]-min_value[pixel["site"]])).toString()
        }
    })
    
    function findRange(d){
        var max_value = {"Municipal": 0, "Agriculture": 0, "Agriculture2": 0, "Industrial" :0, "PowerPlant":0 , "Indian":0}
        var min_value = {"Municipal": 0, "Agriculture": 0, "Agriculture2": 0, "Industrial" :0, "PowerPlant":0 , "Indian":0}
        var site = ["Municipal", "Agriculture", "Agriculture2", "Industrial", "PowerPlant", "Indian"]
        for (var i=0; i<site.length; i++){
            var siteData = Object.values(d).filter(v=>v["site"]==site[i])
            var flow_value = []
            for (var j=0; j<siteData.length; j++){
                
                flow_value.push(siteData[j]["flow_value"])
            }
            max_value[site[i]] = Math.max(...flow_value)
            min_value[site[i]] = Math.min(...flow_value)
        }
        return [max_value, min_value]
        
    }
     
}
export default calPixelMatrix
