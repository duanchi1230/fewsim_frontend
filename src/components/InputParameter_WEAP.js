import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';

class InputParameter_WEAP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parameter:this.props.WEAP_parameter
    }
  }

  onChange(value, para, name) {

    this.state.parameter[name][para] = value
      this.setState({
        
      })
    
  }

  

  render() {
    return (
      <div>
        Population Growth (WP)
      <Row>
          <Col span={8}>
            <div className='scenario-input'>Start(Min 0%)</div>
            <InputNumber
              defaultValue={this.state.parameter['population']['start']}
              min={0}
              max={10}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'start', name = 'population') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Max(End 10%)</div>
            <InputNumber
              defaultValue={this.state.parameter['population']['end']}
              min={this.state.parameter['population']['start']}
              max={10}
              step={0.1}
              value={this.state.parameter['population']['end']}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'end', name = 'population') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Step(0.1-20)</div>
            <InputNumber
              defaultValue={this.state.parameter['population']['step']}
              min={0.1}
              max={20}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'step', name = 'population') => this.onChange(value, para, name)}
            />
          </Col>
        </Row>
        Municipal Efficiency (WM)
      <Row>
          <Col span={8}>
            <div className='scenario-input'>Start(Min 50%)</div>
            <InputNumber
              defaultValue={this.state.parameter['municipal']['start']}
              min={50}
              value = {this.state.parameter['municipal']['start']}
              max={100}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'start', name = 'municipal') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>End(Max 100%)</div>
            <InputNumber
              defaultValue={this.state.parameter['municipal']['end']}
              min={this.state.parameter['municipal']['start']}
              max={100}
              step={0.1}
              value={this.state.parameter['municipal']['end']}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'end', name = 'municipal') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Step(0.1-20)</div>
            <InputNumber
              defaultValue={this.state.parameter['municipal']['step']}
              min={0.1}
              max={20}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'step', name = 'municipal') => this.onChange(value, para, name)}
            />
          </Col>
        </Row>
        Agriculture Efficiency (WA)
      <Row>
          <Col span={8}>
            <div className='scenario-input'>Start(Min 50%)</div>
            <InputNumber
              defaultValue={this.state.parameter['agriculture']['start']}
              min={50}
              max={100}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'start', name = 'agriculture') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>End(Max 100%)</div>
            <InputNumber
              defaultValue={this.state.parameter['agriculture']['end']}
              min={this.state.parameter['agriculture']['start']}
              max={100}
              step={0.1}
              value={this.state.parameter['agriculture']['end']}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'end', name = 'agriculture') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Step(0.1-20)</div>
            <InputNumber
              defaultValue={this.state.parameter['agriculture']['step']}
              min={0.1}
              max={20}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'step', name = 'agriculture') => this.onChange(value, para, name)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default InputParameter_WEAP