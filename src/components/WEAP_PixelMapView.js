import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Form, InputNumber, Button, Row, Col, Modal, Icon} from 'antd';
import WEAP_PixelMapCanvas from './WEAP_PixelMapCanvas';
import VarTreeList from './VarTreeList';


export default class WEAP_PixelMapView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            year: 1986,
            filterModalVisible: false,
            checkedOutput: []
        };
    }

    handleSubmit() {
        alert('submit with ' + this.state.year);
    }

    handleUpdateYear(yearValue) {
        // alert(yearValue);
        this.setState({year: yearValue});
    }

    showFilterModal(){
        this.setState({filterModalVisible: true})
    }

    hideFilterModal(){
        this.setState({filterModalVisible: false})
    }

    handleNodeChecked = (checkedKeys, info) => {     
        this.setState(
            {checkedOutput:checkedKeys}
        )
    };

    render() {
        const {activatedScenario} = this.props;
        return (
            <Row>
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
                <Modal 
                    width={500}
                    visible={this.state.filterModalVisible}
                    onCancel={this.hideFilterModal.bind(this)}
                    footer={null}>
                        <VarTreeList
                            vars={this.props.weap_flow[0].var} handleNodeChecked={this.handleNodeChecked.bind(this)}
                        />
                </Modal>
                <Col
                    span={25}
                    style={{height: '100%', overflow: 'auto'}}
                >
                    <Button onClick={this.showFilterModal.bind(this)} type="primary" style={{"backgroundColor":"#2b8cbe"}}> Filter Variables<Icon type="right" /></Button>
                    <WEAP_PixelMapCanvas
                        // data={data}
                        width={700}
                        height={700}
                        weap_flow={this.props.weap_flow}
                        checkedOutput = {this.state.checkedOutput}
                    />
                </Col>
            </Row>
        );
    }
}