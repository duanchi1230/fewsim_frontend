import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';

// This module lists all selected LEAP variables in the Scenario Creation Panel
class InputParameter_LEAP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
  
    }
  }

  handleChange(){

  }

  onChange(){

  }

  render() {
    let roots = ['Key', 'Demand', 'Transformation', 'Resources']
    // console.log(this.props.leap_inputs)
    return (
      <div>
        <Row><b>Key:</b></Row>
          {this.props.leap_inputs.map(input => {
            let name = input.fullname+':'+input.name
            if(input.path[0]==='Key'){
              return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                        <InputNumber
                          defaultValue={input.percentage_of_default}
                          min={0}
                          max={300}
                          step={0.1}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                          onChange={(value, input=name) =>this.props.leapVariablesOnChange(value, input)}
                        /> Default
                      </div> }
             
          })}
          
        <Row><b>Demand:</b></Row>
          {this.props.leap_inputs.map(input => {
              let name = input.fullname+':'+input.name
              if(input.path[0]==='Demand'){
                return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                          <InputNumber
                            defaultValue={input.percentage_of_default}
                            min={0}
                            max={300}
                            step={0.1}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={(value, input=name) =>this.props.leapVariablesOnChange(value, input)}
                          /> Default
                        </div> }
              
            })}
        <Row><b>Transformation:</b></Row>
          {this.props.leap_inputs.map(input => {
              let name = input.fullname+':'+input.name
              if(input.path[0]==='Transformation'){
                return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                          <InputNumber
                            defaultValue={input.percentage_of_default}
                            min={0}
                            max={300}
                            step={0.1}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={(value, input=name) =>this.props.leapVariablesOnChange(value, input)}
                          /> Default
                        </div> }
              
            })}
        <Row><b>Resources:</b></Row>
          {this.props.leap_inputs.map(input => {
              let name = input.fullname+':'+input.name
              if(input.path[0]==='Resources'){
                return  <div key={input.fullname+':'+input.name}>{input.fullname+': '+input.name} 
                          <InputNumber
                            defaultValue={input.percentage_of_default}
                            min={0}
                            max={300}
                            step={0.1}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={(value, input=name) =>this.props.leapVariablesOnChange(value, input)}
                          /> Default
                        </div> }
              
            })}   
      </div>
    );
  }
  }

  export default InputParameter_LEAP