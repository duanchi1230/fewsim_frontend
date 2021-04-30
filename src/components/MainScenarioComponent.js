import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Row, Col, Divider, Empty, Card, Button, Tabs} from 'antd';

import VarTreeList from './VarTreeList';
import WEAP_PixelMapView from './WEAP_PixelMapView';
import LEAP_Visualization from './LEAP_Visualization';
import Variables_Radial_Tree from './Variables_Radial_Tree'
import LEAP_PixelMapView from './LEAP_PixelMapView'
import Sustainability_Index from './Sustainability_Index'
import WEAP_Result_Graph from './WEAP_Result_Graph'
import LEAP_Result_Graph from './LEAP_Result_Graph'
import Sustainability_Index_Explorer from './Sustainability_Index_Explorer'
import WEAP_Scenarios_Review from './Explorer_Scenarios_Review'
import WEAP_Variables_Ranking from './WEAP_Variables_Ranking'
import FEW_Nexus_Panel from './FEW_Nexus_Panel'
import LEAP_Variables_Ranking from './LEAP_Variables_Ranking'
import SI_Main_View from './SI_Main_View'
import WEAP_Multi_Tab_Pixel_Map from './WEAP_Multi_Tab_Pixel_Map'
import WEAP_Multi_Tab_Pixel_Map_map from './WEAP_Multi_Tab_Pixel_Map_map'
import Food_Visualization from './Food_Visualization'
import WEAP_Demand_PirChart from './WEAP_Demand_PirChart'
import Food_Visualization_CropArea from './Food_Visualization_CropArea'
import Food_Visualization_PieChart from './Food_Visualization_PieChart';

const { TabPane } = Tabs;
export default class MainScenarioComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {

            isButtonDisabled: false,
            runButton: 'Run Model',
            modelStatus:'Finished',
            checkedOutput: [],
            sustainability_variables: [],
            sustainability_index: [],
            run_model_status: this.props.run_model_status,
            scenario_to_show: 'Base',
            type_ranking: 'Demand',
            variable_ranking: 'Energy Demand Final Units',
            pixel_map_supply_source: 'from SRP Withdrawal',
            coupled_parameters: []
            
        };
    }

    runModel=(v)=>{
        this.setState({
            isButtonDisabled: true,
            runButton: 'Running...',
            modelStatus:'Running'
        })
        // console.log(this.state.isButtonDisabled)

        fetch('/proj/1/weap/scenario/0', {method: 'POST', body: JSON.stringify({'data':'1'})}).then(r=>r.json()).then(r=>this.setState({
            isButtonDisabled: false,
            runButton: 'Run Model',
            modelStatus:'Finished'
        }))
    }

    setScenarioToShow(scenario_name){
        console.log(scenario_name)
        this.setState({
            scenario_to_show:scenario_name
        })
    }

    handleNodeChecked = (checkedKeys, info) => {     
        this.setState(
            {checkedOutput:checkedKeys}
        )
    };
    testButtonClicked = () => {
        const scenarios = this.props.scenarios
        
        fetch('/proj/test/weap/scenario', { method: 'GET' }).then(r=>r.json()).then(d=>console.log(d))
    }

    getSuatainabilityIndex(sustainability_index, sustainability_variables){
        this.setState({sustainability_index: sustainability_index,
            sustainability_variables:sustainability_variables})
        console.log(sustainability_variables, sustainability_index)
    }

    componentDidUpdate(){
        console.log(this.state.sustainability_index)
        console.log(this.props.loaded_group_index_simulated)
    }  

    componentDidMount(){
        fetch('get-coupled-parameters', { method: 'GET' }).then(r=>r.json()).then(d=>{console.log(d); this.setState({coupled_parameters: d})}) 
        console.log(this.props.loaded_group_index_simulated)
    }
    setLeapDataType(type, variable){
        console.log(type, variable)
        this.setState({type_ranking: type, variable_ranking: variable})
    }

    setSupplyPixelMap(name){
        console.log(name)
        this.setState({
            pixel_map_supply_source: name
        })
        
    }

    render() {

        console.log(this.props.created_scenarios);
        // let {width, height} = findDOMNode(this).getBoundingClientRect();
        // console.log(width, height)

        if (this.props.run_model_status === 'null' && this.props.run_log.length===0) {
            return (
                <Empty
                    style={{marginTop: '20%'}}
                    description={<div>Please Run Model</div>}
                />
            );
        }

        if (this.props.run_model_status === 'null' && this.props.run_log.length>0) {
            return (
                <Empty
                    style={{marginTop: '20%'}}
                    description={
                        <div>
                            <div>Model Running</div>
                            {this.props.run_log.map(log=>{
                                return <div id={log.message}>{log.time} {"--->"} {log.message}</div>
                            })}
                        </div>
                    }
                />
            );
        }
        if(this.props.run_model_status === 'finished') {

            return (
                <Row
                    gutter={10}
                    style={{
                        height: '100%',
                        overflow: 'auto'
                    }}
                >
                    <Col span={5}>
                        <div>
                            <Row
                            gutter={0}
                            style={{ height: '100%',
                                    overflow: 'auto' }}
                            >
                                <Col span={24}>
                                    <FEW_Nexus_Panel coupled_parameters={this.state.coupled_parameters}></FEW_Nexus_Panel>
                                </Col>
                                
                            </Row>
                        
                        
                            <Row
                            gutter={0}
                            style={{ height: 950,
                                    // overflow: 'auto', 
                                    flex:10}}
                            >
                                <Col span={24}>
                                    <WEAP_Scenarios_Review created_scenarios={this.props.created_scenarios} 
                                                            setScenarioToShow={this.setScenarioToShow.bind(this)} 
                                                            sensitivity_graph={this.props.sensitivity_graph} 
                                                            sustainability_variables_calculated={this.props.sustainability_variables_calculated}
                                                            sustainability_variables={this.props.sustainability_variables}
                                                            sustainability_index={this.props.sustainability_index}
                                                            scenario_to_show={this.state.scenario_to_show}
                                                            loaded_group_index_simulated={this.props.loaded_group_index_simulated}/>
                                </Col>
                                
                            </Row>

                            {/* <Row
                            gutter={0}
                            style={{ height: '100%',
                                    overflow: 'auto' }}
                            >
                                <Col style={{height: '100%'}}>
                                    <Sustainability_Index_Explorer 
                                        sustainability_variables_calculated={this.props.sustainability_variables_calculated} 
                                        sustainability_index={this.props.sustainability_index}
                                        weap_flow={this.props.weap_flow}
                                        loaded_group_index_simulated={this.props.loaded_group_index_simulated}
                                    />
                                </Col>
                                
                            </Row> */}
                        </div>
                    </Col>
                    <Col
                        span={19}
                        style={{
                            height: '100%',
                            // display: 'flex',
                            // flexDirection: 'column',
                            // overflow: 'auto',
                            marginLeft: 0,
                        }}
                    >     
                        {/* <Tabs 
                            type='card'
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                // overflow: 'auto',
                                // marginLeft: 10,
                                
                        }}>
    
                            <TabPane tab='FEW Variables' key='0'> */}
                                <Row
                                    gutter={[10, 10]}
                                    style={{ marginTop: 0, overflow: 'auto',}}
                                    >
                                        <Col span={11}>

                                            <WEAP_Variables_Ranking 
                                            weap_flow={this.props.weap_flow} 
                                            scenario_to_show={this.state.scenario_to_show}
                                            >
                                            </WEAP_Variables_Ranking>
                                        
                                        </Col>
                                        <Col span={13}> 
                                            <Card
                                                size="small" 
                                                headStyle={{
                                                    background: 'rgb(236, 236, 236)'
                                                }}
                                                title='Click Pixel Map to Choose the WEAP Variable' 
                                                style={{
                                                height:270,
                                                flex: 10,
                                                marginTop: 0,
                                                marginLeft: 0,
                                                overflow: 'auto',
                                                }}>
                                                
                                                <WEAP_Result_Graph weap_result_variable={this.props.weap_result_variable} simulation_time_range={this.props.simulation_time_range}/>
                                            </Card>
                                        </Col>
                                </Row>
                                
                                <Row
                                gutter={0}
                                style={{ height: 950, overflow: 'auto', marginTop: 10,}}
                                >
                                   <Col span={24} style={{ height: '100%', overflow: 'auto', marginTop: 0,}}>
                                   <Tabs 
                                        type='card'
                                        style={{
                                            height: '100%',
                                            display: 'flex',
                                            // flexDirection: 'column',
                                            // overflow: 'auto',
                                            // marginLeft: 10,
                                            
                                    }}>
                                        <TabPane tab='Water' key='1'>
                                            <Row
                                            gutter={[10, 10]}
                                            style={{ marginTop: 0, overflow: 'auto',}}
                                            >
                                                <Col span={8}>
                                                    <WEAP_Multi_Tab_Pixel_Map
                                                        weap_flow={this.props.weap_flow}
                                                        pixel_map_supply_source={this.state.pixel_map_supply_source}
                                                        setSupplyPixelMap={this.setSupplyPixelMap.bind(this)}>
                                                    </WEAP_Multi_Tab_Pixel_Map>
                                                </Col>
                                                <Col span={16}>
                                                    <Row 
                                                        gutter={0}
                                                        style={{ height: 200, overflow: 'auto', }}
                                                    >
                                                        <Col span={24}>
                                                            <WEAP_Demand_PirChart
                                                                weap_flow = {this.props.weap_flow}
                                                                scenario_to_show={this.state.scenario_to_show}
                                                                scenario_to_show={this.state.scenario_to_show}
                                                            >

                                                            </WEAP_Demand_PirChart>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={0}
                                                        style={{ height: 850, overflow: 'auto'}}>
                                                        <Col span={24}>
                                                            <WEAP_Multi_Tab_Pixel_Map_map
                                                                weap_flow={this.props.weap_flow}
                                                                scenario_to_show={this.state.scenario_to_show}
                                                                simulation_time_range={this.props.simulation_time_range}
                                                                pixel_map_supply_source={this.state.pixel_map_supply_source}>

                                                            </WEAP_Multi_Tab_Pixel_Map_map>
                                                        </Col>
                                                    </Row>
                                                    
                                                </Col>
                                                
                                            </Row>
                                        </TabPane>

                                        <TabPane tab='Energy' key='2'>
                                        
                                           
                                            <LEAP_PixelMapView 
                                                leap_data={this.props.leap_data} 
                                                handleLEAPResultVariableClick={this.props.handleLEAPResultVariableClick}
                                                scenario_to_show={this.state.scenario_to_show}
                                                setLeapDataType={this.setLeapDataType.bind(this)}>
                                            </LEAP_PixelMapView>
                                        </TabPane>

                                        <TabPane tab='Food' key='3'>
                                            <Row gutter={[10, 10]}
                                                style={{ marginTop: 0, overflow: 'auto',}}
                                            >
                                                <Col span={8}>
                                                    <Food_Visualization_CropArea>
                                                        
                                                    </Food_Visualization_CropArea>
                                                </Col>
                                                <Col span={16}>
                                                    <Row 
                                                        gutter={0}
                                                        style={{ height: 200, overflow: 'auto', }}
                                                    >
                                                        <Col span={24}>
                                                            <Food_Visualization_PieChart></Food_Visualization_PieChart>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={0}
                                                        style={{ height: 850, overflow: 'auto', marginTop: 10}}>
                                                        <Col span={24}>
                                                            <Food_Visualization>
                                                        
                                                            </Food_Visualization>
                                                        </Col>
                                                    </Row>
                                                    
                                                </Col>
                                            </Row>
                                            
                                        </TabPane>

                                        <TabPane tab='Indices' key='4'>
                                            <SI_Main_View
                                                sustainability_variables_calculated={this.props.sustainability_variables_calculated}
                                                sustainability_index={this.props.sustainability_index}
                                                weap_flow={this.props.weap_flow}
                                                setScenarioToShow={this.setScenarioToShow.bind(this)}
                                                // Loaded existing index:
                                                loaded_group_index_simulated={this.props.loaded_group_index_simulated}
                                            ></SI_Main_View>
                                        </TabPane>
                                        
                                    </Tabs>
                                        
                                  </Col>
                                        
                                </Row>      
                            {/* </TabPane> */}

                            {/* <TabPane tab='LEAP View' key='1'>
                                <Row
                                gutter={[8, 8]}
                                style={{ marginTop: 1 }}
                                >
                                    <Col span={11}> 
                                        <LEAP_Variables_Ranking
                                        leap_data={this.props.leap_data} 
                                        scenario_to_show={this.state.scenario_to_show}
                                        type={this.state.type_ranking}
                                        variable={this.state.variable_ranking}
                                        >
                                        </LEAP_Variables_Ranking>
                                    </Col>
                                    <Col span={13}>
                                        <Card 
                                            size="small" 
                                            headStyle={{
                                                background: 'rgb(236, 236, 236)'
                                            }}
                                            title='Click Pixel Map to Choose the LEAP Variable'
                                            style={{
                                            height:270,
                                            flex: 0,
                                            marginTop: 0,
                                            marginLeft: 10,
                                            overflow: 'auto',
                                            }}>
                                            <LEAP_Result_Graph leap_result_variable={this.props.leap_result_variable} simulation_time_range={this.props.simulation_time_range}/>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row
                                gutter={0}
                                style={{ marginTop: 1 }}
                                >
                                    <Col span={24}>
                                        <LEAP_PixelMapView 
                                            leap_data={this.props.leap_data} 
                                            handleLEAPResultVariableClick={this.props.handleLEAPResultVariableClick}
                                            scenario_to_show={this.state.scenario_to_show}
                                            setLeapDataType={this.setLeapDataType.bind(this)}>
                                        </LEAP_PixelMapView>
                                    </Col>
                                </Row>
                            </TabPane> */}
                            {/* <TabPane tab='FEW Index' key='1'>
                            <Row
                                gutter={0}
                                style={{ height: '100%', overflow: 'auto', }}
                            >
                                <SI_Main_View
                                    sustainability_variables_calculated={this.props.sustainability_variables_calculated}
                                    sustainability_index={this.props.sustainability_index}
                                    weap_flow={this.props.weap_flow}
                                    setScenarioToShow={this.setScenarioToShow.bind(this)}
                                    // Loaded existing index:
                                    loaded_group_index_simulated={this.props.loaded_group_index_simulated}
                                ></SI_Main_View>
                            </Row>   
                                
                                
                            </TabPane> */}
                            {/* <TabPane tab='Sustainability Index' key='2' >
                                
                                <Card 
                                    style={{
                                    height: '100%',
                                    flex: 10,
                                    marginTop: 0,
                                    overflow: 'scroll',
                                    }}>
                                    <Sustainability_Index sustainability_variables={this.props.sustainability_variables} sustainability_index={this.props.sustainability_index}/>
                                </Card>        
                            </TabPane> */}
                        {/* </Tabs> */}
                    </Col>  
                    
                    {/*<Col*/}
                    {/*span={10}*/}
                    {/*style={{*/}
                    {/*height: '100%'*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*<Card*/}
                    {/*title='Details'*/}
                    {/*// size='small'*/}
                    {/*style={{*/}
                    {/*height: '100%'*/}
                    {/*}}*/}
                    {/*>*/}
                    {/**/}
                    {/*</Card>*/}
                    {/*</Col>*/}
                </Row>
                );
        }
    }
}