import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs, Table} from 'antd';

class LEAP_Variables_Ranking extends Component {
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
        }
        
    }

    sortLEAPData(data_scenario, sortOrder, sortColumn){
        if(sortOrder===''){
            for(let i=0; i<data_scenario.length; i++){
                data_scenario[i]['index']=i
                }
            return data_scenario
        }
        if(sortOrder==='ascend'){
            let sorted_data = []
            data_scenario =JSON.parse(JSON.stringify(data_scenario))
            console.log(data_scenario)
            while(data_scenario.length>0){
              let min_response = data_scenario[0]['response-level']
              let min_data = data_scenario[0]
              let residual_data = []
              let pointer = 0
              for(let i=0; i<data_scenario.length; i++){
                if(min_response>data_scenario[i]['response-level']){
                    min_response = data_scenario[i]['response-level']
                    min_data = JSON.parse(JSON.stringify(data_scenario[i]))
                    pointer = i
                  }}
              for(let i=0; i<data_scenario.length; i++){
                if(i!==pointer){
                    residual_data.push(data_scenario[i])
                  }
              }
              data_scenario = JSON.parse(JSON.stringify(residual_data))
              min_data["index"] = sorted_data.length
              sorted_data.push(min_data)
            }
          console.log(sorted_data)
          return sorted_data
          
        }

        if(sortOrder==='descend'){
          let sorted_data = []
          data_scenario =JSON.parse(JSON.stringify(data_scenario))
          console.log(data_scenario)
          while(data_scenario.length>0){
            let max_response = data_scenario[0]['response-level']
            let max_data = data_scenario[0]
            let residual_data = []
            let pointer = 0
            for(let i=0; i<data_scenario.length; i++){
              if(max_response<data_scenario[i]['response-level']){
                  max_response = data_scenario[i]['response-level']
                  max_data = JSON.parse(JSON.stringify(data_scenario[i]))
                  pointer = i
            }}
            for(let i=0; i<data_scenario.length; i++){
              if(i!==pointer){
                residual_data.push(data_scenario[i])
              }
            }
            data_scenario = JSON.parse(JSON.stringify(residual_data))
            max_data["index"] = sorted_data.length
            sorted_data.push(max_data)
          }
          console.log(sorted_data)
          return sorted_data
      
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
              width: "10%",
            },
            {
              title: 'Name',
              dataIndex: 'branch',
              width: "20%",
            },
            {
              title: 'Response',
              dataIndex: 'percentage',
              width: "30%",
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
              width: "35%",
              sorter: {
                compare: (a, b) => a['response-level'] - b['response-level'],
                // multiple: 3,
              },
              sortOrder: this.state.sortOrder,
            },
          ]

        let scenario_to_show = ''
        if(this.props.scenario_to_show===''){
            scenario_to_show = this.props.leap_data[0].name
        }
        else{
            scenario_to_show = this.props.scenario_to_show
        }
        console.log(this.props.leap_data)

        let data_scenario = []
        let data_scenario_sorted = []

        this.props.leap_data.forEach(data => {
            if(data.name===scenario_to_show){
                data_scenario = JSON.parse(JSON.stringify(data['var']['output']))
            }
        })

        for(let i=0; i<data_scenario[this.props.type][this.props.variable].length; i++){
            let response_level = 0
            data_scenario[this.props.type][this.props.variable][i]['percentage'].forEach(percentage=>{
                response_level = response_level + Math.abs(percentage)
            })
            data_scenario[this.props.type][this.props.variable][i]['response-level'] = response_level
        }
        // data_scenario[this.props.type][this.props.variable][0]['response-level'] = 10000000000000000
        data_scenario_sorted = this.sortLEAPData(data_scenario[this.props.type][this.props.variable], this.state.sortOrder, this.state.sortColumn)
        console.log(data_scenario_sorted)
        // data_scenario_sorted[10]['response-level'] = 1
        return (
            <div>
            <Card
                title={ <div style={{display:"inline-block"}}>
                            <div style={{display:"inline-block"}}> Response Level: {this.props.variable} </div> (<div style={{color:"#fdae61", display:"inline-block"}}>{scenario_to_show}</div>)
                        </div> }
                style={{
                height:270,
                flex: 10,
                marginTop: 0,
                overflow: 'auto',
            }}>
                <Table columns={columns} dataSource={data_scenario_sorted} onChange={this.onChange.bind(this)} pagination={false} />
            </Card>
        </div>
        );
    }
}

export default LEAP_Variables_Ranking;