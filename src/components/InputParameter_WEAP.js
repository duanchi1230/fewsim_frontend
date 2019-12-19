import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';
import { object } from 'prop-types';

class InputParameter_WEAP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parameter:this.props.WEAP_parameter,
      checked_parameter_name: this.props.checked_WEAP_parameter
    }
  }

  onChange(value, para, name) {
    
    this.state.parameter[name][para] = value
      this.setState({
        
      })
    
  }
  componentWillReceiveProps(){
    console.log("1")
    console.log(this.state.checked_parameter_name)
  }
  render() {
    console.log(this.state.parameter)
    return (
        <div>
          {Object.entries(this.state.parameter).map(([k, v])=>{
            console.log(k,v)
            if  (true
              // this.props.checked_WEAP_parameter.includes(k)
              )
            {
            return (
              <div>
              {v['name']}
              <Row>  
              <Col span={8}>
                <div className='scenario-input'>Start(Min {v['min']}%)</div>
                <InputNumber
                  defaultValue={v['start']}
                  min={v['min']}
                  max={v['max']}
                  step={0.1}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  onChange={(value, para = 'start', name = k) => this.onChange(value, para, name)}
                />
              </Col>
              <Col span={8}>
                <div className='scenario-input'>Max(End {v['max']}%)</div>
                <InputNumber
                  defaultValue={v['end']}
                  min={v['min']}
                  max={v['max']}
                  step={0.1}
                  value={v['end']}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  onChange={(value, para = 'end', name = k) => this.onChange(value, para, name)}
                />
              </Col>
              <Col span={8}>
                <div className='scenario-input'>Step({v['step-min']}%-{v['step-max']}%)</div>
                <InputNumber
                  defaultValue={v['step']}
                  min={v['step-min']}
                  max={20}
                  step={0.1}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  onChange={(value, para = 'step', name = k) => this.onChange(value, para, name)}
                />
              </Col>
            </Row>
            </div>
            )}
          })}
      </div>
    );
  }
}

export default InputParameter_WEAP