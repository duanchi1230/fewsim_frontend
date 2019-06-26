import React, {Component} from 'react';
import {Row, Col} from 'antd';


export default class CreateNewScenarioWindow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
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
        );
    }
}