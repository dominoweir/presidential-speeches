import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';
import { Grid } from '@material-ui/core';

class TopicTrendsView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.trendsWidth = 800;
    this.width = 1000;
    this.height = 600;
    this.margin = { top: 50, right: 75, bottom: 150, left: 75 };
  }

  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    svgCreated: false,
  }

  // update as president/topic selection changes
  componentDidUpdate() {
    if (this.props.visible && this.state.svgCreated) {
      this.updateTopicTrends();
    }
    else if (this.props.visible && !this.state.svgCreated) {
      this.createTopicTrends();
    }
  }

  createTopicTrends = () => {
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    var topicObjects = [];
    selectedSpeeches.forEach(d => {
      var topicObj = d.topic_probabilities;
      topicObj["id"] = d.id;
      topicObj["date"] = new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      topicObjects.push(topicObj);
    });

    var stackedData = d3.stack()
      .keys(selectedTopics)(topicObjects);

    var xScale = d3.scaleTime()
      .range([0, this.trendsWidth])
      .domain(d3.extent(selectedSpeeches, function (d) {
        return new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      }));

    var yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 1]);

    var xAxis = d3.axisBottom(xScale)
      .tickFormat(function (d) { return d.getFullYear(); });

    var yAxis = d3.axisLeft(yScale);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(selectedTopics);

    var area = d3.area()
      .x(function (d) {
        return xScale(d.data.date);
      })
      .y0(function (d) { return yScale(d[0]); })
      .y1(function (d) { return yScale(d[1]); })

    // add a container group for our heatmap rows
    var svg = d3.select(this.refs.trendSvg)
      .append("g")
      .attr("class", "trends-container")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "x axis");

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", this.trendsWidth / 2)
      .attr("y", this.height + 50)
      .text("Time (Speech Date)");

    svg.append("g")
      .call(yAxis);

    svg.append('g')
      .attr('transform', 'translate(' + (-50) + ', ' + (this.height / 2) + ')')
      .append('text')
      .attr("class", "y label")
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Topic Probability');

    var legend = svg.append("g")
      .attr("class", "legend");
    var size = 20;

    // Add one dot in the legend for each topic
    legend.selectAll(".legend-rect")
      .data(selectedTopics)
      .enter()
      .append("rect")
      .attr("x", this.trendsWidth + 50)
      .attr("y", function (d, i) { return 10 + i * (size + 5) })
      .attr("width", size)
      .attr("height", size)
      .attr("class", "legend-rect")
      .style("fill", function (d) { return colorScale(d) })
      .on("mouseover", function (d) {
        var className = d.replace(' ', '.');
        // reduce opacity of all groups
        d3.selectAll(".series").style("opacity", .1)
        // except the one that is hovered
        d3.select(".series." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".series").style("opacity", 1)
      })

    // Add one label in the legend for each topic
    legend.selectAll(".legend-label")
      .data(selectedTopics)
      .enter()
      .append("text")
      .attr("x", this.trendsWidth + 50 + size * 1.2)
      .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) })
      .attr("class", "legend-label")
      .style("fill", function (d) { return colorScale(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", function (d) {
        var className = d.replace(' ', '.');
        // reduce opacity of all groups
        d3.selectAll(".series").style("opacity", .1)
        // except the one that is hovered
        d3.select(".series." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".series").style("opacity", 1)
      });

    // Add brushing
    // var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    //   .extent([[0, 0], [this.trendsWidth, this.height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //   .on("end", this.onBrush) // Each time the brush selection changes, trigger the 'updateChart' function

    var areaContainer = svg.append("g")
      .attr("class", "stacked-area");

    // we create one series per topic
    areaContainer.selectAll(".series")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", function (d) { return "series " + d.key })
      .style("fill", function (d) { return colorScale(d.key); })
      .attr("d", area);

    // areaContainer.append("g")
    //   .attr("class", "brush")
    //   .call(brush);

    this.setState({
      svgCreated: true
    });
  }

  updateTopicTrends = () => {
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    var topicObjects = [];
    selectedSpeeches.forEach(d => {
      var topicObj = d.topic_probabilities;
      topicObj["id"] = d.id;
      topicObj["date"] = new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      topicObjects.push(topicObj);
    });

    var stackedData = d3.stack()
      .keys(selectedTopics)(topicObjects);

    var xScale = d3.scaleTime()
      .range([0, this.trendsWidth])
      .domain(d3.extent(selectedSpeeches, function (d) {
        return new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      }));

    var yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 1]);

    var xAxis = d3.axisBottom(xScale)
      .tickFormat(function (d) { return d.getFullYear(); });

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(selectedTopics);

    var area = d3.area()
      .x(function (d) {
        return xScale(d.data.date);
      })
      .y0(function (d) { return yScale(d[0]); })
      .y1(function (d) { return yScale(d[1]); })

    var svg = d3.select(".trends-container");

    svg.select(".x.axis")
      .transition(750)
      .call(xAxis);

    // Add one dot in the legend for each topic
    var legend = svg.select(".legend");
    var size = 20;

    // Update the dots for each legend entry
    var rects = legend.selectAll(".legend-rect")
      .data(selectedTopics);

    var rectsEnter = rects.enter()
      .append("rect")
      .attr("class", "legend-rect");

    rects.merge(rectsEnter)
      .attr("x", this.trendsWidth + 50)
      .attr("y", function (d, i) {
        return 10 + i * (size + 5)
      })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) { return colorScale(d) })
      .on("mouseover", function (d) {
        var className = d.replace(' ', '.');
        // reduce opacity of all groups
        d3.selectAll(".series").style("opacity", .1)
        // except the one that is hovered
        d3.select(".series." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".series").style("opacity", 1)
      });

    rects.exit().remove();

    var labels = legend.selectAll(".legend-label")
      .data(selectedTopics);

    var labelsEnter = labels.enter()
      .append("text")
      .attr("class", "legend-label");

    labels.merge(labelsEnter)
      .attr("x", this.trendsWidth + 50 + size * 1.2)
      .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) })
      .style("fill", function (d) { return colorScale(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", function (d) {
        var className = d.replace(' ', '.');
        // reduce opacity of all groups
        d3.selectAll(".series").style("opacity", .1)
        // except the one that is hovered
        d3.select(".series." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".series").style("opacity", 1)
      });

    labels.exit().remove();

    var areaContainer = svg.select(".stacked-area").selectAll(".series")
      .data(stackedData);

    var areaEnter = areaContainer.enter()
      .append("path");

    areaContainer.merge(areaEnter)
      .attr("class", function (d) { return "series " + d.key })
      .style("fill", function (d) { return colorScale(d.key); })
      .attr("d", area);

    areaContainer.exit().remove();
  }

  onBrush = () => {
    var extent = d3.event.selection;
    var svg = d3.select(".trends-container");
    var areaContainer = svg.select(".stacked-area");

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      // if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      // x.domain(d3.extent(data, function (d) { return d.year; }))
    } else {
      // x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      var brush = areaContainer.select(".brush")
      brush.call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }
  }

  render() {

    return (
      <Grid container={true} className={this.props.visible ? "trends-container" : "hidden"}>
        <Grid item={true} xs={12} className={this.props.visible ? "" : "hidden"}>
          <svg ref="trendSvg" className={this.props.visible ? "" : "hidden"}
            width={this.width + this.margin.left + this.margin.right}
            height={this.height + this.margin.top + this.margin.bottom}>
          </svg>
        </Grid>
      </Grid>
    );
  }
}

export default TopicTrendsView;
