import React, { Component } from 'react';
import { Layout, Button, Row, Col, Divider, Select, Menu, Modal, Tabs, Spin, Card, Tree, Input, notification, InputNumber } from 'antd';

import MainScenarioComponent from './components/MainScenarioComponent';
import './styles/App.css';
import Variables_Radial_Tree from './components/Variables_Radial_Tree'
import InputParameter_WEAP from './components/InputParameter_WEAP'
import InputParameter_LEAP from './components/InputParameter_LEAP'
import CreatedScenarios from './components/CreatedScenarios';

const {TreeNode} = Tree;
const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const ButtonGroup = Button.Group;

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            createScenarioModalVisible: false,
            activatedMethod: null,
            activatedScenario: null,
            isLoadingScenario: true,
            run_model_status: 'null',
            weap_flow: [],
            leap_data: [],
            variables: [],

            created_scenarios: [],
            created_scenario_name: '',
            scenario_in_summary: '',
            selectedScenarios: [],
            existing_scenarios: [],
            existing_scenarios_summary: "",

            Sustainability_Creation_Modal:false,
            sustainability_variables: [],
            sustainability_index: [],

            leap_inputs:[],
            weap_inputs: [],
            mabia_inputs: [],

            simulation_time_range: [],

            weap_result_variable: [],
            leap_result_variable: [],

            simulation_run_status: "Running"
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
                            console.log("proj", proj)
                            this.setState({ proj: proj });
                        });
                } catch (err) {
                    console.log(err);
                }
            });       
    }

    
    handleMethodChange = (value) => {
        this.setState({ activatedMethod: value});
    };

    runModel () {
        // Search for the scenario
        // load it into the main content

        // const { proj, activatedMethod } = this.state;
        // console.log(proj)
        // // 0. Set the spinning first
        // this.setState({ isLoadingScenario: true });

        // // 1. Test if the scenario has been loaded
        // const candidateScenarioIdx = proj[activatedMethod].scenario.findIndex(s => s.sid === sid),
        //     candidateScenario = proj[activatedMethod].scenario[candidateScenarioIdx];

        // if (!candidateScenario['__filled']) {
        //     fetch(`/proj/${proj.pid}/${activatedMethod}/scenario/${sid}`, {
        //         method: 'GET'
        //     })
        //         .then(r => r.json())
        //         .then(newScenario => {
        //             let newState = { ...this.state };
        //             console.log(newState);
        //             proj[activatedMethod].scenario[candidateScenarioIdx] = newScenario;
        //             newState.isLoadingScenario = false;
        //             newState.activatedScenario = newScenario;

        //             this.setState(newState);

        //             // let scenarioList = newState.proj[activatedMethod];

        //             // for (let i = 0; i < scenarioList.length; i++) {
        //             //     if (scenarioList[i].sid === sid) {
        //             //         scenarioList[i] = newScenario
        //             //     }
        //             // }

        //         })
        // } else {
        //     this.setState({
        //         activatedScenario: candidateScenario,
        //         isLoadingScenario: false
        //     })
        // }
        // console.log(this.state.scenarios)
        // Object.entries(this.state.scenarios).forEach((name, scenario)=>{ console.log(name, scenario)})

        if(this.state.created_scenarios.length===0){
            this.openNotification('No scenario exists!', 'Please create and load scenarios to run!')
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        }
        else{
            
            let xhr = new XMLHttpRequest();
            xhr.timeout = 10000;
            xhr.open('POST', 'run/weap')
            xhr.send(JSON.stringify(this.state.created_scenarios))
            xhr.onload = function() {
                if (xhr.status != 200) { // analyze HTTP status of the response
                //   alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    console.log(JSON.parse(xhr.response))
                //   alert(`Done, got ${xhr.response.length} bytes`); // responseText is the server
                }
            };
            xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                // alert(`Received ${event.loaded} of ${event.total} bytes`);
            } else {
                // alert(`Received ${event.loaded} bytes`); // no Content-Length
            }
            
            };
            
            xhr.onerror = function() {
            // alert("Request failed");
            };

            let created_scenarios = this.state.created_scenarios
            let setState = this.setState.bind(this)
            if(this.state.simulation_run_status==="Running"){
                var t=setInterval(function() { getRunLog(created_scenarios, setState); },1000);
            }
        }
        
        
        
        function getRunLog(created_scenarios, setState){
            
            fetch('log').then(r=>r.json()).then(r=>{
                console.log(r, r[r.length-1]); 
                if(r[r.length-1]["message"] === "Completed"){
                    console.log("Runing Completed")
                    getData(created_scenarios, setState)
                    clearInterval(t);
                }
                })
            
        }

        function getData(created_scenarios, setState){
            console.log("sending created scenarios")
            fetch("run/weap", {method: "GET"})
                .then(r=>r.json())
                .then(r=>{console.log(r); 
                            setState({weap_flow: r['weap-flow'], leap_data:r['leap-data'], run_model_status:'finished', simulation_time_range:r['weap-flow'][0]['timeRange']})
                            let weap_result_variable = []
                            let leap_result_variable = []
                            
                            let weap_flow = r['weap-flow']
                            let leap_data = r['leap-data']
                            for(let i=0; i<weap_flow.length; i++){
                                let v = JSON.parse(JSON.stringify(weap_flow[i]['var']['output'][0]))
                                v['scenario'] = weap_flow[i]['name']
                                weap_result_variable.push(v)
                            }
                    
                            for(let i=0; i<leap_data.length; i++){
                                let v = JSON.parse(JSON.stringify(leap_data[i]['var']['output']['Demand']['Energy Demand Final Units'][0]))
                                v['scenario'] = leap_data[i]['name']
                                v['name'] = 'Demand'
                                leap_result_variable.push(v)
                            }
                            console.log(weap_result_variable)
                            console.log(leap_result_variable)
                            setState({weap_result_variable: weap_result_variable, leap_result_variable: leap_result_variable})
                        })
        }

        fetch('/inputs/tree').then(data => data.json()).then((data)=>{console.log(data)});
        

    };

    handleWEAPResultVariableClick(weap_result_variable){
        weap_result_variable = JSON.parse(JSON.stringify(weap_result_variable))
        console.log(weap_result_variable)
        this.setState({weap_result_variable: weap_result_variable})
    }   

    handleLEAPResultVariableClick(leap_result_variable){
        leap_result_variable = JSON.parse(JSON.stringify(leap_result_variable))
        console.log(leap_result_variable)
        this.setState({leap_result_variable: leap_result_variable})
    } 

    
    componentDidMount(){
        
        fetch('/inputs/tree').then(data => data.json()).then((data)=>{console.log(data); this.setState({variables: data})});
        
    }

    handleAddScenarioButtonClicked = () => {
        this.setState({ createScenarioModalVisible: true });
        fetch('/load-scenarios').then(d => d.json()).then((d)=>{console.log(d); this.setState({existing_scenarios: d['scenarios']})});
    };

    handleAddScenarioModalClosed = () => {
        this.setState({ createScenarioModalVisible: false })
    };

    openSustainabilityModal(){
        this.setState({Sustainability_Creation_Modal:true})
    }

    closeSustainabilityModal(){
        this.setState({Sustainability_Creation_Modal:false})
    }

    handleNodeChecked = (checkedKeys, info) => {
        console.log(checkedKeys)
        this.setState({
            selectedScenarios:checkedKeys
        })
    };

    handleWEAPinputChecked = (checkedKeys, info) =>{
        let data = this.state.variables['children'][0]
        let weap_inputs = []
        data = this.expandData([data], [])
        data.forEach(d=>{
            if(checkedKeys.includes(d.fullname+':'+d.name)){
                d['percentage_of_default'] = 100
                weap_inputs.push(d)
            }}
        )
        this.setState({weap_inputs:weap_inputs})
        console.log(weap_inputs)
    }

    handleLEAPinputChecked = (checkedKeys, info) =>{
        let data = this.state.variables['children'][2]
        let leap_inputs = []
        data = this.expandData([data], [])
        data.forEach(d=>{
            if(checkedKeys.includes(d.fullname+':'+d.name)){
                d['percentage_of_default'] = 100
                leap_inputs.push(d)
            }}
        )
        this.setState({leap_inputs:leap_inputs})
        console.log(leap_inputs)
    }

    expandData(data, expanedData){
        data.map(v => {
            if (Object.keys(v).includes('children')){
                expanedData = this.expandData(v.children, expanedData)
                }
            else{
                expanedData.push(v)
                }
            }
        )
        return expanedData
    }

    plotVariableTree(data){
    // data.map(d=>console.log(d))
    return  data.map(v => {
                    if (Object.keys(v).includes('children')){
                        return (<TreeNode title={v.name} key={v.name} checkable={false}>
                                    {this.plotVariableTree(v.children)}
                                </TreeNode>
                        );}
                    else{
                        return (<TreeNode
                            title={v.name}
                            key={v.fullname+":"+v.name}
                        />);}
                    }
                    )

    }

    getSuatainabilityIndex(sustainability_index, sustainability_variables){
        this.setState({sustainability_index: sustainability_index,
            sustainability_variables:sustainability_variables})
        console.log(sustainability_variables, sustainability_index)
    }

    createScenarios = () => {
        console.log(this.state.weap_inputs, this.state.leap_inputs)
        let created_scenarios = this.state.created_scenarios
        let created_scenarios_names = []
        let weap = JSON.parse(JSON.stringify(this.state.weap_inputs))
        let leap = JSON.parse(JSON.stringify(this.state.leap_inputs))
        let mabia = JSON.parse(JSON.stringify(this.state.mabia_inputs))
        let name = JSON.parse(JSON.stringify(this.state.created_scenario_name))
        created_scenarios.forEach(scenario=>{
            created_scenarios_names.push(scenario.name)
        })
        if(created_scenarios_names.includes(this.state.created_scenario_name) != true){
            created_scenarios.push({'name': name, 'weap':weap, 'leap': leap, 'mabia':mabia})
            console.log(created_scenarios)
            this.setState({created_scenarios:created_scenarios, created_scenario_name: ''})
        }
        if(created_scenarios_names.includes(this.state.created_scenario_name) == true){
            this.openNotification('Scenario name already exists!', 'Please rename the scenario!')
        }
        
    }

    deleteScenario(){

    }

    loadExistingScenarios(element){
        console.log(element.target.id)
        let name = element.target.id
        let existing_scenarios = this.state.existing_scenarios
        let created_scenarios = this.state.created_scenarios
        let created_scenarios_names = []
        let scenarios_to_load = {}

        created_scenarios.forEach(scenario=>{
            created_scenarios_names.push(scenario.name)
        })

        existing_scenarios.forEach(e_scenario=>{
            if(e_scenario["name"]===name){
                e_scenario["type"] = "existing"
                scenarios_to_load = e_scenario
            }
        })


        if(created_scenarios_names.includes(name) !=+ true){
            created_scenarios.push(scenarios_to_load)
            console.log(created_scenarios)
            this.setState({created_scenarios:created_scenarios})
        }
        if(created_scenarios_names.includes(name) === true){
            this.openNotification('Scenario name already exists!', 'Please load another scenario!')
        }
    }

    deleteExistingScenario(){

    }

    showScenarioSummary(element){
        console.log(element.target.id)
        this.setState({scenario_in_summary:element.target.id})
    }

    showExistingScenarioSummary(element){
        this.setState({existing_scenarios_summary:element.target.id})
    }

    openNotification(message, description){
      notification.open({
        message: message,
        description: description,
        // onClick: () => {
        //   console.log('Notification Clicked!');
        // },
      });
    }

    inputScenarioName(user_input){
        console.log(user_input.target.value)
        this.setState({created_scenario_name: user_input.target.value})
    }

    weapVariablesOnChange(value, input){
        let weap_inputs = this.state.weap_inputs
        for(let i=0; i<weap_inputs.length; i++){
            if(weap_inputs[i].fullname+':'+weap_inputs[i].name==input){
                weap_inputs[i].percentage_of_default = value
            }
        }
        console.log(weap_inputs)
        console.log(this.state.created_scenarios)
        this.setState({weap_inputs: weap_inputs})
    }

    leapVariablesOnChange(value, input){
        let leap_inputs = this.state.leap_inputs
        for(let i=0; i<leap_inputs.length; i++){
            if(leap_inputs[i].fullname+':'+leap_inputs[i].name==input){
                leap_inputs[i].percentage_of_default = value
            }
        }
        console.log(leap_inputs)
        this.setState({leap_inputs: leap_inputs})
    }

    render() {

        const {
            proj,
            activatedScenario,
            activatedMethod
        } = this.state;
        let scenario_in_summary = this.state.scenario_in_summary
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

        return (
            <div
                style={{ height: '100%' }}
            >
                <Modal
                    width={1350}
                    visible={this.state.createScenarioModalVisible}
                    onCancel={this.handleAddScenarioModalClosed.bind(this)}
                    footer={null}
                >
                    <Row
                        gutter={16}
                        style={{ minHeight: 380 }}
                    >
                        <Col span={36}>
                            <font size="5">Scenarios List</font>
                            <Tabs type="card">
                                <TabPane tab="Input Variable Selection" key="0" >
                                    <Col span={6}>
                                        <Card style={{
                                            height:380,
                                            flex: 0,
                                            marginTop: 0,
                                            overflow: 'auto',
                                        }}>
                                                FEW variables
                                                <Tree
                                                checkable={true}
                                                defaultExpandedKeys={['model-input']}
                                                onCheck={this.handleWEAPinputChecked.bind(this)}
                                                // onLoad={}
                                                disabled={false}
                                                >
                                                    <TreeNode title="WEAP" key="WEAP" checkable={false}>
                                                        {this.plotVariableTree([this.state.variables['children'][0]])}
                                                    </TreeNode>
                                                </Tree>
                                                <Tree
                                                checkable={true}
                                                defaultExpandedKeys={['model-input']}
                                                onCheck={this.handleLEAPinputChecked.bind(this)}
                                                // onLoad={}
                                                disabled={false}
                                                >
                                                    <TreeNode title="LEAP" key="LEAP" checkable={false}>
                                                        {this.plotVariableTree([this.state.variables['children'][2]])}
                                                    </TreeNode>
                                                </Tree>
                                        </Card>
                                    </Col>
                                    <Col span={17}>
                                        <Card style={{
                                                height:380,
                                                flex: 0,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                            <Input id="name" defaultValue="" value={this.state.created_scenario_name} onChange={this.inputScenarioName.bind(this)} addonBefore="name" />
                                            <Tabs type="card" tabPosition="left">
                                                <TabPane tab="WEAP" key="1">
                                                    <InputParameter_WEAP 
                                                    weapVariablesOnChange={this.weapVariablesOnChange.bind(this)}
                                                    weap_inputs={this.state.weap_inputs}
                                                    />
                                                </TabPane>
                                                <TabPane tab="LEAP" key="2" >
                                                    <InputParameter_LEAP
                                                    leapVariablesOnChange={this.leapVariablesOnChange.bind(this)}
                                                    leap_inputs={this.state.leap_inputs}
                                                    />
                                                </TabPane>
                                                <TabPane tab="WEAP-MABIA" key="3">
                                                    WEAP-MABIA Input will be incorporated!
                                                </TabPane>
                                            </Tabs>
                                        </Card>
                                    </Col>
                                    <Button type="primary" onClick={this.createScenarios}>Create Scenario</Button> 
                                </TabPane>
                                <TabPane tab="Scenarios Summary" key="1">
                                 <Tabs type="card" tabPosition="left">
                                    <TabPane tab="Run" key="1">
                                        <Col span={6}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                {/* <Row gutter={8}>Scenarios to Run!</Row> */}
                                                <Row gutter={8}>Created Scenarios </Row>
                                                <ButtonGroup>
                                                    {this.state.created_scenarios.map(scenario=>{
                                                        if(Boolean(scenario["type"])===false){
                                                            return <Row gutter={8} key={scenario.name}>
                                                                        <Col span={21}>
                                                                            <div><Button id={scenario.name} onClick={this.showScenarioSummary.bind(this)} block>{scenario.name}</Button> </div>
                                                                        </Col>
                                                                        <Col span={1}>
                                                                            <div onClick={this.deleteScenario.bind(this)}> <div id={scenario.name}>x</div> </div>
                                                                        </Col>
                                                                    </Row> }})}    
                                                </ButtonGroup>

                                                <Row gutter={8}>Existing Scenarios</Row>
                                                <ButtonGroup>
                                                    {this.state.created_scenarios.map(scenario=>{
                                                        if(Boolean(scenario["type"])!==false){
                                                            return <Row gutter={8} key={scenario.name}>
                                                                        <Col span={21}>
                                                                            <div><Button id={scenario.name} onClick={this.showScenarioSummary.bind(this)} block>{scenario.name}</Button> </div>
                                                                        </Col>
                                                                        <Col span={1}>
                                                                            <div onClick={this.deleteScenario.bind(this)}> <div id={scenario.name}>x</div> </div>
                                                                        </Col>
                                                                    </Row> }})}    
                                                </ButtonGroup>
                                                {/* <Button type="primary">Load Existing</Button> */}
                                            </Card>
                                        </Col>
                                        <Col span={17}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                Scenario Summary (RUN):
                                                {this.state.created_scenarios.map(scenario=>{
                                                    let scenario_in_summary = this.state.scenario_in_summary
                                                    if(scenario_in_summary==='' && scenario.name===this.state.created_scenarios[0].name){
                                                        return <div key={scenario.name}>Please select the scenario to vew!</div>
                                                    }
                                                    if(scenario_in_summary===scenario.name){
                                                        return <div key={scenario.name}>
                                                                {scenario.name}
                                                                <Row gutter={8}>WEAP</Row>
                                                                    {scenario.weap.map(variable=>{
                                                                        return <div key={variable.fullname+':'+variable.name}>
                                                                                    {variable.fullname+':'+variable.name} <InputNumber
                                                                                        defaultValue={variable.percentage_of_default}
                                                                                        value={variable.percentage_of_default}
                                                                                        disabled={true}
                                                                                        min={0}
                                                                                        max={300}
                                                                                        step={0.1}
                                                                                        formatter={value => `${value}%`}
                                                                                        parser={value => value.replace('%', '')}
                                                                                    /> Default
                                                                                </div>
                                                                    })}
                                                                <Row gutter={8}>LEAP</Row>
                                                                    {scenario.leap.map(variable=>{
                                                                        return <div key={variable.fullname+':'+variable.name}>
                                                                                    {variable.fullname+':'+variable.name} <InputNumber
                                                                                        defaultValue={variable.percentage_of_default}
                                                                                        value={variable.percentage_of_default}
                                                                                        disabled={true}
                                                                                        min={0}
                                                                                        max={300}
                                                                                        step={0.1}
                                                                                        formatter={value => `${value}%`}
                                                                                        parser={value => value.replace('%', '')}
                                                                                    /> Default
                                                                                </div>
                                                                    })}
                                                                <Row gutter={8}>WEAP-MABIA</Row>
                                                                </div>
                                                        
                                                    }}) 
                                                }
                                            </Card>
                                        </Col>
                                    </TabPane>
                                    <TabPane tab="Load" key="2" >
                                        <Col span={6}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                <Row gutter={8}>Existing Scenarios</Row>
                                                <ButtonGroup>
                                                    {this.state.existing_scenarios.map(scenario=>{return <Row gutter={8} key={scenario.name}><Col span={21}><div><Button id={scenario.name} onClick={this.showExistingScenarioSummary.bind(this)} block>{scenario.name}</Button> </div></Col><Col span={1}><div onClick={this.deleteScenario.bind(this)}><div id={scenario.name}>x</div></div></Col></Row>})}
                                                </ButtonGroup>
                                                {/* <Button type="primary">Load Existing</Button> */}
                                            </Card>
                                        </Col>
                                        <Col span={17}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                Exisiting Scenario Summary: 
                                                {this.state.existing_scenarios.map(scenario=>{
                                                    let existing_scenarios_summary = this.state.existing_scenarios_summary
                                                    if(existing_scenarios_summary===''){
                                                        return <div key={scenario.name}>Please select the scenario to view!</div>
                                                    }
                                                    if(existing_scenarios_summary==='Base'){
                                                        return <div key={scenario.name}>      
                                                                    This is Base scenario with every variable in default!
                                                                    <Button id={scenario.name} type="dash" shape="round" onClick={this.loadExistingScenarios.bind(this)}>Load to Run</Button>
                                                                </div>
                                                    }
                                                    if(existing_scenarios_summary===scenario.name && existing_scenarios_summary !== "Base"){
                                                        return <div key={scenario.name}>
                                                                
                                                                {scenario.name} <Button id={scenario.name} type="dash" shape="round" onClick={this.loadExistingScenarios.bind(this)}>Load to Run</Button>
                                                                <Row gutter={8}>WEAP</Row>
                                                                    {scenario.weap.map(variable=>{
                                                                        return <div key={variable.fullname+':'+variable.name}>
                                                                                    {variable.fullname+':'+variable.name} <InputNumber
                                                                                        defaultValue={variable.percentage_of_default}
                                                                                        value={variable.percentage_of_default}
                                                                                        disabled={true}
                                                                                        min={0}
                                                                                        max={300}
                                                                                        step={0.1}
                                                                                        formatter={value => `${value}%`}
                                                                                        parser={value => value.replace('%', '')}
                                                                                    /> Default
                                                                                </div>
                                                                    })}
                                                                <Row gutter={8}>LEAP</Row>
                                                                    {scenario.leap.map(variable=>{
                                                                        return <div key={variable.fullname+':'+variable.name}>
                                                                                    {variable.fullname+':'+variable.name} <InputNumber
                                                                                        defaultValue={variable.percentage_of_default}
                                                                                        value={variable.percentage_of_default}
                                                                                        disabled={true}
                                                                                        min={0}
                                                                                        max={300}
                                                                                        step={0.1}
                                                                                        formatter={value => `${value}%`}
                                                                                        parser={value => value.replace('%', '')}
                                                                                    /> Default
                                                                                </div>
                                                                    })}
                                                                <Row gutter={8}>WEAP-MABIA</Row>
                                                                </div>
                                                        
                                                    }}) 
                                                }
                                            </Card>
                                        </Col>
                                    </TabPane>

                                </Tabs>
                                
                                </TabPane>
                            </Tabs>
                            
                            


                            {/* <Button type="primary" onClick={this.createScenarios} style={
                                {marginLeft: '85px'}
                            }>Move to Batch</Button> */}
                        </Col>
                        
                    </Row>
                </Modal>
                <Modal 
                    width={1550}
                    visible={this.state.Sustainability_Creation_Modal}
                    onCancel={this.closeSustainabilityModal.bind(this)}
                    footer={null}
                >
                    <Variables_Radial_Tree variables={this.state.variables} getSuatainabilityIndex={this.getSuatainabilityIndex.bind(this)}></Variables_Radial_Tree>
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
                                    fontSize: 22,
                                    fontWeight: 'bold'
                                }}
                            >
                                FEWSim
                            </div>
                            <div
                                style={{
                                    marginLeft: 35
                                }}
                            >
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={this.handleAddScenarioButtonClicked.bind(this)}
                                >Scenario Creation</Button>
                            </div>

                            <div
                                style={{
                                    marginLeft: 16
                                }}
                            >
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={this.openSustainabilityModal.bind(this)}
                                >
                                    Sustainability Index Creation
                                </Button>
                            </div>

                            <div
                                style={{
                                    marginLeft: 50
                                }}
                            >
                                {/* <Select
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
                                        ) */}
                                    {/* } */}
                                    {/*<Select.Option value="weap">WEAP</Select.Option>*/}
                                    {/*<Select.Option value="leap">LEAP</Select.Option>*/}
                                    {/*<Select.Option value="mabia">MABIA</Select.Option>*/}
                                {/* </Select> */}
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={this.runModel.bind(this)}
                                >Run Model</Button>
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
                            // height: 100,
                            padding: 16,
                            overflow: "auto"
                        }}
                    >
                        <MainScenarioComponent
                            proj={proj}
                            run_model_status={this.state.run_model_status}
                            activatedMethod={activatedMethod}
                            weap_flow={this.state.weap_flow}
                            leap_data={this.state.leap_data}
                            selectedScenarios={this.state.selectedScenarios}
                            scenarios={this.state.selectedScenarios}
                            variables={this.state.variables}
                            sustainability_variables={this.state.sustainability_variables}
                            sustainability_index={this.state.sustainability_index}
                            simulation_time_range={this.state.simulation_time_range}
                            handleWEAPResultVariableClick={this.handleWEAPResultVariableClick.bind(this)}
                            handleLEAPResultVariableClick={this.handleLEAPResultVariableClick.bind(this)}
                            weap_result_variable={this.state.weap_result_variable}
                            leap_result_variable={this.state.leap_result_variable}
                        />                        
                    </Content>
                </Layout>
            </div>
        );
    }
}

