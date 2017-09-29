'use strict';

/**
 * Configuration
 */
// const bldataUrl = 'app/data/barLine/barchart_data.json',
// config = {
//     divEle: '#bl-custom-chart',
//     margin: {top: 80, right: 200, bottom: 80, left: 300},
//     heightDiv: '.main-panel', // Div element that determin height of SVG
//     chartId: 'bl-charts',
//     barDefault: 'Number of Dead Oaks',
//     lineDefault: 'Money Spent',
//     yLabelPad: 20,
//     topPad: 15,
//     legendRectSize: 15,
//     colorPalette: {
//         baseline: "rgba(238, 221, 153, .8)",
//         palette: [
//                 "rgba(255, 204, 188, 1)",
//                 "rgba(77, 182, 172, 1)",
//                 "rgba(129, 199, 132, 1)",
//                 "rgba(255, 202, 40, 1)",
//                 "rgba(156, 204, 101, 1)",
//                 "#E0E0E0",
//                 "rgba(205, 220, 57, 1)"
//             ]
//     }
// }

/**
 * 
 * 
 * @class BarLineChart
 */
class BarLineChart {
    constructor(config, rowData) {
        this.config = config;
        this.rowData = rowData;
        this.width = $(config.divEle).width();// - this.config.margin.left - this.config.margin.right - this.config.yLabelPad * 2;
        // this.height = $(config.heightDiv).height();
        this.height = $(config.heightDiv).height() * 0.8;
        this.svg = this.createSVG();
        this.colors = this.assignColors();
        this.hide = [];
    }

    createSVG() {
        let svg = d3.select(this.config.divEle)
            .append('svg')
            .attr('id', this.config.chartId)
            .attr('width', this.width)
            .attr('height', this.height)
        return svg;
    }

    getPlayers(values) {
        let players = [];
        values.map(d => {
            if (d.playerName === 'No treatment'){
                players.push('No treatment');
            } else {
                players.push(`${d.playerName} ${d.attempt}`);
            }
        });
        return players;
    }

    setScaleX(players) {
        let scaleX = d3.scale.ordinal()
            .range(0, this.width)
        scaleX.domain(players);
        scaleX.rangeRoundBands([0, this.width-this.config.margin.left-this.config.margin.right], .2);
        return scaleX;
    }
    
    drawXaxis(scaleX) {
        let xAxisCall = d3.svg.axis()
            .scale(scaleX)
            .orient('bottom')
            .tickPadding(4);

        let xAxis = this.svg.append('g')
            .attr({
                'class': 'x axis',
                'id': 'x-axis',
                'transform': 'translate(' + [this.config.margin.left+this.config.yLabelPad, this.height-this.config.margin.bottom] + ')'
            })
            .call(xAxisCall)
            .selectAll('text')
            .attr('y', 0)
            .attr('x', 9)
            .attr('transform', 'rotate(65)')
            .style('text-anchor', 'start');
    }

    getMinYvalue(barData){
        let min = 0;
        if (barData.options.negative){
           min = d3.min(barData.values, v => { return v.value; });     
        }
        return min;
    }

 
    filterData(y1Label, y2Label){
        let chartsData = {bar: null, line: null};
        // Deep copy the data
        chartsData.bar = $.extend(true, [], this.rowData.find( d => d.axis === y1Label));
        chartsData.line = $.extend(true, [], this.rowData.find( d => d.axis === y2Label));
        if (chartsData.bar.values.length != chartsData.line.values.length){
            alert('Data length incorrect!!');
        }
        if (this.hide.length > 0){
            this.hide.sort( (a, b) => { return b - a; });
            for (var i = 0; i < this.hide.length; i++){
                chartsData.bar.values.splice(this.hide[i], 1);
                chartsData.line.values.splice(this.hide[i], 1);
            }
        }
        return chartsData;
    }

    drawCharts(y1Label, y2Label) {
        let players, scaleX;
        let barLineData = this.filterData(y1Label, y2Label);
        this.removeAll();
        players = this.getPlayers(barLineData.bar.values);
        scaleX = this.setScaleX(players);
        this.chartsLegend(y1Label, y2Label);
        this.drawXaxis(scaleX);
        this.barchart(barLineData.bar, scaleX, y1Label);
        this.linechart(barLineData.line, scaleX, y2Label);
    }

    assignColors(){
        let barchartColors = {};
        let count = 0;
        this.rowData[0].values.forEach( (d, i) => {
            if (d.playerName === 'No treatment'){
                barchartColors[d.playerName] = this.config.colorPalette.noTreatment;
            } else if (d.playerName != this.rowData[0].values[i-1].playerName){
                barchartColors[d.playerName] = this.config.colorPalette.palette[count];
                count += 1;
            }
        });
        return barchartColors;
    }

    removeAll(){
        this.svg.selectAll('.bar').remove();
        this.svg.selectAll('#y1g').remove();
        this.svg.selectAll('#y1label').remove();
        this.svg.selectAll('.linechart').remove();
        this.svg.selectAll('.circle').remove();
        this.svg.selectAll('#y2g').remove();
        this.svg.selectAll('#y2label').remove();
        this.svg.selectAll('#x-axis').remove();
    }

    labelFormat(data, d){
        let value = null;
        if (data.options.money) {
            d = d / 1000;
            value = '$' + d3.format(',')(d) + 'K'
        } else {
            value = d3.format(',')(d);
        }
        return value;
    }

    chartsLegend(y1Label, y2Label){
        let players = this.getPlayers(this.rowData[0].values);

        // let frameH = players.length * (this.config.legendRectSize + 15) + 15;
        // this.svg.append('g')
        // .attr('class', 'legend-frame')
        //     .append('rect')
        //     .attr('width', 200 - 15)
        //     .attr('height', frameH)
        //     .attr('transform', 'translate(' + [0, this.config.margin.top] + ')');
        let legend = this.svg.selectAll('.legend-pointer')
            .data(players)
            .enter()
            .append('g')
            .attr({
                'class': 'legend-pointer',
                'id': d => { 
                    let playerAttem = d.split(' ');
                    //console.log(playerAttem);
                    if (playerAttem[0] === 'No'){ return 'noTreatment'; } 
                    else { return `${playerAttem[0]}-${playerAttem[1]}`; }
                },
                'transform': (d, i) => {
                    let lh = this.config.legendRectSize + 15;
                    let horz = this.config.legendRectSize + 10;
                    let vert = i * lh + this.config.margin.top + 15;
                    return 'translate(' + horz + ',' + vert + ')'; },
                'title': 'Hide'
            })
            .on('click', (d, i) => {
                let selected = d3.selectAll('.legend-pointer')[0][i].id;
               
                if ($('#'+selected).attr('title') === 'Hide'){
                    $('#'+selected).attr('title', 'Show');
                    $('#'+selected).attr('class', 'legend-pointer off');
                    this.hide.push(i);
                } else {
                    $('#'+selected).attr('title', 'Hide');
                    $('#'+selected).attr('class', 'legend-pointer');
                    this.hide.splice(this.hide.indexOf(i), 1);
                }
                this.drawCharts(y1Label, y2Label);
            });
        
        legend.append('rect')
            .attr({
                'width': this.config.legendRectSize,
                'height': this.config.legendRectSize,
            })
            .style('fill', d => { 
                if (d === 'No treatment') {
                    return this.colors['No treatment'];
                }
                return this.colors[d.split(' ')[0]]; 
            });

        legend.append('text')
            .attr({
                'class': 'legend-text',
                'x': this.config.legendRectSize + 15,
                'y': this.config.legendRectSize
            })
            .append('tspan')
            .text( d => {
                return d; 
            });
    }

    barchart(barData, scaleX, y1Label) {
        let min = this.getMinYvalue(barData);
        // Y axis - barchart at the left
        let scaleY = d3.scale.linear()
            .domain([min, d3.max(barData.values, d => { return d.value; })])
            .range([this.height-this.config.margin.bottom-this.config.margin.top, 0]);

        let yAxisCall = d3.svg.axis()
            .scale(scaleY)
            .tickFormat( d => {
                return this.labelFormat(barData, d);
            })
            .orient('left')
            .innerTickSize(-(this.width-this.config.margin.left-this.config.margin.right))
            .outerTickSize(8)
            .tickPadding(4);

        let yAxis = this.svg.append('g')
            .attr({
                'id': 'y1g',
                'class': 'y1 axis',
                'transform': 'translate(' + [this.config.margin.left + this.config.yLabelPad, this.config.margin.top] + ')'
            })
            .call(yAxisCall);

        // Y axis label
        this.svg.append('text')
            .attr({
                'id': 'y1label',
                'transform': 'translate(' + [this.config.margin.left - 70, this.height / 2] + ') rotate(-90)'
            })
            .style('text-anchor', 'middle')
            .style('font-size', 18)
            .text(y1Label);

        // Y1 tip
        let tipY1 = d3.tip()
            .attr('class', 'd3-tip')
            .style('z-index', 2)
            .offset([-10, 0])
            .html( d => {
                return y1Label + ': ' + d.value;
            })
        this.svg.call(tipY1)

        let rect = this.svg.selectAll('.bar')
            .data(barData.values)
            .enter()
            .append('rect')
            .attr({
                class: 'bar',
                x: d => {
                    if (d.playerName === 'No treatment'){ return scaleX(d.playerName)}
                    else { return scaleX(`${d.playerName} ${d.attempt}`); }
                },
                y: d => { return this.height-this.config.margin.top-this.config.margin.bottom; },
                width: scaleX.rangeBand(),
                height: 0,
                transform: 'translate(' + [this.config.margin.left+this.config.yLabelPad, this.config.margin.top] + ')'
            })
            .style('fill', d => {
                if (d.playerName === 'No treatment') {
                    return this.colors['No treatment']; 
                } 
                return this.colors[d.playerName.split(' ')[0]]; 
            })
            .on('mouseover', tipY1.show)
            .on('mouseout', tipY1.hide)
            .transition()
            .delay( (d, i) => { return i * 40; } )
            .duration(1000)
            .attr('y', d => { return scaleY(Math.max(0, d.value)); })
            .attr('height', d => { return Math.abs(scaleY(d.value) - scaleY(0)); });
        $('.bar').insertBefore('.linechart');
    }

    linechart(lineData, scaleX, y2Label){
        let min = this.getMinYvalue(lineData);
        
        let scaleY2 = d3.scale.linear()
            .domain([min, d3.max(lineData.values, d => { return d.value; })])
            .range([this.height-this.config.margin.bottom-this.config.margin.top, 0]);
        
        let y2AxisCall = d3.svg.axis()
            .scale(scaleY2)
            .tickFormat(d => { return this.labelFormat(lineData, d); })
            .orient('right')
            //.ticks(8)
            .innerTickSize(-(this.width-this.config.margin.left-this.config.margin.right))
            .outerTickSize(8)
            .tickPadding(4);
        
        let y2Axis = this.svg.append('g')
            .attr({
                'id': 'y2g',
                'class': 'y2 axis',
                'transform': 'translate(' + [this.width-this.config.margin.right+this.config.yLabelPad, this.config.margin.top] + ')'
            })
            .call(y2AxisCall);
    // Y2 axis label
        this.svg.append('text')
            .attr({
                'id': 'y2label',
                'transform': 'translate(' + [this.width-70, this.height / 2] + ') rotate(-90)'
            })
            .style('text-anchor', 'middle')
            .style('font-size', 18)
            .text(y2Label);

        // Y2 tip
        let tipY2 = d3.tip()
            .attr('class', 'd3-tip')
            .style('z-index', 2)
            .offset([-10, 0])
            .html(function(d) {
                return y2Label + ': ' + d.value;
            })
        this.svg.call(tipY2)
        // Line chart
        let valueline = d3.svg.line()
            .x( d => { 
                if (d.playerName === 'No treatment'){ return scaleX('No treatment'); }
                else { return scaleX(`${d.playerName} ${d.attempt}`); }
            })
            .y( d => { return scaleY2(d.value); });

        this.svg.append('path')
            .attr({
                'class': 'linechart',
                'd': valueline(lineData.values),
                'fill': 'none',
                'transform': 'translate(' + [this.config.margin.left + this.config.yLabelPad + scaleX.rangeBand() / 2, this.config.margin.top] + ')'
            })
            .transition()
            .delay( (d, i) => { return i; })
            .duration(1500)
            .attrTween('d', pathTween);

        function pathTween() {
            var interpolate = d3.scale.quantile()
                .domain([0, 1])
                .range(d3.range(1, lineData.values.length + 1));
            return t => { return valueline(lineData.values.slice(0, interpolate(t))); }
        }

        d3.select('.linechart')
            .attr('d', valueline(lineData.values));
        // Circles
        this.svg.selectAll('.circle')
            .data(lineData.values)
            .enter()
            .append('circle')
            .attr({
                'class': 'circle',
                'cx': d => { 
                    if (d.playerName === 'No treatment'){ return scaleX('No treatment'); }
                    else { return scaleX(`${d.playerName} ${d.attempt}`); }
                },
                'cy': d => { return scaleY2(d.value); },
                'r': 5,
                'transform': 'translate(' + [this.config.margin.left + this.config.yLabelPad + scaleX.rangeBand() / 2, this.config.margin.top] + ')'
            })
            .on('mouseover', tipY2.show)
            .on('mouseout', tipY2.hide);
    }

    print(){
        console.log('config', this.config);
    }
} 

