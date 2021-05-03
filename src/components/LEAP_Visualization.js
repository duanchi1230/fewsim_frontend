import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import * as d3 from 'd3';
import Variables_Radial_Tree from './Variables_Radial_Tree';
import { node } from 'prop-types';

//  This module is for the LEAP Pixel-Map Panel
class LEAP_Visualization extends Component {
    constructor(props) {
        super(props);
        this.state = {branches_to_visualize: ['null'],
                    data: [],
                    type: '',
                    variable:''
                };
    }

    componentDidMount(){
        const leap_data = this.filterLeapData(JSON.parse(JSON.stringify(this.props.leap_data)), this.props.scenario_to_show) 

        var {width, height} = findDOMNode(this).getBoundingClientRect();
 
        var height = leap_data['var']['output'].length * 30 +150
        console.log(this.props.type, this.props.var)
        let data = leap_data['var']['output'][this.props.type][this.props.variable]
        let minimum_depth = 100
        let root = []

        data.forEach(d=>{
            let name = d['branch'].split('\\')[d['branch'].split('\\').length-1];
            let parent_branch = d['branch'].substring(0, d['branch'].length - name.length -1)
            let parents = []
            data.forEach(i=>{
                if(i['branch']===parent_branch){
                    parents.push(i['branch'])
                }
            })
            if(parents.length===0){
                root.push(d['branch'])
            }
        })

        console.log(root)

        let branches_to_visualize = this.state.branches_to_visualize
        root.forEach(r=>{
            branches_to_visualize.push(r)
        })

        this.setState({branches_to_visualize:branches_to_visualize})

        for(let i=0; i< data.length; i++){
            data[i] = this.parseBranchPath(data[i], root)
            if(data[i]['depth']<minimum_depth){
                minimum_depth = data[i]['depth']
            }
        }

        for(let i=0;i<data.length;i++){
            data[i]['children']=[]
            for(let j=i+1;j<data.length;j++){
                if(data[i]['branch']==data[j]['parent']){
                    data[i]['children'].push(data[j]['branch'])
                }
            }
            
        }

        this.setState({
            data: data,
            type: this.props.type,
            variable: this.props.variable
        })
        console.log(data)
        let timeRange = [leap_data['timeRange'][0], leap_data['timeRange'][1]]
        this.initCanvas(data, width, height, timeRange)
    }

    componentWillReceiveProps(nextProps){
        const leap_data = this.filterLeapData(JSON.parse(JSON.stringify(this.props.leap_data)), nextProps.scenario_to_show) 
        console.log(leap_data, this.state.type, this.props.type)
        if(this.state.type!==this.props.type || this.state.variable!==this.props.variable){

            var {width, height} = findDOMNode(this).getBoundingClientRect();
    
            var height = leap_data['var']['output'].length * 30 +150
            console.log(this.props.type, this.props.variable)
            let data = leap_data['var']['output'][this.props.type][this.props.variable]
            let minimum_depth = 100
            let root = []

            data.forEach(d=>{
                let name = d['branch'].split('\\')[d['branch'].split('\\').length-1];
                let parent_branch = d['branch'].substring(0, d['branch'].length - name.length -1)
                let parents = []
                data.forEach(i=>{
                    if(i['branch']===parent_branch){
                        parents.push(i['branch'])
                    }
                })
                if(parents.length===0){
                    root.push(d['branch'])
                }
            })

            console.log(root)

            let branches_to_visualize = ['null']
            root.forEach(r=>{
                branches_to_visualize.push(r)
            })

            

            for(let i=0; i< data.length; i++){
                data[i] = this.parseBranchPath(data[i], root)
                if(data[i]['depth']<minimum_depth){
                    minimum_depth = data[i]['depth']
                }
            }

            for(let i=0;i<data.length;i++){
                data[i]['children']=[]
                for(let j=i+1;j<data.length;j++){
                    if(data[i]['branch']==data[j]['parent']){
                        data[i]['children'].push(data[j]['branch'])
                    }
                }
                
            }

            this.setState({
                data: data,
                branches_to_visualize: branches_to_visualize,
                type: this.props.type,
                variable: this.props.variable
            })
            // console.log(data)
            // console.log(branches_to_visualize)
        }

    }
    
    componentDidUpdate(){
        const leap_data = this.filterLeapData(JSON.parse(JSON.stringify(this.props.leap_data)), this.props.scenario_to_show) 
        let timeRange = [leap_data['timeRange'][0], leap_data['timeRange'][1]]
        var {width, height} = findDOMNode(this).getBoundingClientRect();
        var height = leap_data['var']['output'].length * 30 +15
        let data =this.state.data
        console.log(data)
        this.updateCanvas(data, width, height, timeRange)
    }

    filterLeapData(leap_data, scenario_props){
        let data = []
        console.log(leap_data, scenario_props)
        let scenario_to_show = ''
        if(scenario_props===''){
            scenario_to_show = leap_data[0].name
        }
        else{
            scenario_to_show = scenario_props
        }
        leap_data.forEach(d=>{
            if(d.name===scenario_to_show){
                data = d
            }
        })
        console.log(data)
        return data
    }

       handleMouseOver(x,y,flow_value,name, d){

        console.log(x,y,name,flow_value,d)
        const svg = d3.select('#leap-svg1')

        svg.append('rect')
            .attr('id', 'leap-tooltip-pixelmap')
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
            .attr('id', 'leap-tooltip-pixelmap')
            .attr('x', x+5)
            .attr('y', y-5)
            .text(flow_value.toExponential(2))
            .attr('font-size', '15px')
            .attr('fill', 'black')
            .style('opacity', 1)

        const linearGradient = svg.append('defs')
            .attr('class', 'leap-scale-def')
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
            .attr('id', 'leap-tooltip-pixelmap')
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
            .attr('id', "leap-tooltip-pixelmap")
            .attr('points', String(x+60+d['scale-factor']*120)+','+String(y-25)+' '+String(x+60+d['scale-factor']*120-5)+','+String(y-25-5)+' '+String(x+60+d['scale-factor']*120+5)+','+String(y-25-5))
            .attr('fill', 'black')
        svg.append('polyline')
            .attr('id', "leap-tooltip-pixelmap")
            .attr('points', String(x+60+d['scale-factor']*120)+','+String(y-25)+' '+String(x+60+d['scale-factor']*120)+','+String(y))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr("stroke-opacity", 1)
            .attr('fill', 'none')
        
    }

    handleMouseOut(){
        d3.selectAll('#leap-tooltip-pixelmap')
            .remove()
        d3.selectAll('.leap-scale-def')
            .remove()
    }

    parseBranchPath(node_data, root){
        // let s = 'Demand\\Industrial\\Water infrastructure\\Industrial\\CAP\\Treatment and distribution\\Phoenix Union Hills WTP'
        let inner_node = node_data['branch']
        node_data['name'] = node_data['branch'].split('\\')[node_data['branch'].split('\\').length-1]
        node_data['expand'] = true
        while(root.includes(inner_node)!=true){
            inner_node = inner_node.substring(0, inner_node.length - inner_node.split('\\')[inner_node.split('\\').length-1].length -1)
        }
        node_data['root'] = inner_node
        node_data['depth'] = node_data['branch'].split('\\').length-node_data['root'].split('\\').length
        if(root.includes(node_data['branch'])==false){
            node_data['parent'] = node_data['branch'].substring(0, node_data['branch'].length - node_data['name'].length -1)
        }else{node_data['parent'] = 'null'}
        // console.log(node_data)
        return node_data
    }

    filter(data){
        let node_data =[]
        data.forEach(d=>{
            let node = d['branch']
            if(this.verifyParentExistance(d['branch'], this.state.branches_to_visualize, data)===true && this.state.branches_to_visualize.includes(d['branch'])===true){
                node_data.push(d)
                // console.log(this.state.branches_to_visualize.includes(d['parent']))
            }
        })
        // console.log(this.verifyParentExistance(data[1]['branch'], this.state.branches_to_visualize, data))
        return node_data
    } 

    verifyParentExistance(branch, branches_to_visualize, data){
        let existance = false
        data.forEach(d=>{
            if(d['branch']===branch){
                branch=d['parent']
            }
        })
        if(branch==='null'){
            existance = true
            return existance
        }
        if(branches_to_visualize.includes(branch)===true){
            existance = this.verifyParentExistance(branch, branches_to_visualize, data)
            return existance  
        }
        if(branches_to_visualize.includes(branch)===false){
            existance = false
            return existance
        }
    }

    expandDemandRow(row){
        console.log(row)
        let data = this.state.data
        let branches_to_visualize = this.state.branches_to_visualize
        console.log(branches_to_visualize)
        let branches_to_remove = []
        for(let i =0; i<data.length; i++){
            if(data[i]['branch']===row['branch']){
                data[i]['expand'] = data[i]['expand'] != true
            }
            if(data[i]['parent']===row['branch']){
                // data[i]['expand'] = data[i]['expand'] != true
                if(branches_to_visualize.includes(data[i]['branch'])===true){
                    branches_to_remove.push(data[i]['branch'])
                }
                if(branches_to_visualize.includes(data[i]['branch'])!==true){
                    branches_to_visualize.push(data[i]['branch'])
                }
            }
        }
        
        let branches = []
        branches_to_visualize.forEach(b=>{
            if(branches_to_remove.includes(b)!==true){
                branches.push(b)
            }
        })

        this.setState({branches_to_visualize: branches, data: data})
        console.log(branches)
    }

    rowtitle(row){
        let space='';
        let mark = ''
        for(let i=0;i<row['depth'];i++){
            space=space+'\xa0\xa0\xa0'
        }; 
        if(row['expand']===true && row['children'].length!==0){
            mark = '\xa0 \u25B8'
        }
        if(row['expand']===false && row['children'].lengt!==0){
            mark = '\xa0 \u25BE'
        }
        if(row['children'].length===0){
            mark = '\xa0\xa0\xa0\xa0\xa0\xa0'
        }
        return row['name']+mark+space
    }

    handleMouseClick(d){
        
        let leap_result_variable = []
        let leap_data = JSON.parse(JSON.stringify(this.props.leap_data))
        console.log(d) 
        leap_data.forEach(
            data=>{data['var']['output'][this.props.type][this.props.variable].forEach(f=>{
                if(f['branch']+f['variable']===d['branch']+d['variable']){
                    f['name'] = d['name']
                    
                    f['scenario'] = data['name']
                    leap_result_variable.push(f)
                }
            })
        })
        // console.log(leap_result_variable)
        this.props.handleLEAPResultVariableClick(leap_result_variable)
    }

    initCanvas(data, width, height, timeRange) {

        console.log(findDOMNode(this))
        const svg = d3.select(
        // '#PixelMap'
            findDOMNode(this)
        )
            .append('svg')
            .attr('id', 'leap-svg1')
            .attr('width', width+500)
            .attr('height', 1800);

        let origin = {'x': 350, 'y': 50};
        ;
        let start_year = timeRange[0];
        let end_year = timeRange[1];

        data = this.filter(data)

        console.log(data)
        let d = calPixelMatrix(data, origin, start_year, end_year);
        console.log(d)
        svg.append('Tooltip')
        .attr('title', '12301230')
        .text('this is a tooltip')

        svg.append('g')
            .attr('id', 'leap-demand-map')
            .selectAll('rect')
            .data(d)
            .join('rect')
            .attr('x', d => d['x'])
            .attr('y', d => d['y'])
            .attr('height', d => d['dy'])
            .attr('width', d => d['dx'])
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('fill', d => 'rgb(' + d['color'] + ')') //d => 'rgb(' + d['color'] + ')'
            // .attr('fill', d => d['color'])
            .attr('stroke', 'rgb(50 50 50)')
            .on('click', d=>this.handleMouseClick(d))
            .on('mouseover', d=>{console.log(d)})
            .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['value'] , d['name'],d))
            .on('mouseout', d=>this.handleMouseOut());
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
        let row = d.filter(value => value['year'] === start_year);
        svg.append('g')
            .attr('id', 'leap-demand-rowname')
            .selectAll('text')
            .data(row)
            .join('text')
            .attr('x', x_text)
            .attr('y', row => row['y'] + 15)
            .text(row => this.rowtitle(row))
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            .attr('transform', function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(0, ${xRot},  ${yRot} )`;
            })
            .on('click', v=>this.expandDemandRow(v));

        let y_lable = [];
        let dx = 30;
        let x = origin['x'] + 10;
        for (let year = start_year; year <= end_year; year++) {
            y_lable.push({'year': year, 'x': x, 'y': origin['y'] - 10});
            x = x + dx;
        }

        svg.append('g')
            .attr('id', 'leap-demand-ylabel')
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

    updateCanvas(data, width, height, timeRange){

        let origin = {'x': 350, 'y': 50};
        
        let start_year = timeRange[0];
        let end_year = timeRange[1];

        data = this.filter(data)
        console.log(data)
        let d = calPixelMatrix(data, origin, start_year, end_year);
        console.log(d)
        const rect = d3.select('#leap-demand-map')
                .selectAll('rect')
                .remove()
                .exit()
                .select('#leap-demand-map')
                .data(d)
                .enter()
                .append('rect')
                .on('mouseover',d=>this.handleMouseOver(d['x'] ,d['y'] ,d['value'] , d['name'],d))
                .on('mouseout', d=>this.handleMouseOut())
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
                .on('click', d=>this.handleMouseClick(d))
                // .on('mouseover', d=>{console.log(d)})

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
          d3.select('#leap-demand-rowname')
            .selectAll('text')
            .remove()
            .select('#leap-demand-rowname')
            .data(row)
            .enter()
            .append('text')
            .attr('x', x_text)
            .attr('y', row => row['y'] + 15)
            .text(row => this.rowtitle(row))
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            .attr('transform', function (row) {
                let xRot = d3.select(this).attr('x');
                let yRot = d3.select(this).attr('y');
                return `rotate(0, ${xRot},  ${yRot} )`;
            })
            .on('click', v=>this.expandDemandRow(v));

    }

    render() {
        const leap_data = this.props.leap_data 
        return (
            <div
            id='leap-pixel-map'
            style={{height: '100%', "overflow-x": "scroll"}}
        >
            <b>{this.props.type}: {this.props.variable}</b>
        </div>
        );
    }
}

function calPixelMatrix(flow, origin, start_year = 1986, end_year = 2008, sort = 1) {
    let year1 = start_year
    let year2 = end_year
    let d = []
    if (sort === 1) {
        d = processData(flow, origin, year1, year2)
    }

    mapColor(d)
    // console.log('d', d)
    return d
}

function processData(data, origin, start_year = 1986, end_year = 2008) {

    let value = []
    let name = []
    let year = []
    let branch = []
    let variable = []
    let depth = []
    let parent = []
    let expand = []
    let children = []
    // let percentage = []
    let d = []

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]['value'].length; j++) {
            value.push(data[i]['value'][j])
            name.push(data[i]['name'])
            expand.push(data[i]['expand'])
            variable.push(data[i]['variable'])
            branch.push(data[i]['branch'])
            year.push(start_year + j)
            depth.push(data[i]['depth'])
            parent.push(data[i]['parent'])
            children.push(data[i]['children'])
            // percentage.push(flow[i]['delta_to_reference'][j])

        }
    }
    let [x, y, dx, dy] = calCoordinate(data, origin, start_year, end_year)
    for (let i = 0; i < x.length; i++) {
        d.push({
            'x': x[i],
            'y': y[i],
            'dx': dx,
            'dy': dy,
            'value': value[i],
            'branch': branch[i],
            'depth': depth[i],
            'expand': expand[i],
            'name': name[i],
            'parent': parent[i],
            'variable': variable[i],
            'color': '',
            'year': year[i],
            'children':children[i]
            // 'percentage_change': percentage[i]
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

function mapColor(d) {
    
    let base_color = [[141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189], [141,211,199], [255,255,179], [190,186,218], [251,128,114], [128,177,211],[253,180,98], [179,222,105], [252,205,229], [217,217,217], [188,128,189]]
    
    let color = base_color[5]
    let [max_value, min_value] = findRange(d)
    console.log('max', min_value, max_value)
    let i =0
    d.forEach(d => {
        d['base-color'] = 'rgb('
        for (let i = 0; i < 3; i++) {
            d['color'] = d['color'] + ' ' + (255 - (d['value'] - min_value) * (255 - color[i]) / (max_value - min_value+0.1)).toString()
            d['base-color'] = d['base-color'] + color[i] + ','
        }
        d['base-color'] = d['base-color'].slice(0, -1) +')'
        d['scale-factor'] = (d['value'] - min_value)/(max_value- min_value+0.01)
    })

    function findRange(d) {
        let max_value = 0
        let min_value = 0
        let value = []
        d.forEach(data=>{
            value.push(data['value'])
        })
        max_value = Math.max(...value)
        min_value = Math.min(...value)
        return [max_value, min_value]

    }

}

export default LEAP_Visualization;