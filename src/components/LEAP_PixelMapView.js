import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';
import Variables_Radial_Tree from './Variables_Radial_Tree';
import { node } from 'prop-types';
import LEAP_Visualization from "./LEAP_Visualization";
import {Form, InputNumber, Button, Row, Col, Modal, Radio, Input, Card} from 'antd'
import Icon from '@ant-design/icons'

//  This module is the container of the LEAP Pixel-Map Panel
class LEAP_PixelMapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
                    demand_variables: ['Energy Demand Final Units', 'Load Shape'],
                    transformation_variables: ['Requirements', 'Outputs by Output Fuel', 'Outputs by Feedstock Fuel',
                    'Inputs', 'Exports into Module',
                    'Imports into Module', 'Capacity', 'Capacity Added',
                    'Capacity Retired', 'Reserve Margin', 'Load Factor',
                    'Peak Power Requirements', 'Actual Availability',
                    'Average Power Dispatched', 'Average Power Requirements Not Dispatched', 'Module Energy Balance'],
                    resource_variables: ['Reserves', 'Primary Requirements', 'Primary Supply', 'Indigenous Production', 'Imports', 'Exports'],
                    Demand_Modal: false,
                    demand_value: 'Energy Demand Final Units',
                    Transformation_Modal: false,
                    type: 'Demand',
                    variable:'Energy Demand Final Units',
                    transformation_value: 'Requirements',
                    Resource_Modal: false,
                    resource_value: 'Primary Requirements',
                    root_branch:{'Requirements':["Transformation\\Transmission and distribution", "Transformation\\Electricity generation"],
                                    'Outputs by Output Fuel':["Transformation\\Transmission and distribution", "Transformation\\Electricity generation"],
                                    'Outputs by Feedstock Fuel':["Transformation\\Transmission and distribution", "Transformation\\Electricity generation"],
                                    'Inputs':["Transformation\\Transmission and distribution", "Transformation\\Electricity generation"],
                                    'Imports into Module': ["Transformation\\Transmission and distribution"],
                                    'Capacity':["Transformation\\Transmission and distribution\\Processes", "Transformation\\Electricity generation"],
                                    'Capacity Added':["Transformation\\Transmission and distribution\\Processes", "Transformation\\Electricity generation"],
                                    'Reserve Margin':["Transformation\\Electricity generation"],
                                    'Load Factor':["Transformation\\Electricity generation"],
                                    'Peak Power Requirements':["Transformation\\Electricity generation"],
                                    'Actual Availability':[]
                                }};
                    
    }


    showDemandModal(){
        this.setState({Demand_Modal:true, type: 'Demand', variable: this.state.demand_value})
        this.props.setLeapDataType("Demand", this.state.demand_value)
    }

    closeDemandModal(){
        this.setState({Demand_Modal:false})
        
    }
    onChangeDemand(e){
        this.setState({
            demand_value: e.target.value,
            variable: e.target.value
          });
        this.props.setLeapDataType("Demand", e.target.value)
    }

    showTransformationModal(){
        this.setState({Transformation_Modal:true, type: 'Transformation', variable: this.state.transformation_value})
        this.props.setLeapDataType("Transformation", this.state.transformation_value)
    }

    closeTransformationModal(){
        this.setState({Transformation_Modal:false})
    }
    onChangeTransformation(e){
        this.setState({
            transformation_value: e.target.value,
            variable: e.target.value
          });
        this.props.setLeapDataType("Transformation", e.target.value)
    }

    showResourceModal(){
        this.setState({Resource_Modal:true, type: 'Resource', variable: this.state.resource_value})
        this.props.setLeapDataType("Resource", this.state.resource_value)
    }

    closeResourceModal(){
        this.setState({Resource_Modal:false})
    }
    onChangeResource(e){
        this.setState({
            resource_value: e.target.value,
            variable: e.target.value
          });
        this.props.setLeapDataType("Resource", e.target.value)
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        let scenario_to_show = ''
        if(this.props.scenario_to_show===''){
            scenario_to_show = this.props.leap_data[0].name
        }
        else{
            scenario_to_show = this.props.scenario_to_show
        }
        return (
            <div>
                <Modal 
                    width={500}
                    visible={this.state.Demand_Modal}
                    onCancel={this.closeDemandModal.bind(this)}
                    footer={null}
                >
                    <Radio.Group onChange={this.onChangeDemand.bind(this)} value={this.state.demand_value}>
                        <b>Demand Variables</b>
                        {this.state.demand_variables.map(d=>{
                            return (<div>
                                        <Radio style={radioStyle} value={d}>
                                            {d}
                                        </Radio>
                                    </div>)
                        })}                      
                    </Radio.Group>
                </Modal>
                <Modal 
                    width={500}
                    visible={this.state.Transformation_Modal}
                    onCancel={this.closeTransformationModal.bind(this)}
                    footer={null}
                >
                    <Radio.Group onChange={this.onChangeTransformation.bind(this)} value={this.state.transformation_value}>
                        <b>Transformation Variables</b>
                        {this.state.transformation_variables.map(d=>{
                            return (<div>
                                        <Radio style={radioStyle} value={d}>
                                            {d}
                                        </Radio>
                                    </div>)
                        })}                      
                    </Radio.Group>
                </Modal>
                <Modal 
                    width={500}
                    visible={this.state.Resource_Modal}
                    onCancel={this.closeResourceModal.bind(this)}
                    footer={null}
                >
                    <Radio.Group onChange={this.onChangeResource.bind(this)} value={this.state.resource_value}>
                        <b>Resource Variables</b>
                        {this.state.resource_variables.map(d=>{
                            return (<div>
                                        <Radio style={radioStyle} value={d}>
                                            {d}
                                        </Radio>
                                    </div>)
                        })}                      
                    </Radio.Group>
                </Modal>
                <Card 
                    size="small" 
                    headStyle={{
                        background: 'rgb(236, 236, 236)'
                    }}
                    extra={<div>
                        <Button onClick={this.showDemandModal.bind(this)} type="primary" style={{"backgroundColor":"#fdae61", marginLeft: 35}}> <Icon type="left" /> Demand <Icon type="right" /></Button>
                        <Button onClick={this.showTransformationModal.bind(this)} type="primary" style={{"backgroundColor":"#fdae61", marginLeft: 35}}> <Icon type="left" /> Transformation <Icon type="right" /></Button>
                        <Button onClick={this.showResourceModal.bind(this)} type="primary" style={{"backgroundColor":"#fdae61", marginLeft: 35}}> <Icon type="left" /> Resource <Icon type="right" /></Button></div>}
                    title=
                    { <div style={{display:"inline-block"}}>
                                    <div style={{display:"inline-block"}}>LEAP Pixel Map </div> (<div style={{color:"#fdae61", display:"inline-block"}}>{scenario_to_show}</div>)
                                </div> }
                    style={{
                    height:900,
                    flex: 0,
                    marginTop: 0,
                    overflow: 'auto',
                    }}>
                    <LEAP_Visualization 
                        leap_data={this.props.leap_data} 
                        type={this.state.type} 
                        variable={this.state.variable} 
                        handleLEAPResultVariableClick={this.props.handleLEAPResultVariableClick}
                        scenario_to_show={this.props.scenario_to_show}>
                    </LEAP_Visualization>
                </Card>
                
                
            </div>
        );
    }
}

export default LEAP_PixelMapView;
