/**
 * @class radar-chart
 */

class RadarChart {
  constructor(cfg, id, chartData, options) {
    this.cfg;
    this.id;
    this.chartData;
    this.legendTitle;
    this.data = [];
    this.options;

    this.svg;
    this.g;
    this.hide = [];
  }

  startup() {
    // Set up configuration options
    if ('undefined' !== typeof this.options) {
      for (var i in this.options) {
        if ('undefined' !== typeof this.options[i]) { this.cfg[i] = this.options[i]; }
      }
    }
    this.this.legendTitle = this.data.map((rData, i) => {
      if (rData.baseline) {
        legend[i] = 'No treatment'
      } else {
        legend[i] = rData.attempt;
      }
      this.data[i] = rData.data;
    });

  }

  cleateSVG() {

    let maxValue = this.cfg.maxValue;
    let allAxis = (this.data[0].map((i, j) => { return i.axis })),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(this.cfg.w / 2, this.cfg.h / 2), 	//Radius of the outermost circle
      Format = d3.format('g'),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    //Scale for the radius
    let rScale = d3.scale.linear()
      .range([0, radius])
      .domain([0, maxValue]);

    //Remove whatever chart with the same id/class was present before
    d3.select(this.id).select("svg").remove();
    //Initiate the radar chart SVG
    this.svg = d3.select(this.id).append("svg")
      .attr('id', 'radar-chart')
      .attr("width", this.cfg.w + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.h + this.cfg.margin.top + this.cfg.margin.bottom);

    //Append a g element		
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + (this.cfg.w / 2 + this.cfg.margin.left) + "," + (this.cfg.h / 2 + this.cfg.margin.top) + ")");
    // Draw the circular grid  
    let axisGrid = this.g.append("g").attr("class", "axisWrapper");

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////
    axisGrid.selectAll(".levels")
      .data(d3.range(1, (this.cfg.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d, i) => { return radius / this.cfg.levels * d; })
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", this.cfg.opacityCircles);
    // .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (this.cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", d => { return -d * radius / this.cfg.levels; })
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text((d, i) => { return Format(maxValue * d / this.cfg.levels); });


    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    let axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", (d, i) => { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => { return rScale(maxValue * this.cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y", (d, i) => { return rScale(maxValue * this.cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
      .text(d => { return d })
      .call(wrap, this.cfg.wrapWidth);
  }

  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text	
  wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }//wrap	








} // END