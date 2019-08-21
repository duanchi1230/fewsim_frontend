import React, {Component} from 'react';
import {Row, Col, Divider, Empty, Card, Button} from 'antd';

import VarTreeList from './VarTreeList';
import PixelMapView from "./PixelMapView";


export default class MainScenarioComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {

            isButtonDisabled: false,
            runButton: "Run Model",
            modelStatus:"Finished",
            checkedOutput: []
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
                        <p>RUN: <Button type="primary" onClick={this.runModel} disabled={this.state.isButtonDisabled}>{this.state.runButton}</Button> 
                        </p>
                        <p>Name: {activatedScenario.name}</p>
                        <p>Running Status: {this.state.modelStatus}</p>
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
                            vars={activatedScenario.var} handleNodeChecked={this.handleNodeChecked.bind(this)}
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
                        title="Pixel Map (m^3/year)"
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
                            activatedScenario={activatedScenario} checkedOutput={this.state.checkedOutput}
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