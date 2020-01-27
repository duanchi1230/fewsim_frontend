import React, { Component } from 'react';
import { Button , Card, Col, Divider, Icon, Input,notification, Row, Tree} from 'antd';
import * as d3 from 'd3'
import { selectAll } from 'd3';
import '../styles/App.css';
const InputGroup = Input.Group;
const {TreeNode} = Tree;
const ButtonGroup = Button.Group;
class Variables_Radial_Tree extends Component {
    constructor(props) {
        super(props);
        this.getSuatainabilityIndex = this.props.getSuatainabilityIndex
        this.state = {
          leaf_to_show:[],
          user_input:{"name":"", "variable": "", "node":{}},
          index_input:{"index-name":"", "index-function": "", "value":[], "node": []},
          sustainability_variables:[],
          sustainability_index:[]
          // leaf_node_not_to_hide:[]
        }
      }

    componentDidMount(){
        var ar = ['Roosevelt_ID-Alfalfa_hay']
        console.log(this.props.variables)
        const variables = JSON.parse(JSON.stringify(this.props.variables))
        this.drawCanvas(this.compressTreeLeaf(variables, this.state.leaf_to_show))

    }

    componentDidUpdate(){
      console.log(this.state.index_input)
    }

    compressTreeLeaf(data, leaf_to_show=[], depth=0){
      var new_node = []
      var leaf_node = []
      data['depth'] = depth
      depth = depth + 1; 
      data['children'].map(d=>{if(Object.keys(d).includes('value')!=true){
        new_node.push(this.compressTreeLeaf(d, leaf_to_show, depth=depth)) }else{
        if(this.state.leaf_to_show.includes(JSON.stringify(d['path']))== true){d['depth'] = depth; d['children']=[]; d['leaf_node']=[]; new_node.push(d); leaf_node.push(d)}
        else{d['depth'] = depth; d['children']=[]; d['leaf_node']=[]; leaf_node.push(d)}}}
        )
      data['children'] = new_node
      data['leaf_node'] = leaf_node
      return data
    }

    handleMouseClick(d){

      if(Object.keys(d['data']).includes("value")){
        console.log(d['data'])
        this.setState({user_input:{"name":this.state.user_input.name, "variable": d['data']["fullname"]+":"+d['data']["name"], "node": d['data']}})
      }

      else{
        var leaf_to_show =JSON.parse(JSON.stringify(this.state.leaf_to_show))
        var variables = JSON.parse(JSON.stringify(this.props.variables))
        var d_leaf = []
        var leaf = []
        d['data']['children'].map(d=>{if(Object.keys(d).includes('value')){d_leaf.push(JSON.stringify(d.path))}})

        for(var i=0; i<d['data']['leaf_node'].length; i++){
          var v = JSON.stringify(d['data']['leaf_node'][i]['path'])
          if (leaf_to_show.includes(v)==false){
          leaf_to_show.push(v);
          }  
        }
        if (d_leaf.length!=0){
          leaf_to_show.map(l => {if(d_leaf.includes(l)==false){
                leaf.push(l)
              }
            }
          )
          leaf_to_show = leaf 
        }

        this.setState({
          leaf_to_show:leaf_to_show
        })
        
        this.updateCanvas(this.compressTreeLeaf(variables, this.state.leaf_to_show))
      }

    }

    node_edge(d){
      var d_children = []
      var d_leaf = []
      // console.log(d['data'])
      d['data']['children'].map(d=>{if(Object.keys(d).includes('value')){d_children.push(JSON.stringify(d.path))}})
      d['data']['leaf_node'].map(d=>{if(Object.keys(d).includes('value')){d_leaf.push(JSON.stringify(d.path))}})
      // console.log(d_leaf.length)
      if(d_children.length == 0 && d_leaf.length != 0){
        return 1
      }
      else{return 0}
    }
    
    updateCanvas(data){
      // console.log(data)
      // console.log(this.state.leaf_to_show)
      const width = 2850;
      const radius = width/2;
      const tree = d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
      const root = tree(d3.hierarchy(data));
      const svgDoc = d3.selectAll('#radial-tree-svg')

      const link = svgDoc.select('#radial-tree-link')
                          .selectAll('#tree-link-element')
                          .remove()
                          .exit()
                          .data(root.links())
                          .enter()
                          .append('path')
                          .attr("id", "tree-link-element")
                          .attr("fill", "none")
                          .attr("stroke", "#555")
                          .transition()
                          .duration(500)
                          .attr("stroke-opacity", 0.4)
                          .attr("stroke-width", 1.5)
                          .attr("d", d3.linkRadial()
                          .angle(d => d.x)
                          .radius(d => d.y))
      const node = svgDoc.select('#radial-tree-node')
                          .selectAll('#tree-node-element')
                          .remove()
                          .exit()
                          .data(root.descendants().reverse())
                          .enter()
                          .append("g")
                          .attr("id", "tree-node-element")
                          .attr("transform", d => `
                            rotate(${d.x * 180 / Math.PI - 90})
                            translate(${d.y},0)`);
      node.append("circle")
          .attr("fill", d => {if (d.children){return "#555"} if(Object.keys(d['data']).includes("value")){return "#d95f0e"} else{return "#999"}})
          .attr("r", 2.5)
          .attr("stroke", "green")
          .attr("stroke-width", d=> this.node_edge(d))
          .on('click',d=>this.handleMouseClick(d));
                
      node.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
          .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
          .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
          .attr("font-size", "7px")
          .text(d => d.data.name)
          .clone(true).lower()
          .attr("stroke", "white");                    
    }

    drawCanvas(data){
        console.log(data);
        const width = 2850;
        const radius = width/2;
        const tree = d3.tree()
                .size([2 * Math.PI, radius])
                .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
        const root = tree(d3.hierarchy(data));
        // .sort((a, b) => d3.ascending(a.data.name, b.data.name)))
        // console.log(root);
        const svg = d3.select('#variables-radial-tree')
                        .append('svg')
                        .attr('id', 'radial-tree-svg')
                        .attr('width', 750)
                        .attr('height', 750)
                        .attr("viewBox", [-580, -500, 1200, 1200])
                        .style("max-width", "100%")
                        .style("border", "1px solid black")
                        .style("font", "10px sans-serif")
                        .style("margin", "5px")
                        .call(d3.zoom()
                        .scaleExtent([0.3, 8])
                        .on("zoom", function(){svg.attr("transform", d3.event.transform)}))
                        .append("g")

        const link = svg.append("g")
                        .attr("id", "radial-tree-link")
                        .attr("fill", "none")
                        .attr("stroke", "#4393c3")
                        .attr("stroke-opacity", 0.5)
                        .attr("stroke-width", 1.5)
                        .selectAll("path")
                        .data(root.links())
                        .join("path")
                        .attr("id", "tree-link-element")
                        .attr("d", d3.linkRadial()
                        .angle(d => d.x)
                        .radius(d => d.y))
                        
        const node = svg.append("g")
                        .attr("id", "radial-tree-node")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-width", 3)
                        .selectAll("g")
                        .data(root.descendants().reverse())
                        .join("g")
                        .attr("id", "tree-node-element")
                        .attr("transform", d => `
                          rotate(${d.x * 180 / Math.PI - 90})
                          translate(${d.y},0)`);
        node.append("circle")
            .attr("id", "tree-node-element")
            .attr("fill", d => {if (d.children){return "#555"} if(Object.keys(d['data']).includes("value")){return "#d95f0e"} else{return "#999"}})
            .attr("r", 2.5)
            .attr("stroke", "green")
            .attr("stroke-width", d=> this.node_edge(d))
            .on('click',d=>this.handleMouseClick(d));

        node.append("text")
            .attr("id", "tree-node-element")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .attr("font-size", "7px")
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

    handleChange(user_input){
      // console.log(user_input.target.id)
      // console.log(user_input.target.value)
      var input = this.state.user_input
      input[user_input.target.id] = user_input.target.value
      console.log(input)
      this.setState({user_input: input})
    }

    addVariable(){
      let sustainability_variables = this.state.sustainability_variables
      let keys = []
      let variables = []
      sustainability_variables.map(v=>{keys.push(v['name']); variables.push(v["variable"])})
      if (this.state.user_input.name !=="" && this.state.user_input.variable !=="" && keys.includes(this.state.user_input.name)!==true && variables.includes(this.state.user_input.variable)!==true && this.onlyLettersAndNumbers(this.state.user_input.name)){
        sustainability_variables.push(this.state.user_input)
        console.log(sustainability_variables)
        sustainability_variables = this.sortVariables(sustainability_variables)
        this.setState({sustainability_variables:sustainability_variables, user_input:{"name":"", "variable":"", "node":{}}})
        this.getSuatainabilityIndex(this.state.sustainability_index,sustainability_variables)
      }
      if(this.onlyLettersAndNumbers(this.state.user_input.name)!==true && this.state.user_input.name!==""){
        this.openNotification("Name should start with letters and only include letetres, underscores and numbers!", "Please rename the variable.")
      }
      if(keys.includes(this.state.user_input.name)===true && variables.includes(this.state.user_input.variable)!==true){
        this.openNotification("Name already exists!", "Please rename the variable.")
      }
      if(keys.includes(this.state.user_input.name)!==true && variables.includes(this.state.user_input.variable)===true){
        this.openNotification("Variable already exists!", "Please select another variable.")
      }
      if(keys.includes(this.state.user_input.name)===true && variables.includes(this.state.user_input.variable)===true){
        this.openNotification("Both name and variable already exist!", "Please rename and select another variable.")
      }
    
    }

    onlyLettersAndNumbers(str) {
      return Boolean(str.match(/[A-Za-z]([_A-Za-z0-9]+)/g));
    }

    sortVariables(sustainability_variables){
      let variables = []
      let keys = []
      sustainability_variables.map(v=>{keys.push(v["name"])})
      keys.sort().map(k=>{ sustainability_variables.map(v=>{if(v["name"]==k){variables.push(v)}})})
      console.log(variables)
      return variables
    }

    deleteVariable(element){
      console.log(element.target)
      let sustainability_variables = []
      let variables = this.state.sustainability_variables
      variables.map(v=>{if(v["name"]!=element.target.id){
        sustainability_variables.push(v)
      }})
      console.log(sustainability_variables)
      this.setState({sustainability_variables:sustainability_variables})
      this.getSuatainabilityIndex(this.state.sustainability_index,sustainability_variables)
    }

    variableList(id){
      console.log(id.target.textContent)
    }

    handleChange_Index(index_input){
      let input = this.state.index_input
      input[index_input.target.id] = index_input.target.value
      this.setState({index_input: input})
    }

    addIndex(){
      let sustainability_index = this.state.sustainability_index
      let variables = this.parseIndex(this.state.index_input["index-function"])
      let existing_variables = []
      let index_functions = []
      let names = []
      let bool = true
      let non_exist_variables = []
      this.state.sustainability_index.map(i=>{names.push(i["index-name"]); index_functions.push(i["index-function"])})
      this.state.sustainability_variables.map(v=>{existing_variables.push(v["name"])})
      console.log(variables)
      variables.map(v=>{if(existing_variables.includes(v)!=true){
        bool = false;
        non_exist_variables.push(v)
      }})
      if(names.includes(this.state.index_input["index-name"])===true || index_functions.includes(this.state.index_input["index-function"])===true &&this.state.index_input["index-function"]!==""){
        this.openNotification("Name or index function already exists!", "Please redefine the function.")
      }
      if(Boolean(this.state.index_input["index-name"].match(/[A-Za-z]([_A-Za-z0-9]+)/g))===false){
        this.openNotification("Name should start with letters and only include letetres, underscores and numbers!", "Please rename the index.")
      }
      if(bool && names.includes(this.state.index_input["index-name"])!==true && index_functions.includes(this.state.user_input.variable)!==true && Boolean(this.state.index_input["index-name"].match(/[A-Za-z]([_A-Za-z0-9]+)/g))){
        if (this.state.index_input["index-name"] !=="" && this.state.index_input["index-function"] !==""){
          this.state.index_input["value"]=this.calculateIndexFunction(this.state.index_input["index-function"])
          sustainability_index.push(this.state.index_input)
        }
        this.setState({sustainability_index:sustainability_index, index_input:{"index-name":"", "index-function":"", "node":{}}})
        this.getSuatainabilityIndex(sustainability_index,this.state.sustainability_variables)
      }
      if(bool===false){
        this.openNotification("Variables "+ non_exist_variables +" not exist!", "Please select and add variable.")
      }
      
      return null
    }

    calculateIndexFunction(index_functions){
      const variables = this.parseIndex(index_functions)
      let values = {}
      variables.map(v=>{this.state.sustainability_variables.map(s_v=>{
        if(v===s_v["name"]){
          values[v] = s_v["node"]
          // console.log(v)
        }})
        var re = new RegExp(v,"g")
        index_functions = index_functions.replace(re, "value['"+v+ "']")
        }
      )
      let parsed_value = this.parseNodeValues(values)
      let result = []
      console.log(values)
      console.log(index_functions)
      parsed_value.forEach(value=>{result.push(eval(index_functions))})
      console.log(result)
      return result
    }

    parseNodeValues(values){
      console.log(values)
      let parsed_value = []
      let num_years = this.state.sustainability_variables[0]["node"]["value"].length
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

    openNotification(message, description){
      notification.open({
        message: message,
        description: description,
        // onClick: () => {
        //   console.log('Notification Clicked!');
        // },
      });
    }

    render() { 

        const style = {
              width: '100px',
              height: '100px',
              border: '1px solid black',
              position: 'absolute',
              top: '100px',
              left: '100px',
            };
        return (
          <div>
          <Row gutter={30}
                type="flex"
                style={{
                height: '100%'
            }}>
          <Col
              span={15}
              style={{
                  height: 800,
                  display: 'flex',
                  flexDirection: 'column'
              }}
          >
            <div id='variables-radial-tree'> 
            </div>
          </Col> 
          <Col
              span={9}
              style={{
                  height: 800,
                  display: 'flex',
                  flexDirection: 'column'
              }}
          >
          <Card title="Sustainability Variables">
            <InputGroup size="large">
              {/* {this.state.sustainability_variables.map(d=>{return <div onClick={this.variableList.bind(this.innerHTML)}>{d.name}={d.variable}</div>})} */}
              <ButtonGroup>
                {this.state.sustainability_variables.map(v=>{return <Row gutter={8}><Col span={21}><div class="tooltip"><Button id={v["variable"]}>{v["name"]+"="+v["variable"].substring(0, 60)}</Button> <span class="tooltiptext">{v["variable"]}</span></div></Col><Col span={1}><div onClick={this.deleteVariable.bind(this)}><div id={v["name"]}>x</div></div></Col></Row>})}
              </ButtonGroup>
              <Row gutter={8}>
                <Col span={8}>
                  <Input id="name" defaultValue="" value={this.state.user_input.name} onChange={this.handleChange.bind(this)} addonBefore="name" />
                </Col>
                <Col span={15}>
                  <Input id="variable" defaultValue="" value={this.state.user_input.variable} onChange={this.handleChange.bind(this)} addonBefore="variable" disabled={true}/>
                </Col>
              </Row>
            </InputGroup>
            <Button type="dashed" onClick={this.addVariable.bind(this)} style={{ width: '60%' }}>
              <Icon type="plus" /> Add a Variable
            </Button>
          </Card>
          
          <Card title="Sustainability Index Function">
          {this.state.sustainability_index.map(d=>{return <div>{d["index-name"]}={d["index-function"]}</div>})}
            <Row gutter={8}>
                <Col span={8}>
                  <Input id="index-name" defaultValue="" value={this.state.index_input["index-name"]} onChange={this.handleChange_Index.bind(this)} addonBefore="index" />
                </Col>
                <Col span={15}>
                <Input id="index-function" defaultValue="" value={this.state.index_input["index-function"]} onChange={this.handleChange_Index.bind(this)} addonBefore="function" disabled={false}/>
                </Col>
              </Row>
            <Button type="dashed" onClick={this.addIndex.bind(this)} style={{ width: '60%' }}>
              <Icon type="plus" /> Add a Index
            </Button>
          </Card>
          </Col>  
          </Row> 
          </div>
         );
    }
}
 
export default Variables_Radial_Tree;