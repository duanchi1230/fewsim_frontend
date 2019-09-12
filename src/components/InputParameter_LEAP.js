import React, { Component } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';

class InputParameter_LEAP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parameter:this.props.LEAP_parameter
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
          {Object.entries(this.state.parameter).map(([k, v])=>{
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
            )
          })}
        
        {/* Population Growth (LP)
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
              value = {this.state.parameter['population']['end']}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'end', name = 'population') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Step(0.1%-20%)</div>
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
        Industrial Efficiency (LI)
      <Row>
          <Col span={8}>
            <div className='scenario-input'>Start(Min 50%)</div>
            <InputNumber
              defaultValue={this.state.parameter['industrial']['start']}
              min={50}
              max={100}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'start', name = 'industrial') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>End(Max 100%)</div>
            <InputNumber
              defaultValue={this.state.parameter['industrial']['end']}
              min={this.state.parameter['industrial']['start']}
              max={100}
              step={0.1}
              value={this.state.parameter['industrial']['end']}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para='end', name = 'industrial') => this.onChange(value, para, name)}
            />
          </Col>
          <Col span={8}>
            <div className='scenario-input'>Step(0.1%-20%)</div>
            <InputNumber
              defaultValue={this.state.parameter['industrial']['step']}
              min={0.1}
              max={20}
              step={0.1}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={(value, para = 'step', name = 'industrial') => this.onChange(value, para, name)}
            />
          </Col>
        </Row>  */}
        
        </div>
      );
    }
  }

  export default InputParameter_LEAP