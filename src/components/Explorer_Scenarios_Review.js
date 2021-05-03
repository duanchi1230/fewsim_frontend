import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs, InputNumber, List, Select} from 'antd';
import Sustainability_Graph from '../components/Sustainability_Graph'

// this module is for the Scenario Explorer Panel

const { Option } = Select;

class WEAP_Scenarios_Review extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            scenario_in_summary: this.props.scenario_to_show
         };
    }

    componentWillMount(){
        // this.setState({
        //     scenario_in_summary: this.props.created_scenarios[0].name
        // })
    }

    handleChange(element){
        // console.log(element)
        // this.setState({
        //     scenario_in_summary: element
        // })
        this.props.setScenarioToShow(element)
    }

    render() {
        let created_scenarios = this.props.created_scenarios
       
        /// get the links and nodes for sustainability graph////////////////////////////////////////////////////////
        let active_scenario = this.props.created_scenarios.filter(s => s.name===this.props.scenario_to_show)
        let scenario_variables = []
        let sustainability_graph = {"link": [], "node": []}
        let sustainability_index_link = []

        // get weap variables in scenario
        active_scenario[0]["weap"].forEach(variable=>{
            scenario_variables.push(variable["fullname"]+"\\"+"\\:"+variable["name"])
            scenario_variables.push(variable["name"])
        })

        // get leap variables in scenario
        active_scenario[0]["leap"].forEach(variable=>{
            scenario_variables.push(variable["fullname"]+":"+variable["name"])
        })

        // get agriculture variables in scenario
        active_scenario[0]["mabia"].forEach(variable=>{
            scenario_variables.push(variable["fullname"]+":"+variable["name"])
        })

        // this.props.sensitivity_graph["link"].forEach(link=>{
        //     if(link["target"].match(/[A-Za-z]([_A-Za-z0-9]+)/g).includes("Supply and Resources")){
        //         sustainability_graph
        //     }
        // })

        // get he nodes in scenario
        let filtered_node = this.props.sensitivity_graph.node.filter(
            node => node.group.includes("output") || scenario_variables.includes(node.id) || scenario_variables.includes(node.id.split(":")[node.id.split(":").length-1])
        )
        
        // get the links in the scenario
        this.props.loaded_group_index_simulated.forEach(index_group=>{
            let index_variable = []
            
            index_group["index"].forEach(index=>{
                filtered_node.push({"id":index["index-name"], "group": "sustainability-index"})
                index["index-function"].match(/[A-Za-z]([_A-Za-z0-9]+)/g).forEach(v_name=>{
                    
                    let index_variable_filtered = index_group["variable"].filter(variable=> variable["name"]===v_name)
                    sustainability_index_link.push({"source":index_variable_filtered[0]["variable"], "target": index["index-name"], "value": 1, "type": "sustainability-index"})
                })
            }) 
        })
        sustainability_index_link.forEach(index_link=>{
            if(index_link["source"].includes("Supply and Resources")){
                index_link["source"] = index_link["source"].split(":")[0]+":Total Node Outflow"
            }
        })
        this.props.sensitivity_graph.link.forEach(link=>{
            sustainability_index_link.push(JSON.parse(JSON.stringify(link)))
        })
        console.log(scenario_variables, filtered_node, sustainability_index_link)

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        console.log(this.props.sensitivity_graph, 
            this.state.scenario_in_summary, 
            this.props, 
            this.props.sustainability_variables_calculated,
            this.props.sustainability_variables,
            this.props.sustainability_index,
            this.props.loaded_group_index_simulated,
            this.props.created_scenarios)

        console.log(this.props.scenario_to_show)
        return (<Row style={{height: '100%', overflow: 'hidden'}} >
            <Card
                size="small" 
                headStyle={{
                    background: 'rgb(236, 236, 236)'
                }}
                title='Scenarios Explorer'
                extra={<Select value={this.props.scenario_to_show} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                            {this.props.created_scenarios.map(scenario=>{
                                return <Option value={scenario.name}>{scenario.name}</Option>
                            })}
                            
                        </Select>
                        }
                style={{
                height: 950,
                flex: 10,
                marginTop: 10,
                overflow: 'auto',
            }}>
                <Sustainability_Graph filtered_node={filtered_node} 
                                    sustainability_index_link={sustainability_index_link}
                                    scenario_in_summary={this.props.scenario_to_show}>

                </Sustainability_Graph>
                {created_scenarios.map(scenario=>{
                    let scenario_in_summary = this.props.scenario_to_show
                    if(scenario_in_summary===scenario.name && scenario.name==='Base'){
                        return <div key={scenario.name} >
                                <List>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<div>{'WEAP Inputs'}</div>}
                                        />
                                            Default
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<div>{'LEAP Inputs'}</div>}
                                        />
                                            Default
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<div>{'WEAP-MABIA Inputs'}</div>}
                                        />
                                            Default
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<div>{'Climate Inputs'}</div>}
                                        />
                                            {scenario.climate.map(variable=>{
                                                return variable
                                            })}
                                    </List.Item>
                                </List>
                                </div>    
                    }
                    if(scenario_in_summary===scenario.name && scenario.name!=='Base'){
                        return <div key={scenario.name}>
                                    WEAP Inputs
                                    
                                        {scenario.weap.map(variable=>{
                                        return <div key={variable.fullname+':'+variable.name} style={{width:'100%'}}>
                                                    {variable.fullname+':'+variable.name} <InputNumber
                                                        defaultValue={variable.percentage_of_default}
                                                        value={variable.percentage_of_default}
                                                        disabled={true}
                                                        min={0}
                                                        max={300}
                                                        step={0.1}
                                                        formatter={value => `${value}%`}
                                                        parser={value => value.replace('%', '')}/> Default  
 
                                                </div>
                                            
                                        })}
                                        
                                    <Row gutter={8}>    
                                        {'LEAP Inputs'}
                                    </Row>
                                        {scenario.leap.map(variable=>{
                                            return <div key={variable.fullname+':'+variable.name}>
                                                        {variable.fullname+':'+variable.name} <InputNumber
                                                            defaultValue={variable.percentage_of_default}
                                                            value={variable.percentage_of_default}
                                                            disabled={true}
                                                            min={0}
                                                            max={300}
                                                            step={0.1}
                                                            formatter={value => `${value}%`}
                                                            parser={value => value.replace('%', '')}
                                                        /> Default
                                                    </div>
                                        })}
                                    <Row gutter={8}>    
                                        {'Climate Inputs'}
                                    </Row>
                                        {scenario.climate.map(variable=>{
                                            return <div key={"climate-"+variable}>
                                                        {variable} 
                                                    </div>
                                        })}
                                    {/* <Row gutter={8}>   
                                        {'WEAP Inputs'}
                                    </Row>
                                        {scenario.leap.map(variable=>{
                                            return <div key={variable.fullname+':'+variable.name}>
                                                        {variable.fullname+':'+variable.name} <InputNumber
                                                            defaultValue={variable.percentage_of_default}
                                                            value={variable.percentage_of_default}
                                                            disabled={true}
                                                            min={0}
                                                            max={300}
                                                            step={0.1}
                                                            formatter={value => `${value}%`}
                                                            parser={value => value.replace('%', '')}
                                                        /> Default
                                                    </div>
                                        })} */}
                                </div>
                        
                    }}) 
                }
            </Card>
        </Row>
                
        );
    }
}

export default WEAP_Scenarios_Review;