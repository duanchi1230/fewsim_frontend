import React, {Component} from 'react';
import {Layout, Button, Row, Col, Divider, Select, Menu, Modal, Tabs, Spin} from 'antd';

import MainScenarioComponent from './components/MainScenarioComponent';
import './styles/App.css';
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";


const {Header, Content} = Layout;
const {TabPane} = Tabs;
const {Option} = Select;


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createScenarioModalVisible: false,
            activatedMethod: null,
            activatedScenario: null,

            isLoadingScenario: false
        };

        // Initialize data loading
        const DUMMY_PROJ_NAME = 'test';

        fetch('/proj/' + DUMMY_PROJ_NAME, {method: 'GET'})
            .then(r => r.json())
            .then(proj => {
                // const {supportedMethods} = proj;
                const supportedMethods = ['weap'];

                const methodFetches = supportedMethods.map(
                    method => [
                        `/proj/${DUMMY_PROJ_NAME}/${method}/scenario`,
                        {method: 'GET'}
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
                            proj.supportedMethodsDisplayNames = {weap: 'WEAP'};
                            this.setState({proj: proj});
                        });
                } catch (err) {
                    console.log(err);
                }
            });
    }

    handleMethodChange = (value) => {
        this.setState({activatedMethod: value});
    };

    handleScenarioChange = (sid) => {
        // Search for the scenario
        // load it into the main content

        const {proj, activatedMethod} = this.state;

        // 0. Set the spinning first
        this.setState({isLoadingScenario: true});

        // 1. Test if the scenario has been loaded
        const candidateScenarioIdx = proj[activatedMethod].scenario.findIndex(s => s.sid === sid),
            candidateScenario = proj[activatedMethod].scenario[candidateScenarioIdx];

        if (!candidateScenario['__filled']) {
            fetch(`/proj/${proj.pid}/${activatedMethod}/scenario/${sid}`, {
                method: 'GET'
            })
                .then(r => r.json())
                .then(newScenario => {
                    let newState = {...this.state};
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
        this.setState({createScenarioModalVisible: true});
    };

    handleAddScenarioModalClosed = () => {
        this.setState({createScenarioModalVisible: false})
    };

    handleSubmitNewScenario = () => {

    };

    render() {

        const {
            proj,
            activatedScenario,
            activatedMethod
        } = this.state;

        if (proj === undefined) {
            return <div
                style={{height: '100%'}}
            >
                <Layout
                    style={{height: '100%'}}
                >
                    <Spin
                        tip="Loading..."
                        style={{margin: 'auto'}}
                    />
                </Layout>
            </div>;
        }

        const {supportedMethods, supportedMethodsDisplayNames} = proj;

        // console.log(proj);

        return (
            <div
                style={{height: '100%'}}
            >
                <Modal
                    width={800}
                    visible={this.state.createScenarioModalVisible}
                    onCancel={this.handleAddScenarioModalClosed.bind(this)}
                    footer={null}
                >
                    <Row
                        gutter={16}
                        style={{minHeight: 430}}
                    >
                        <Col span={12}>
                            Existing scenarios
                        </Col>
                        <Col span={12}>
                            New Parameters
                        </Col>
                    </Row>
                </Modal>
                <Layout
                    style={{height: '100%'}}
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
                                    onChange={this.handleScenarioChange.bind(this)}
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
                                style={{lineHeight: '64px'}}
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
                        {(this.state.isLoadingScenario)
                            ? <Row
                                style={{height: '100%', display: 'flex'}}
                            >
                                <Spin
                                    style={{margin: 'auto'}}
                                    tip="Loading Scenario..."
                                />
                            </Row>
                            : <MainScenarioComponent
                                proj={proj}
                                activatedMethod={activatedMethod}
                                activatedScenario={activatedScenario}
                            />
                        }

                    </Content>
                </Layout>
            </div>
        );
    }
}
