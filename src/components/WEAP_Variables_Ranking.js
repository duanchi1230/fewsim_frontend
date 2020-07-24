import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs, Table, Icon} from 'antd';


class WEAP_Variables_Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            sortOrder: '', 
            sortColumn:'',
           };
    }

    onChange(pagination, filters, sorter, extra){
        console.log(sorter, sorter['order']);
        if(Boolean(sorter['order'])===true){
            this.setState({
                sortOrder: sorter['order']
            })
        }
        if(Boolean(sorter['order'])===false){
            this.setState({
                sortOrder: ''
            })
            console.log('1111111111', sorter);
        }
        
    }

    componentDidUpdate(){
        
    }

    componentDidMount(){

    }
    sortFlowData(flow_scenario, sortOrder, sortColumn){
        if(sortOrder===''){
            for(let i=0; i<flow_scenario.length; i++){
                flow_scenario[i]['index']=i
                }
            return flow_scenario
        }
        if(sortOrder==='ascend'){
            let sorted_flow = []
            flow_scenario =JSON.parse(JSON.stringify(flow_scenario))
            console.log(flow_scenario)
            while(flow_scenario.length>0){
              let min_response = flow_scenario[0]['response-level']
              let min_flow = flow_scenario[0]
              let residual_flow = []
              let pointer = 0
              for(let i=0; i<flow_scenario.length; i++){
                if(min_response>flow_scenario[i]['response-level']){
                    min_response = flow_scenario[i]['response-level']
                    min_flow = flow_scenario[i]
                    pointer = i
                  }}
              for(let i=0; i<flow_scenario.length; i++){
                if(i!==pointer){
                  residual_flow.push(flow_scenario[i])
                  }
              }
              flow_scenario = residual_flow
              min_flow["index"] = sorted_flow.length
              sorted_flow.push(min_flow)
            }
          console.log(sorted_flow)
          return sorted_flow
        }

        if(sortOrder==='descend'){
          let sorted_flow = []
          flow_scenario =JSON.parse(JSON.stringify(flow_scenario))
          console.log(flow_scenario)
          while(flow_scenario.length>0){
            let max_response = flow_scenario[0]['response-level']
            let max_flow = flow_scenario[0]
            let residual_flow = []
            let pointer = 0
            for(let i=0; i<flow_scenario.length; i++){
              if(max_response<flow_scenario[i]['response-level']){
                  max_response = flow_scenario[i]['response-level']
                  max_flow = flow_scenario[i]
                  pointer = i
            }}
            for(let i=0; i<flow_scenario.length; i++){
              if(i!==pointer){
                residual_flow.push(flow_scenario[i])
              }
            }
            flow_scenario = residual_flow
            max_flow["index"] = sorted_flow.length
            sorted_flow.push(max_flow)
          }
          console.log(sorted_flow)
          return sorted_flow
        }
    }
    render() {
        let x0 = 0
        let y0 = 0
        let height = 30
        let width = 100
        const columns = [
            {
              title: 'ID',
              dataIndex: 'index',
            },
            {
              title: 'Name',
              dataIndex: 'name',
              
            },
            {
              title: 'Response',
              dataIndex: 'percentage',
              render: (data)=> {let w = Math.floor(width/data.length); 
                                x0 = -w; 
                                return <div>
                                          <svg width={width} height={height}>
                                            <g>{data.map(d=>{
                                              x0=x0+w; 
                                              return <rect x={x0} y={height-(height*Math.abs(d)+1)} width={w-1} height={height*Math.abs(d)+1} style={{fill: "#2b8cbe"}}></rect>})}
                                            </g>
                                          </svg>
                                        </div>}
            },
            {
              title: 'Response Level',
              dataIndex: 'response-level',
              sorter: {
                compare: (a, b) => a['response-level'] - b['response-level'],
                // multiple: 3,
              },
              sortOrder: this.state.sortOrder,
              render: (data)=>{return  parseFloat(data).toFixed(2)}
            },
          ]

        let flow_scenario = []
        let flow_scenario_sorted = []
        let scenario_to_show = ''
        if(this.props.scenario_to_show===''){
            scenario_to_show = this.props.weap_flow[0].name
        }
        else{
            scenario_to_show = this.props.scenario_to_show
        }
        
        this.props.weap_flow.forEach(flow => {
            if(flow.name===scenario_to_show){
                flow_scenario = flow['var']['output']
            }
        })
        
        for(let i=0; i<flow_scenario.length; i++){
            let response_level = 0
            flow_scenario[i]['percentage'].forEach(percentage=>{
                response_level = response_level + Math.abs(percentage)
            })
            flow_scenario[i]['response-level'] = response_level
        }
        // flow_scenario[0]['response-level'] = 1
        flow_scenario_sorted = this.sortFlowData(flow_scenario, this.state.sortOrder, this.state.sortColumn)
        console.log(flow_scenario_sorted)


        return (
                <Card
                    title='Response Level: WEAP Flow Variable'
                    style={{
                    height:270,
                    flex: 10,
                    marginTop: 0,
                    overflow: 'auto',
                }}>
                    <Table columns={columns} dataSource={flow_scenario_sorted} onChange={this.onChange.bind(this)} pagination={false} />

                </Card>
        );
    }
}

export default WEAP_Variables_Ranking;