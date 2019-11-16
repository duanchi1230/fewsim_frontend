import React, { Component } from 'react';
import { Divider, Tree} from 'antd';
import * as d3 from 'd3'
const {TreeNode} = Tree;
class Variables_Radial_Tree extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          variables:[]
        }
      }

    componentDidMount(){
        fetch('/inputs/tree').then(data => data.json()).then((data)=>{console.log(data); this.updateCanvas(data['weap-variables'][0]); this.setState({variables: [data['weap-variables'][0],data['leap-variables'][0]]})}); 
    }

    updateCanvas(data){
        console.log(data);
        const width = 932;
        const radius = width/2;
        const tree = d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
        const root = tree(d3.hierarchy(data));
        // .sort((a, b) => d3.ascending(a.data.name, b.data.name)))
        console.log(root);
        const svg = d3.select('#variables-radial-tree')
                        .append('svg')
                        .attr('id', 'svg1')
                        .attr('width', 1000)
                        .attr('height', 1200)
                        .style("max-width", "100%")
                        .style("font", "10px sans-serif")
                        .style("margin", "5px")
        const link = svg.append("g")
                        .attr("fill", "none")
                        .attr("stroke", "#555")
                        .attr("stroke-opacity", 0.4)
                        .attr("stroke-width", 1.5)
                        .selectAll("path")
                        .data(root.links())
                        .join("path")
                        .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(d => d.y));
        const node = svg.append("g")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-width", 3)
                        .selectAll("g")
                        .data(root.descendants().reverse())
                        .join("g")
                        .attr("transform", d => `
                          rotate(${d.x * 180 / Math.PI - 90})
                          translate(${d.y},0)`);
        node.append("circle")
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);
        svg.attr("viewBox", [-580, -500, 1200, 1200]);
        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");
            }
    plotVariableTree(data){
        console.log(data)
        // data.map(d=>console.log(d))
        return  data.map(v => {
                        if (Object.keys(v).includes('children')){
                            return (<TreeNode title={v.name} key={v.name}>
                                        {this.plotVariableTree(v.children)}
                                    </TreeNode>
                                
                            );}
                        else{
                            return (<TreeNode
                                title={v.name}
                                key={v.name}
                            />);}
                        }
                        )
    }
    render() { 
        var fake_data = {
            "name": "A1",
            "children": [
                {
                "name": "B1",
                "children": [
                  {
                    "name": "C1",
                    "value": 100
                  },
                  {
                    "name": "C2",
                    "value": 300
                  },
                  {
                    "name": "C3",
                    "value": 200,
                    "children": [
                        {
                            "name": "D1",
                            "value": 100
                        }
                    ]
                  }
                ]
                },
                {
                    "name": "B2",
                    "value": 200
                  }
                ]
            }
        return ( 

            <div id='variables-radial-tree'> </div>
            
         );
    }
}
 
export default Variables_Radial_Tree;