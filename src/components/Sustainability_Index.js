import React, { Component } from 'react';
import * as d3 from 'd3'
import { selectAll, values } from 'd3';
import {Form, InputNumber, Button, Row, Col, Modal} from 'antd';
import Variables_Radial_Tree from './Variables_Radial_Tree'

class Sustainability_Index extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
          sustainability_variables: this.props.sustainability_variables,
          sustainability_index:this.props.sustainability_index,
          Sustainability_Creation_Modal: false
        }
      }

    componentDidMount(){
        console.log("Plot Sustainability_Index")
        let base_color = ["#8dd3c7", "#fcdf03", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
        
        // d3.selectAll("#index-plot")
        // .remove()
        for(var i=0; i<this.state.sustainability_index.length; i++){
            this.updateCanvas(this.state.sustainability_index[i], base_color[i])
        }
       

    }

    updateCanvas(index, base_color){
        var margin = {top: 10, right: 30, bottom: 60, left: 80},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        var value = index["value"]
        var svg = d3.select("#sustainability-index")
                    .append("svg")
                    .attr("id", "index-plot")
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
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));    
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 35)
            .text("Year");

        svg.append("text")
            .attr("class", "y label")
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
    }

    render() { 
        return ( 
            <Row
                style={{height: 800}}
            >

                <Col
                    span={25}
                    style={{height: '100%'}}
                >
                    <div id="sustainability-index">
                    
                    </div>
                </Col>
            </Row>
            
         );
    }
}
 
export default Sustainability_Index;