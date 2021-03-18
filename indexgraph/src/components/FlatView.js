import React, {Component} from 'react';
import {Button, Row, Dropdown, Menu, Checkbox, Divider, Switch, List, Card} from 'antd';
import ReactEcharts from 'echarts-for-react';

//TODO: need adjustment
const VIEW_FLAT_VIEW_HEIGHT = 685;
const VIEW_CHART_HEIGHT = 180;
const ECHARTS_TITLE_TEXT_STYLE = {fontSize: 14};

export default class FlatView extends Component {

    constructor() {
        super();

        this.state = {
            disabledScenarios: [],
            disabledSusIndices: [],
            aggregateScenarios: false,
            aggregateIndices: false
        };
    }

    handleScenarioChange = (event, name) => {

        let newDisabledScenario = [...this.state.disabledScenarios];

        if (!event.target.checked) {
            newDisabledScenario.push(name);
            this.setState({
                disabledScenarios: newDisabledScenario
            });
        } else {
            this.setState({
                disabledScenarios: newDisabledScenario.filter(x => x !== name)
            })
        }
    };

    handleSusIndexChange = (event, name) => {
        let newDisabledSusIndices = [...this.state.disabledSusIndices];

        if (!event.target.checked) {
            newDisabledSusIndices.push(name);
            this.setState({
                disabledSusIndices: newDisabledSusIndices
            });
        } else {
            this.setState({
                disabledSusIndices: newDisabledSusIndices.filter(x => x !== name)
            })
        }

    };

    handleAggregateScenarios = (aggregateScenarios) => {
        this.setState({aggregateScenarios});
    };

    handleAggregateSusIndex = (aggregateIndices) => {
        this.setState({aggregateIndices});
    };

    handleCompareButtonClick = (chartBlock) => {
        this.props.handleCompareButtonClick(chartBlock);
    };

    render() {

        const {data} = this.props;
        const {scenarioNames, susIndexNames} = data;

        const scenarioMenu = <Menu>
            {
                scenarioNames.map((name, i) =>
                    <Checkbox
                        key={`scenario-${i}`}
                        onChange={e => this.handleScenarioChange(e, name)}
                        defaultChecked={true}
                    >
                        {name}
                    </Checkbox>
                )
            }
        </Menu>;

        const susIndexMenu = <Menu>
            {
                susIndexNames.map((name, i) =>
                    <Checkbox
                        key={`susindex-${i}`}
                        onChange={e => this.handleSusIndexChange(e, name)}
                        defaultChecked={true}
                    >
                        {name}
                    </Checkbox>
                )
            }
        </Menu>;

        return (
            <div>
                <Row
                    style={{
                        marginBottom: 16
                    }}
                >
                    <span>Aggreate Scenarios</span>
                    <Switch
                        defaultChecked={this.state.aggregateScenarios}
                        onChange={this.handleAggregateScenarios}
                        style={{marginLeft: 4, marginRight: 8}}
                    />

                    <Dropdown disabled={this.state.aggregateScenarios} overlay={scenarioMenu}>
                        <Button>Scenarios</Button>
                    </Dropdown>

                    <Divider type="vertical"/>

                    <span>Aggreate Indices</span>
                    <Switch
                        defaultChecked={this.state.aggregateIndices}
                        onChange={this.handleAggregateSusIndex}
                        style={{marginLeft: 4, marginRight: 8}}
                    />

                    <Dropdown disabled={this.state.aggregateIndices} overlay={susIndexMenu}>
                        <Button>Sustainability Indices</Button>
                    </Dropdown>
                </Row>
                <Row
                    style={{
                        height: VIEW_FLAT_VIEW_HEIGHT,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                    }}
                >
                    {
                        (this.state.aggregateScenarios || this.state.aggregateIndices)
                            ? <AggregatedChartGrid
                                data={this.props.data}
                                disabledScenarios={this.state.disabledScenarios}
                                disabledSusIndices={this.state.disabledSusIndices}
                                aggregateScenarios={this.state.aggregateScenarios}
                                aggregateIndices={this.state.aggregateIndices}
                            />
                            : <FlatChartGrid
                                data={this.props.data}
                                disabledScenarios={this.state.disabledScenarios}
                                disabledSusIndices={this.state.disabledSusIndices}
                                handleCompareButtonClick={this.handleCompareButtonClick}
                            />
                    }
                </Row>
            </div>
        );
    };
}


class FlatChartGrid extends Component {
    constructor() {
        super();
    }

    handleCompareButtonClick = (chartBlock) => {
        this.props.handleCompareButtonClick(chartBlock);
    };

    render() {

        const {data, disabledScenarios, disabledSusIndices} = this.props;
        const enabledScenarios = data.scenarioNames.filter(
            d => disabledScenarios.indexOf(d) === -1
        );
        const enabledSusIndices = data.susIndexNames.filter(
            d => disabledSusIndices.indexOf(d) === -1
        );

        const enabledChartBlocks = data.chartBlocks.filter(
            block =>
                enabledScenarios.indexOf(block.scenarioName) >= 0
                && enabledSusIndices.indexOf(block.susIndexName) >= 0
        );


        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    // backgroundColor: 'blue'
                }}
            >
                <List
                    grid={{gutter: 8, column: enabledScenarios.length}}
                    dataSource={enabledChartBlocks}
                    renderItem={item => {
                        return <List.Item>
                            <Card
                                // title={`${item.scenarioName}, ${item.susIndexName}`}
                                size="small"
                                bodyStyle={{
                                    padding: 8,
                                    height: '100%'
                                }}
                                style={{
                                    // width: 300,
                                    height: VIEW_CHART_HEIGHT
                                }}
                            >
                                <ReactEcharts
                                    option={{
                                        title: {
                                            text: `${item.scenarioName}, ${item.susIndexName}`,
                                            textStyle: ECHARTS_TITLE_TEXT_STYLE
                                        },
                                        xAxis: {
                                            type: 'category',
                                            data: data.timeRange
                                        },
                                        yAxis: {
                                            type: 'value'
                                        },
                                        grid: {
                                            left: '3%',
                                            right: '4%',
                                            bottom: '3%',
                                            top: '18%',
                                            containLabel: true
                                        },
                                        series: [{
                                            name: item.susIndexName,
                                            type: 'line',
                                            data: item.series
                                        }]
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 10
                                    }}
                                >
                                    <Button
                                        size="small"
                                        shape="circle"
                                        icon="link"
                                        onClick={() => this.handleCompareButtonClick(item)}
                                    />
                                </div>
                            </Card>
                        </List.Item>
                    }}
                />
            </div>
        )
    }
}

class AggregatedChartGrid extends Component {
    constructor() {
        super();
    }

    render() {
        const {
            data,
            disabledScenarios, disabledSusIndices,
            aggregateScenarios, aggregateIndices
        } = this.props;

        let rowData = [];

        // prepare the row data
        if (aggregateScenarios) {
            // filter indices first
            const filteredSusIndexData = data.chartBlocks.filter(
                block => disabledSusIndices.indexOf(block.susIndexName) === -1
            );

            const enabledSusIndices = data.susIndexNames.filter(
                d => disabledSusIndices.indexOf(d) === -1
            );

            for (let i = 0; i < enabledSusIndices.length; i++) {
                const currentSusIndexName = enabledSusIndices[i];

                // the filtered _chartBlock will be in the same row
                const _chartBlocks = filteredSusIndexData.filter(
                    block => block.susIndexName === currentSusIndexName
                );

                let row = {
                    title: {
                        text: currentSusIndexName,
                        textStyle: ECHARTS_TITLE_TEXT_STYLE
                    },
                    series: _chartBlocks.map(block => {
                        return {
                            name: block.scenarioName,
                            type: 'line',
                            data: block.series
                        };
                    })
                };

                rowData.push(row);
            }
        } else if (aggregateIndices) {
            // filter scenarios first
            const filteredScenarioData = data.chartBlocks.filter(
                block => disabledScenarios.indexOf(block.scenarioName) === -1
            );

            const enabledScenarios = data.scenarioNames.filter(
                d => disabledScenarios.indexOf(d) === -1
            );

            for (let i = 0; i < enabledScenarios.length; i++) {
                const currentScenarioName = enabledScenarios[i];

                const _chartBlocks = filteredScenarioData.filter(
                    block => block.scenarioName === currentScenarioName
                );

                rowData.push({
                    title: {
                        text: currentScenarioName,
                        textStyle: ECHARTS_TITLE_TEXT_STYLE
                    },
                    series: _chartBlocks.map(block => {
                        return {
                            name: block.susIndexName,
                            type: 'line',
                            data: block.series
                        };
                    })
                });
            }
        }


        return (
            <div
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                {
                    rowData.map((row, _i) => {
                        return (
                            <Row
                                key={`row-${_i}`}
                                style={{
                                    height: VIEW_CHART_HEIGHT,
                                    width: '100%'
                                }}
                            >
                                <ReactEcharts
                                    option={{
                                        ...row,
                                        legend: {
                                            data: row.series.map(r => r.name)
                                        },
                                        tooltip: {
                                            trigger: 'axis'
                                        },
                                        xAxis: {
                                            type: 'category',
                                            data: data.timeRange
                                        },
                                        yAxis: {
                                            type: 'value'
                                        },
                                        grid: {
                                            left: '3%',
                                            right: '4%',
                                            bottom: '3%',
                                            top: '18%',
                                            containLabel: true
                                        },
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                />
                            </Row>
                        );
                    })
                }
            </div>
        );
    }
}