import React, { Component } from 'react';
import { Layout, Button, Row, Col, Divider, Select, Menu, Modal, Tabs, Spin, Card, Tree, Input, Popconfirm, notification, InputNumber, Radio } from 'antd';

import MainScenarioComponent from './components/MainScenarioComponent';
import './styles/App.css';
import Variables_Radial_Tree from './components/Variables_Radial_Tree'
import InputParameter_WEAP from './components/InputParameter_WEAP'
import InputParameter_LEAP from './components/InputParameter_LEAP'
import CreatedScenarios from './components/CreatedScenarios';
import Sensitivity_Graph from './components/Sensitivity_Graph'

// This module is the ENTRY point for all frontend visualization modules


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
            food_data: [],
            variables: [],
            
            climate_scenarios: [],
            checked_climate_scenarios:[],

            created_scenarios: [],
            created_scenario_name: '',
            scenario_in_summary: '',
            selectedScenarios: [],
            existing_scenarios: [],
            existing_scenarios_summary: "",

            Sustainability_Creation_Modal:false,
            sustainability_variables: [],
            sustainability_index: [],
            sustainability_variables_calculated: [],
            sustainability_index_calculated: [],
            loaded_group_index: [],
            loaded_group_index_simulated: [],

            leap_inputs:[],
            weap_inputs: [],
            mabia_inputs: [],

            simulation_time_range: [],

            weap_result_variable: [],
            leap_result_variable: [],

            simulation_run_status: "Running",
            run_log: [],

            sensitivity_graph:[],
            weap_checked_variables_on_sensitivity_graph: [],
            leap_checked_variables_on_sensitivity_graph: [],
            mabia_checked_variables_on_sensitivity_graph: [],
            Sensitivity_Graph_Modal: false,

            Load_History_Modal: false,
            Save_History_Modal: false,
            Stored_Simulations: [],
            Simulation_to_Load_Name: "",
            Simulation_to_Save_Name: ""
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
        // excute when Run Scenario button is clicked
        if(this.state.created_scenarios.length===0){
            this.openNotification('No scenario exists!', 'Please create and load scenarios to run!')
        }
        else{
            // send the created scenarios to backend to run
            // check every 10 s to see if simulation runing has completed or not, if completed it will fetch the simulation result
            console.log(this.state.created_scenarios, this.state.sustainability_variables, this.state.loaded_group_index)
            let xhr = new XMLHttpRequest();
            xhr.timeout = 10000;
            xhr.open('POST', 'run/weap')
            xhr.send(JSON.stringify([this.state.created_scenarios, this.state.sustainability_variables, this.state.loaded_group_index]))
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
                var t=setInterval(function() { getRunLog(created_scenarios, setState); },10000);
            }
        }
        
        
        
        function getRunLog(created_scenarios, setState){
            // fetch the run log in the backend
            fetch('log').then(r=>r.json()).then(r=>{
                console.log(r, r[r.length-1]); 
                setState({run_log: r})
                if(r[r.length-1]["message"] === "Completed"){
                    console.log("Runing Completed")
                    getData(created_scenarios, setState)
                    clearInterval(t);
                }
                })
            
        }

        function getData(created_scenarios, setState){
            // fetch the simulation when simulation is completed
            console.log("sending created scenarios")
            fetch("run/weap", {method: "GET"})
                .then(r=>r.json())
                .then(r=>{console.log(r, r["loaded_group_index"]); 
                            setState({weap_flow: r['weap-flow'], leap_data:r['leap-data'], run_model_status:'finished', 
                                        food_data:r["food-data"], simulation_time_range:r['weap-flow'][0]['timeRange'], sustainability_variables_calculated: r['sustainability_variables'], 
                                        loaded_group_index_simulated:r["loaded_group_index"]})
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
        
        fetch('/inputs/tree').then(data => data.json()).then((data)=>{console.log(data); this.setState({variables: data["data"], climate_scenarios: data["climate_scenarios"]})});
        // fetch('/sensitivity-graph').then(si_data=> si_data.json()).then(si_data=> {console.log(si_data)})
        fetch('/sensitivity-graph', { method: 'GET' }).then(r => r.json()).then(r => {
          this.setState({sensitivity_graph: r})
          console.log(r)
        }); 
        console.log(this.state)

        fetch('/load-simulation-history').then(data => data.json()).then(data=>{console.log(data); this.setState({Stored_Simulations: data})})
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
        console.log(checkedKeys)
        let data = this.state.variables['children'][0]
        let weap_inputs = []
        data = this.expandData([data], [])
        data.forEach(d=>{
            if(checkedKeys.includes(d.fullname+':'+d.name)){
                d['percentage_of_default'] = 100
                weap_inputs.push(d)
            }}
        )
        this.setState({weap_inputs:weap_inputs, weap_checked_variables_on_sensitivity_graph:checkedKeys})
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
        this.setState({leap_inputs:leap_inputs, leap_checked_variables_on_sensitivity_graph:checkedKeys})
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
    //  plot the input variabels tree in the Scenario Creation Panel
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

    getLoadedSuatainabilityIndex(loaded_group_index){
        let index_group = []
        console.log(loaded_group_index)
        loaded_group_index.forEach(index=>{
            if(index["loaded"]){
                index_group.push(JSON.parse(JSON.stringify(index)))
            }
        })
        this.setState({loaded_group_index: index_group})
    }

    createScenarios = () => {
        // handle the event of scenarios creation button clicked
        console.log(this.state.weap_inputs, this.state.leap_inputs)
        let created_scenarios = this.state.created_scenarios
        let created_scenarios_names = []
        let weap = JSON.parse(JSON.stringify(this.state.weap_inputs))
        let leap = JSON.parse(JSON.stringify(this.state.leap_inputs))
        let mabia = JSON.parse(JSON.stringify(this.state.mabia_inputs))
        let climate = JSON.parse(JSON.stringify(this.state.checked_climate_scenarios))
        let name = JSON.parse(JSON.stringify(this.state.created_scenario_name))
        created_scenarios.forEach(scenario=>{
            created_scenarios_names.push(scenario.name)
        })
        if(created_scenarios_names.includes(this.state.created_scenario_name) != true){
            created_scenarios.push({'name': name, 'weap':weap, 'leap': leap, 'mabia':mabia, "climate": climate})
            console.log(created_scenarios)
            this.setState({created_scenarios:created_scenarios, created_scenario_name: ''})
        }
        if(created_scenarios_names.includes(this.state.created_scenario_name) == true){
            this.openNotification('Scenario name already exists!', 'Please rename the scenario!')
        }
        
    }

    deleteScenario(scenario_to_delete){
        console.log(scenario_to_delete)
    }

    loadExistingScenarios(element){
        // load the existing sustaqinability indices in the Sustainability Index Creation Panel when button clicked
        console.log(element)
        let name = element
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


        if(created_scenarios_names.includes(name) !== true){
            if(scenarios_to_load['name']==='Base'){
                created_scenarios.unshift(scenarios_to_load)
            }
            else{
                created_scenarios.push(scenarios_to_load)
            }
            console.log(created_scenarios)
            this.setState({created_scenarios:created_scenarios})
        }
        if(created_scenarios_names.includes(name) === true){
            this.openNotification('Scenario name already exists!', 'Please load another scenario!')
        }
    }

    

    showScenarioSummary(element){
        console.log(element)
        this.setState({scenario_in_summary:element})
    }

    showExistingScenarioSummary(element){
        console.log(element)
        this.setState({existing_scenarios_summary:element})
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

    showSensitivityGraphModal(){
        console.log("1230")
        this.setState({
            Sensitivity_Graph_Modal: true
        })
    }

    closeSensitivityGraphModal(){
        this.setState({
            Sensitivity_Graph_Modal: false
        })
    }

    clickSensitivityGraphNode(element){
        console.log(element)

        let checked_variables_on_sensitivity_graph = []
        if(element["group"]==="weap-input"){
            let data = this.state.variables['children'][0]
            let weap_inputs = []
            data = this.expandData([data], [])
            
            if(this.state.weap_checked_variables_on_sensitivity_graph.includes(element["id"])){
                this.state.weap_checked_variables_on_sensitivity_graph.forEach(variable=>{
                        if(variable!==element["id"]){
                            checked_variables_on_sensitivity_graph.append(variable)
                        }
                    }
                )
                data.forEach(d=>{
                    if(checked_variables_on_sensitivity_graph.includes(d.fullname+':'+d.name)){
                        d['percentage_of_default'] = 100
                        weap_inputs.push(d)
                    }}
                )
                this.setState({weap_inputs: weap_inputs, weap_checked_variables_on_sensitivity_graph:checked_variables_on_sensitivity_graph})
            }
            else{
                checked_variables_on_sensitivity_graph = JSON.parse(JSON.stringify(this.state.weap_checked_variables_on_sensitivity_graph))
                checked_variables_on_sensitivity_graph.push(element["id"])
                data.forEach(d=>{
                    if(checked_variables_on_sensitivity_graph.includes(d.fullname+':'+d.name)){
                        d['percentage_of_default'] = 100
                        weap_inputs.push(d)
                    }}
                )
                this.setState({weap_inputs: weap_inputs, weap_checked_variables_on_sensitivity_graph:checked_variables_on_sensitivity_graph})
            }
        }
        
 
        if(element["group"]==="leap-input"){
            console.log(this.state.leap_checked_variables_on_sensitivity_graph)
            let data = this.state.variables['children'][2]
            let leap_inputs = []
            data = this.expandData([data], [])
            if(this.state.leap_checked_variables_on_sensitivity_graph.includes(element["id"])){
                this.state.leap_checked_variables_on_sensitivity_graph.forEach(variable=>{
                        if(variable!==element["id"]){
                            checked_variables_on_sensitivity_graph.append(variable)
                        }
                    }
                )
                data.forEach(d=>{
                    if(checked_variables_on_sensitivity_graph.includes(d.fullname+':'+d.name)){
                        d['percentage_of_default'] = 100
                        leap_inputs.push(d)
                    }}
                )
                this.setState({leap_inputs: leap_inputs, leap_checked_variables_on_sensitivity_graph:checked_variables_on_sensitivity_graph})
            }
            else{
                checked_variables_on_sensitivity_graph = JSON.parse(JSON.stringify(this.state.leap_checked_variables_on_sensitivity_graph))
                checked_variables_on_sensitivity_graph.push(element["id"])
                data.forEach(d=>{
                    if(checked_variables_on_sensitivity_graph.includes(d.fullname+':'+d.name)){
                        d['percentage_of_default'] = 100
                        leap_inputs.push(d)
                    }}
                )
                
                this.setState({leap_inputs: leap_inputs, leap_checked_variables_on_sensitivity_graph:checked_variables_on_sensitivity_graph})
            }
        }
    }

    closeLoadHisotyModal(){
        this.setState({
            Load_History_Modal: false
        })
    }

    handleLoadHistoryClick(){
        this.setState({
                    Load_History_Modal: true
                })
    }
    
    onChangeSimulationToLoadName(element){
        console.log(element.target.value)
        this.setState({
            Simulation_to_Load_Name: element.target.value
        })
    }

    handleLoadSimulationButtonClick(){
        //  handle load scenarion history
        console.log(this.state.Stored_Simulations)
        this.state.Stored_Simulations.forEach(simulation=>{
            if(simulation['name']===this.state.Simulation_to_Load_Name){
                console.log(simulation)
                let state = simulation['state']
                this.setState({
                    createScenarioModalVisible: state.createScenarioModalVisible,
                    activatedMethod: state.activatedMethod,
                    activatedScenario: state.activatedScenario,
                    isLoadingScenario: state.isLoadingScenario,
                    run_model_status: state.run_model_status,
                    weap_flow: state.weap_flow,
                    leap_data: state.leap_data,
                    food_data: state.food_data,
                    variables: state.variables,

                    climate_scenarios: state.climate_scenarios,
                    checked_climate_scenarios: state.checked_climate_scenarios,

                    created_scenarios: state.created_scenarios,
                    created_scenario_name: state.created_scenario_name,
                    scenario_in_summary: state.scenario_in_summary,
                    selectedScenarios: state.selectedScenarios,
                    existing_scenarios: state.existing_scenarios,
                    existing_scenarios_summary: state.existing_scenarios_summary,

                    Sustainability_Creation_Modal:state.Sustainability_Creation_Modal,
                    sustainability_variables: state.sustainability_variables,
                    sustainability_index: state.sustainability_index,
                    sustainability_variables_calculated: state.sustainability_variables_calculated,
                    sustainability_index_calculated: state.sustainability_index_calculated,
                    loaded_group_index: state.loaded_group_index,
                    loaded_group_index_simulated: state.loaded_group_index_simulated,

                    leap_inputs: state.leap_inputs,
                    weap_inputs: state.weap_inputs,
                    mabia_inputs: state.mabia_inputs,

                    simulation_time_range: state.simulation_time_range,

                    weap_result_variable: state.weap_result_variable,
                    leap_result_variable: state.leap_result_variable,

                    simulation_run_status: state.simulation_run_status,
                    run_log: state.run_log,

                    sensitivity_graph: state.sensitivity_graph,
                    weap_checked_variables_on_sensitivity_graph: state.weap_checked_variables_on_sensitivity_graph,
                    leap_checked_variables_on_sensitivity_graph: state.leap_checked_variables_on_sensitivity_graph,
                    mabia_checked_variables_on_sensitivity_graph: state.mabia_checked_variables_on_sensitivity_graph,
                    Sensitivity_Graph_Modal: state.Sensitivity_Graph_Modal,

                    Load_History_Modal: state.Load_History_Modal,
                    Save_History_Modal: state.Save_History_Modal,
                    // Stored_Simulations: [],
                    Simulation_to_Load_Name: state.Simulation_to_Load_Name,
                    Simulation_to_Save_Name: state.Simulation_to_Save_Name
                })
            }
        })
    }

    closeSaveHisotyModal(){
        this.setState({
            Save_History_Modal: false
        })
    }

    handleSaveHistoryClick(){
        this.setState({
            Save_History_Modal: true
        })
    }

    confirmSaveSimulationResult(){
        let stored_simulations = JSON.parse(JSON.stringify(this.state.Stored_Simulations))
        console.log(stored_simulations)
        let stored_simulations_names = []
        let fewsim_state = JSON.parse(JSON.stringify(this.state))
        stored_simulations.forEach(simulation=>{
            stored_simulations_names.push(simulation["name"])
        })
        fewsim_state.Stored_Simulations = []
        console.log(fewsim_state)
        if(stored_simulations_names.includes(this.state.Simulation_to_Save_Name)){
            this.openNotification('Simulation name already exists!', 'Please rename the simulation!')
        }
        else{
            stored_simulations.push(JSON.parse(JSON.stringify({"name": this.state.Simulation_to_Save_Name, "state":fewsim_state})))
            fetch('/load-simulation-history', {method: 'POST', body: JSON.stringify(stored_simulations)}).then(data => data.json()).then(data=>{console.log(data)})
        }
        
    }

    inputSaveSimulationNameChanged(user_input){

        this.setState({
            Simulation_to_Save_Name: user_input.target.value
        })
    }

    confirmSaveScenario(scenario_to_save){
        let created_scenarios = JSON.parse(JSON.stringify(this.state.created_scenarios))
        let existing_scenarios = JSON.parse(JSON.stringify(this.state.existing_scenarios))
        let existing_scenarios_names = []
        console.log(scenario_to_save)
        console.log(this.state.created_scenarios)
        console.log(this.state.existing_scenarios)
        existing_scenarios.forEach(scenario=>{
            existing_scenarios_names.push(scenario.name)
        })
        if(existing_scenarios_names.includes(scenario_to_save) !== true){
            created_scenarios.forEach(scenario=>{
                if(scenario.name===scenario_to_save){
                    existing_scenarios.push(scenario)
                }
            })
            console.log(existing_scenarios)
            this.setState({
                existing_scenarios: existing_scenarios
            })
            fetch('/load-scenarios', { method: 'POST', body: JSON.stringify({"scenarios": existing_scenarios})}).then(d => d.json()).then((d)=>{console.log(d)});
        }
        
        if(existing_scenarios_names.includes(scenario_to_save) === true){
            this.openNotification('Scenario already exists!', 'Please save another scenario!')
        }
        
    }

    deleteExistingScenario(existing_scenario_to_delete){
        console.log(existing_scenario_to_delete)
        let existing_scenarios = JSON.parse(JSON.stringify(this.state.existing_scenarios))
        let existing_scenarios_names = []
        let updated_existing_scenario = []
        existing_scenarios.forEach(scenario=>{
            existing_scenarios_names.push(scenario.name)
        })
        if(existing_scenarios_names.includes(existing_scenario_to_delete) !== true){
            this.openNotification('Scenario already deleted!', 'Done!')
        }
        if(existing_scenarios_names.includes(existing_scenario_to_delete) === true){
            updated_existing_scenario = existing_scenarios.filter(scenario => scenario.name!==existing_scenario_to_delete)
            console.log(updated_existing_scenario)
            this.setState({
                existing_scenarios: updated_existing_scenario
            })
            fetch('/load-scenarios', { method: 'POST', body: JSON.stringify({"scenarios": updated_existing_scenario})}).then(d => d.json()).then((d)=>{console.log(d)});
        }
    }

    handleClimateScenarioChecked(checkedKeys, info){
        console.log(checkedKeys)
        let current_key_checked = []
        let previous_keys_checked = this.state.checked_climate_scenarios
        checkedKeys.forEach(key=>{
            if(previous_keys_checked.includes(key)===false){
                current_key_checked.push(key)
            }
        })
        this.setState({checked_climate_scenarios:current_key_checked})
    }

    render() {

        const {
            proj,
            activatedScenario,
            activatedMethod
        } = this.state;

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };

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
                        <Col span={24}>
                            <font size="5">Scenarios List</font>
                            <Tabs type="card">
                                <TabPane tab="Input Variable Selection" key="0" >
                                    <Row>
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
                                                checkedKeys={this.state.weap_checked_variables_on_sensitivity_graph}
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
                                                checkedKeys={this.state.leap_checked_variables_on_sensitivity_graph}
                                                onCheck={this.handleLEAPinputChecked.bind(this)}
                                                // onLoad={}
                                                disabled={false}
                                                >
                                                    <TreeNode title="LEAP" key="LEAP" checkable={false}>
                                                        {this.plotVariableTree([this.state.variables['children'][2]])}
                                                    </TreeNode>
                                                </Tree>
                                                <Tree
                                                checkable={true}
                                                defaultExpandedKeys={['climate-input']}
                                                checkedKeys={this.state.checked_climate_scenarios}
                                                onCheck={this.handleClimateScenarioChecked.bind(this)}
                                                // onLoad={}
                                                disabled={false}
                                                >
                                                    <TreeNode title="climate" key="climate" checkable={false}>
                                                        {this.state.climate_scenarios.map(scenario=>{
                                                            
                                                            return <TreeNode
                                                            title={scenario["name"]+"-"+scenario["type"]}
                                                            key={scenario["name"]+"_"+scenario["type"]}
                                                            />
                                                        })}
                                                    </TreeNode>
                                                </Tree>
                                        </Card> 
                                    </Col>
                                    <Col span={18}>
                                        <Card style={{
                                                height:380,
                                                flex: 0,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                            <Row>
                                                <Col span={21}> <Input id="name" defaultValue="" value={this.state.created_scenario_name} onChange={this.inputScenarioName.bind(this)} addonBefore="name" /></Col>
                                                <Col span={3}><Button type="primary" onClick={this.showSensitivityGraphModal.bind(this)}>Sensitivity Graph</Button> </Col>
                                            </Row>
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
                                                <TabPane tab="climate" key="3">
                                                    {this.state.checked_climate_scenarios.map(scenario=>{return <b1><h2>{scenario}</h2> Climate Scenario is selected!</b1>}
                                                        )}
                                                </TabPane>
                                            </Tabs>
                                        </Card>
                                    </Col>
                                    </Row>
                                    <Button type="primary" onClick={this.createScenarios}>Create Scenario</Button> 
                                </TabPane>
                                <TabPane tab="Scenarios Summary" key="1">
                                
                                 <Tabs type="card" tabPosition="left">
                                    <TabPane tab="Run" key="1">
                                        <Row>
                                        <Col span={6}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                {/* <Row gutter={8}>Scenarios to Run!</Row> */}
                                                <Row gutter={8}>Created Scenarios </Row>
                                                
                                                {/* <ButtonGroup> */}
                                                    {this.state.created_scenarios.map(scenario=>{
                                                        if(Boolean(scenario["type"])===false){

                                                            return  <Row gutter={8} key={scenario.name}>
                                                                        <Col span={21}>
                                                                       
                                                                            <div><Button id={scenario.name} onClick={element=>this.showScenarioSummary(scenario.name)} block>{scenario.name}</Button> </div>
                                                                        
                                                                        </Col>
                                                                        <Col span={3}>
                                                                            <div onClick={element=> this.deleteScenario(scenario.name)}> <div id={scenario.name}>x</div> </div>
                                                                        </Col>
                                                                    </Row>
                                                                     }})}    
                                                {/* </ButtonGroup> */}
                                                

                                                <Row gutter={8}>Existing Scenarios</Row>
                                                
                                                    {this.state.created_scenarios.map(scenario=>{
                                                        if(Boolean(scenario["type"])!==false){
                                                            return <Row gutter={8} key={scenario.name}>
                                                                        <Col span={21}>
                                                                            <div><Button id={scenario.name} onClick={element=>this.showScenarioSummary(scenario.name)} block>{scenario.name}</Button> </div>
                                                                        </Col>
                                                                        <Col span={3}>
                                                                            <div onClick={element=> this.deleteScenario(scenario.name)}> <div id={scenario.name}>x</div> </div>
                                                                        </Col>
                                                                    </Row> }})}    
                                                
                                            </Card>
                                        </Col>
                                        <Col span={18}>
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
                                                                <Popconfirm placement="bottomLeft" title={"Do you want to save the indices?"} onConfirm={element=>this.confirmSaveScenario(scenario.name)} okText="Yes" cancelText="No">
                                                                    <div><Button >Save</Button> </div>
                                                                </Popconfirm>
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

                                                                <Row gutter={8}>Climate</Row>
                                                                {scenario.climate.map(variable=>{
                                                                    return variable
                                                                })}
                                                                </div>
                                                        
                                                    }}) 
                                                }
                                            </Card>
                                        </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tab="Load" key="2">
                                        <Row>
                                        <Col span={6}>
                                            <Card style={{
                                                height:380,
                                                flex: 2,
                                                marginTop: 0,
                                                overflow: 'auto',
                                            }}>
                                                <Row gutter={8}>Existing Scenarios</Row>
                                                    {this.state.existing_scenarios.map(scenario=>{return <Row gutter={8} key={scenario.name}>
                                                                                                            <Col span={21}>
                                                                                                                <div>
                                                                                                                    <Button id={scenario.name} onClick={element=>this.showExistingScenarioSummary(scenario.name)} block>{scenario.name}</Button> 
                                                                                                                </div>
                                                                                                            </Col>
                                                                                                            <Col span={3}>
                                                                                                                
                                                                                                                <Popconfirm placement="bottomLeft" title={"Do you want to delete this existing scenario?"} onConfirm={element=>this.deleteExistingScenario(scenario.name)} okText="Yes" cancelText="No">
                                                                                                                    <div><Button >x</Button> </div>
                                                                                                                </Popconfirm>
                                                                                                                    
                                                                                                            </Col>
                                                                                                            </Row>})}
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
                                                    if(existing_scenarios_summary==='' && scenario.name ===this.state.existing_scenarios[0].name){
                                                        return <div key={scenario.name}>Please select the scenario to view!</div>
                                                    }
                                                    if(existing_scenarios_summary==='Base' && scenario.name===existing_scenarios_summary){
                                                        return <div key={scenario.name}>      
                                                                    This is Base scenario with every variable in default!
                                                                    <Button id={scenario.name} type="dash" shape="round" onClick={element=>this.loadExistingScenarios(scenario.name)}>Load to Run</Button>
                                                                </div>
                                                    }
                                                    if(existing_scenarios_summary===scenario.name && existing_scenarios_summary !== "Base"){
                                                        return <div key={scenario.name}>
                                                                
                                                                {scenario.name} <Button id={scenario.name} type="dash" shape="round" onClick={element=>this.loadExistingScenarios(scenario.name)}>Load to Run</Button>
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
                                        </Row>
                                    </TabPane>

                                </Tabs>
                                
                                </TabPane>
                            </Tabs>
                        </Col>
                        
                    </Row>
                    
                </Modal>

                <Modal 
                    width={800}
                    visible={this.state.Sensitivity_Graph_Modal}
                    onCancel={this.closeSensitivityGraphModal.bind(this)}
                    footer={null}
                >
                    <Sensitivity_Graph 
                        sensitivity_graph={this.state.sensitivity_graph} 
                        weap_checked_variables_on_sensitivity_graph={this.state.weap_checked_variables_on_sensitivity_graph}
                        leap_checked_variables_on_sensitivity_graph={this.state.leap_checked_variables_on_sensitivity_graph}
                        clickSensitivityGraphNode={this.clickSensitivityGraphNode.bind(this)}
                    >

                    </Sensitivity_Graph>
                </Modal>

                <Modal 
                    width={1550}
                    visible={this.state.Sustainability_Creation_Modal}
                    onCancel={this.closeSustainabilityModal.bind(this)}
                    footer={null}
                >
                    <Variables_Radial_Tree 
                        variables={this.state.variables} 
                        getSuatainabilityIndex={this.getSuatainabilityIndex.bind(this)}
                        getLoadedSuatainabilityIndex={this.getLoadedSuatainabilityIndex.bind(this)}
                    >
                    </Variables_Radial_Tree>
                </Modal>

                <Modal 
                    width={650}
                    visible={this.state.Load_History_Modal}
                    onCancel={this.closeLoadHisotyModal.bind(this)}
                    footer={null}
                >   
                    <Card style={{
                                height:380,
                                flex: 2,
                                marginTop: 0,
                                overflow: 'auto',
                            }}
                            title="Existing Simulations"
                    >
                        <Radio.Group onChange={this.onChangeSimulationToLoadName.bind(this)} value={this.state.Simulation_to_Load_Name}>
                        {this.state.Stored_Simulations.map(simulation=>{
                            return <Radio style={radioStyle} value={simulation['name']}>{simulation['name']}</Radio>
                        })}
                    </Radio.Group>
                    </Card>
                    <Popconfirm placement="bottomLeft" title={"Do you want to load the simulation?"} onConfirm={this.handleLoadSimulationButtonClick.bind(this)} okText="Yes" cancelText="No">
                      <Button type="primary" >Load Simulation</Button>
                    </Popconfirm>
                    {/* <Button type="primary" onClick={this.handleLoadSimulationButtonClick.bind(this)}>Load Simulation</Button> */}
                    
                </Modal>

                <Modal 
                    width={650}
                    visible={this.state.Save_History_Modal}
                    onCancel={this.closeSaveHisotyModal.bind(this)}
                    footer={null}
                >
                     <Input id="name" defaultValue="" value={this.state.Simulation_to_Save_Name} onChange={this.inputSaveSimulationNameChanged.bind(this)} addonBefore="name" />
                     <Popconfirm placement="bottomLeft" title={"Do you want to save the simulation?"} onConfirm={this.confirmSaveSimulationResult.bind(this)} okText="Yes" cancelText="No">
                      <Button>Save Simulation</Button>
                    </Popconfirm>
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
                                {this.state.run_model_status==="null" && 
                                    <Menu.Item key="load" onClick={this.handleLoadHistoryClick.bind(this)}>Load History</Menu.Item>
                                }
                                {this.state.run_model_status==="finished" && 
                                    <Menu.Item key="save" onClick={this.handleSaveHistoryClick.bind(this)}>Save</Menu.Item>
                                }

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
                            run_log={this.state.run_log}
                            created_scenarios={this.state.created_scenarios}
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
                            sustainability_variables_calculated={this.state.sustainability_variables_calculated}
                            loaded_group_index_simulated={this.state.loaded_group_index_simulated}
                            sensitivity_graph={this.state.sensitivity_graph} 
                        />                        
                    </Content>
                </Layout>
            </div>
        );
    }
    
}