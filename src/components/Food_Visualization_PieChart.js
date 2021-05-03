import React, { Component } from 'react';
import {Row, Col, Divider, Empty, Card, Button, Tabs} from 'antd';

// Food Visualization currently under development
class Food_Visualization_PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div>
                <Card
                        size="small" 
                        headStyle={{
                            background: 'rgb(236, 236, 236)'
                        }}
                        // extra={<Button onClick={this.showFilterModal.bind(this)} type="primary" style={{"backgroundColor":"#2b8cbe"}}><Icon type="left" /> Flow Variables Filter<Icon type="right" /></Button>}
                        // title={ <div style={{display:"inline-block"}}>
                        //             <div style={{display:"inline-block"}}>WEAP Pixel Map </div> (<div style={{color:"#2b8cbe", display:"inline-block"}}>{scenario_to_show}</div>)
                        //         </div> }
                        style={{
                        height: 895,
                        flex: 10,
                        marginTop: 0,
                        overflow: 'auto',
                        }}>

                            Annual Crop Production Proportions
                        </Card>
            </div>
        );
    }
}

export default Food_Visualization_PieChart;