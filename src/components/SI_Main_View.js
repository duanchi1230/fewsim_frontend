import React, { Component } from 'react';
import {Card, Button, Radio, Select, Row, Col, Modal, Tree} from 'antd';
import '../styles/App.css';
import {findDOMNode} from 'react-dom';
import FlatView from "./SI_FlatView";
import CompareView from "./SI_CompareView";

// This Module is the main Module for sustaianbility index visualization

const { Option , OptGroup} = Select;
const {TreeNode} = Tree;
const VIEW_STATUS_FLAT = 'VIEW_STATUS_FLAT';
const VIEW_STATUS_COMPARE = 'VIEW_STATUS_COMPARE';

const VIEW_SUSVIEW_WIDTH = 1200;
const VIEW_SUSVIEW_HEIGHT = 800;

class SI_Main_View extends Component {
    constructor() {
        super();

        this.state = {
            series_sustainability_index: [],
            customized_sustainability_variables_calculated: [],
            loaded_group_index_simulated:[],
            SI_data_customized: [],
            SI_data_loaded: [],
            index_to_show: "empty",
            base_scenario_compare: "Base",
            compare_mode: false,
            isSelectSIModalVisible: false,
            scenario_compare_mode: "",
            index_compare_mode: ""

        };
        this.state.viewStatus = VIEW_STATUS_FLAT;

        // states for the compare view
        this.state.compareChartBlock = null;
        this.state.compareScenarioName = null;
        this.state.compareSusIndexName = null;
    }

    handleViewStatusChange = (event) => {
        this.setState({
            viewStatus: event.target.value
        })
    };

    handleCompareButtonClick = (chartBlock) => {
        this.setState({
            compareChartBlock: chartBlock,
            viewStatus: VIEW_STATUS_COMPARE
        });
    };

    handleCompareScenarioChange = (value) => {
        // let data = []
        // if(this.state.index_to_show==="customized" || this.state.index_to_show==="empty"){
        //     data = this.state.SI_data_customized[0]["seriesData"]
        // }
        // console.log(this.state.index_to_show)
        // this.state.SI_data_loaded.forEach(data_loaded=>{
        //     if(this.state.index_to_show.includes(data_loaded["name"])){
        //         data = data_loaded["seriesData"]
        //     }
        // })

        let data = {"chartBlocks":[], 
        "scenarioNames":[],
        "susIndexNames":[],
        "timeRange":[]}

        console.log(this.state.SI_data_customized)
        if(this.state.index_to_show==="customized" || this.state.index_to_show==="empty"){
        data = this.state.SI_data_customized[0]["seriesData"]
        }
        this.state.SI_data_customized.forEach(data_loaded=>{
        if(this.state.index_to_show.includes(data_loaded["name"])){
            
            data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                data.chartBlocks.push(block)
            })
            data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                if(data.scenarioNames.includes(name)===false){
                    data.scenarioNames.push(name)
                }
                
            })
            data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                data.susIndexNames.push(name)
            })
            data.timeRange = data_loaded["seriesData"]["timeRange"] 
        }
        })

        this.state.SI_data_loaded.forEach(data_loaded=>{
        if(this.state.index_to_show.includes(data_loaded["name"])){
            
            data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                data.chartBlocks.push(block)
            })
            data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                if(data.scenarioNames.includes(name)===false){
                    data.scenarioNames.push(name)
                }
                
            })
            data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                data.susIndexNames.push(name)
            })
            data.timeRange = data_loaded["seriesData"]["timeRange"] 
        }
        })

        const newCompare = data.chartBlocks.filter(
            block => block.susIndexName === this.state.compareChartBlock.susIndexName
                && block.scenarioName === value
        );
        console.log(newCompare)
        this.setState({
            compareChartBlock: newCompare[0],
        });
    };

    handleCompareSusIndexChange = (value) => {
        // let data = []
        // if(this.state.index_to_show==="customized" || this.state.index_to_show==="empty"){
        //     data = this.state.SI_data_customized[0]["seriesData"]
        // }
        // console.log(this.state.index_to_show)
        // this.state.SI_data_loaded.forEach(data_loaded=>{
        //     if(this.state.index_to_show.includes(data_loaded["name"])){
        //         data = data_loaded["seriesData"]
        //     }
        // })

        let data = {"chartBlocks":[], 
        "scenarioNames":[],
        "susIndexNames":[],
        "timeRange":[]}

        console.log(this.state.SI_data_customized)
        if(this.state.index_to_show==="customized" || this.state.index_to_show==="empty"){
        data = this.state.SI_data_customized[0]["seriesData"]
        }
        this.state.SI_data_customized.forEach(data_loaded=>{
        if(this.state.index_to_show.includes(data_loaded["name"])){
            
            data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                data.chartBlocks.push(block)
            })
            data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                if(data.scenarioNames.includes(name)===false){
                    data.scenarioNames.push(name)
                }
                
            })
            data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                data.susIndexNames.push(name)
            })
            data.timeRange = data_loaded["seriesData"]["timeRange"] 
        }
        })

        this.state.SI_data_loaded.forEach(data_loaded=>{
        if(this.state.index_to_show.includes(data_loaded["name"])){
            
            data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                data.chartBlocks.push(block)
            })
            data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                if(data.scenarioNames.includes(name)===false){
                    data.scenarioNames.push(name)
                }
                
            })
            data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                data.susIndexNames.push(name)
            })
            data.timeRange = data_loaded["seriesData"]["timeRange"] 
        }
        })

        const newCompare = data.chartBlocks.filter(
            block => block.scenarioName === this.state.compareChartBlock.scenarioName
                && block.susIndexName === value
        );
        console.log(newCompare)

        this.setState({
            compareChartBlock: newCompare[0],
        });
    };
    componentWillMount(){
        console.log(this.props.sustainability_variables_calculated, this.props.loaded_group_index_simulated, this.props.sustainability_index, this.props.weap_flow)
        let series_sustainability_index = []
        let timeRange = []
        let scenarioNames = []

        // Get the all scenarios names
        JSON.parse(JSON.stringify(this.props.weap_flow)).forEach(w_flow=>{
            scenarioNames.push(w_flow["name"])
        })

        //  Get the simulation time range
        for(let i=JSON.parse(JSON.stringify(this.props.weap_flow[0]["timeRange"]))[0]; i<=JSON.parse(JSON.stringify(this.props.weap_flow[0]["timeRange"]))[1];i++ ){
            timeRange.push(i)
        }
        // Calculate the customized sustainability index 
        let sustainability_variables_calculated = JSON.parse(JSON.stringify(this.props.sustainability_variables_calculated))
        let sustainability_index = JSON.parse(JSON.stringify(this.props.sustainability_index))
        if(sustainability_variables_calculated.length>0 && sustainability_index.length>0){

            for(let i=0; i<sustainability_index.length; i++){
                sustainability_index[i]["value"] = this.calculateIndexFunction(sustainability_index[i]["index-function"], sustainability_variables_calculated)
            }
            this.setState({
                customized_sustainability_index_calculated: sustainability_index,
                customized_sustainability_variables_calculated:sustainability_variables_calculated,
                
        })}
        // Calculate the loaded sustainability index 
        let loaded_group_index_simulated = JSON.parse(JSON.stringify(this.props.loaded_group_index_simulated))
        loaded_group_index_simulated.forEach(index_group=>{
            index_group["index"].forEach(index=>{
                index["value"] = this.calculateIndexFunction(index["index-function"], index_group["variable"])
            })
        })
        this.setState({
            loaded_group_index_simulated: loaded_group_index_simulated
        })
        console.log(loaded_group_index_simulated)

        // Reform the data structure of Customized Index
        let seriesData = {
            timeRange: timeRange,
            scenarioNames: scenarioNames,
            susIndexNames: [],
        };
        let chartBlocks = [];
        if(sustainability_index.length>0){
            for(let i=0; i<sustainability_index.length; i++){
                seriesData.susIndexNames.push(sustainability_index[i]["index-name"])
                for(let j=0; j<sustainability_index[i]["value"].length; j++){
                    chartBlocks.push({
                        scenarioIdx: j,
                        scenarioName: sustainability_index[i]["value"][j]["name"],
                        susIndexIdx: i,
                        susIndexName: sustainability_index[i]["index-name"],
                        series: sustainability_index[i]["value"][j]["calculated"],
                        indexFunction: sustainability_index[i]["index-function"]
                    })
                }
            }
            seriesData.chartBlocks = chartBlocks;
            console.log(seriesData)
            this.setState({
                SI_data_customized: [{"name": "customized", "seriesData": seriesData}]
            })
        }
        

        // Reform the data structure of Loaded Index
        let SI_data_loaded = []
        for(let k=0; k<loaded_group_index_simulated.length; k++){
            seriesData = {
                timeRange: timeRange,
                scenarioNames: scenarioNames,
                susIndexNames: [],
            };
            chartBlocks = [];
            for(let i=0; i<loaded_group_index_simulated[k]["index"].length; i++){
                seriesData.susIndexNames.push(loaded_group_index_simulated[k]["index"][i]["index-name"])
                for(let j=0; j<loaded_group_index_simulated[k]["index"][i]["value"].length; j++){
                    chartBlocks.push({
                        scenarioIdx: j,
                        scenarioName: loaded_group_index_simulated[k]["index"][i]["value"][j]["name"],
                        susIndexIdx: i,
                        susIndexName: loaded_group_index_simulated[k]["index"][i]["index-name"],
                        series: loaded_group_index_simulated[k]["index"][i]["value"][j]["calculated"],
                        indexFunction: loaded_group_index_simulated[k]["index"][i]["index-function"]
                    })
                }
            }
            seriesData.chartBlocks = chartBlocks;
            SI_data_loaded.push({"name": loaded_group_index_simulated[k]["name"], "seriesData": seriesData})
        }
        console.log(SI_data_loaded)
        this.setState({
            SI_data_loaded: SI_data_loaded
        })
    
    }

    calculateIndexFunction(index_functions, sustainability_variables_calculated){
        const variables = this.parseIndex(index_functions)
        let values = {}
        let scenarios = []
        variables.map(v=>{sustainability_variables_calculated.map(s_v=>{
          if(v===s_v["name"]){
            values[v] = s_v["node"]
            // console.log(v)
          }})
          var re = new RegExp(v,"g")
          index_functions = index_functions.replace(re, "values['"+v+ "']['value'][i]['calculated'][j]")
          }
        )

        let calculated_index_value = []
        for(let i=0;i< sustainability_variables_calculated[0]['node']['value'].length;i++){
            let s_value = []
            for(let j=0; j<sustainability_variables_calculated[0]['node']['value'][i]['calculated'].length;j++){
                s_value.push(eval(index_functions))
                
            }
            let s_name = sustainability_variables_calculated[0]['node']['value'][i]['name']
            calculated_index_value.push({'name':s_name, 'calculated': s_value})
        }
        return calculated_index_value
    }
  
    parseNodeValues(values, sustainability_variables_calculated){
    console.log(values)
    let parsed_value = []
    let num_years = sustainability_variables_calculated[0]["node"]["value"].length
    console.log(num_years)
    for(let i=0; i<num_years; i++){
        let v_year = {}
        Object.entries(values).forEach(v=>{
        v_year[v[0]] = v[1]["value"][i]
        v_year["node"] = v[1]
        })
        parsed_value.push(v_year)
    }
    return parsed_value
    }

    parseIndex(string_formular){
        let variables = string_formular.match(/[A-Za-z]([_A-Za-z0-9]+)/g)
        console.log(variables)
        if(variables != null){return Array.from(new Set(variables))}
        else{return []}
        }

    handleIndexGroupChange(element){
        console.log(element)
        this.setState({
            index_to_show: element,
        })
    }

    handleChangeCompareScenario = (name) =>{
        console.log(name)
        this.setState({
            base_scenario_compare: name
        })
    }

    showSustainabilityIndexModal = () =>{
        this.setState({isSelectSIModalVisible: true})
    }

    hideSustainabilityIndexModal = () =>{
        this.setState({isSelectSIModalVisible: false})
    }

    handleSIChecked=(checkedKeys)=>{
        let index_to_show = []
        checkedKeys.forEach(key=>{
            if(key!=="loaded"){
                index_to_show.push(key)
            }
        })
        console.log(checkedKeys)
        this.setState({
            index_to_show: index_to_show
        })
    }

    render() {
        const TEST_NUM_SCENARIO = 3;
        const TEST_NUM_INDEX = 4;
        const TEST_NUM_TIME_STEP = 11;
        const createRandomSeries = () => Array.from(Array(TEST_NUM_TIME_STEP)).map(x => Math.random());
        // let seriesData = {
        //     timeRange: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
        //     scenarioNames: Array.from(Array(TEST_NUM_SCENARIO)).map((d, i) => `Scenario ${i}`),
        //     susIndexNames: Array.from(Array(TEST_NUM_INDEX)).map((d, i) => `Index ${i}`),
        // };
        
        // // Generate dummy test data
        
        // let chartBlocks = [];
        
        // for (let iIndex = 0; iIndex < TEST_NUM_INDEX; iIndex++) {
        //     for (let iScenario = 0; iScenario < TEST_NUM_SCENARIO; iScenario++) {
        //         chartBlocks.push({
        //             scenarioIdx: iScenario,
        //             scenarioName: `Scenario ${iScenario}`,
        //             susIndexIdx: iIndex,
        //             susIndexName: `Index ${iIndex}`,
        //             series: createRandomSeries()
        //         })
        //     }
        // }
        
        // seriesData.chartBlocks = chartBlocks;
        
        let viewComponent;
        let data = {"chartBlocks":[], 
                    "scenarioNames":[],
                    "susIndexNames":[],
                    "timeRange":[]}
        let percentage_data = {"chartBlocks":[], 
                                "scenarioNames":[],
                                "susIndexNames":[],
                                "timeRange":[]}
        console.log(this.state.SI_data_customized)
        if(this.state.index_to_show==="customized" || this.state.index_to_show==="empty"){
            data = this.state.SI_data_customized[0]["seriesData"]
        }
        this.state.SI_data_customized.forEach(data_loaded=>{
            if(this.state.index_to_show.includes(data_loaded["name"])){
                
                data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                    data.chartBlocks.push(block)
                })
                data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                    if(data.scenarioNames.includes(name)===false){
                        data.scenarioNames.push(name)
                    }
                    
                })
                data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                    data.susIndexNames.push(name)
                })
                data.timeRange = data_loaded["seriesData"]["timeRange"] 
            }
        })

        console.log(this.state.SI_data_loaded)
        this.state.SI_data_loaded.forEach(data_loaded=>{
            if(this.state.index_to_show.includes(data_loaded["name"])){
                
                data_loaded["seriesData"]["chartBlocks"].forEach(block=>{
                    data.chartBlocks.push(block)
                })
                data_loaded["seriesData"]["scenarioNames"].forEach(name=>{
                    if(data.scenarioNames.includes(name)===false){
                        data.scenarioNames.push(name)
                    }
                    
                })
                data_loaded["seriesData"]["susIndexNames"].forEach(name=>{
                    data.susIndexNames.push(name)
                })
                data.timeRange = data_loaded["seriesData"]["timeRange"] 
            }
        })
        percentage_data = JSON.parse(JSON.stringify(data))

        percentage_data.susIndexNames.forEach(name=>{
            let denominator = []
            percentage_data.chartBlocks.forEach(block=>{
                
                if(block.scenarioName===this.state.base_scenario_compare){
                    if(block.susIndexName===name){
                        denominator = JSON.parse(JSON.stringify(block.series))
                    }  
                }
            })
            
            percentage_data.chartBlocks.forEach(block=>{
                if(block.susIndexName===name){
                    let percentage = []
                    for(let i=0;i<+block.series.length;i++){
                        // percentage.push(Math.round((block.series[i]-denominator[i])*100000)/100000)
                        percentage.push(Math.round(((block.series[i]+0.00000001)/(denominator[i]+0.00000001))*100000)/100000)
                    }

                    block.series = percentage
                }
                
            })
        })

        percentage_data.chartBlocks = percentage_data.chartBlocks.filter(block=>block["scenarioName"]!=="Base")
        percentage_data.scenarioNames = percentage_data.scenarioNames.filter(name=>name!=="Base")

        console.log(data, percentage_data)
        if (this.state.viewStatus === VIEW_STATUS_FLAT) {
            viewComponent = <FlatView
                data={data}
                setScenarioToShow={this.props.setScenarioToShow}
                percentage_data={percentage_data}
                handleCompareButtonClick={this.handleCompareButtonClick}
                handleChangeCompareScenario={this.handleChangeCompareScenario}
            />;
        } else if (this.state.viewStatus === VIEW_STATUS_COMPARE) {
            viewComponent = <CompareView
                data={data}
                percentage_data={percentage_data}
                compareChartBlock={this.state.compareChartBlock}
                handleCompareScenarioChange={this.handleCompareScenarioChange}
                handleCompareSusIndexChange={this.handleCompareSusIndexChange}
            />;
        }

        
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    // marginLeft: 20,
                    // marginTop: 20
                }}
            >
                <Modal title="Select Sustainability Index" visible={this.state.isSelectSIModalVisible} onCancel={this.hideSustainabilityIndexModal} footer={null}>
                   
                    <Tree
                    checkable={true}
                    defaultExpandedKeys={['customized']}
                    // checkedKeys={this.state.SI_data_customized}
                    onCheck={this.handleSIChecked}
                    // onLoad={}
                    disabled={false}
                    >
                        {/* <TreeNode title="" key="customized" checkable={false}> */}
                        {this.state.SI_data_customized.map(SI=>{
                            console.log(SI, SI.seriesData, SI.seriesData.susIndexNames)

                                return <TreeNode title={SI.name} key={SI.name} checkable={true}>

                                </TreeNode>
                            })
                        }
                        {/* </TreeNode> */}
                        <TreeNode title="loaded" key="loaded" checkable={true}>
                            {this.state.SI_data_loaded.map(SI=>{
                                console.log(SI, SI.seriesData, SI.seriesData.susIndexNames)

                                    return <TreeNode title={SI.name} key={SI.name} checkable={true}>

                                    </TreeNode>
                                })
                            }
                        </TreeNode>
                    </Tree>
                    
                </Modal>
                <Card
                    size="small"
                    title={<Row>
                                {"Select Sustainability Index: "}
                                {/* <Select  style={{ width: 150 , height: 15}} onChange={this.handleIndexGroupChange.bind(this)} mode="multiple" as const>
                                    {this.state.SI_data_customized.map(sustainability_index=>{
                                            return <Option value={sustainability_index["name"]}>{sustainability_index["name"]}</Option>  
                                        })}
                                    <OptGroup label="Loaded">
                                        {this.state.SI_data_loaded.map(sustainability_group=>{
                                            return <Option value={sustainability_group["name"]}>{sustainability_group["name"]}</Option>  
                                        })}
                                    </OptGroup>
                                </Select> */}
                                <Button onClick={this.showSustainabilityIndexModal}>Select Sustainability Index</Button>
                            </Row>
                            }
                    headStyle={{
                        background: 'rgb(236, 236, 236)'
                    }}
                    style={{
                        width: '100%',
                        height: 900,
                        overflow: 'auto',
                        
                    }}
                    extra={
                        <Radio.Group
                            onChange={this.handleViewStatusChange}
                            defaultValue={VIEW_STATUS_FLAT}
                            value={this.state.viewStatus}
                            size="small"
                        >
                            <Radio.Button value={VIEW_STATUS_FLAT}>Flat Mode</Radio.Button>
                            <Radio.Button value={VIEW_STATUS_COMPARE}>Compare Mode</Radio.Button>
                        </Radio.Group>
                    }
                >
                    {viewComponent}
                </Card>
            </div>
        );
    }
}

export default SI_Main_View;