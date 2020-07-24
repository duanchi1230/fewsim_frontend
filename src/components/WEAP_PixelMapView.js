import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Form, InputNumber, Button, Row, Col, Modal, Icon, Card, Radio} from 'antd';
import WEAP_PixelMapCanvas from './WEAP_PixelMapCanvas';
import VarTreeList from './VarTreeList';


export default class WEAP_PixelMapView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            year: 1986,
            filterModalVisible: false,
            checkedOutput: [],
            sortType: 1
        };
    }

    componentWillMount(){
        
        let checkedOutput = []
        let weap_flow =this.props.weap_flow

       for(let i=0; i<weap_flow[0]['var']['output'].length; i++){
           checkedOutput.push(weap_flow[0]['var']['output'][i]['name'])
        }
        console.log(checkedOutput)
        
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

    onChangeSort(element){
        console.log(element)
        this.setState({
            sortType: element.target.value
        })
    }

    sortFlowbySource(weap_flow){
        weap_flow = JSON.parse(JSON.stringify(weap_flow))
        let sorted_weap_flow = []
        weap_flow.forEach(flow_scenario=>{
            let source = []
            let sorted_weap_flow_scenario = []
            flow_scenario['var']['output'].forEach(f=>{
                if(source.includes(f['source'])!==true){
                    source.push(f['source'])
                }
            })
            source.forEach(s=>{
                flow_scenario['var']['output'].forEach(f=>{
                    if(s===f['source']){
                        sorted_weap_flow_scenario.push(f)
                    }
                })
            })
            flow_scenario['var']['output'] = sorted_weap_flow_scenario
        })
        console.log(weap_flow)
        return weap_flow
    }

    render() {
        const {activatedScenario} = this.props;
        let weap_flow = JSON.parse(JSON.stringify(this.props.weap_flow))
        let scenario_to_show = ''
        let weap_flow_sorted_by_source = []
        if(this.props.scenario_to_show===''){
            scenario_to_show = weap_flow[0].name
        }
        else{
            scenario_to_show = this.props.scenario_to_show
        }
        console.log(scenario_to_show)
        weap_flow_sorted_by_source = this.sortFlowbySource(weap_flow)
        if(this.state.sortType===2){
            weap_flow = weap_flow_sorted_by_source
        }
        return (
            <Row style={{height: '100%', overflow: 'auto'}}>
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
                            vars={weap_flow[0].var} handleNodeChecked={this.handleNodeChecked.bind(this)} checkedOutput = {this.state.checkedOutput}
                        />
                </Modal>
                    <Card 
                        extra={<Button onClick={this.showFilterModal.bind(this)} type="primary" style={{"backgroundColor":"#2b8cbe"}}><Icon type="left" /> Flow Variables Filter<Icon type="right" /></Button>}
                        title={ <div style={{display:"inline-block"}}>
                                    <div style={{display:"inline-block"}}>WEAP Pixel Map </div> (<div style={{color:"#2b8cbe", display:"inline-block"}}>{scenario_to_show}</div>)
                                </div> }
                        style={{
                        height: 950,
                        flex: 10,
                        marginTop: 10,
                        overflow: 'auto',
                        }}>
                            <Radio.Group onChange={this.onChangeSort.bind(this)} value={this.state.sortType}>
                                <Radio value={1}>Sort by Demand</Radio>
                                <Radio value={2}>Sort by Source</Radio>
                            </Radio.Group>
                            <WEAP_PixelMapCanvas
                            // data={data}
                            width={700}
                            height={700}
                            weap_flow={weap_flow}
                            sortType={this.state.sortType}
                            checkedOutput = {this.state.checkedOutput}
                            handleWEAPResultVariableClick = {this.props.handleWEAPResultVariableClick}
                            scenario_to_show={scenario_to_show}
                            />
                    </Card>  
            </Row>
        );
    }
}