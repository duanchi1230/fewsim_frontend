import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';

// This module is for the WEAP Line Graph Panel

class WEAP_Result_Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidUpdate(){
        console.log(this.props.weap_result_variable)
        let base_color = ["#8dd3c7", "#fcdf03", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
        this.initVariableCanvas(this.props.weap_result_variable, base_color)
    }

    initVariableCanvas(weap_result_variable, base_color){

        var margin = {top: 10, right: 30, bottom: 80, left: 80},
        width = 1000 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;
        
        console.log(weap_result_variable)
        var value = []
        weap_result_variable.forEach(variable => {
            variable.value.forEach(v=>{
                value.push(v)
            })
        });
        let simulation_time_range = JSON.parse(JSON.stringify(this.props.simulation_time_range))

        d3.selectAll("#weap-result-graph-plot")
            .remove()
           
            
        var svg = d3.select("#weap-result-graph")
                    .append("svg")
                    .attr("id", "weap-result-graph-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleTime().domain(simulation_time_range).range([0, width])
        var y = d3.scaleLinear().domain(d3.extent(value)).range([height, 0])
        console.log(x.invert(2008))
        var year = [];

        for (var i = simulation_time_range[0]; i <= simulation_time_range[1]; i++) {
            year.push(i);
        }
        var data = []
        for(var i = 0; i < weap_result_variable.length; i++) {
            let data_scenario = []
            for(var j = 0; j < weap_result_variable[i]['value'].length; j++) {
                data_scenario.push({"value": weap_result_variable[i]['value'][j], "year": year[j], "scenario":weap_result_variable[i]['scenario']});
            }
            data.push(data_scenario);
        }
        console.log(weap_result_variable[0]["name"])
        svg.append("g")
            .call(d3.axisLeft(y))

        svg.append("g")
            .attr("id", "xaxis-weap-graph")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format('0')));

        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 35)
            .text("Year");

        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", 0)
            .text(weap_result_variable[0]["name"]);

        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", -70)
            .attr("y", height/2)
            .attr("transform", function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(-90, ${xRot},  ${yRot} )`})
            .text("Flow[M^3]");

        var lengend_space = -50
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
           
            svg.append("g")
                .append("circle")
                .attr("cx", lengend_space )
                .attr("cy", height + margin.top + 45 )
                .attr("r", 5)
                .attr("fill", base_color[i])
            svg.append("g")
                .append("text")
                .attr("x", lengend_space + 10 )
                .attr("y", height + margin.top + 45 )
                .attr("text-anchor", "left")
                .attr('alignment-baseline', 'middle')
                .text(data[i][0]['scenario']);
            // svg.append('polyline')
            //     .attr('points', String(width/2-(lengend_space*data.length)/2 + lengend_space*i-10)+','+String(height + margin.top + 45)+' '+String(width/2-(lengend_space*data.length)/2 + lengend_space*i+10)+','+String(height + margin.top + 45))
            //     .attr('stroke',base_color[i])
            //     .attr('stroke-width', 1)
            //     .attr("stroke-opacity", 1)
            //     .attr('fill', 'none')
            lengend_space = lengend_space + (data[i][0]['scenario'].length) * 6.5 + 35
        }
            

        // var focus = svg.append("g")
        // .attr("class", "sustainability-index-focus")
        // // .style("display","none")
        
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


        // // focus.append("rect")
        // //     .attr("class", "overlay")
        // //     .attr("fill", "green")
        // //     .attr("opacity", 30)
        // //     .attr("width", "100%")
        // //     .attr("height", "100%")

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

        // function mousemove() {
        //     var x0 = d3.mouse(this)
        //     console.log(x0)
        //     //     i = bisectDate(data, x0, 1),
        //     //     d0 = data[i - 1],
        //     //     d1 = data[i],
        //     //     d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        //     let min_dist = 1000
        //     let nearest_year = 2008
        //     let nearest_value = 0
        //     data.forEach(d=>{
        //         if(Math.abs(x0[0]-x(d["year"]))<min_dist){
        //             console.log(d["year"], min_dist)
        //             min_dist = Math.abs(x0[0]-x(d["year"]))
        //             nearest_year = d["year"]
        //             nearest_value = d["value"]
        //         }
        //     })
        //     console.log(nearest_year)
        //     let variables = [...new Set(index["index-function"].match(/[A-Za-z]([_A-Za-z0-9]+)/g))].sort()
        //     console.log(variables)
        //     focus.select("circle").attr("stroke", "grey").attr("fill", base_color).attr("transform", "translate(" + x(nearest_year) + "," + y(nearest_value) + ")");
        //     focus.select("text").selectAll("tspan").remove()
        //     focus.selectAll("#dash-line-index").remove()
        //     var x_text_anchor = x(nearest_year)>width/2? "end": "start"
        //     var x_text_location = x(nearest_year)>width/2? -15:15
        //     var delta_y = y(nearest_value)>height/2? -(variables.length+1)*15:0
        //     focus.select("text").append("tspan").attr("text-anchor", x_text_anchor).attr("x", x_text_location).attr("dy", 15).text(index["index-name"]+": "+nearest_value.toFixed(2))
        //     variables.forEach(v=>{
        //         sustainability_variables.forEach(sustainability_v=>{
        //             if(sustainability_v["name"]===v){
        //                 focus.select("text")
        //                         .append("tspan")
        //                         .attr("text-anchor", x_text_anchor)
        //                         .attr("x", x_text_location).attr("dy", 15)
        //                         .text(sustainability_v["name"]+": "+ sustainability_v["node"]["value"][year.indexOf(nearest_year)].toFixed(2))
        //             }
        //         })
        //     })
            
        //     focus.select("text").attr("transform", "translate(" + x(nearest_year) + "," + (y(nearest_value) + delta_y) + ")").attr("text");
        //     focus.append("path").attr("id", "dash-line-index").attr("d", "M"+x(nearest_year)+" "+height+"L"+x(nearest_year)+" "+y(nearest_value)).attr("stroke", "grey").attr("stroke-dasharray", "10,10")
        //     // focus.select("text").text(function() { return d.value; });
        //     // focus.select(".x-hover-line").attr("y2", height - y(d.value));
        //     // focus.select(".y-hover-line").attr("x2", width + width);
        // }
    
    }

    render() {
        return (
            <div>
                <div id="weap-result-graph"></div>
            </div>
            
        );
    }
}

export default WEAP_Result_Graph;