import React, {Component} from 'react';
import {Button, Row, Col, Divider, List, Card, Select} from 'antd';
import ReactEcharts from 'echarts-for-react';
import numeric from 'numericjs';
// This module is OBSOLETE now and is not used.
// const VIEW_CHART_HEIGHT = 162;
// const VIEW_CHART_WIDTH = 368;
// const VIEW_SIMILAR_RESULT_HEIGHT = 500;
const VIEW_SIMILAR_RESULT_NUM_COL = 8;
const VIEW_CHART_HEIGHT = '100%';
const VIEW_CHART_WIDTH = '100%';
const VIEW_SIMILAR_RESULT_HEIGHT = '100%';
const ECHARTS_TITLE_TEXT_STYLE = {fontSize: 14};


const computeDistance = (a, b) => {
    return numeric.norm2(
        numeric.sub(a.series, b.series)
    )
};


export default class CompareView extends Component {

    constructor() {
        super();
    }

    handleCompareScenarioChange = (value) => {
        this.props.handleCompareScenarioChange(value);
    };

    handleCompareSusIndexChange = (value) => {
        this.props.handleCompareSusIndexChange(value);
    };

    render() {

        const {data, compareChartBlock} = this.props;
        console.log(compareChartBlock)
        if (compareChartBlock === null) {
            return <div>Please select a chart first</div>;
        }


        const remainedChartBlocks = data.chartBlocks.filter(
            block => compareChartBlock !== block
        );

        // rank the charts with a specific measure
        const sortedChartBlocks = remainedChartBlocks.map(block => ({
            distance: computeDistance(block, compareChartBlock),
            chartBlock: block
        })).sort((a, b) => {
            if (a.distance < b.distance) return -1;
            else return 1;
        });

        return (
            <div>
            <Row>
                <Col span={6}>
                    <Row
                        style={{
                            marginTop: 8
                        }}
                    >
                        <span>Scenario: </span>
                        <Select
                            value={compareChartBlock.scenarioName}
                            onChange={this.handleCompareScenarioChange}
                        >
                            {
                                data.scenarioNames.map(
                                    (name, i) => <Select.Option
                                        value={name}
                                        key={`scenario-${i}`}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Row>
                    <Row
                        style={{
                            marginTop: 16
                        }}
                    >
                        <span>Sustainability Index: </span>
                        <Select
                            value={compareChartBlock.susIndexName}
                            onChange={this.handleCompareSusIndexChange}
                        >
                            {
                                data.susIndexNames.map(
                                    (name, i) => <Select.Option
                                        value={name}
                                        key={`susindex-${i}`}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Row>
                    <Row
                        style={{
                            marginTop: 16
                        }}
                    >
                        <span>Distance Measure: </span>
                        <Select
                            value={'euclidean'}
                        >
                            <Select.Option value="euclidean">Euclidean</Select.Option>
                        </Select>
                    </Row>
                </Col>
                <Col span={16}>
                    <ReactEcharts
                        option={{
                            title: {
                                text: `${compareChartBlock.scenarioName}, ${compareChartBlock.susIndexName}`.slice(0, 38),
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
                                name: compareChartBlock.susIndexName,
                                type: 'line',
                                data: compareChartBlock.series
                            }]
                        }}
                        style={{
                            height: VIEW_CHART_HEIGHT,
                            width: VIEW_CHART_WIDTH
                        }}
                    />
                </Col>
            </Row>

            <Divider orientation="left">Most Similar Charts</Divider>

            <div
                style={{
                    width: '100%',
                    height: 950,
                    overflowX: "hidden",
                    overflowY: "scroll"
                }}
            >
                <List
                    grid={{gutter: 8, column: VIEW_SIMILAR_RESULT_NUM_COL}}
                    dataSource={sortedChartBlocks}
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
                                            text: `${item.chartBlock.scenarioName}, ${item.chartBlock.susIndexName}`.slice(0, 38),
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
                                            name: item.chartBlock.susIndexName,
                                            type: 'line',
                                            data: item.chartBlock.series
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
                                    {`Distance: ${item.distance.toFixed(3)}`}
                                </div>
                            </Card>
                        </List.Item>
                    }}
                />
            </div>
        </div>
        );
    };
}
