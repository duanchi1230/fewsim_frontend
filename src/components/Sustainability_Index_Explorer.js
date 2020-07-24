import React, { Component } from 'react';
import * as d3 from 'd3'
import {Form, InputNumber, Button, Row, Col, Modal, Empty, Card, Divider, Icon, Input, Select, Tree, Tabs} from 'antd';
const { TabPane } = Tabs;
const { Option , OptGroup} = Select;
class Sustainability_Index_Explorer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            sustainability_index_calculated: [],
            index_to_show: ""
         };
    }
    
    componentWillMount(){
        let sustainability_variables_calculated = JSON.parse(JSON.stringify(this.props.sustainability_variables_calculated))
        let sustainability_index = JSON.parse(JSON.stringify(this.props.sustainability_index))
        if(sustainability_variables_calculated.length>0 && sustainability_index.length>0){
            let index_to_show = JSON.parse(JSON.stringify(this.props.sustainability_index))[0]["index-name"]
            for(let i=0; i<sustainability_index.length; i++){
                sustainability_index[i]["value"] = this.calculateIndexFunction(sustainability_index[i]["index-function"], sustainability_variables_calculated)
            }
            console.log(sustainability_index)
            console.log(this.props.weap_flow)
            this.setState({
                sustainability_index_calculated: sustainability_index,
                index_to_show: index_to_show
        })}
        
    }

    calculateIndexFunction(index_functions, sustainability_variables_calculated){
        const variables = this.parseIndex(index_functions)
        let values = {}
        let scenarios = []
        variables.map(v=>{sustainability_variables_calculated.map(s_v=>{
          if(v===s_v["name"]){
            values[v] = s_v["node"]
            // console.log(v)
          }})
          var re = new RegExp(v,"g")
          index_functions = index_functions.replace(re, "values['"+v+ "']['value'][i]['calculated'][j]")
          }
        )

        let calculated_index_value = []
        for(let i=0;i< sustainability_variables_calculated[0]['node']['value'].length;i++){
            let s_value = []
            for(let j=0; j<sustainability_variables_calculated[0]['node']['value'][i]['calculated'].length;j++){
                s_value.push(eval(index_functions))
                console.log(eval(index_functions))
            }
            let s_name = sustainability_variables_calculated[0]['node']['value'][i]['name']
            calculated_index_value.push({'name':s_name, 'calculated': s_value})
        }

        // sustainability_variables_calculated.forEach(s_v=>{
        //     s_v["value"].forEach(v=>{
        //         scenarios.push(Object.keys(v)[0])
        //     })
        // })

        // scenarios.forEach(s=>{

        // })

        // let parsed_value = this.parseNodeValues(values, sustainability_variables_calculated)
        // let result = []
        console.log(values)
        console.log(index_functions)
        // parsed_value.forEach(value=>{result.push(eval(index_functions))})
        // console.log(result)
        return calculated_index_value
    }
  
    parseNodeValues(values, sustainability_variables_calculated){
    console.log(values)
    let parsed_value = []
    let num_years = sustainability_variables_calculated[0]["node"]["value"].length
    console.log(num_years)
    for(let i=0; i<num_years; i++){
        let v_year = {}
        Object.entries(values).forEach(v=>{
        v_year[v[0]] = v[1]["value"][i]
        v_year["node"] = v[1]
        })
        parsed_value.push(v_year)
    }
    return parsed_value
    }

    parseIndex(string_formular){
    let variables = string_formular.match(/[A-Za-z]([_A-Za-z0-9]+)/g)
    console.log(variables)
    if(variables != null){return Array.from(new Set(variables))}
    else{return []}
    }

    componentDidUpdate(){

        let base_color = ["#8dd3c7", "#fcdf03", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
        let sustainability_variables_calculated = JSON.parse(JSON.stringify(this.props.sustainability_variables_calculated))
        let sustainability_index_calculated = JSON.parse(JSON.stringify(this.state.sustainability_index_calculated))
        console.log(sustainability_index_calculated)
        // d3.selectAll("#index-plot")
        // .remove()
        if(sustainability_variables_calculated.length>0 && sustainability_index_calculated.length>0){
            for(let i=0; i<sustainability_variables_calculated.length;i++){
                if(sustainability_variables_calculated[i]["name"]===this.state.index_to_show){
                    d3.selectAll('#sustainability-variable-plot')
                        .remove()
                    d3.selectAll('#sustainability-index-plot')
                        .remove()
                    this.initVariableCanvas(sustainability_variables_calculated[i], base_color)
                }
            }
            for(let i=0; i<sustainability_index_calculated.length;i++){
                if(sustainability_index_calculated[i]["index-name"]===this.state.index_to_show){
                    d3.selectAll('#sustainability-variable-plot')
                        .remove()
                    d3.selectAll('#sustainability-index-plot')
                        .remove()
                    this.initIndexCanvas(sustainability_index_calculated[i], base_color)
                }
            }
        }
        
    }

    initIndexCanvas(index, base_color){

        var margin = {top: 10, right: 30, bottom: 60, left: 80},
        width = 490 - margin.left - margin.right,
        height = 235 - margin.top - margin.bottom;
        var sustainability_variables = this.props.sustainability_variables_calculated
        console.log(index)
        var timeRange = JSON.parse(JSON.stringify(this.props.weap_flow[0]["timeRange"]))
        var value = index['value'][0]["calculated"]
        var svg = d3.select("#sustainability-index")
                    .append("svg")
                    .attr("id", "sustainability-index-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleTime().domain([timeRange[0], timeRange[1]]).range([0, width])
        var y = d3.scaleLinear().domain(d3.extent(value)).range([height, 0])
        console.log(x.invert(2008))
        var year = [];

        for (var i = timeRange[0]; i <= timeRange[1]; i++) {
            year.push(i);
        }
        var data = []
        for(var i = 0; i < index['value'].length; i++) {
            let data_scenario = []
            for(var j=0; j< index['value'][i]["calculated"].length; j++){
                data_scenario.push({"value": index['value'][i]["calculated"][j],"year": year[j], "scenario": index['value'][i]["name"]});
            }
            data.push(data_scenario)
        }
        console.log(data)
        svg.append("g")
            .call(d3.axisLeft(y))

        svg.append("g")
            .attr("id", "xaxis-index")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format('0')));
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 35)
            .text("Year");

        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", -70)
            .attr("y", height/2)
            .attr("transform", function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(-90, ${xRot},  ${yRot} )`})
            .text(index["index-name"]);
        for(let i=0; i<data.length; i++){
            svg.append("path")
            .datum(data[i])
            .attr("fill", "none")
            .attr("stroke", base_color[i])
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(d.value) })
            )
            svg.append("g")
                .selectAll("dot")
                .data(data[i])
                .enter()
                .append("circle")
                .attr("cx", function(d) { return x(d.year) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 5)
                .attr("fill", base_color[i])
            
            // Plot legends
            svg.append("g")
                .append("circle")
                .attr("cx", width/2-(100*data.length)/2 + 100*i )
                .attr("cy", height + margin.top + 45 )
                .attr("r", 5)
                .attr("fill", base_color[i])
            svg.append("g")
                .append("text")
                .attr("x", width/2-(100*data.length)/2 + 100*i + 15 )
                .attr("y", height + margin.top + 45 )
                .attr("text-anchor", "left")
                .attr('alignment-baseline', 'middle')
                .text(data[i][0]['scenario']);
            svg.append('polyline')
                .attr('points', String(width/2-(100*data.length)/2 + 100*i-10)+','+String(height + margin.top + 45)+' '+String(width/2-(100*data.length)/2 + 100*i+10)+','+String(height + margin.top + 45))
                .attr('stroke',base_color[i])
                .attr('stroke-width', 1)
                .attr("stroke-opacity", 1)
                .attr('fill', 'none')
        }        
        

        var focus = svg.append("g")
        .attr("class", "sustainability-index-focus")
        // .style("display","none")
        
        // focus.append("line")
        // .attr("class", "y-hover-line hover-line")
        // .attr("x1", width)
        // .attr("x2", width);

        // focus.append("circle")
        //     .attr("r", 7.5)
        //     .attr("fill", "null")

        // focus.append("text")
        //     .attr("x", 15)
        //     .attr("dy", ".31em")
        //     .attr("background","green")


        // focus.append("rect")
        //     .attr("class", "overlay")
        //     .attr("fill", "green")
        //     .attr("opacity", 30)
        //     .attr("width", "100%")
        //     .attr("height", "100%")

        // focus.append("rect")
        //     .attr("class", "overlay")
        //     .attr("fill", "green")
        //     .attr("opacity", 0)
        //     .style("pointer-events", "all")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .on("mouseover", function() { focus.select("circle").attr("opacity", 90)})
        //     .on("mouseout", function() { focus.select("circle").attr("opacity", 0); focus.select("text").selectAll("tspan").remove(); focus.selectAll("#dash-line-index").remove()})
        //     .on("mousemove", mousemove);

        function mousemove() {
            var x0 = d3.mouse(this)
            console.log(x0)
            //     i = bisectDate(data, x0, 1),
            //     d0 = data[i - 1],
            //     d1 = data[i],
            //     d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            let min_dist = 1000
            let nearest_year = 2008
            let nearest_value = 0
            data.forEach(d=>{
                if(Math.abs(x0[0]-x(d["year"]))<min_dist){
                    console.log(d["year"], min_dist)
                    min_dist = Math.abs(x0[0]-x(d["year"]))
                    nearest_year = d["year"]
                    nearest_value = d["value"]
                }
            })
            console.log(nearest_year)
            let variables = [...new Set(index["index-function"].match(/[A-Za-z]([_A-Za-z0-9]+)/g))].sort()
            console.log(variables)
            focus.select("circle").attr("stroke", "grey").attr("fill", base_color).attr("transform", "translate(" + x(nearest_year) + "," + y(nearest_value) + ")");
            focus.select("text").selectAll("tspan").remove()
            focus.selectAll("#dash-line-index").remove()
            var x_text_anchor = x(nearest_year)>width/2? "end": "start"
            var x_text_location = x(nearest_year)>width/2? -15:15
            var delta_y = y(nearest_value)>height/2? -(variables.length+1)*15:0
            focus.select("text").append("tspan").attr("text-anchor", x_text_anchor).attr("x", x_text_location).attr("dy", 15).text(index["index-name"]+": "+nearest_value.toFixed(2))
            variables.forEach(v=>{
                sustainability_variables.forEach(sustainability_v=>{
                    if(sustainability_v["name"]===v){
                        console.log(sustainability_v)
                        focus.select("text")
                                .append("tspan")
                                .attr("text-anchor", x_text_anchor)
                                .attr("x", x_text_location).attr("dy", 15)
                                .text(sustainability_v["name"]+": "+ sustainability_v["node"]["value"][0]['calculated'][year.indexOf(nearest_year)].toFixed(2))
                    }
                })
            })
            
            focus.select("text").attr("transform", "translate(" + x(nearest_year) + "," + (y(nearest_value) + delta_y) + ")").attr("text");
            focus.append("path").attr("id", "dash-line-index").attr("d", "M"+x(nearest_year)+" "+height+"L"+x(nearest_year)+" "+y(nearest_value)).attr("stroke", "grey").attr("stroke-dasharray", "10,10")
            // focus.select("text").text(function() { return d.value; });
            // focus.select(".x-hover-line").attr("y2", height - y(d.value));
            // focus.select(".y-hover-line").attr("x2", width + width);
        }
    
    }

    
    initVariableCanvas(variable, base_color){

        var margin = {top: 10, right: 30, bottom: 60, left: 80},
        width = 490 - margin.left - margin.right,
        height = 235 - margin.top - margin.bottom;
        console.log(variable)
        var timeRange = JSON.parse(JSON.stringify(this.props.weap_flow[0]["timeRange"]))
        var value = variable["node"]["value"][0]["calculated"]
        var svg = d3.select("#sustainability-index")
                    .append("svg")
                    .attr("id", "sustainability-variable-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleTime().domain([timeRange[0], timeRange[1]]).range([0, width])
        var y = d3.scaleLinear().domain(d3.extent(value)).range([height, 0])
        var year = [];

        for (var i = timeRange[0]; i <= timeRange[1]; i++) {
            year.push(i);
        }
        var data = []
        for(var i = 0; i < variable["node"]["value"].length; i++) {
            let data_scenario = []
            for(var j = 0; j < variable["node"]["value"][i]["calculated"].length; j++) {
                data_scenario.push({"value": variable["node"]["value"][i]["calculated"][j],"year": year[j], "scenario": variable["node"]["value"][i]["name"]});
            }
            data.push(data_scenario)
        }
        console.log(data)
        svg.append("g")
            .call(d3.axisLeft(y))

        svg.append("g")
            .attr("id", "xaxis-index")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format('0')));
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 35)
            .text("Year");

        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", -70)
            .attr("y", height/2)
            .attr("transform", function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(-90, ${xRot},  ${yRot} )`})
            .text(variable["name"]);
        for(let i=0; i<data.length; i++){
            svg.append("path")
                .datum(data[i])
                .attr("fill", "none")
                .attr("stroke", base_color[i])
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(function(d) { return x(d.year) })
                .y(function(d) { return y(d.value) })
                )
            svg.append("g")
                .selectAll("dot")
                .data(data[i])
                .enter()
                .append("circle")
                .attr("cx", function(d) { return x(d.year) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 5)
                .attr("fill", base_color[i])
            
            // Plot legends
            svg.append("g")
                .append("circle")
                .attr("cx", width/2-(100*data.length)/2 + 100*i )
                .attr("cy", height + margin.top + 45 )
                .attr("r", 5)
                .attr("fill", base_color[i])
            svg.append("g")
                .append("text")
                .attr("x", width/2-(100*data.length)/2 + 100*i + 15 )
                .attr("y", height + margin.top + 45 )
                .attr("text-anchor", "left")
                .attr('alignment-baseline', 'middle')
                .text(data[i][0]['scenario']);
            svg.append('polyline')
                .attr('points', String(width/2-(100*data.length)/2 + 100*i-10)+','+String(height + margin.top + 45)+' '+String(width/2-(100*data.length)/2 + 100*i+10)+','+String(height + margin.top + 45))
                .attr('stroke',base_color[i])
                .attr('stroke-width', 1)
                .attr("stroke-opacity", 1)
                .attr('fill', 'none')
        }
    }

    handleChange(element){
        console.log(element)
        
        this.setState({
            index_to_show: element
        })
        // let  sustainability_variables_calculated = JSON.parse(JSON.stringify(this.props.sustainability_variables_calculated))
        // let  sustainability_index_calculated = JSON.parse(JSON.stringify(this.state.sustainability_index_calculated))
        // sustainability_variables_calculated.forEach(sustainability_variable=>{
        //     if(sustainability_variable["name"]==element){
        //         index_to_show
        //     }
        // })
    }

    render() {
        let index_to_show = ''
        let sustainability_variables_calculated = JSON.parse(JSON.stringify(this.props.sustainability_variables_calculated))
        let sustainability_index_calculated = JSON.parse(JSON.stringify(this.state.sustainability_index_calculated))
        for(let i=0; i<sustainability_variables_calculated.length;i++){
            if(sustainability_variables_calculated[i]["name"]===this.state.index_to_show){
                index_to_show = "Variable: " + sustainability_variables_calculated[i]["name"]
            }
        }
        for(let i=0; i<sustainability_index_calculated.length;i++){
            if(sustainability_index_calculated[i]["index-name"]===this.state.index_to_show){
                index_to_show = "Index: " + sustainability_index_calculated[i]["index-name"] + " = " + sustainability_index_calculated[i]["index-function"]
            }
        }
        console.log(sustainability_variables_calculated, sustainability_index_calculated)
        let height = 368
        if(sustainability_variables_calculated.length>0 && sustainability_index_calculated.length>0){
            return (
                <div>
                    
                    {/* <Tabs type="card" tabPosition="top">
                        <TabPane tab="Sustainability Index" key="0" >
                            <Card
                                title="Index"
                                    style={{
                                    height: height,
                                    flex: 0,
                                    marginTop: 0,
                                    overflow: 'auto',
                            }}>
                                Index
                            </Card>
                        </TabPane>
    
                        <TabPane tab="Sustainability Variable" key="1" >
                            <Card
                                title="Variable"
                                    style={{
                                    height: height,
                                    flex: 0,
                                    marginTop: 0,
                                    overflow: 'auto',
                            }}>
                                Variable
                            </Card>
                        </TabPane>
                    </Tabs> */}
                <Card
                    title="Sustainability Index"
                    extra={<Select defaultValue={sustainability_index_calculated[0]["index-name"]} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                            <OptGroup label="Index">
                                {sustainability_index_calculated.map(sustainability_index=>{
                                    return <Option value={sustainability_index["index-name"]}>{sustainability_index["index-name"]}</Option>  
                                })}
                            </OptGroup>
                            <OptGroup label="Variable">
                                {sustainability_variables_calculated.map(sustainability_variable=>{
                                    return <Option value={sustainability_variable["name"]}>{sustainability_variable["name"]}</Option>  
                                })}
                            </OptGroup>
                            </Select>
                            }
                    style={{
                    height: height,
                    flex: 0,
                    marginTop: 10,
                    overflow: 'auto',
                }}>
                   <div id="sustainability-index">
                        <div>{index_to_show}</div>            
                    </div>
                </Card>
                    
                </div>
            );
        }
        else{
            return  <Card
                        title="Sustainability Index"      
                        style={{
                        height: height,
                        flex: 0,
                        marginTop: 10,
                        overflow: 'auto',
                    }}>
                        <Empty
                        style={{marginTop: '20%'}}
                        description={<span>Please Create Sustainability Index</span>}/>
                    </Card>
            
        }
        
    }
}


export default Sustainability_Index_Explorer;