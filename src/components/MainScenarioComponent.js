import React, {Component} from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs} from 'antd';

import VarTreeList from './VarTreeList';
import WEAP_PixelMapView from "./WEAP_PixelMapView";
import LEAP_Visualization from "./LEAP_Visualization";
import Variables_Radial_Tree from './Variables_Radial_Tree'
import LEAP_PixelMapView from './LEAP_PixelMapView'
import Sustainability_Index from "./Sustainability_Index"
const { TabPane } = Tabs;
export default class MainScenarioComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {

            isButtonDisabled: false,
            runButton: "Run Model",
            modelStatus:"Finished",
            checkedOutput: [],
            sustainability_variables: [],
            sustainability_index: [],
            run_model_status: this.props.run_model_status
        };
    }

    runModel=(v)=>{
        this.setState({
            isButtonDisabled: true,
            runButton: "Running...",
            modelStatus:"Running"
        })
        console.log(this.state.isButtonDisabled)

        fetch('/proj/1/weap/scenario/0', {method: 'POST', body: JSON.stringify({'data':'1'})}).then(r=>r.json()).then(r=>this.setState({
            isButtonDisabled: false,
            runButton: "Run Model",
            modelStatus:"Finished"
        }))
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
    }

    render() {
        console.log(this.state.run_model_status)
        const {proj, activatedMethod, activatedScenario} = this.props.run_model_status;

        // console.log(activatedScenario);
        if (this.props.run_model_status === 'null') {
            return (
                <Empty
                    style={{marginTop: '20%'}}
                    description={<span>Please Run Model</span>}
                />
            );
        }
        if(this.props.run_model_status === 'finished') {
        return (
            <Row
                gutter={30}
                style={{
                    height: '100%',
                    overflow: "auto"
                }}
            >
                <Col
                    span={30}
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: "auto"
                    }}
                >
                            
                    <Tabs type="card"style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: "auto"
                    }}>

                        <TabPane tab="Pixel_Map_WEAP" key="0">
                            <Card 
                            style={{
                            height:'100%',
                            flex: 10,
                            marginTop: 0,
                            overflow: 'auto',
                            }}>
                                <WEAP_PixelMapView
                                    activatedScenario={activatedScenario} checkedOutput={this.state.checkedOutput} weap_flow={this.props.weap_flow}
                                />
                            </Card>
                        </TabPane>
                        <TabPane tab="Visualization_LEAP" key="1">
                            <Card 
                            style={{
                            height:'100%',
                            flex: 10,
                            marginTop: 0,
                            overflow: 'auto',
                            }}>
                                <LEAP_PixelMapView leap_data={this.props.leap_data} ></LEAP_PixelMapView>
                               
                            </Card>
                        </TabPane>

                        <TabPane tab="Sustainability Index" key="2" >
                            <Card 
                                style={{
                                height: '100%',
                                flex: 10,
                                marginTop: 0,
                                overflow: 'scroll',
                                }}>
                                <Sustainability_Index sustainability_variables={this.props.sustainability_variables} sustainability_index={this.props.sustainability_index}/>
                            </Card>        
                        </TabPane>
                    </Tabs>
                </Col>  
                
                {/*<Col*/}
                {/*span={10}*/}
                {/*style={{*/}
                {/*height: '100%'*/}
                {/*}}*/}
                {/*>*/}
                {/*<Card*/}
                {/*title="Details"*/}
                {/*// size="small"*/}
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