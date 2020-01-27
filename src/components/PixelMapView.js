import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Form, InputNumber, Button, Row, Col} from 'antd';
import PixelMapCanvas from './PixelMapCanvas';


export default class PixelMapView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            year: 1986
        };
    }

    handleSubmit() {
        alert('submit with ' + this.state.year);
    }

    handleUpdateYear(yearValue) {
        // alert(yearValue);
        this.setState({year: yearValue});
    }

    render() {
        const {activatedScenario} = this.props;
        return (
            <Row
                style={{height: 800}}
            >
                {/*<Col span={2}>*/}
                    {/*<Form>*/}
                        {/*<Form.Item>*/}
                            {/*<InputNumber*/}
                                {/*min={1986}*/}
                                {/*max={2009}*/}
                                {/*placeholder="Year"*/}
                                {/*defaultValue={this.state.year}*/}
                                {/*onChange={this.handleUpdateYear.bind(this)}*/}
                            {/*/>*/}
                        {/*</Form.Item>*/}
                        {/*<Form.Item>*/}
                            {/*<Button*/}
                                {/*type="primary"*/}
                                {/*onClick={this.handleSubmit.bind(this)}*/}
                                {/*// htmlType="submit"*/}
                            {/*>*/}
                                {/*Run*/}
                            {/*</Button>*/}
                        {/*</Form.Item>*/}
                    {/*</Form>*/}
                {/*</Col>*/}
                <Col
                    span={25}
                    style={{height: '100%'}}
                >
                    <PixelMapCanvas
                        // data={data}
                        width={700}
                        height={700}
                        activatedScenario={activatedScenario}
                        checkedOutput = {this.props.checkedOutput}
                    />
                </Col>
            </Row>
        );
    }
}