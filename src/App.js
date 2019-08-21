import React, { Component } from 'react';
import { Layout, Button, Row, Col, Divider, Select, Menu, Modal, Tabs, Spin, Card } from 'antd';

import MainScenarioComponent from './components/MainScenarioComponent';
import './styles/App.css';

import InputParameter_WEAP from './components/InputParameter_WEAP'
import InputParameter_LEAP from './components/InputParameter_LEAP'

import CreatedScenarios from './components/CreatedScenarios';
const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createScenarioModalVisible: false,
            activatedMethod: null,
            activatedScenario: null,
            isLoadingScenario: true,

            WEAP_parameter: {
                'population': { 'start': 1, 'end': 1, 'step': 1 },
                'municipal': { 'start': 85, 'end': 100, 'step': 6 },
                'agriculture': { 'start': 85, 'end': 100, 'step': 6 }
            },

            LEAP_parameter: {
                'population': { 'start': 1, 'end': 1, 'step': 1 },
                'industrial': { 'start': 85, 'end': 100, 'step': 6 }
            },

            scenarios: [],
            finishedScenarios: [],
            selectedScenarios: []
        };

        // Initialize data loading
        const DUMMY_PROJ_NAME = 'test';

        fetch('/proj/' + DUMMY_PROJ_NAME, { method: 'GET' })
            .then(r => r.json())
            .then(proj => {
                // const {supportedMethods} = proj;
                const supportedMethods = ['weap'];

                const methodFetches = supportedMethods.map(
                    method => [
                        `/proj/${DUMMY_PROJ_NAME}/${method}/scenario`,
                        { method: 'GET' }
                    ]
                );
                try {
                    Promise.all(
                        methodFetches.map(([url, options]) => fetch(url, options))
                    )
                        .then(responses => Promise.all(responses.map(res => res.json())))
                        .then(scenariosPerMethod => {

                            // fill the scenarios into the proj
                            for (let i = 0; i < supportedMethods.length; i++) {
                                proj[supportedMethods[i]] = {
                                    scenario: scenariosPerMethod[i]
                                };
                            }

                            proj.supportedMethods = supportedMethods;
                            proj.supportedMethodsDisplayNames = { weap: 'WEAP' };
                            this.setState({ proj: proj });
                        });
                } catch (err) {
                    console.log(err);
                }
            });
    }

    handleMethodChange = (value) => {
        this.setState({ activatedMethod: value });
    };

    handleScenarioChange = (sid) => {
        // Search for the scenario
        // load it into the main content

        const { proj, activatedMethod } = this.state;

        // 0. Set the spinning first
        this.setState({ isLoadingScenario: true });

        // 1. Test if the scenario has been loaded
        const candidateScenarioIdx = proj[activatedMethod].scenario.findIndex(s => s.sid === sid),
            candidateScenario = proj[activatedMethod].scenario[candidateScenarioIdx];

        if (!candidateScenario['__filled']) {
            fetch(`/proj/${proj.pid}/${activatedMethod}/scenario/${sid}`, {
                method: 'GET'
            })
                .then(r => r.json())
                .then(newScenario => {
                    let newState = { ...this.state };
                    proj[activatedMethod].scenario[candidateScenarioIdx] = newScenario;
                    newState.isLoadingScenario = false;
                    newState.activatedScenario = newScenario;

                    this.setState(newState);

                    // let scenarioList = newState.proj[activatedMethod];

                    // for (let i = 0; i < scenarioList.length; i++) {
                    //     if (scenarioList[i].sid === sid) {
                    //         scenarioList[i] = newScenario
                    //     }
                    // }

                })
        } else {
            this.setState({
                activatedScenario: candidateScenario,
                isLoadingScenario: false
            })
        }
    };

    handleAddScenarioButtonClicked = () => {
        this.setState({ createScenarioModalVisible: true });
    };

    handleAddScenarioModalClosed = () => {
        this.setState({ createScenarioModalVisible: false })
    };

    handleSubmitNewScenario = () => {

    };

    createScenarios = () => {
        let WP = []
        let WM = []
        let WA = []
        let LP = []
        let LI = []
        let scenarios = []
        // console.log(this.state.WEAP_parameter)
        WP = this.decomposeInputParameter(this.state.WEAP_parameter['population']['start'], this.state.WEAP_parameter['population']['end'], this.state.WEAP_parameter['population']['step'])
        WM = this.decomposeInputParameter(this.state.WEAP_parameter['municipal']['start'], this.state.WEAP_parameter['municipal']['end'], this.state.WEAP_parameter['municipal']['step'])
        WA = this.decomposeInputParameter(this.state.WEAP_parameter['agriculture']['start'], this.state.WEAP_parameter['agriculture']['end'], this.state.WEAP_parameter['agriculture']['step'])
        LP = this.decomposeInputParameter(this.state.LEAP_parameter['population']['start'], this.state.LEAP_parameter['population']['end'], this.state.LEAP_parameter['population']['step'])
        LI = this.decomposeInputParameter(this.state.LEAP_parameter['industrial']['start'], this.state.LEAP_parameter['industrial']['end'], this.state.LEAP_parameter['industrial']['step'])
        WP.forEach(
            wp=>{WM.forEach(
                wm=>{
                    WA.forEach(wa=>{
                        LP.forEach(
                            lp=>{
                                LI.forEach(li=>{
                                    scenarios.push(
                                        {'wp':wp, 'wm':wm, 'wa':wa, 'lp':lp, 'li':li, 'name':'WP:'+wp+' WM:'+wm+' WA:'+wa+' LP:'+lp+' LI:'+li}
                                    )
                                })
                            }
                        )
                    })
                }
            )}
        )
        this.state.scenarios = scenarios
        let selected = []
        scenarios.map(s=>{
            selected.push(s['name'])
        })
        this.setState({
            selectedScenarios: selected
        })
        console.log(this.state.scenarios)
    }

    
    decomposeInputParameter = (start, end, step) => {
        let input = []
        for (let i = start; i.toFixed(1) <= end; i = i + step) {
            input.push(i.toFixed(1))
        }
        return input
    }

    deleteScenarios(){

        console.log(this.state.selectedScenarios)
        let selected = []
        this.state.scenarios.map(
            s=>{
                if(this.state.selectedScenarios.includes(s['name']) != true){

                    selected.push(s)
                }
                
            }
        )

        this.setState({
            scenarios: selected,
            selectedScenarios:selected
        })
    }

    handleNodeChecked = (checkedKeys, info) => {
        this.state.selectedScenarios = checkedKeys
        this.setState({

        })
    };

    render() {

        const {
            proj,
            activatedScenario,
            activatedMethod
        } = this.state;

        if (proj === undefined) {
            return <div
                style={{ height: '100%' }}
            >
                <Layout
                    style={{ height: '100%' }}
                >
                    <Spin
                        tip="Loading..."
                        style={{ margin: 'auto' }}
                    />
                </Layout>
            </div>;
        }

        const { supportedMethods, supportedMethodsDisplayNames } = proj;

        // console.log(proj);

        return (
            <div
                style={{ height: '100%' }}
            >
                <Modal
                    width={1250}
                    visible={this.state.createScenarioModalVisible}
                    onCancel={this.handleAddScenarioModalClosed.bind(this)}
                    footer={null}
                >
                    <Row
                        gutter={16}
                        style={{ minHeight: 380 }}
                    >
                        <Col span={9}>
                            <font size="5">Scenarios List</font>
                            <Card style={{
                                    height:380,
                                    flex: 2,
                                    marginTop: 16,
                                    overflow: 'auto',
                            }}>
                                <CreatedScenarios scenarios={this.state.scenarios} selectedScenarios={this.state.selectedScenarios} handleNodeChecked={this.handleNodeChecked.bind(this)}/>
                            </Card>
                            
                            <Button type="primary" onClick={this.createScenarios}>Create Scenario</Button>

                            <Button type="danger" onClick={this.deleteScenarios.bind(this)}>Delete</Button>

                            {/* <Button type="primary" onClick={this.createScenarios} style={
                                {marginLeft: '85px'}
                            }>Move to Batch</Button> */}
                        </Col>
                        <Col span={15}>
                            <font size="5">Input Parameter</font>
                            <Tabs type="card">
                                <TabPane tab="WEAP" key="1">
                                    <InputParameter_WEAP WEAP_parameter={this.state.WEAP_parameter} />
                                </TabPane>
                                <TabPane tab="LEAP" key="2" >
                                    <InputParameter_LEAP LEAP_parameter={this.state.LEAP_parameter} />
                                </TabPane>
                                <TabPane tab="WEAP-MABIA" key="3">
                                    WEAP-MABIA Input will be incorporated!
                                </TabPane>
                            </Tabs>

                        </Col>
                    </Row>
                </Modal>
                <Layout
                    style={{ height: '100%' }}
                >
                    <Header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div
                            style={{
                                color: '#ddd',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}
                            >
                                FEWSim
                            </div>
                            <div
                                style={{
                                    marginLeft: 48
                                }}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon="plus"
                                    onClick={this.handleAddScenarioButtonClicked.bind(this)}
                                />
                            </div>
                            <div
                                style={{
                                    marginLeft: 16
                                }}
                            >
                                <Select
                                    placeholder={'Select a model'}
                                    style={{
                                        width: 200
                                    }}
                                    onChange={this.handleMethodChange.bind(this)}
                                >
                                    {
                                        supportedMethods.map(
                                            method => <Option
                                                key={method}
                                                value={method}
                                            >
                                                {supportedMethodsDisplayNames[method]}
                                                
                                            </Option>
                                        )
                                    }
                                    {/*<Select.Option value="weap">WEAP</Select.Option>*/}
                                    {/*<Select.Option value="leap">LEAP</Select.Option>*/}
                                    {/*<Select.Option value="mabia">MABIA</Select.Option>*/}
                                </Select>
                            </div>
                            <div
                                style={{
                                    marginLeft: 16
                                }}
                            >
                                <Select
                                    showSearch
                                    placeholder={'Select a scenario'}
                                    style={{
                                        width: 200
                                    }}
                                    disabled={this.state.activatedMethod === null}
                                    onChange={this.handleScenarioChange.bind(1)}
                                >
                                    {
                                        (this.state.activatedMethod === null)
                                            ? null
                                            : proj[this.state.activatedMethod].scenario.map(
                                                scenario => <Option
                                                    key={scenario.sid}
                                                    value={scenario.sid}
                                                >
                                                    {scenario.name}
                                                </Option>
                                            )
                                    }
                                    {/*<Select.Option value="create">Create...</Select.Option>*/}
                                    {/*<Select.Option value="s1">Scenario 1</Select.Option>*/}
                                    {/*<Select.Option value="s2">Scenario 2</Select.Option>*/}
                                    {/*<Select.Option value="s3">Scenario 3</Select.Option>*/}
                                </Select>
                            </div>

                        </div>
                        <div>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                style={{ lineHeight: '64px' }}
                            >
                                <Menu.Item key="helpmenu">Help</Menu.Item>
                                <Menu.Item key="aboutmenu">About</Menu.Item>
                            </Menu>
                        </div>
                    </Header>
                    <Content
                        style={{
                            height: '100%',
                            padding: 16,
                        }}
                    >
                <MainScenarioComponent
                                proj={proj}
                                activatedMethod={activatedMethod}
                                activatedScenario={activatedScenario}
                                selectedScenarios={this.state.selectedScenarios}
                            />
                        }

                    </Content>
                </Layout>
            </div>
        );
    }
}
