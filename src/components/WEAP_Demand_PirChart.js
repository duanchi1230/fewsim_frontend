import React, { Component } from 'react';
import { Button , Collapse , Card, Col, Divider, Icon, Input,notification, Row, Slider, Select, List, Tree, Table, InputNumber} from 'antd';
import * as d3 from 'd3';
import Chart from 'chart.js';
import ReactEcharts from 'echarts-for-react';
import { transpileModule } from 'typescript';
import {LinkOutlined, FilterOutlined} from '@ant-design/icons'

//  This module is for the WEAP Visualization Pie Chart

const { Option , OptGroup} = Select;

const VIEW_CHART_HEIGHT = 180;

class WEAP_Demand_PirChart extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pie_chart_id: {'pie_chart_1':'Municipal', 'pie_chart_2':'Industrial', 'pie_chart_3':'Roosevelt_ID'}
         };
    }

    setPieChart(value, chart_id){
        console.log(value, chart_id)
        let pie_chart_id = this.state.pie_chart_id
        pie_chart_id[chart_id] = value
        console.log(pie_chart_id)
        this.setState({
            // pie_chart_id: 
        })
    }

    render() {

        let demand_site = []
        const flow_filtered_by_scenario = this.props.weap_flow.filter(flow=> flow['name']==this.props.scenario_to_show)[0]
        const flow_value = flow_filtered_by_scenario['var']['output']

        flow_value.forEach(item => {
            if(demand_site.includes(item['site'])===false){
                demand_site.push(item['site'])
            }
        })

        const demand_site_names = demand_site

        // demand_site  = demand_site.slice(0, 3)
        let demand_site_flow = {}
        let data = []

        demand_site.forEach( site=>{
            let data_by_demand = []
            demand_site_flow[site] = {'average':[], 'value':flow_value.filter(flow=> flow['site']===site)}
            demand_site_flow[site]['value'].forEach(flow=>{
                let sum = flow['value'].reduce((previous, current) => current += previous);
                let avg = sum / flow['value'].length;
                data_by_demand.push({'value': avg, 'name':flow['source'].slice(5, flow.length)})
                demand_site_flow[site]['average'].push({'value': avg, 'name':flow['source'].slice(5, flow.length)})
            })
            // data.push({'site':site, 'value': data_by_demand})
        })

        console.log(demand_site_flow)
        // demand_site.forEach(site=>{
        //     demand_site_flow[site] .forEach(flow=>{
        //         let sum = flow['value'].reduce((previous, current) => current += previous);
        //         let avg = sum / flow['value'].length;
        //         data.push({'value': avg, 'name':flow['source'].slice(5, flow.length)})
        //     })
        // })
        
        let pie_chart_id = ['pie_chart_1', 'pie_chart_2', 'pie_chart_3']
        let id = -1
        return (
            <div>
                <Card
                // title='1230'
                // size="small"
                headStyle={{
                    background: 'rgb(236, 236, 236)'
                }}
                style={{
                    height: 190,
                    flex: 10,
                    marginTop: 0,
                    overflow: 'auto',
                    }}
                >
                    {/* <Button
                        size="small"
                        shape="round"
                        icon={<FilterOutlined/>}
                        // onClick={}
                        style={{}}
                    /> */}

                    <List
                    // grid={{gutter: 8, column: enabledScenarios.length}}
                        grid={{gutter: 5, 
                                column: pie_chart_id.length}}
                        dataSource={pie_chart_id}
                        renderItem={item => {
                            id = id + 1
                            console.log(id)
                            return <List.Item>
                                <Card

                                    bodyStyle={{
                                        padding: 0,
                                        height: '100%'
                                    }}
                                >   
                                    <div 
                                        style={{
                                            // width: 300,
                                            height: VIEW_CHART_HEIGHT - 20,
                                    }}>
                                    <ReactEcharts
                                        option={{
                                                // color: ['#08519c', '#4292c6', '#6baed6',  '#c6dbef', '#deebf7', '#f7fbff'],
                                                title: {
                                                    text: this.state.pie_chart_id[item],
                                                    // subtext: '纯属虚构',
                                                    left: 'left',
                                                    textStyle:{
                                                        fontSize: 12
                                                    },
                                                },
                                                tooltip: {
                                                    trigger: 'item'
                                                },
                                                // legend: {
                                                //     orient: 'vertical',
                                                //     left: 'left',
                                                // },
                                                series: [
                                                    {
                                                        name: 'Time Series Average: '+this.props.scenario_to_show,
                                                        type: 'pie',
                                                        radius: '50%',
                                                        data: demand_site_flow[this.state.pie_chart_id[item]]['average'],
                                                        emphasis: {
                                                            itemStyle: {
                                                                shadowBlur: 10,
                                                                shadowOffsetX: 0,
                                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                            }
                                                        }
                                                    }
                                                ]
                                                }}
                                        style={{
                                                height: '100%',
                                                width: 380,
                                        }}
                                />
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 10,
                                        
                                    }}
                                >
                                    {/* <Button
                                        size="small"
                                        shape="circle"
                                        icon={<LinkOutlined/>}
                                        onClick={(pie_chart_id) => this.props.setScenarioToShow(item.scenarioName)}
                                        style={{}}
                                    /> */}
                                    <Select  style={{ width: 100 , height: 30}} onChange={value=>this.setPieChart(value, item)} disabled={false} defaultValue={"SRP Withdrawl"}>
                                            {/* <Option value={'1230'}>1230</Option>  */}
                                        {demand_site_names.map((name)=>{
                                            return <Option value={name}>{name}</Option>  
                                        })}
                                    </Select>
                                </div>
                            </Card>
                        </List.Item>
                    }}
                />
                </Card>
             
             
                
            </div>
        );
    }
}

export default WEAP_Demand_PirChart;