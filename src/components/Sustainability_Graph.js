import React, { Component } from 'react';
import {Form, InputNumber, Button, Row, Col, Modal, Icon, Radio, Input, Card} from 'antd'
import * as d3 from 'd3';
import Chart from 'chart.js';

class Sustainability_Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    

    render() {
        console.log(this.props.scenario_in_summary)
        if (this.props.scenario_in_summary==="Base"){
            return (
                <Card style={{
                                height:150,
                                flex: 0,
                                marginTop: 0,
                                overflow: 'auto',
                        }}>
            Please select Scenario
        </Card>
            )
        }else{
            return (
            <SI_Graph filtered_node={this.props.filtered_node} 
                        sustainability_index_link={this.props.sustainability_index_link}>

            </SI_Graph>
        );}
        
    }
}

class SI_Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    componentDidMount() {

        const width = 450
        const height = 320
        const svg = d3.select("#sustainability-graph")
                      .append("svg")
                      
                      .attr("height", height)
                      .attr("width", width)
                      .attr("viewBox", [-width / 2, -height / 2, width, height])
                    //   .append("g")
                      
                      .call(d3.zoom()
                      .scaleExtent([0.3, 8])
                      .on("zoom", function(){svg.attr("transform", d3.event.transform)}))
                      .append("g")
                      .attr("id", "sustainability-graph-svg")

                    //   .on("zoom", zoomed));

        // function zoomed({transform}) {
        //     g.attr("transform", transform);
        //     }
            
        this.setState({
            
        })
    }

    mapIndexColor(name){
      let splited_name = name.split(' ')
      let color_type = "mpm-output"
      let weap_keys = ["Groundwater", "CAP", "Water"]
      let leap_keys = ["Renewable", "Electricity"]
      
      weap_keys.forEach(w_key=>{
          if(splited_name.includes(w_key) ){
              color_type = "weap-output"
          }
      })
      leap_keys.forEach(l_key=>{
          if(splited_name.includes(l_key) ){
              color_type = "leap-output"
          }
      })
      return color_type
    }

    componentDidUpdate(){
        
        // console.log(this.state.graph)
        // const bin_index = this.state.graph["index-value"]
        // console.log(bin_index)
        // var ctx = document.getElementById("bar-chart").getContext('2d');
        // var dataValues = bin_index["quantity"];
        // var dataLabels = bin_index["bin"];
        // // console.log(dataLabels[dataLabels.length-2])
        // var myChart = new Chart(ctx, {
        //   type: 'bar',
        //   data: {
        //     labels: dataLabels,
        //     datasets: [{
        //       label: 'Quantity in Log Scale',
        //       data: dataValues,
        //       backgroundColor: '#abd9e9',
        //     }]
        //   },
        //   options: {
        //     scales: {
        //       xAxes: [{
        //         display: false,
        //         barPercentage: 1.25,
        //         ticks: {
        //           max: dataLabels[dataLabels.length-2],
        //         }
        //       }, {
        //         display: true,
        //         ticks: {
        //           autoSkip: false,
        //           max: dataLabels[dataLabels.length-1],
        //         }
        //       }, 
        //     ],
        //       yAxes: [{
        //         ticks: {
        //           beginAtZero:true
        //         }
        //       }]
        //     },
        //     onClick: this.onClick.bind(this)
        //   }
        // });
        
        ////////////////////////////////////////////////
    
        const links = this.props.sustainability_index_link
        const nodes = this.props.filtered_node
        let unique_node = []
        let filtered_nodes = nodes
        let filtered_links = []
        let threshold = this.state.inputValue
        nodes.forEach(n=>{

            if(unique_node.includes(n["id"]===true)){
                unique_node.push(n["id"])
            }
            unique_node.push(JSON.parse(JSON.stringify(n["id"])))
        })
        console.log(filtered_links)
        filtered_links = JSON.parse(JSON.stringify(links.filter(l=> unique_node.includes(l["source"]))))

        console.log(filtered_links, filtered_nodes, unique_node)
        // links.forEach(l=>{
        //   // console.log(l["target"])
        //   // console.log(unique_node.includes(l["target"])===false)
        //   if(Math.abs(l["value"])>=threshold){
        //     filtered_links.push(JSON.parse(JSON.stringify(l)))
        //     if(unique_node.includes(l["source"])===false){
        //       unique_node.push(JSON.parse(JSON.stringify(l["source"])))
        //     }
        //     if(unique_node.includes(l["target"])===false){
        //       unique_node.push(JSON.parse(JSON.stringify(l["target"])))
        //   }
          
        //   }
        // })
        // nodes.forEach(node=>{
        //   if(unique_node.includes(node["id"])===true){
        //     filtered_nodes.push(JSON.parse(JSON.stringify(node)))
        //   }
        // })
        // console.log(links, nodes, unique_node,filtered_nodes,filtered_links)
        const color = {"weap-input":"#e0f3f8", "weap-output":"#74add1", "leap-input": "#fee090", "leap-output": "#fdae61", "mpm-input":"#c7e9c0", "mpm-output": "#41ab5d", "sustainability-index": "#d9d9d9"}
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
        const svg = d3.select("#sustainability-graph-svg")

        
        const link = svg.selectAll("#sustainability-graph-link")
                        .remove()
                        .exit()
                        .data(filtered_links)
                        .enter()
                        // .append("g")
                        .append("line")
                        .attr("id", "sustainability-graph-link")
                        .attr("stroke", "#999")
                        .attr("stroke-opacity", 0.6)
                        .attr("id", "sustainability-graph-link")
                        .attr("stroke-width", 1);
        // console.log(filtered_nodes, this.props.checked_variables_on_sensitivity_graph, this.state.graph)
     
        const node = svg.selectAll("#sustainability-graph-node")
                        .remove()
                        .exit()
                        .data(filtered_nodes)
                        .enter()
                        .append("circle")
                        .attr("id", "sustainability-graph-node")
                        .attr("r", d=>{if(d.group==="sustainability-index"){return 7}else{return 5} })
                        .attr("stroke", d=>{if(d.group==="sustainability-index"){ return color[this.mapIndexColor(d.id)] }else{return ""}})
                        .attr("stroke-width", 2)
                        .attr("fill", d=> color[d["group"]])
                        .call(this.drag(simulation))
                        // .on('click', d=> this.props.clickSensitivityGraphNode(d));

        let i = 0
        Object.entries(color).forEach((value)=>{
          // console.log(value)
          svg.append("g")
            .append("circle")
            .attr("id", "sustainability-graph-node")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", 5)
            .attr("id", "sustainability-graph-node")
            .attr("fill", value[1])
            .attr("cx", -235)
            .attr("cy", -235+i);
          svg.append("g")
            .append("text")
            .attr("id", "sustainability-graph-node")
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
            .attr("cy", d => d.y)
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
      
    render() {
        return (
            <div>
                <Card style={{
                        height:380,
                        flex: 0,
                        marginTop: 0,
                        overflow: 'auto',
                }}>
                    <div id="sustainability-graph">
                    
                    </div>
                </Card>
            </div>
        );
    }
}



export default Sustainability_Graph;