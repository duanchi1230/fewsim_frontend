
// import './App.css';
import React, { Component } from 'react';
import { Button , Collapse , Card, Col, Divider, Icon, Input,notification, Row, Slider, Tree, InputNumber} from 'antd';
import * as d3 from 'd3';
import Chart from 'chart.js';
import { transpileModule } from 'typescript';

const { Panel } = Collapse;
class Sensitivity_Graph extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            graph: JSON.parse(JSON.stringify(this.props.sensitivity_graph)),
            inputValue: 0
        };
      }
    
      componentDidMount(){
        const width = 650
        const height = 650
        const svg = d3.select("#sensitivity-graph")
                      .append("svg")
                      .attr("id", "sensitivity-graph-svg")
                      .attr("height", height)
                      .attr("width", width)
                      .attr("viewBox", [-width / 2, -height / 2, width, height])
                      .call(d3.zoom()
                      .scaleExtent([0.3, 8])
                      .on("zoom", function(){svg.attr("transform", d3.event.transform)}));  
        
      }
    
      drag = simulation => {
      
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      }
    
      componentDidUpdate(){
        
        console.log(this.state.graph)
        const bin_index = this.state.graph["index-value"]
        console.log(bin_index)
        var ctx = document.getElementById("bar-chart").getContext('2d');
        var dataValues = bin_index["quantity"];
        var dataLabels = bin_index["bin"];
        // console.log(dataLabels[dataLabels.length-2])
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dataLabels,
            datasets: [{
              label: 'Quantity in Log Scale',
              data: dataValues,
              backgroundColor: '#abd9e9',
            }]
          },
          options: {
            scales: {
              xAxes: [{
                display: false,
                barPercentage: 1.25,
                ticks: {
                  max: dataLabels[dataLabels.length-2],
                }
              }, {
                display: true,
                ticks: {
                  autoSkip: false,
                  max: dataLabels[dataLabels.length-1],
                }
              }, 
            ],
              yAxes: [{
                ticks: {
                  beginAtZero:true
                }
              }]
            },
            onClick: this.onClick.bind(this)
          }
        });
        
        ////////////////////////////////////////////////
    
        const links = this.state.graph["link"]
        const nodes = this.state.graph["node"]
        let unique_node = []
        let filtered_nodes = []
        let filtered_links = []
        let threshold = this.state.inputValue
        links.forEach(l=>{
          // console.log(l["target"])
          // console.log(unique_node.includes(l["target"])===false)
          if(Math.abs(l["value"])>=threshold){
            filtered_links.push(JSON.parse(JSON.stringify(l)))
            if(unique_node.includes(l["source"])===false){
              unique_node.push(JSON.parse(JSON.stringify(l["source"])))
            }
            if(unique_node.includes(l["target"])===false){
              unique_node.push(JSON.parse(JSON.stringify(l["target"])))
          }
          
          }
        })
        nodes.forEach(node=>{
          if(unique_node.includes(node["id"])===true){
            filtered_nodes.push(JSON.parse(JSON.stringify(node)))
          }
        })
        // console.log(links, nodes, unique_node,filtered_nodes,filtered_links)
        const color = {"weap-input":"#e0f3f8", "weap-output":"#74add1", "leap-input": "#fee090", "leap-output": "#fdae61", "mpm-input":"#c7e9c0", "mpm-output": "#41ab5d"}
        const simulation = d3.forceSimulation(filtered_nodes)
          .force("link", d3.forceLink(filtered_links).id(d => d.id))
          .force("charge", d3.forceManyBody())
          .force("x", d3.forceX())
          .force("y", d3.forceY());
    
        // d3.selectAll("#sensitivity-graph-link")
        //   .remove()
        // d3.selectAll("#sensitivity-graph-node")
        //   .remove()
        const width = 680
        const height = 680
        const svg = d3.select("#sensitivity-graph-svg")
        const link = svg.selectAll("#sensitivity-graph-link")
                        .remove()
                        .exit()
                        .data(filtered_links)
                        .enter()
                        .append("g")
                        .append("line")
                        .attr("id", "sensitivity-graph-link")
                        .attr("stroke", "#999")
                        .attr("stroke-opacity", 0.6)
                        .attr("id", "sensitivity-graph-link")
                        .attr("stroke-width", 1);
        console.log(filtered_nodes, this.props.checked_variables_on_sensitivity_graph, this.state.graph)
     
        const node = svg.selectAll("#sensitivity-graph-node")
                        .remove()
                        .exit()
                        .data(filtered_nodes)
                        .enter()
                        .append("circle")
                        .attr("id", "sensitivity-graph-node")
                        .attr("r", 5)
                        .attr("stroke", node=>{ if(node["group"]==="weap-input"){
                                                        if(this.props.weap_checked_variables_on_sensitivity_graph.includes(node["id"])===true){ return "#1b7837"}
                                                        else{return "#fff"}
                                                    }
                                                if(node["group"]==="leap-input"){
                                                    if(this.props.leap_checked_variables_on_sensitivity_graph.includes(node["id"])===true){return "#1b7837"}
                                                    else{return "#fff"}
                                                    }
                                                })
                        .attr("stroke-width", 1.5)
                        .attr("fill", d=> color[d["group"]])
                        .call(this.drag(simulation))
                        .on('click', d=> this.props.clickSensitivityGraphNode(d));
        
        let i = 0
        Object.entries(color).forEach((value)=>{
          // console.log(value)
          svg.append("g")
            .append("circle")
            .attr("id", "sensitivity-graph-node")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", 5)
            .attr("id", "sensitivity-graph-node")
            .attr("fill", value[1])
            .attr("cx", -235)
            .attr("cy", -235+i);
          svg.append("g")
            .append("text")
            .attr("id", "sensitivity-graph-node")
            // .attr("dy", "0.5em")
            .attr("x", -225)
            .attr("y", -235+i)
            .attr('alignment-baseline', 'middle')
            .attr("text-anchor", "start")
            .attr("font-size", "15px")
            .text(value[0])
          i = i+ 10
        })                
        
                  
        node.append("title")
            .text(d => d.id);
        
        simulation.on("tick", () => {
          link
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);
      
          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
            });
          
          // invalidation.then(() => simulation.stop());
      }
    
      onChange = value => {
        this.setState({
          inputValue: value,
        });
      };
    
    
      onClick(event, element, value){
        console.log()
        const bin = this.state.graph["index-value"]["bin"]
        if(Boolean(element[0])===true){
            console.log(bin[element[0]._index])
            this.setState({inputValue: bin[element[0]._index]})
        }
        
      }

    //   handleGraphNodeClick(element){
    //     console.log(element)
    //   }

      render(){
        const inputValue = this.state.inputValue
        
        return (
        <div>
          <h1>Sensitivity Graph</h1>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Sensitivity Graph" key="1"> 
                <Row>
                    <canvas id="bar-chart" width="150" height="30" ></canvas>
                </Row>
                <div>
                <Row>
                    <Col span={12}>
                    <Slider
                        min={0}
                        max={1}
                        onChange={this.onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        step={0.01}
                    />
                    </Col>
                    <Col span={4}>
                    <InputNumber
                        min={0}
                        max={30}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={inputValue}
                        onChange={this.onChange}
                    />
                    </Col>
                </Row>
                </div>
                <Row>
                    <div id="sensitivity-graph">
                    
                    </div>
                </Row>
            </Panel>
          </Collapse>
        </div>
        
      );
    }
}


export default Sensitivity_Graph;