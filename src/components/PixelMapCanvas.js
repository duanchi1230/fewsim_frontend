import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';


export default class PixelMapCanvas extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {
        this.initCanvas();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateCanvas();
    }

    initCanvas() {
        const {data} = this.props;
        const svg = d3.select(findDOMNode(this));

        // start d3 drawing here
        svg.append('circle')
            .attr('cx', 100)
            .attr('cy', 100)
            .attr('r', 50)
            .style('fill', 'gray');
    }

    updateCanvas() {

    }

    render() {

        const {width, height} = this.props;

        return (
            <svg
                width={width}
                height={height}
            >
                <g id="base-group" />
            </svg>
        );
    }
}