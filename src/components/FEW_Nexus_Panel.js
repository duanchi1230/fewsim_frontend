import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs, Modal} from 'antd';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';
const { TabPane } = Tabs;

class FEW_Nexus_Panel extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showMPMModal: false,
            showWEAPModal: false,
            showLEAPModal: false
         };
    }
    componentDidMount(){
        this.drawDiagram()
    }

    mouseClickMPM(){
        console.log("MPM")
        this.setState({
            showMPMModal: true
        })
    }

    mouseClickWEAP(){
        console.log("WEAP")
        this.setState({
            showWEAPModal: true
        })
    }

    mouseClickLEAP(){
        console.log("LEAP")
        this.setState({
            showLEAPModal: true
        })
    }

    hideMPMModal(){
        this.setState({
            showMPMModal: false
        })
    }

    hideWEAPModal(){
        this.setState({
            showWEAPModal: false
        })
    }

    hideLEAPModal(){
        this.setState({
            showLEAPModal: false
        })
    }

    drawDiagram(){
        let width = 450
        let height = 150
        const svg = d3.select('#concept-diagram')
                        .append('svg')
                        .attr('id', 'svg1-concept-diagram')
                        .attr('width', width)
                        .attr('height', height);
        let x_element_weap = 180
        let x_element_leap = 330
        let x_element_mpm = 30
        let y_element = 50
        svg.append('g')
            .append('rect')
            .attr('x', x_element_weap)
            .attr('y', y_element)
            .attr('height', 80)
            .attr('width', 100)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', "#2b8cbe")
            .attr('stroke', 'rgb(50 50 50)')
            .attr('fill-opacity', 0.5)
            .on('click', d=>this.mouseClickWEAP());
        svg.append('g')
            .append('text')
            .attr('x', x_element_weap+50)
            .attr('y', y_element+25)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', 'bold')
            .text('WEAP')
            // .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['flow_value'] , d['rowName']))
            // .on('mouseout', d=>this.handleMouseOut())
            // .on('click', d=>this.handleMouseClick(d));
            
        svg.append('g')
            .append('rect')
            .attr('x', x_element_weap)
            .attr('y', y_element + 50)
            .attr('height', 30)
            .attr('width', 80)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', "#2b8cbe")
            .attr('stroke', 'rgb(50 50 50)')
            .attr('fill-opacity', 0.5)
            .on('click', d=>this.mouseClickWEAP());
        svg.append('g')
            .append('text')
            .attr('x', x_element_weap+30)
            .attr('y', y_element+65)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', 'bold')
            .text('MABIA')
            // .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['flow_value'] , d['rowName']))
            // .on('mouseout', d=>this.handleMouseOut())
            // .on('click', d=>this.handleMouseClick(d));  

        svg.append('defs')
            .append('marker')
            .attr('id', 'triangle-weap')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', '1')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '3')
            .attr('markerHeight', '3')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 -5 L 10 0 L 0 5 z')
            .attr('fill', '#2b8cbe')

        svg.append('g')
            .append('polyline')
            // .attr('d', "M 20 35 L 120 100 L 0 100 Z")
            .attr('points', String(x_element_weap+100)+', '+String(y_element+65)+' '+ String(x_element_leap-13)+', '+String(y_element+65))
            .attr('stroke', '#2b8cbe')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-weap)")

        // Append MPM concept diagram
        svg.append('g')
            .append('rect')
            .attr('x', x_element_mpm)
            .attr('y', y_element)
            .attr('height', 80)
            .attr('width', 100)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', "#b3de69")
            .attr('stroke', 'rgb(50 50 50)')
            .attr('fill-opacity', 0.5)
            .on('click', d=>this.mouseClickMPM());
        svg.append('g')
            .append('text')
            .attr('x', x_element_mpm+50)
            .attr('y', y_element+25)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', 'bold')
            .text('MPM')
            
        svg.append('defs')
            .append('marker')
            .attr('id', 'triangle-mpm')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', '1')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '3')
            .attr('markerHeight', '3')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 -5 L 10 0 L 0 5 z')
            .attr('fill', '#b3de69')

        svg.append('g')
            .append('polyline')
            // .attr('d', "M 20 35 L 120 100 L 0 100 Z")
            .attr('points', String(x_element_mpm+100)+', '+String(y_element+65)+' '+ String(x_element_weap-13)+', '+String(y_element+65))
            .attr('stroke', '#b3de69')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-mpm)")
        
        // Append LEAP concept diagram
        svg.append('g')
            .append('rect')
            .attr('x', x_element_leap)
            .attr('y', y_element)
            .attr('height', 80)
            .attr('width', 100)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', "#fdae61")
            .attr('stroke', 'rgb(50 50 50)')
            .attr('fill-opacity', 0.5)
            .on('click', d=>this.mouseClickLEAP());
        svg.append('g')
            .append('text')
            .attr('x', x_element_leap+50)
            .attr('y', y_element+25)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', 'bold')
            .text('LEAP')

        svg.append('defs')
            .append('marker')
            .attr('id', 'triangle-leap')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', '1')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '3')
            .attr('markerHeight', '3')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 -5 L 10 0 L 0 5 z')
            .attr('fill', '#fdae61')

        svg.append('g')
            .append('polyline')
            // .attr('d', "M 20 35 L 120 100 L 0 100 Z")
            .attr('points', String(x_element_leap)+', '+String(y_element+25)+' '+ String(x_element_weap+100+13)+', '+String(y_element+25))
            .attr('stroke', '#fdae61')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-leap)")

        //  Append scenario diagram
        svg.append('g')
            .append('rect')
            .attr('x', x_element_mpm)
            .attr('y', 0)
            .attr('height', 30)
            .attr('width', 400)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', "gery")
            .attr('stroke', 'rgb(50 50 50)')
            .attr('fill-opacity', 0.3)
        svg.append('g')
            .append('text')
            .attr('x', x_element_weap+50)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', 'bold')
            .text('Created Scenarios')

        svg.append('defs')
            .append('marker')
            .attr('id', 'triangle-scenario')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', '1')
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', '3')
            .attr('markerHeight', '3')
            .attr('orient', 'auto')
            .append('path')
            .attr('fill-opacity', 1)
            .attr('d', 'M 0 -5 L 10 0 L 0 5 z')
            .attr('fill', 'grey')

        svg.append('g')
            .append('polyline')
            .attr('points', String(x_element_mpm+50)+', '+String(30)+' '+ String(x_element_mpm+50)+', '+String(y_element-13))
            .attr('stroke', 'grey')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-scenario)")
        svg.append('g')
            .append('polyline')
            .attr('points', String(x_element_weap+50)+', '+String(30)+' '+ String(x_element_weap+50)+', '+String(y_element-13))
            .attr('stroke', 'grey')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-scenario)")
        svg.append('g')
            .append('polyline')
            .attr('points', String(x_element_leap+50)+', '+String(30)+' '+ String(x_element_leap+50)+', '+String(y_element-13))
            .attr('stroke', 'grey')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
            .attr("marker-end", "url(#triangle-scenario)")
    }

    render() {
        return (
            <div>
                <Modal 
                    width={1200}
                    visible={this.state.showMPMModal}
                    onCancel={this.hideMPMModal.bind(this)}
                    footer={null}>
                       
                    <Tabs type="card" >
                        <TabPane tab="Model Map" key="2" >
                            Model Map to be Updated!
                        </TabPane>
                        <TabPane tab="Coupled Variables" key="1">
                            Coupled Variables to be Updated!
                        </TabPane>
                        
                        
                    </Tabs>
                </Modal>
                <Modal 
                    width={1200}
                    visible={this.state.showWEAPModal}
                    onCancel={this.hideWEAPModal.bind(this)}
                    footer={null}>
                    <Tabs type="card" >
                        
                        <TabPane tab="Model Map" key="2" >
                            Phoenix AMA
                            <img src={ require('../images/WEAP_model.PNG')} width={1200} height={600} mode='fit' />
                        </TabPane>
                        <TabPane tab="Coupled Variables" key="1">
                            <h1>Coupled Variables between WEAP and LEAP</h1>
                            {this.props.coupled_parameters.map(parameter=>{
                                return <div style={{'fontSize': 3}}>
                                            {parameter[0]}, --->{parameter[1]}
                                        </div>
                            })}
                        </TabPane>
                        
                    </Tabs>
                </Modal>
                <Modal 
                    width={1200}
                    visible={this.state.showLEAPModal}
                    onCancel={this.hideLEAPModal.bind(this)}
                    footer={null}>
                       <Tabs type="card" >
                        
                        <TabPane tab="Model Map" key="2" >
                            Phoenix AMA
                            <img src={ require('../images/LEAP_model.PNG')} width={1150} height={600} mode='fit' />
                        </TabPane>
                        
                        <TabPane tab="Coupled Variables" key="1">
                            <h1>Coupled Variables between WEAP and LEAP</h1>
                            {this.props.coupled_parameters.map(parameter=>{
                                return <div style={{'fontSize': 3}}>
                                            {parameter[0]}, --->{parameter[1]}
                                        </div>
                            })}
                        </TabPane>
                    </Tabs>
                </Modal>
                <Card
                    title='FEW Nexus Summary'
                    style={{
                    height:270,
                    flex: 10,
                    marginTop: 55.6,
                    overflow: 'auto',
                }}>
                    {/* This could display some text content or summary visualizarion content */}
                    Model: Food-->MPM, Water-->WEAP, Energy-->LEAP
                    <div id="concept-diagram"></div>
                </Card>
            </div>
        );
    }
    
}

export default FEW_Nexus_Panel;