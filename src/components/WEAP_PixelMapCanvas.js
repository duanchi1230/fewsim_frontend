import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';
// import calPixelMatrix from './calPixelMatrix'
// This module is OBSOLETE currently (and was for the WEAP pixel map)
export default class WEAP_PixelMapCanvas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scenario: ''
        };
    }
    
    componentDidMount() {
        // fetch('/proj/1/weap/scenario/0').then(r=>r.json()).then(data=>this.initCanvas(data))
        
        const weap_flow = this.props.weap_flow
        console.log(weap_flow)
        let {width, height} = findDOMNode(this).getBoundingClientRect();
        let scenario_to_show = this.props.scenario_to_show
        console.log(scenario_to_show)
        height = weap_flow[0]['var']['output'].length * 30 +150
        this.initCanvas(weap_flow[0], width, height);
    }

    handleMouseOver(x,y,flow_value,name, d){
        let data = this.props.weap_flow[0]
        let value = []
        data['var']['output'].forEach(
            v=> {if(v['name']==name){
                value = v['value']
            }}
        )
        console.log(x,y,name,flow_value,d)
        const svg = d3.select('#svg1')

        svg.append('rect')
            .attr('id', 'tooltip-pixelmap')
            .attr('x', x)
            .attr('y', y-30)
            .attr('height', 30)
            .attr('width', 180)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('fill', 'grey')
            .attr('stroke', 'rgb(50 50 50)')
            .style('opacity', 1)

            svg.append('text')
            .attr('id', 'tooltip-pixelmap')
            .attr('x', x+5)
            .attr('y', y-5)
            .text(flow_value.toExponential(2))
            .attr('font-size', '15px')
            .attr('fill', 'black')
            .style('opacity', 1)

        const linearGradient = svg.append('defs')
            .attr('class', 'scale-def')
            .append('linearGradient')
            .attr('id', 'grad1')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
        linearGradient.append('stop')
            .attr('offset', '0%')
            .style('stop-color', 'rgb(255, 255, 255)')
            .style('stop-opacity', '1')
        linearGradient.append('stop')
            .attr('offset', '100%')
            .style('stop-color', d['base-color'])
            .style('stop-opacity', '1')
        svg.append('rect')
            .attr('id', 'tooltip-pixelmap')
            .attr('x', x+60)
            .attr('y', y-25)
            .attr('height', 25)
            .attr('width', 120)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('fill', 'url(#grad1)')
            .attr('stroke', 'rgb(50 50 50)')
            .style('opacity', 1)
        svg.append('polyline')
            .attr('id', "tooltip-pixelmap")
            .attr('points', String(x+60+d['scale-factor']*120)+','+String(y-25)+' '+String(x+60+d['scale-factor']*120-5)+','+String(y-25-5)+' '+String(x+60+d['scale-factor']*120+5)+','+String(y-25-5))
            .attr('fill', 'black')
        svg.append('polyline')
            .attr('id', "tooltip-pixelmap")
            .attr('points', String(x+60+d['scale-factor']*120)+','+String(y-25)+' '+String(x+60+d['scale-factor']*120)+','+String(y))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
        
    }

    handleMouseOut(){
        d3.selectAll('#tooltip-pixelmap')
            .remove()
        d3.selectAll('.scale-def')
            .remove()
    }

    handleMouseClick(d){
        console.log(d)
        let weap_result_variable = []
        let weap_flow = JSON.parse(JSON.stringify(this.props.weap_flow))
        weap_flow.forEach(
            flow=>{flow['var']['output'].forEach(f=>{
                if(f['name']===d['rowName']){
                    f['scenario'] = flow['name']
                    weap_result_variable.push(f)
                }
            })
        })
        // console.log(weap_result_variable)
        this.props.handleWEAPResultVariableClick(weap_result_variable)
    }
    // componentWillReceiveProps(nextProps, nextContext) {
    //     this.updateCanvas();
    //     fetch('/proj/1/weap/scenario/1').then(r=>r.json()).then(data=>console.log(data))
    // }

    initCanvas(data, width, height) {
        
        // fetch('/proj/1/weap/scenario/0', {method: 'POST', body: JSON.stringify({'data':'1'})}).then(r=>r.json()).then(r=>console.log(r))
        const svg = d3.select(
        // '#PixelMap'
            findDOMNode(this)
        )
            .append('svg')
            .attr('id', 'svg1')
            .attr('width', width+500)
            .attr('height', height);
        console.log(data)
        let origin = {'x': 350, 'y': 50};
        let flow = data['var']['output'];
        let start_year = data['timeRange'][0];
        let end_year = data['timeRange'][1];

        let d = calPixelMatrix(flow, origin, start_year, end_year, this.props.sortType)
            

        svg.append('Tooltip')
        .attr('title', '12301230')
        .text('this is a tooltip')

        svg.append('g')
            .attr('id', 'map')
            .selectAll('rect')
            .data(d)
            .join('rect')
            .attr('x', d => d['x'])
            .attr('y', d => d['y'])
            .attr('height', d => d['dy'])
            .attr('width', d => d['dx'])
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', d => 'rgb(' + d['color'] + ')')
            // .attr('fill', d => d['color'])
            .attr('stroke', 'rgb(50 50 50)')
            .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['flow_value'] , d['rowName'],d))
            .on('mouseout', d=>this.handleMouseOut())
            .on('click', d=>this.handleMouseClick(d));
            // svg.append('g')
            // .attr('id', 'text-reference')
            // .selectAll('text')
            // .data(d)
            // .join('text')
            // .attr('x', d => d['x']+25)
            // .attr('y', d => d['y']+25)
            // .text(v=>v['percentage_change'])
            // .attr('text-anchor', 'end')
            // .attr('font-size', '9px')

        let x_text = origin['x'] - 10;
        let row = d.filter(value => value['year'] == start_year);
        svg.append('g')
            .attr('id', 'text-row')
            .selectAll('text')
            .data(row)
            .join('text')
            .attr('x', x_text)
            .attr('y', v => v['y'] + 15)
            .text(v => v['rowName'])
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            .attr('transform', function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(0, ${xRot},  ${yRot} )`;
            });

        let y_lable = [];
        let dx = 30;
        let x = origin['x'] + 10;
        for (let year = start_year; year <= end_year; year++) {
            y_lable.push({'year': year, 'x': x, 'y': origin['y'] - 10});
            x = x + dx;
        }

        svg.append('g')
            .selectAll('text')
            .data(y_lable)
            .join('text')
            .attr('x', y => y['x'])
            .attr('y', y => y['y'])
            .text(y => y['year'])
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('transform', function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(-45, ${xRot},  ${yRot} )`
            });

    }



    // updateCanvas(data) {
        // let flow= []
        // let origin = {'x':370, 'y':50}

        // let start_year = 1986
        // let end_year = 2008
        // let d = calPixelMatrix(raw_flow, origin, start_year,end_year, sort)

        // // Object.values(d).forEach(v=>console.log(v))
        // console.log(d)
        // const rect = d3.select('#map')
        //                 .selectAll('rect')
        //                 .remove()
        //                 .select('#map')
        //                 .data(d)
        //                 .enter()
        //                 .append('rect')
        //                 .attr('x', d=>d['x'])
        //                 .attr('y', d=>d['y'])
        //                 .attr('height', d=>d['dy'])
        //                 .attr('width', d=>d['dx'])
        //                 .attr('fill', '255 255 255')
        //                 .transition()
        //                 .duration(700)
        //                 .attr('rx', 0)
        //                 .attr('ry', 0)
        //                 .attr('fill', d=> 'rgb(' + d['color'] +')')
        //                 .attr('stroke', 'rgb(50 50 50)')

        // let x_text = origin['x']-10
        // let row = d.slice(0, 30*3)

        // d3.select('#text')
        //     .selectAll('text')
        //     .remove()
        //     .select('#text')
        //     .data(row)
        //     .enter()
        //     .append('text')
        //     .attr('x', x_text)
        //     .attr('y', row=>row['y']+15)
        //     .text(row=> row['source'])
        //     .transition()
        //     .duration(700)
        //     .text(row=> row['source']+' ' +row['siteName'] + '-(' + row['scenario'] +')')
        //     .attr('text-anchor','end')
        //     .attr('alignment-baseline', 'central')
        //     .attr('transform', function (row) {
        //     let xRot = d3.select(this).attr('x');
        //     let yRot = d3.select(this).attr('y');
        //             return `rotate(0, ${xRot},  ${yRot} )`})
    // }

    componentDidUpdate(){
        
        let data = []
        
        let scenario_to_show = ''
        if(this.props.scenario_to_show===''){
            scenario_to_show = this.props.weap_flow[0].name
        }

        else{
            scenario_to_show = this.props.scenario_to_show
        }
        this.props.weap_flow.forEach(flow=>{
            if(flow.name===scenario_to_show){
                data = flow
            }
        })
        console.log(scenario_to_show)
        const {width, height} = findDOMNode(this).getBoundingClientRect();
        this.updateCanvas(data, this.props.checkedOutput)
    }
    
    updateCanvas(data, nextProps) {
        console.log(data)
        let origin = {'x': 350, 'y': 50};
        let flow = data['var']['output'];
        let flow_filtered =[]
        let start_year = data['timeRange'][0];
        let end_year = data['timeRange'][1];
        flow.map(v=>{
            if(nextProps.includes(v['name'])){
                flow_filtered.push(v)
            }
        })

        let d = calPixelMatrix(flow_filtered, origin, start_year, end_year, this.props.sortType);
  
        const rect = d3.select('#map')
                .selectAll('rect')
                .remove()
                .select('#map')
                .data(d)
                .enter()
                .append('rect')
                .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['flow_value'] , d['rowName'], d))
                .on('mouseout', d=>this.handleMouseOut())
                .on('click', d=>this.handleMouseClick(d))
                .attr('x', d => d['x'])
                .attr('y', d => d['y'])
                .attr('width', d => d['dx'])
                // .transition()
                // .duration(300)
                .attr('height', d => d['dy'])
                .attr('rx', 0)
                .attr('ry', 0)
                .attr('fill', d => 'rgb(' + d['color'] + ')')
                .attr('stroke', 'rgb(50 50 50)')

            // svg.append('g')
            // .attr('id', 'text-reference')
            // .selectAll('text')
            // .data(d)
            // .join('text') 
            // .attr('x', d => d['x']+25)
            // .attr('y', d => d['y']+25)
            // .text(v=>v['percentage_change'])
            // .attr('text-anchor', 'end')
            // .attr('font-size', '9px')

        let x_text = origin['x'] - 10;
        let row = d.filter(value => value['year'] == start_year);
          d3.select('#text-row')
            .selectAll('text')
            .remove()
            .select('#text-row')
            .data(row)
            .enter()
            .append('text')
            .attr('y', v => v['y'] + 15)
            // .transition()
            // .duration(300)
            .attr('x', x_text)
            .text(v => v['rowName'])
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            // .attr('transform', function (row) {
            //     let xRot = d3.select(this).attr('x');
            //     let yRot = d3.select(this).attr('y');
            //     return `rotate(0, ${xRot},  ${yRot} )`;
            // });

    }

    render() {
        const {width, height} = this.props;
        return (
            <div
                id='pixel-map'
                style={{height: '100%', overflow: "auto"}}
            >

            </div>
            // <svg id='PixelCanvas'
            //     width={width}
            //     height={height}
            // >
            //     <g id='base-group' />
            // </svg>
        );
    }
}



function calPixelMatrix(flow, origin, start_year, end_year, sort) {
    let year1 = start_year
    let year2 = end_year
    let d = []
    console.log(sort)
    d = flowToCoordinate(flow, origin, year1, year2)

    if(sort===1){
        mapColorByDemandSite(d)
    }
    if(sort===2){
        mapColorBySupplySource(d)
    }
    // console.log('d', d)
    return d
}

function flowToCoordinate(flow, origin, start_year, end_year) {
    let flow_value = []
    let rowName = []
    let source = []
    let year = []
    let site = []
    let percentage = []
    let d = []

    console.log(flow)
    for (let i = 0; i < flow.length; i++) {
        for (let j = 0; j < flow[i]['value'].length; j++) {
            flow_value.push(flow[i]['value'][j])
            rowName.push(flow[i]['name'])
            source.push(flow[i]['source'])
            site.push(flow[i]['site'])
            year.push(start_year + j)
            // percentage.push(flow[i]['delta_to_reference'][j])

        }
    }
    let [x, y, dx, dy] = calCoordinate(flow, origin, start_year, end_year)
    for (let i = 0; i < x.length; i++) {
        d.push({
            'x': x[i],
            'y': y[i],
            'dx': dx,
            'dy': dy,
            'flow_value': flow_value[i],
            'source': source[i],
            'site': site[i],
            'rowName': rowName[i],
            'color': '',
            'year': year[i],
            'percentage_change': percentage[i]
        })
    }
    return d
}

function calCoordinate(flow, origin, start_year, end_year) {
    let space = 0
    let y0 = origin['y']
    let x = []
    let y = []
    let dx = 30
    let dy = dx
    let num_scenarios = Object.keys(flow).length

    for (let i = 0; i < flow.length; i++) {
        let x0 = origin['x']
        for (let j = start_year; j <= end_year; j++) {
            x.push(x0)
            x0 = x0 + dx + space
        }
    }

    for (let i = 0; i < flow.length; i++) {
        for (let j = start_year; j <= end_year; j++) {
            y.push(y0)
        }
        y0 = y0 + dy + space
    }

    return [x, y, dx, dy]
}


// function mapColor(d) {
//     console.log(d);

//     let base_color = {
//         'Municipal': [27, 158, 119],
//         'Agriculture': [217, 95, 2],
//         'Agriculture2': [117, 112, 179],
//         'Industrial': [231, 41, 138],
//         'PowerPlant': [102, 166, 30],
//         'Indian': [230, 171, 2]
//     }
//     let [max_value, min_value] = findRange(d)
//     // console.log(base_color['Municipal'][0])
//     d.forEach(pixel => {
//         for (let i = 0; i < 3; i++) {
//             const baseColor = base_color[pixel['site']][i];
//             pixel['color'] = pixel['color'] + ' ' + (255 - (pixel['flow_value'] - min_value[pixel['site']]) * (255 - base_color[pixel['site']][i]) / (max_value[pixel['site']] - min_value[pixel['site']])).toString()
//         }
//     })

//     function findRange(d) {
//         let max_value = {
//             'Municipal': 0,
//             'Agriculture': 0,
//             'Agriculture2': 0,
//             'Industrial': 0,
//             'PowerPlant': 0,
//             'Indian': 0
//         }
//         let min_value = {
//             'Municipal': 0,
//             'Agriculture': 0,
//             'Agriculture2': 0,
//             'Industrial': 0,
//             'PowerPlant': 0,
//             'Indian': 0
//         }
//         let site = ['Municipal', 'Agriculture', 'Agriculture2', 'Industrial', 'PowerPlant', 'Indian']
//         for (let i = 0; i < site.length; i++) {
//             let siteData = Object.values(d).filter(v => v['site'] == site[i])
//             let flow_value = []
//             for (let j = 0; j < siteData.length; j++) {

//                 flow_value.push(siteData[j]['flow_value'])
//             }
//             max_value[site[i]] = Math.max(...flow_value)
//             min_value[site[i]] = Math.min(...flow_value)
//         }
//         return [max_value, min_value]

//     }

// }

function mapColorByDemandSite(d) {

    let base_color = [[141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189], [141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189]]
    
    let color = {}
    let [max_value, min_value] = findRange(d)
    console.log('max', min_value, max_value)
    let i =0
    Object.keys(max_value).forEach(
        key=>{color[key]= base_color[i];
        i = i+1}
    )
    // console.log('color', color)
    // console.log(base_color['Municipal'][0])
    d.forEach(d => {
        d['base-color'] = 'rgb('
        for (let i = 0; i < 3; i++) {
            d['color'] = d['color'] + ' ' + (255 - (d['flow_value'] - min_value[d['site']]) * (255 - color[d['site']][i]) / (max_value[d['site']] - min_value[d['site']]+0.1)).toString()
            d['base-color'] = d['base-color'] + color[d['site']][i] + ','
        }
        d['base-color'] = d['base-color'].slice(0, -1) +')'
        d['scale-factor'] = (d['flow_value'] - min_value[d['site']])/(max_value[d['site']] - min_value[d['site']]+0.01)
    })

    function findRange(d) {
        let max_value = {}
        let min_value = {}
        let site = []
        d.forEach(pixel=>{ if (pixel['site'] in site ==false){
            site.push(pixel['site'])
            }
        })
        for (let i = 0; i < site.length; i++) {
            let siteData = Object.values(d).filter(v => v['site'] == site[i])
            let flow_value = []
            for (let j = 0; j < siteData.length; j++) {

                flow_value.push(siteData[j]['flow_value'])
            }
            max_value[site[i]] = Math.max(...flow_value)
            min_value[site[i]] = Math.min(...flow_value)
        }
        return [max_value, min_value]

    }
}
function mapColorBySupplySource(d) {

    let base_color = [[141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189], [141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189]]
    
    let color = {}
    let [max_value, min_value] = findRange(d)
    console.log('max', min_value, max_value)
    let i =0
    Object.keys(max_value).forEach(
        key=>{color[key]= base_color[i];
        i = i+1}
    )
    // console.log('color', color)
    // console.log(base_color['Municipal'][0])
    d.forEach(d => {
        d['base-color'] = 'rgb('
        for (let i = 0; i < 3; i++) {
            d['color'] = d['color'] + ' ' + (255 - (d['flow_value'] - min_value[d['source']]) * (255 - color[d['source']][i]) / (max_value[d['source']] - min_value[d['source']]+0.1)).toString()
            d['base-color'] = d['base-color'] + color[d['source']][i] + ','
        }
        d['base-color'] = d['base-color'].slice(0, -1) +')'
        d['scale-factor'] = (d['flow_value'] - min_value[d['source']])/(max_value[d['source']] - min_value[d['source']]+0.01)
    })

    function findRange(d) {
        let max_value = {}
        let min_value = {}
        let source = []
        d.forEach(pixel=>{ if (pixel['source'] in source ==false){
            source.push(pixel['source'])
            }
        })
        for (let i = 0; i < source.length; i++) {
            let sourceData = Object.values(d).filter(v => v['source'] == source[i])
            let flow_value = []
            for (let j = 0; j < sourceData.length; j++) {

                flow_value.push(sourceData[j]['flow_value'])
            }
            max_value[source[i]] = Math.max(...flow_value)
            min_value[source[i]] = Math.min(...flow_value)
        }
        return [max_value, min_value]

    }}