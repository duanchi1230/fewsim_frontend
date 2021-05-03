import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';
import { object } from 'prop-types';

// This module lists all selected WEAP variables in the Scenario Creation Panel

class InputParameter_WEAP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  onChange(value, input) {
    console.log(value, input)
  }

  componentWillReceiveProps(){

  }

  render() {
    console.log(this.state.parameter)
    let key = 1
    return (
      <div>
        <Row><b>Key Assumptions:</b></Row>
          {this.props.weap_inputs.map(input => {
            let name = input.fullname+':'+input.name
              if(input.path[0]==='Key Assumptions'){
                return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                          <InputNumber key={input.fullname+':'+input.name}
                            defaultValue={input.percentage_of_default}
                            min={0}
                            max={300}
                            step={0.1}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={(value, input=name) =>this.props.weapVariablesOnChange(value, input)}
                          /> Default
                        </div> }
              
            })}
        <Row><b>Demand Sites and Catchments:</b></Row>
          {this.props.weap_inputs.map(input => {
                let name = input.fullname+':'+input.name
                if(input.path[0]==='Demand Sites and Catchments'){
                  return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                            <InputNumber
                              defaultValue={input.percentage_of_default}
                              value={input.percentage_of_default}
                              min={0}
                              max={300}
                              step={0.1}
                              formatter={value => `${value}%`}
                              parser={value => value.replace('%', '')}
                              onChange={(value, input=name) =>this.props.weapVariablesOnChange(value, input)}
                            /> Default
                          </div> }
                
              })}
        <Row><b>Hydrology:</b></Row>
          {this.props.weap_inputs.map(input => {
            let name = input.fullname+':'+input.name
                  if(input.path[0]==='Hydrology'){
                    return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                              <InputNumber key={input.fullname+':'+input.name}
                                defaultValue={input.percentage_of_default}
                                min={0}
                                max={300}
                                step={0.1}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={(value, input=name) =>this.props.weapVariablesOnChange(value, input)}
                              /> Default
                            </div> }
                  
                })}
        <Row><b>Supply and Resource:</b></Row>
          {this.props.weap_inputs.map(input => {
            let name = input.fullname+':'+input.name
                  if(input.path[0]==='Supply and Resources'){
                    return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                              <InputNumber key={input.fullname+':'+input.name}
                                defaultValue={input.percentage_of_default}
                                min={0}
                                max={300}
                                step={0.1}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={(value, input=name) =>this.props.weapVariablesOnChange(value, input)}
                              /> Default
                            </div> }
                  
                })}
        <Row><b>Water Quality:</b></Row>
          {this.props.weap_inputs.map(input => {
            let name = input.fullname+':'+input.name
                  if(input.path[0]==='Water Quality'){
                    return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                              <InputNumber key={input.fullname+':'+input.name}
                                defaultValue={input.percentage_of_default}
                                min={0}
                                max={300}
                                step={0.1}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                onChange={(value, input=name) =>this.props.weapVariablesOnChange(value, input)}
                              /> Default
                            </div> }
                  
                })}
      </div>
    );
  }
}

export default InputParameter_WEAP