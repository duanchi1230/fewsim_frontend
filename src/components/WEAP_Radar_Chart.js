import React, { Component } from 'react';
import { Button , Collapse , Card, Col, Divider, Icon, Input,notification, Row, Slider, Tree, Table, Select, List, InputNumber} from 'antd';
import * as d3 from 'd3';
import '../styles/App.css';
import Chart from 'chart.js';
import { transpileModule } from 'typescript';
const COLOR_LIST = ["#80b1d3", "#bebada", "#fb8072", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#8dd3c7", "#ffffb3", "#ffed6f"]
const { Option , OptGroup} = Select;

class WEAP_Radar_Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
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
                        height: 190,
                        flex: 10,
                        marginTop: 10,
                        overflow: 'auto',
                        }}>

                        Supply Proportions
                        </Card>
            </div>
        );
    }
}

export default WEAP_Radar_Chart;