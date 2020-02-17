import React, { Component } from 'react';
import * as d3 from 'd3'
import { selectAll, values } from 'd3';
import {Form, InputNumber, Button, Row, Col, Modal, Empty, Card,Divider, Icon, Input, Tree} from 'antd';
import Variables_Radial_Tree from './Variables_Radial_Tree'
const InputGroup = Input.Group;
const {TreeNode} = Tree;
const ButtonGroup = Button.Group;
class Sustainability_Index extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
          sustainability_variables: this.props.sustainability_variables,
          sustainability_index:this.props.sustainability_index,
          Sustainability_Creation_Modal: false,
          display: "Sustainability Index"
        }
      }

    componentDidMount(){
        console.log("Plot Sustainability_Index")
        let base_color = ["#8dd3c7", "#fcdf03", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]

        console.log(this.state.sustainability_index)
        console.log(this.state.sustainability_variables)
        // d3.selectAll("#index-plot")
        // .remove()
        for(var i=0; i<this.state.sustainability_index.length; i++){
            this.initIndexCanvas(this.state.sustainability_index[i], base_color[i])
        }
    }

    componentDidUpdate(){
        let base_color = ["#8dd3c7", "#fcdf03", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]

        d3.selectAll('#sustainability-variable-plot')
            .remove()
        d3.selectAll('#sustainability-index-plot')
            .remove()

        if(this.state.display==="Sustainability Index"){
            for(var i=0; i<this.state.sustainability_index.length; i++){
                this.initIndexCanvas(this.state.sustainability_index[i], base_color[i])
            }
        }

        if(this.state.display==="Sustainability Variable"){
            for(var i=0; i<this.state.sustainability_index.length; i++){
                this.initVariableCanvas(this.state.sustainability_variables[i], base_color[i])
            }
        }
        
    }

    initIndexCanvas(index, base_color){

        var margin = {top: 10, right: 30, bottom: 60, left: 80},
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;
        var sustainability_variables = this.state.sustainability_variables
        console.log(index)
        var value = index["value"]
        var svg = d3.select("#sustainability-index")
                    .append("svg")
                    .attr("id", "sustainability-index-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleTime().domain([2008, 2018]).range([0, width])
        var y = d3.scaleLinear().domain(d3.extent(value)).range([height, 0])
        console.log(x.invert(2008))
        var year = [];

        for (var i = 2008; i <= 2018; i++) {
            year.push(i);
        }
        var data = []
        for(var i = 0; i < value.length; i++) {
            data.push({"value": value[i],"year": year[i]});
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

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", base_color)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(d.value) })
            )
        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.year) } )
            .attr("cy", function(d) { return y(d.value) } )
            .attr("r", 5)
            .attr("fill", base_color)

        var focus = svg.append("g")
        .attr("class", "sustainability-index-focus")
        // .style("display","none")
        
        focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5)
            .attr("fill", "null")

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em")
            .attr("background","green")


        // focus.append("rect")
        //     .attr("class", "overlay")
        //     .attr("fill", "green")
        //     .attr("opacity", 30)
        //     .attr("width", "100%")
        //     .attr("height", "100%")

        focus.append("rect")
            .attr("class", "overlay")
            .attr("fill", "green")
            .attr("opacity", 0)
            .style("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.select("circle").attr("opacity", 90)})
            .on("mouseout", function() { focus.select("circle").attr("opacity", 0); focus.select("text").selectAll("tspan").remove(); focus.selectAll("#dash-line-index").remove()})
            .on("mousemove", mousemove);

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
                        focus.select("text")
                                .append("tspan")
                                .attr("text-anchor", x_text_anchor)
                                .attr("x", x_text_location).attr("dy", 15)
                                .text(sustainability_v["name"]+": "+ sustainability_v["node"]["value"][year.indexOf(nearest_year)].toFixed(2))
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
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;
        console.log(variable)
        var value = variable["node"]["value"]
        var svg = d3.select("#sustainability-index")
                    .append("svg")
                    .attr("id", "sustainability-variable-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var x = d3.scaleTime().domain([2008, 2018]).range([0, width])
        var y = d3.scaleLinear().domain(d3.extent(value)).range([height, 0])
        var year = [];

        for (var i = 2008; i <= 2018; i++) {
            year.push(i);
        }
        var data = []
        for(var i = 0; i < value.length; i++) {
            data.push({"value": value[i],"year": year[i]});
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

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", base_color)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.value) })
            )
        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.year) } )
            .attr("cy", function(d) { return y(d.value) } )
            .attr("r", 5)
            .attr("fill", base_color)
    }

    showVariablePlot(){
        console.log("clicked")
        this.setState({display: "Sustainability Variable"})
    }

    showIndexPlot(){
        this.setState({display: "Sustainability Index"})
    }

    render() { 
        if (this.state.sustainability_index.length === 0) {
            return (
                    <Empty
                    style={{marginTop: '20%', height: 1200}}
                    description={<span>Please Create Sustainability Index</span>}/>
            );
        }
        return ( 
            <Row
                style={{height: '100%'}}
            >
                
                <Col
                    span={7}
                    style={{height: 3000, marginRight: 35}}
                >
                    <div>
                        <Card title="Sustainability Variables">
                            <InputGroup size="large">
                            {/* {this.state.sustainability_variables.map(d=>{return <div onClick={this.variableList.bind(this.innerHTML)}>{d.name}={d.variable}</div>})} */}
                            <ButtonGroup>
                                {this.state.sustainability_variables.map(v=>{
                                    return <Row gutter={8}><Col span={21}><div class="tooltip"><Button id={v["variable"]}>{v["name"]+"="+v["variable"].substring(0, 60)}</Button> <span class="tooltiptext">{v["variable"]}</span></div></Col></Row>})}
                            </ButtonGroup>
                            <Button type="dashed" onClick={this.showVariablePlot.bind(this)} style={{ width: '60%' }}>
                            <Icon type="line-chart" /> Show Variables Plots
                            </Button> 
                            </InputGroup>
                        </Card>
                        
                        <Card title="Sustainability Index Function">
                        {this.state.sustainability_index.map(d=>{return <div>{d["index-name"]}={d["index-function"]}</div>})}
                            {/* <Row gutter={8}>
                                <Col span={8}>
                                <Input id="index-name" defaultValue="" value={this.state.index_input["index-name"]} onChange={this.handleChange_Index.bind(this)} addonBefore="index" />
                                </Col>
                                <Col span={15}>
                                <Input id="index-function" defaultValue="" value={this.state.index_input["index-function"]} onChange={this.handleChange_Index.bind(this)} addonBefore="function" disabled={false}/>
                                </Col>
                            </Row> */}
                            <Button type="dashed" onClick={this.showIndexPlot.bind(this)} style={{ width: '60%' }}>
                            <Icon type="line-chart" /> Show Indexes Plots
                            </Button>
                        </Card>
                    </div>
                </Col>
                <Col
                    span={15}
                    style={{height: '100%'}}
                >
                    <b>{this.state.display}</b>
                    <div id="sustainability-index">
                            
                    </div>
                </Col>
            </Row>
            
         );
    }
}
 
export default Sustainability_Index;