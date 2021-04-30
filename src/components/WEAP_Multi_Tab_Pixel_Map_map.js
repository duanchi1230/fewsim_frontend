import React, { Component } from 'react';
import { Button , Collapse , Card, Col, Divider, Icon, Input,notification, Row, Slider, Tree, Table, InputNumber} from 'antd';
import * as d3 from 'd3';
import Chart from 'chart.js';
import ReactEcharts from 'echarts-for-react';
import { transpileModule } from 'typescript';
const COLOR_LIST = ["#80b1d3", "#bebada", "#fb8072", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#8dd3c7", "#ffffb3", "#ffed6f"]

class WEAP_Multi_Tab_Pixel_Map_map extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    componentDidMount(){
        
    }

    render() {
        const weap_flow = this.props.weap_flow
        let scenario_to_show = this.props.scenario_to_show
        if(scenario_to_show===''){
            scenario_to_show = 'Base'
        }

        let supply_source_to_show = this.props.pixel_map_supply_source
        // var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        // '7a', '8a', '9a','10a','11a',
        // '12p', '1p', '2p', '3p', '4p', '5p',
        // '6p', '7p', '8p', '9p', '10p', '11p'];
        // var days = ['Saturday', 'Friday', 'Thursday',
        //         'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

        // var data = [[0,0,5],[0,1,1],[0,2,0.1],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

        // data = data.map(function (item) {
        //     return [item[1], item[0], item[2] || '-'];
        // });

        let data_v = []
        let site = []
        let timeRange = []
        let valueRange = [0, 0]
        console.log(weap_flow, supply_source_to_show, scenario_to_show)
        let weap_flow_filtered = weap_flow.filter(flow=>flow['name']===scenario_to_show)
        let weap_flow_filter_variable = weap_flow_filtered[0]["var"]["output"].filter(variable=>variable["source"]===supply_source_to_show)
        
        for(let i=0; i<weap_flow_filter_variable.length; i++){
            for(let j=0; j<weap_flow_filter_variable[i]['value'].length; j++){
                data_v.push([j, i, weap_flow_filter_variable[i]['value'][j]])
                if(weap_flow_filter_variable[i]['value'][j]>valueRange[1]){
                    valueRange[1] = JSON.parse(JSON.stringify(weap_flow_filter_variable[i]['value'][j]))
                }
                if(weap_flow_filter_variable[i]['value'][j]<valueRange[0]){
                    valueRange[0] = JSON.parse(JSON.stringify(weap_flow_filter_variable[i]['value'][j]))
                }
            }
            site.push(weap_flow_filter_variable[i]['site'])
        }
        
        for(let y=weap_flow[0]['timeRange'][0]; y<=weap_flow[0]['timeRange'][1]; y++){
            timeRange.push(y)
        }
        console.log(weap_flow_filtered, weap_flow_filter_variable, data_v, site, timeRange)

        let option = {
            tooltip: {
                position: 'top'
            },
            grid: {
                height: '50%',
                width: '80%',
                top: '5%',
                left: '15%'
            },
            xAxis: {
                type: 'category',
                data: timeRange,
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                data: site,
                splitArea: {
                    show: true
                },
                inverse: true
            },
            visualMap: {
                min: valueRange[0],
                max: valueRange[1],
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '25%',
                color: ['#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7', '#f7fbff'] 
                
            },
            series: [{
                name: '',
                type: 'heatmap',
                data: data_v,
                label: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    borderWidth:1,
                    borderColor: 'white'
                }
            }]
        };

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
                        height: 700,
                        flex: 10,
                        marginTop: 0,
                        overflow: 'auto',
                        }}>
                            <h1>Scenario: {scenario_to_show}</h1>Water Supplied by {this.props.pixel_map_supply_source}
                            <ReactEcharts 
                                option={option} 
                                style={{
                                    height: 600,
                                    flex: 10,
                                    marginTop: 10,
                                    overflow: 'auto',
                                    }}
                            >
                            </ReactEcharts>
                        </Card>
            </div>
            
        );
    }
}

export default WEAP_Multi_Tab_Pixel_Map_map;