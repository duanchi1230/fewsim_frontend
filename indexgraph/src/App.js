import React, {Component} from 'react';
import {Card, Button, Radio} from 'antd';
import './App.css';

import FlatView from "./components/FlatView";
import CompareView from "./components/CompareView";

const VIEW_STATUS_FLAT = 'VIEW_STATUS_FLAT';
const VIEW_STATUS_COMPARE = 'VIEW_STATUS_COMPARE';

// TODO: need adjustment
const VIEW_SUSVIEW_WIDTH = 1200;
const VIEW_SUSVIEW_HEIGHT = 800;


class App extends Component {
    constructor() {
        super();

        this.state = {};
        this.state.viewStatus = VIEW_STATUS_FLAT;

        // states for the compare view
        this.state.compareChartBlock = null;
        this.state.compareScenarioName = null;
        this.state.compareSusIndexName = null;
    }

    handleViewStatusChange = (event) => {
        this.setState({
            viewStatus: event.target.value
        })
    };

    handleCompareButtonClick = (chartBlock) => {
        this.setState({
            compareChartBlock: chartBlock,
            viewStatus: VIEW_STATUS_COMPARE
        });
    };

    handleCompareScenarioChange = (value) => {
        const newCompare = this.state.data.chartBlocks.filter(
            block => block.susIndexName === this.state.compareChartBlock.susIndexName
                && block.scenarioName === value
        );

        this.setState({
            compareChartBlock: newCompare[0]
        });
    };

    handleCompareSusIndexChange = (value) => {

        const newCompare = this.state.data.chartBlocks.filter(
            block => block.scenarioName === this.state.compareChartBlock.scenarioName
                && block.susIndexName === value
        );

        this.setState({
            compareChartBlock: newCompare[0]
        });
    };

    render() {

        let viewComponent;
        let {data} = this.props;

        if (this.state.viewStatus === VIEW_STATUS_FLAT) {
            viewComponent = <FlatView
                data={data}
                handleCompareButtonClick={this.handleCompareButtonClick}
            />;
        } else if (this.state.viewStatus === VIEW_STATUS_COMPARE) {
            viewComponent = <CompareView
                data={data}
                compareChartBlock={this.state.compareChartBlock}
                handleCompareScenarioChange={this.handleCompareScenarioChange}
                handleCompareSusIndexChange={this.handleCompareSusIndexChange}
            />;
        }


        return (
            <div
                style={{
                    width: VIEW_SUSVIEW_WIDTH,
                    height: VIEW_SUSVIEW_HEIGHT,
                    // marginLeft: 20,
                    // marginTop: 20
                }}
            >
                <Card
                    size="small"
                    title="Sustainability Index View"
                    headStyle={{
                        background: 'rgb(236, 236, 236)'
                    }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    extra={
                        <Radio.Group
                            onChange={this.handleViewStatusChange}
                            defaultValue={VIEW_STATUS_FLAT}
                            value={this.state.viewStatus}
                            size="small"
                        >
                            <Radio.Button value={VIEW_STATUS_FLAT}>Flat Mode</Radio.Button>
                            <Radio.Button value={VIEW_STATUS_COMPARE}>Compare Mode</Radio.Button>
                        </Radio.Group>
                    }
                >
                    {viewComponent}
                </Card>
            </div>
        );
    }
}


export default App;