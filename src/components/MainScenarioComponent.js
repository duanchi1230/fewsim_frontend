import React, {Component} from 'react';
import {Row, Col, Divider, Empty, Card} from 'antd';

import VarTreeList from './VarTreeList';
import PixelMapView from "./PixelMapView";


export default class MainScenarioComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedVariables: []
        };
    }

    render() {

        const {proj, activatedMethod, activatedScenario} = this.props;

        // console.log(activatedScenario);

        if (activatedScenario === null) {
            return (
                <Empty
                    style={{marginTop: '20%'}}
                    description={<span>Please select a scenario</span>}
                />
            );
        }

        return (
            <Row
                gutter={16}
                style={{
                    height: '100%'
                }}
            >
                <Col
                    span={4}
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Card
                        title="Summary of Scenario"
                        // style={{}}
                        // size="small"
                    >
                        <p>Name: {activatedScenario.name}</p>
                        <p>Running Status: {activatedScenario.runStatus}</p>
                    </Card>

                    <Card
                        title="Variables"
                        // size="small"
                        style={{
                            marginTop: 16,
                            flex: 2,
                            overflow: 'scroll'
                        }}
                    >
                        <VarTreeList
                            vars={activatedScenario.var}
                        />
                    </Card>
                </Col>
                <Col
                    span={20}
                    style={{
                        height: '100%'
                    }}
                >
                    <Card
                        title="Pixel Map"
                        // size="small"
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        headStyle={{
                            height: 57
                        }}
                        bodyStyle={{
                            flex: 2,
                            // height: '100%'
                        }}
                    >
                        <PixelMapView
                            activatedScenario={activatedScenario}
                        />
                    </Card>
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