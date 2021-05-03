import React, {Component} from 'react';
import {Button, Col, Row, Dropdown, Menu, Checkbox, Divider, Switch, Select, List, Card} from 'antd';
import ReactEcharts from 'echarts-for-react';
import {Icon, LinkOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';

// This Module is for sustaianbility index visualization: Flat View and Compare Scenario View
//TODO: need adjustment
// const VIEW_FLAT_VIEW_HEIGHT = 685;
const VIEW_FLAT_VIEW_HEIGHT = '100%';
const VIEW_CHART_HEIGHT = 165;
// const VIEW_CHART_HEIGHT = '100%';
const ECHARTS_TITLE_TEXT_STYLE = {fontSize: 14};
const Title_Font_Size = ECHARTS_TITLE_TEXT_STYLE.fontSize
const { Option , OptGroup} = Select;
const chart_title_color = {'weap': '#2b8cbe', 'leap': '#f46d43', 'mpm':'#d9ef8b'}

export default class FlatView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disabledScenarios: [],
            disabledSusIndices: [],
            aggregateScenarios: false,
            aggregateIndices: false,
            compareMode:false
        };
    }

    handleScenarioChange = (event, name) => {
        // handle the mouse event of filtering scenarios
        let newDisabledScenario = [...this.state.disabledScenarios];

        if (!event.target.checked) {
            newDisabledScenario.push(name);
            this.setState({
                disabledScenarios: newDisabledScenario
            });
        } else {
            this.setState({
                disabledScenarios: newDisabledScenario.filter(x => x !== name)
            })
        }
    };

    handleSusIndexChange = (event, name) => {
        //  handle the mouse event of filtering indices
        let newDisabledSusIndices = [...this.state.disabledSusIndices];

        if (!event.target.checked) {
            newDisabledSusIndices.push(name);
            this.setState({
                disabledSusIndices: newDisabledSusIndices
            });
        } else {
            this.setState({
                disabledSusIndices: newDisabledSusIndices.filter(x => x !== name)
            })
        }

    };

    handleAggregateScenarios = (aggregateScenarios) => {
        // handle the mouse event of enabling or disabling the aggregate scenario function
        this.setState({aggregateScenarios});
    };

    handleAggregateSusIndex = (aggregateIndices) => {
        // handle the mouse event of enabling or disabling the aggregate index function
        this.setState({aggregateIndices});
    };

    handleCompareMode = (compareMode) => {
        //  hanle compare mode enabling
        
        console.log(compareMode)
        this.setState({compareMode});
    };

    handleCompareButtonClick = (chartBlock) => {
        //  handle compre mode enabling or disabling
        this.props.handleCompareButtonClick(chartBlock);
    };


    render() {
     
        let data = this.props.data;
        const percentage_data = this.props.percentage_data;
        const {scenarioNames, susIndexNames} = data;

        const scenarioMenu = <Menu>
            {
                scenarioNames.map((name, i) =>
                    <Checkbox
                        key={`scenario-${i}`}
                        onChange={e => this.handleScenarioChange(e, name)}
                        defaultChecked={true}
                    >
                        {name}
                    </Checkbox>
                )
            }
        </Menu>;

        const susIndexMenu = <Menu>
            {
                susIndexNames.map((name, i) =>
                    <Checkbox
                        key={`susindex-${i}`}
                        onChange={e => this.handleSusIndexChange(e, name)}
                        defaultChecked={true}
                    >
                        {name}
                    </Checkbox>
                )
            }
        </Menu>;

        const compareBaseScenario = <div>
            {
                // susIndexNames.map((name, i) =>
                //     <Checkbox
                //         key={`susindex-${i}`}
                //         onChange={e => this.props.handleChangeCompareScenario(e, name)}
                //         defaultChecked={true}
                //     >
                //         {name}
                //     </Checkbox>
                // )
                <Select  style={{ width: 150 , height: 30}} onChange={this.props.handleChangeCompareScenario}>
                    {/* {this.state.SI_data_customized.map(sustainability_index=>{
                            return <Option value={sustainability_index["name"]}>{sustainability_index["name"]}</Option>  
                        })} */}
                    
                    {scenarioNames.map((name, i)=>{
                        return <Option value={name}>{name}</Option>  
                    })}
                    
                </Select>
            }
            </div>;
        //  add text header based on the view mode
        if(this.state.compareMode){
            data = JSON.parse(JSON.stringify(percentage_data))
        }

        let text_header = "Scenario (Column)"
        if(this.state.aggregateScenarios){
            text_header = "Aggregate Scenario"
        }

        if(this.state.aggregateIndices){
            text_header = "Aggregate Indices"
        }

        if(this.state.compareMode){
            text_header = "Scenario (Column)"
        }

        const enabledScenarios = data.scenarioNames.filter(
            d => this.state.disabledScenarios.indexOf(d) === -1
        );

        return (
            <div>
            <div style={{transform: "rotate(90deg)"}}>
                Index
            </div>
            
            <div
                style={{
                    // marginBottom: 16,
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                
                <Row
                    style={{
                        marginBottom: 16,
                        overflow: 'auto',
                    }}
                >
                    <span>Aggregate Scenarios</span>
                    <Switch
                        defaultChecked={this.state.aggregateScenarios}
                        onChange={this.handleAggregateScenarios}
                        style={{marginLeft: 4, marginRight: 8}}
                    />

                    <Dropdown disabled={this.state.aggregateScenarios} overlay={scenarioMenu}>
                        <Button>Scenarios</Button>
                    </Dropdown>

                    <Divider type="vertical"/>

                    <span>Aggregate Indices</span>
                    <Switch
                        defaultChecked={this.state.aggregateIndices}
                        onChange={this.handleAggregateSusIndex}
                        style={{marginLeft: 4, marginRight: 8}}
                    />

                    <Dropdown disabled={this.state.aggregateIndices} overlay={susIndexMenu}>
                        <Button>Sustainability Indices</Button>
                    </Dropdown>

                    <Divider type="vertical"/>
                    <span>Comparing Mode</span>
                    <Switch
                        defaultChecked={this.state.aggregateIndices}
                        onChange={this.handleCompareMode}
                        style={{marginLeft: 4, marginRight: 8}}
                    />
                    
                    <Select  style={{ width: 150 , height: 30}} onChange={this.props.handleChangeCompareScenario} disabled={true} defaultValue={"Base"}>
                        {/* {this.state.SI_data_customized.map(sustainability_index=>{
                                return <Option value={sustainability_index["name"]}>{sustainability_index["name"]}</Option>  
                            })} */}
                        
                        {scenarioNames.map((name, i)=>{
                            return <Option value={name}>{name}</Option>  
                        })}
                
                    </Select>
                    {/* <Dropdown disabled={this.state.aggregateIndices} overlay={compareBaseScenario}>
                        <Button>Select Scenario</Button>
                    </Dropdown> */}
                </Row>
                
                <Divider>
                    {text_header}        
                </Divider>
                
                {
                    (this.state.aggregateScenarios || this.state.aggregateIndices)
                    ? <Row>{text_header}</Row>
                        : <Row gutter={5}>
                        <Col span={1}>
                            
                        </Col>
    
                        <Col span={23}>
                        <List
                            // grid={{gutter: 8, column: enabledScenarios.length}}
                            grid={{gutter: 16, 
                                    column: enabledScenarios.length}}
                            dataSource={enabledScenarios}
                            renderItem={item => {
                                console.log(item)
                                return <List.Item>
                                     
                                        <div class = "sustainability-index-flat-row-name" id={item}
                                            style={{
                                                // width: 300,
                                                // "text-orientation": "mixed",
                                                // "writing-mode": "vertical-rl",
                                                // "transform": "rotate(180deg)", 
                                                "font-weight": "bold",
                                                height: 15,
                                                // color: chart_title_color[this.mapTitleNameColor(item)]
                                        }}>
                                            {item}
                                        </div>
                                    </List.Item>
                            }}
                        />
                        
                        </Col>
                    </Row>
                }

                <Row
                style={{
                    // overflowY: 'scroll',
                    // overflowX: 'hidden',
                    overflow: 'auto',
                    height: 900,
                }}
                >
                    {
                        // mount the visualization modules basen on status of aggregating scenarios or indices
                        (this.state.aggregateScenarios || this.state.aggregateIndices)
                            ? <AggregatedChartGrid
                                data={data}
                                disabledScenarios={this.state.disabledScenarios}
                                disabledSusIndices={this.state.disabledSusIndices}
                                aggregateScenarios={this.state.aggregateScenarios}
                                aggregateIndices={this.state.aggregateIndices}
                            />
                            : <Col span={24}>
                                    <FlatChartGrid
                                        data={data}
                                        setScenarioToShow={this.props.setScenarioToShow}
                                        compareMode={this.state.compareMode}
                                        disabledScenarios={this.state.disabledScenarios}
                                        disabledSusIndices={this.state.disabledSusIndices}
                                        handleCompareButtonClick={this.handleCompareButtonClick}
                                    />
                                </Col>
    
                    }
                </Row> 
                
            </div>
            </div>
        );
    };
}


//  The following for the sensitivity index visualization flat view 
class FlatChartGrid extends Component {
    constructor() {
        super();
    }

    handleCompareButtonClick = (chartBlock) => {
        //  handle compare mode enabling mouse event
        this.props.handleCompareButtonClick(chartBlock);
    };

    mapTitleNameColor(name){
        // map the chart title color
        let splited_name = name.split(' ')
        let color_type = "mpm"
        let weap_keys = ["Groundwater", "CAP", "Water"]
        let leap_keys = ["Renewable", "Electricity"]
        
        weap_keys.forEach(w_key=>{
            if(splited_name.includes(w_key) ){
                color_type = "weap"
            }
        })
        leap_keys.forEach(l_key=>{
            if(splited_name.includes(l_key) ){
                color_type = "leap"
            }
        })
        return color_type
    }

    
    mapColor(value, min_value, max_value, color){

        // map the encoded color in compare mode

        // console.log(value, min_value, max_value, color)
        // let map_color = "rgb("
        // color.forEach(c=>{
        //     map_color = map_color + (255 - (value-min_value)/(max_value-min_value+0.0001)*(255-c)).toString() +","
        // })
        // console.log(map_color)
        // map_color = map_color.slice(0, -1) + ")"
        // console.log(map_color)
        // return map_color
        
        if(this.props.compareMode===true){
            if(value>1.000001){
                return "#ccebc5"
            }
            if(value<0.999999){
                return "#fbb4ae"
            }
            if(value<1.000001||value>0.999999){
                return "#fff7fb"
            }
        }else{
            return"white"
        }
    }

    // componentDidUpdate(){
    //     var index_chart = document.getElementsByClassName('sustainability-index-flat');
        
    // //     for (var i = 0; i < index_chart.length; i++) {
    // //         console.log(index_chart[i])
    // //         let element = index_chart[i]
    // //         index_chart[i].addEventListener('click', this.mouseSustianbilityIndexOverEffect.bind(this));
    // //         index_chart[i].addEventListener('mouseout', (element)=>{this.mouseSustianbilityIndexOutEffect(element)});
    // //   }
    // }

    // mouseSustianbilityIndexOverEffect(element){
    //     console.log(element.toElement)
    //     console.log("click", '111', element)
    //     console.log("click", '111', element.innerHTML)
    //     this.setState({

    //     })
    // }

    // mouseSustianbilityIndexOutEffect(element){
    //     console.log("mouseover", element)
    //     console.log("mouseover", element.toElement, element.toElement.innerHTML)
    // }

    render() {

        let {data, disabledScenarios, disabledSusIndices} = this.props;
        const enabledScenarios = data.scenarioNames.filter(
            d => disabledScenarios.indexOf(d) === -1
        );
        const enabledSusIndices = data.susIndexNames.filter(
            d => disabledSusIndices.indexOf(d) === -1
        );

        console.log(data)
        // the following keys identifies whether an index is weap, leap or mpm
        let color_type = "mpm"
        let weap_keys = ["Groundwater", "CAP", "Water"]
        let leap_keys = ["Renewable", "Electricity"]
        let mpm_keys = ["Food"]
        const chart_color = {'weap': [43, 140, 190], 'leap': [253, 174, 97], 'mpm':[179, 222, 105]}
        
        let weap_value_range = []
        let leap_value_range = []
        let mpm_value_range = {}
        
        //  add types to the chart blocks
        data.chartBlocks.forEach(blocks=>{
            
            blocks["type"] = "mpm"
            
            weap_keys.forEach(w_key=>{
                if(blocks.susIndexName.split(" ").includes(w_key)){
                    
                    weap_value_range.push(blocks.series[blocks.series.length-1])
                    blocks["type"] = "weap"
                }
            })

            leap_keys.forEach(l_key=>{
                if(blocks.susIndexName.split(" ").includes(l_key)){
                   
                    leap_value_range.push(blocks.series[blocks.series.length-1])
                    blocks["type"] = "leap"
                }
            })

            if(blocks["type"] === "mpm"){
                mpm_value_range[blocks["susIndexName"]] = []
            }
        })

        console.log(mpm_value_range)
        data.chartBlocks.forEach(blocks=>{
            if(blocks["type"] === "mpm"){
                mpm_value_range[blocks["susIndexName"]].push(Math.max(...blocks.series))
            }
        })



        console.log(data)

        let enabledChartBlocks = data.chartBlocks.filter(
            block =>
                enabledScenarios.indexOf(block.scenarioName) >= 0
                && enabledSusIndices.indexOf(block.susIndexName) >= 0
        );

        console.log(enabledChartBlocks)

        let index_value_range = {
            "weap": [Math.min(...weap_value_range), Math.max(...weap_value_range)], 
            "leap": [Math.min(...leap_value_range), Math.max(...leap_value_range)],
            "mpm": mpm_value_range
            }
        const range_max = {'weap': 1, 'leap': 1, 'mpm': mpm_value_range}
        console.log(index_value_range, weap_value_range, leap_value_range, mpm_value_range)
        return (
                <Row
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                        // backgroundColor: 'blue'
                    }}
                    gutter={5}
                >
                    <Col span={1}>
                        {/* {enabledSusIndices.map(index=>{
                            return <Row style={{
                                            // width: 300,
                                            height: VIEW_CHART_HEIGHT+0,
                                    }}>
                                        {index}
                                    </Row>
                        })} */}
                        <List
                            // grid={{gutter: 8, column: enabledScenarios.length}}
                            grid={{gutter: 16, 
                                    column: 1}}
                            dataSource={enabledSusIndices}
                            renderItem={item => {
                                console.log(item)
                                return <List.Item>
                                    <Card
                                        // title={`${item.scenarioName}, ${item.susIndexName}`}
                                        // size="small"
                                        bodyStyle={{
                                            padding: 8,
                                            height: '100%'
                                        }}
                                    >   
                                        <div class = "sustainability-index-flat-row-name" id={item}
                                            style={{
                                                // width: 300,
                                                "text-orientation": "mixed",
                                                "writing-mode": "vertical-rl",
                                                "transform": "rotate(180deg)", 
                                                "font-weight": "bold",
                                                height: VIEW_CHART_HEIGHT+0,
                                                color: chart_title_color[this.mapTitleNameColor(item)]
                                        }}>
                                            {item}
                                        </div>
                                    
                                    </Card>
                                </List.Item>
                            }}
                        />
                    </Col>

                    <Col span={23}>
                        <List
                            // grid={{gutter: 8, column: enabledScenarios.length}}
                            grid={{gutter: 16, 
                                    column: enabledScenarios.length}}
                            
                            dataSource={enabledChartBlocks}
                            renderItem={item => {
                                let max_value = 1
                                if(item.type=="mpm"){
                                    max_value = Math.ceil(Math.max(...range_max[item.type][item.susIndexName]))
                                }
                                return <List.Item>
                                    <Card
                                        // title={`${item.scenarioName}, ${item.susIndexName}`}
                                        // size="small"
                                        bodyStyle={{
                                            padding: 8,
                                            height: '100%'
                                        }} 
                                    >   
                                        <div class = "sustainability-index-flat" id={item.scenarioName}
                                            style={{
                                                // width: 300,
                                                height: VIEW_CHART_HEIGHT+0,
                                        }}>
                                        <ReactEcharts
                                            
                                            option={{
                                                // title: {
                                                //     text: `${item.scenarioName}, ${item.susIndexName}"="${item.indexFunction}`,
                                                //     textStyle: {color: chart_title_color[this.mapTitleNameColor(item.susIndexName)], fontSize: Title_Font_Size, 
                                                //         textBorderColor: "grey", textBorderWidth: 0},
                                                //     // textStyle: {fontSize: Title_Font_Size},
                                                //     top: 10
                                                // },
                                                xAxis: {
                                                    type: 'category',
                                                    data: data.timeRange
                                                },
                                                yAxis: {
                                                    type: 'value',
                                                    min:0,
                                                    max: max_value
                                                },
                                                grid: {
                                                    left: '3%',
                                                    right: '4%',
                                                    bottom: '3%',
                                                    top: '10%',
                                                    containLabel: true
                                                },
                                                series: [{
                                                    name: item.susIndexName,
                                                    type: 'line',
                                                    data: item.series
                                                }]
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                "backgroundColor": this.mapColor(item.series[item.series.length-1], index_value_range[item.type][0], index_value_range[item.type][1], chart_color[item.type]),
                                                "opacity": "80%"
                                            }}
                                        />
                                        </div>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                right: 20,
                                                top: 50,
                                                
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                shape="circle"
                                                icon={<LinkOutlined/>}
                                                onClick={() => this.props.setScenarioToShow(item.scenarioName)}
                                                style={{}}
                                            />
                                        </div>
                                    </Card>
                                </List.Item>
                            }}
                        />
                    </Col>
                </Row>
            
        )
    }
}

//  The following compoenent is for aggregated 
class AggregatedChartGrid extends Component {
    constructor() {
        super();
    }
    
    mapTitleNameColor(name){
        let splited_name = name.split(' ')
        let color_type = "mpm"
        let weap_keys = ["Groundwater", "CAP", "Water"]
        let leap_keys = ["Renewable", "Electricity"]
        console.log(name, splited_name)
        weap_keys.forEach(w_key=>{
            if(splited_name.includes(w_key) ){
                color_type = "weap"
            }
        })
        leap_keys.forEach(l_key=>{
            if(splited_name.includes(l_key) ){
                color_type = "leap"
            }
        })
        return color_type
    }

    render() {
        const {
            data,
            disabledScenarios, disabledSusIndices,
            aggregateScenarios, aggregateIndices
        } = this.props;

        let rowData = [];
        let chart_height = VIEW_CHART_HEIGHT
        // prepare the row data
        if (aggregateScenarios) {
            // filter indices first
            const filteredSusIndexData = data.chartBlocks.filter(
                block => disabledSusIndices.indexOf(block.susIndexName) === -1
            );

            const enabledSusIndices = data.susIndexNames.filter(
                d => disabledSusIndices.indexOf(d) === -1
            );

            for (let i = 0; i < enabledSusIndices.length; i++) {
                const currentSusIndexName = enabledSusIndices[i];
                console.log(currentSusIndexName, enabledSusIndices)
                // the filtered _chartBlock will be in the same row
                const _chartBlocks = filteredSusIndexData.filter(
                    block => block.susIndexName === currentSusIndexName
                );
                console.log(_chartBlocks)
                let row = {
                    title: {
                        text: currentSusIndexName+" = "+_chartBlocks[0].indexFunction,
                        textStyle: {color: chart_title_color[this.mapTitleNameColor(currentSusIndexName)], fontSize: Title_Font_Size}
                    },
                    series: _chartBlocks.map(block => {
                        return {
                            name: block.scenarioName,
                            type: 'line',
                            data: block.series
                        };
                    })
                };

                rowData.push(row);
            }
        } else if (aggregateIndices) {
            // filter scenarios first
            const filteredScenarioData = data.chartBlocks.filter(
                block => disabledScenarios.indexOf(block.scenarioName) === -1
            );

            const enabledScenarios = data.scenarioNames.filter(
                d => disabledScenarios.indexOf(d) === -1
            );

            for (let i = 0; i < enabledScenarios.length; i++) {
                const currentScenarioName = enabledScenarios[i];

                const _chartBlocks = filteredScenarioData.filter(
                    block => block.scenarioName === currentScenarioName
                );

                rowData.push({
                    title: {
                        text: currentScenarioName,
                        textStyle: {color: chart_title_color[this.mapTitleNameColor(data.chartBlocks[0]['susIndexName'])], fontSize: Title_Font_Size},
                    },
                    series: _chartBlocks.map(block => {
                        return {
                            name: block.susIndexName,
                            type: 'line',
                            data: block.series
                        };
                    })
                });
            }

            console.log(rowData, data.chartBlocks)
            chart_height = chart_height + Math.floor(rowData[0]["series"].length/5)*75
        }

       
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                {
                    rowData.map((row, _i) => {
                        return (
                            <Row
                                key={`row-${_i}`}
                                style={{
                                    height: chart_height,
                                    width: '100%'
                                }}
                            >
                                <ReactEcharts
                                    option={{
                                        ...row,
                                        legend: {
                                        data: row.series.map(r => r.name),
                                            top:20
                                        },
                                        tooltip: {
                                            trigger: 'axis'
                                        },
                                        xAxis: {
                                            type: 'category',
                                            data: data.timeRange
                                        },
                                        yAxis: {
                                            type: 'value',
                                            min:0,
                                            max:1
                                        },
                                        grid: {
                                            left: '3%',
                                            right: '4%',
                                            bottom: '3%',
                                            top: '25%',
                                            containLabel: true
                                        },
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                />
                            </Row>
                        );
                    })
                }
            </div>
        );
    }
    
}