import React, {Component} from 'react';
import {Layout, Button, Row, Col, Divider, Select, Menu} from 'antd';
import './styles/App.css';

const {Header, Content} = Layout;


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <Layout>
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
                                <Select
                                    showSearch
                                    placeholder={'Select a scenario'}
                                    style={{
                                        width: 200
                                    }}
                                >
                                    <Select.Option value="s1">Scenario 1</Select.Option>
                                    <Select.Option value="s2">Scenario 2</Select.Option>
                                    <Select.Option value="s3">Scenario 3</Select.Option>
                                </Select>
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
                                >
                                    <Select.Option value="weap">WEAP</Select.Option>
                                    <Select.Option value="leap">LEAP</Select.Option>
                                    <Select.Option value="mabia">MABIA</Select.Option>
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
                    <Layout
                        style={{flex: 1}}
                    >
                        <Content
                            style={{
                                padding: 16
                            }}
                        >
                            <Row
                                gutter={16}
                                style={{
                                    height: 900
                                }}
                            >
                                <Col span={4}>
                                    <div
                                        style={{
                                            backgroundColor: '#fff',
                                            minHeight: '100%',
                                            padding: 16
                                        }}
                                    >
                                        <Divider
                                            orientation="left"
                                            style={{fontSize: 14}}
                                        >
                                            Summary of Scenario
                                        </Divider>
                                        <Divider
                                            orientation="left"
                                            style={{fontSize: 14}}
                                        >
                                            Variables
                                        </Divider>
                                    </div>
                                </Col>
                                <Col span={10}>
                                    <div
                                        style={{
                                            backgroundColor: '#fff',
                                            // minHeight: 500,
                                            // minHeight: '100%',
                                            height: '100vh'
                                        }}
                                    >
                                        Center
                                    </div>
                                </Col>
                                <Col span={10}>
                                    <div
                                        style={{
                                            backgroundColor: '#fff',
                                            minHeight: 500
                                        }}
                                    >
                                        Center
                                    </div>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}
