import React, { Component } from 'react';
import { Button , Collapse , Card, Col, Divider, Icon, Input,notification, Row, Slider, Tree, Table, Select, List, InputNumber} from 'antd';
import * as d3 from 'd3';
import '../styles/App.css';
import Chart from 'chart.js';
import { transpileModule } from 'typescript';
const COLOR_LIST = ["#80b1d3", "#bebada", "#fb8072", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#8dd3c7", "#ffffb3", "#ffed6f"]
const { Option , OptGroup} = Select;

class WEAP_Multi_Tab_Pixel_Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flow_table_scenarios: ''
         };
    }

    componentDidMount(){
        var flow_table = document.getElementsByClassName('flow-table-scenarios');
        for (var i = 0; i < flow_table.length; i++) {
          flow_table[i].addEventListener('click', this.mouseOverEffect.bind(this));
          flow_table[i].addEventListener('mouseout', this.mouseOutEffect.bind(this));
      }
    }

    componentDidUpdate(){
         console.log(this.props.weap_flow)
         
    }

    updateCanvas(){

    }

    distanceFunction(series1, series2){
        function subvector(a,b){
            return a.map((e,i) => (-e + b[i])/(e+0.00000001));
        }
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        let distance = subvector(series1, series2)
        
        return Math.abs(distance.reduce(reducer))/distance.length
    }

    onChange(){

    }

    mouseOverEffect(element){
        console.log(element.target.id)
        this.setState({flow_table_scenarios:element.target.id})
    }

    mouseOutEffect(element){
        console.log(element.target.id)
        this.setState({flow_table_scenarios:''})
    }

    render() {

        let scenarios = []
        let demand_site = {}
        let demand_site_names = []
        const weap_flow = this.props.weap_flow
        const supply_source = "CAP"
        
        // find the scenarios 
        weap_flow.forEach(flow=>{
            if(scenarios.includes(flow["name"])===false){
                scenarios.push(flow["name"])
            }
            flow["var"]["output"].forEach(variable=>{

                demand_site[variable["source"]] = []
                if(demand_site_names.includes(variable["site"])===false){
                    demand_site_names.push(variable["site"])
                }
            })

            flow["var"]["output"].forEach(variable=>{
                demand_site[variable["source"]].push({"site":variable["site"], "value": [], "distance_to_base": []}   ) 
            })})

        weap_flow.forEach(flow=>{
            flow["var"]["output"].forEach(variable=>{
                for(let i=0; i<demand_site[variable["source"]].length; i++){
                    if(demand_site[variable["source"]][i]["site"]===variable["site"]){
                        demand_site[variable["source"]][i]["value"].push(variable["value"])
                    }
                }
            })
        })

        Object.keys(demand_site).forEach(key=>{
            demand_site[key].forEach(site=>{
                site["value"].forEach(value=>{
                    site["distance_to_base"].push(this.distanceFunction(site["value"][0], value))
                })
            })
        })

        // find the table range
        let table_range = []
        let distance_to_base = []
        Object.keys(demand_site).forEach(key=>{
            demand_site[key].forEach(variable=>{
                variable["distance_to_base"].forEach(value=>{
                    distance_to_base.push(value)
                })
            })
        })

        table_range = [Math.min(...distance_to_base), Math.max(...distance_to_base)]
        console.log(demand_site, table_range)
        let supply_source_to_show = this.props.pixel_map_supply_source

        let width = 200
        let height = 30
        let w = 5
        let scenarios_filtered = scenarios.filter(s=> s!==this.state.flow_table_scenarios)
        console.log(scenarios_filtered)
        // define the column format for the table
        const columns = [
            {
              title: <div><span>Supplied by: </span>
                        <Select  style={{ width: 100 , height: 30}} onChange={this.props.setSupplyPixelMap} disabled={false} defaultValue={"SRP Withdrawl"}>
                            
                            {Object.keys(demand_site).map((name, i)=>{
                                return <Option value={name}>{name.slice(4,name.length)}</Option>  
                            })}
                        </Select>
                    </div>,
              dataIndex: 'site',
              width: 200,
              height: 10
            },
            {
              title: <List  grid={{gutter: 16, 
                            column: 2}}
                            dataSource={scenarios}
                            renderItem={item => {
                            return <List.Item><span>{item}: </span><svg width={10} height={height-15}> <g><circle cx={5} cy={10} r={5} class='flow-table-scenarios' id={item} style={{fill: COLOR_LIST[scenarios.indexOf(item)]}}> </circle> </g></svg></List.Item>}}
                        >
                    </List>,
                    // <div>Scenario Responses</div>,
                           
            //   <Row><div>Scenarios: <svg width={width-10} height={height-15}> <g><circle cx={5} cy={10} r={5}> <span class="tooltiptext">{"scenario1"}</span> </circle> </g></svg></div> </Row>,
              dataIndex: 'distance_to_base',
              render: (data)=> {                            
                                let i = -1
                                return <div>
                                          <svg width={width} height={height}>
                                            <g>{data.map(d=>{
                                            i = i + 1
                                            let opacity = 0.05
                                            if(this.state.flow_table_scenarios===scenarios[i]){
                                                opacity = 1
                                            }
                                            if(this.state.flow_table_scenarios===''){
                                                opacity = 1
                                            }
                                            console.log(opacity, this.state.flow_table_scenarios==='')
                                              return <circle cx={w+(width-2*w)*(d-table_range[0])/(table_range[1]-table_range[0])} cy={15} r={5} opacity={opacity} style={{fill: COLOR_LIST[i]}} />})}
                                                        {/* <rect x={x0} y={height-(height*Math.abs(d)+1)} width={w-1} height={height*Math.abs(d)+1} style={{fill: "#2b8cbe"}}></rect> */}
                                            </g>
                                          </svg>
                                          
                                        </div>}
            },
            // {
            //   title: 'Response Level',
            //   dataIndex: 'response-level',
            //   sorter: {
            //     compare: (a, b) => a['response-level'] - b['response-level'],
            //     // multiple: 3,
            //   },
            //   sortOrder: this.state.sortOrder,
            //   render: (data)=>{return  parseFloat(data).toFixed(2)}
            // },
          ]
        
          
        return (
            <div>
                <Card
                        size="small" 
                        headStyle={{
                            background: 'rgb(236, 236, 236)'
                        }}
                        // extra={<Button onClick={this.showFilterModal.bind(this)} type="primary" style={{"backgroundColor":"#2b8cbe"}}><Icon type="left" /> Flow Variables Filter<Icon type="right" /></Button>}
                        // title={ <div style={{display:"inline-block"}}>
                        //             <div style={{display:"inline-block"}}>WEAP Pixel Map </div> (<div style={{color:"#2b8cbe", display:"inline-block"}}>{scenario_to_show}</div>)
                        //         </div> }
                        style={{
                        height: 900,
                        flex: 10,
                        marginTop: 0,
                        overflow: 'auto',
                        }}>

                            <Table columns={columns} dataSource={demand_site[supply_source_to_show]} onChange={this.onChange.bind(this)} pagination={false} scroll={{ y: 550}}/>

                            <div id="weap-multi-tab-pixel-map">

                            </div>
                        </Card>
            </div>
        );
    }
}

export default WEAP_Multi_Tab_Pixel_Map;