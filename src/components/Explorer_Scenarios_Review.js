import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs, InputNumber, List, Select} from 'antd';
const { Option } = Select;

class WEAP_Scenarios_Review extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            scenario_in_summary: ''
         };
    }

    componentWillMount(){
        this.setState({
            scenario_in_summary: this.props.created_scenarios[0].name
        })
        
    }

    handleChange(element){
        console.log(element)
        this.setState({
            scenario_in_summary: element
        })
        this.props.setScenarioToShow(element)
    }

    render() {
        let created_scenarios = this.props.created_scenarios
        return (<Row style={{height: '100%', overflow: 'auto'}}>
            <Card
                title='Scenarios Explorer'
                extra={<Select defaultValue={this.state.scenario_in_summary} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                            {this.props.created_scenarios.map(scenario=>{
                                return <Option value={scenario.name}>{scenario.name}</Option>
                            })}
                            
                        </Select>
                        }
                style={{
                height: 520,
                flex: 10,
                marginTop: 10,
                overflow: 'auto',
            }}>
                {created_scenarios.map(scenario=>{
                    let scenario_in_summary = this.state.scenario_in_summary
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
                                </List>
                                </div>    
                    }
                    if(scenario_in_summary===scenario.name && scenario.name!=='Base'){
                        return <div key={scenario.name}>
                                    <h2>WEAP Inputs</h2>
                                    
                                        {scenario.weap.map(variable=>{
                                        return <div key={variable.fullname+':'+variable.name} style={{width:'100%'}}>
                                                    {variable.fullname+':'+variable.name} ---> <InputNumber
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
                                        <h1>{'LEAP Inputs'}</h1>
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
                                        <div>{'WEAP Inputs'}</div>
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
                                </div>
                        
                    }}) 
                }
            </Card>
        </Row>
                
        );
    }
}

export default WEAP_Scenarios_Review;