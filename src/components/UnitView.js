import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';
import { Grid } from '@material-ui/core';

class UnitView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.trendsWidth = 1100;
    this.width = 1300;
    this.height = 600;
    this.margin = { top: 50, right: 75, bottom: 150, left: 75 };
    this.colors = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#ffe119', '#46f0f0', '#f032e6', 
      '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', 
      '#000075', '#808080', '#ffffff', '#f00202'];
  }

  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    svgCreated: false,
  }

  componentDidMount() {
    this.createStackedBars();
  }

  // update as president/topic selection changes
  componentDidUpdate() {
    if (this.state.svgCreated) {
      this.updateStackedBars();
    }
    else {
      this.createStackedBars();
    }
  }

  createStackedBars = () => {
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    var topicObjects = [];
    var speechIds = [];
    selectedSpeeches.forEach(d => {
      var topicObj = d.topic_probabilities;
      topicObj["id"] = d.id;
      topicObj["date"] = new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      topicObj["title"] = d.title;
      topicObj["president"] = d.president;
      topicObjects.push(topicObj);
      speechIds.push(d.id);
    });

    var stackedData = d3.stack()
      .keys(selectedTopics)(topicObjects);

    var xScale = d3.scaleBand()
      .range([0, this.trendsWidth])
      .domain(speechIds);

    var yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 1]);

    var xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickFormat("");

    var yAxis = d3.axisLeft(yScale)
      .tickFormat(function (d) { return ((d * 100) + "%") });

    var colorScale = d3.scaleOrdinal(this.colors)
      .domain(selectedTopics);

    // add a container group for our heatmap rows
    var svg = d3.select(this.refs.trendSvg)
      .append("g")
      .attr("class", "unit-container")
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
      .text("Speeches");

    svg.append("g")
      .call(yAxis);

    svg.append('g')
      .attr('transform', 'translate(' + (-50) + ', ' + (this.height / 2) + ')')
      .append('text')
      .attr("class", "y label")
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Topic Frequency');

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
        var className = d.replace(' ', '.').replace("/", "");
        // reduce opacity of all groups
        d3.selectAll(".frequency").style("opacity", .1)
        // except the one that is hovered
        d3.select(".frequency." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".frequency").style("opacity", 1)
      });

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
        var className = d.replace(' ', '.').replace("/", "");
        // reduce opacity of all groups
        d3.selectAll(".frequency").style("opacity", .1)
        // except the one that is hovered
        d3.select(".frequency." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".frequency").style("opacity", 1)
      });

    var barContainer = svg.append("g")
      .attr("class", "stacked-bars");

    // we create one series per topic
    var groups = barContainer.selectAll(".frequency")
      .data(stackedData, function (d) { return d.key; })
      .enter()
      .append("g")
      .attr("class", function (d) { return "frequency " + d.key.replace("/", ""); })
      .style("fill", function (d) { return colorScale(d.key); });

    groups.selectAll("rect")
      .data(function (d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return xScale(d.data.id); })
      .attr("y", function (d) { return yScale(d[1]); })
      .attr("height", function (d) { return yScale(d[0]) - yScale(d[1]); })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function () { d3.select(".unit-container").select(".tooltip").style("display", null); })
      .on("mouseout", function () { d3.select(".unit-container").select(".tooltip").style("display", "none"); })
      .on("mousemove", function (d) {
        var xPosition = d3.mouse(this)[0] + 5;
        var yPosition = d3.mouse(this)[1] + 5;
        var tooltip = d3.select(".unit-container").select(".tooltip");
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = 'Helvetica Neue 12pt';
        var nameWidth = context.measureText(d.data.president).width;
        var titleWidth = context.measureText(d.data.title).width;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
        tooltip.select("rect").attr("width", nameWidth > titleWidth ? nameWidth + 60 : titleWidth + 60);
        tooltip.select(".speech-title").text(d.data.title);
        tooltip.select(".speech-president").text(d.data.president);
        tooltip.select(".topic-frequency").text(((d[1] - d[0]) * 100).toFixed(3) + "%");
      });

    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 300)
      .attr("height", 50)
      .attr("fill", "white")
      .style("opacity", 1);

    tooltip.append("text")
      .attr("class", "speech-title")
      .attr("x", 10)
      .attr("dy", "1.2em")
      .style("text-anchor", "left")
      .attr("font-size", "12px");

    tooltip.append("text")
      .attr("class", "speech-president")
      .attr("x", 10)
      .attr("dy", "2.2em")
      .style("text-anchor", "left")
      .attr("font-size", "12px");

    tooltip.append("text")
      .attr("class", "topic-frequency")
      .attr("x", 10)
      .attr("dy", "3.2em")
      .style("text-anchor", "left")
      .attr("font-size", "12px");

    this.setState({
      svgCreated: true
    });
  }

  updateStackedBars = () => {
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    var topicObjects = [];
    var speechIds = [];
    selectedSpeeches.forEach(d => {
      var topicObj = d.topic_probabilities;
      topicObj["id"] = d.id;
      topicObj["date"] = new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      topicObj["title"] = d.title;
      topicObj["president"] = d.president;
      topicObjects.push(topicObj);
      speechIds.push(d.id);
    });

    var stackedData = d3.stack()
      .keys(selectedTopics)(topicObjects);

    var xScale = d3.scaleBand()
      .range([0, this.trendsWidth])
      .domain(speechIds);

    var yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, 1]);

    var xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickFormat("");

    var colorScale = d3.scaleOrdinal(this.colors)
      .domain(selectedTopics);

    var svg = d3.select(".unit-container");

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
        var className = d.replace(' ', '.').replace("/", "");
        // reduce opacity of all groups
        d3.selectAll(".frequency").style("opacity", .1)
        // except the one that is hovered
        d3.select(".frequency." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".frequency").style("opacity", 1)
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
        var className = d.replace(' ', '.').replace("/", "");
        // reduce opacity of all groups
        d3.selectAll(".frequency").style("opacity", .1)
        // except the one that is hovered
        d3.select(".frequency." + className).style("opacity", 1)
      })
      .on("mouseleave", function (d) {
        d3.selectAll(".frequency").style("opacity", 1)
      });

    labels.exit().remove();

    svg.select(".stacked-bars")
      .selectAll("*")
      .remove();

    var barContainer = svg.select(".stacked-bars");

    var groups = barContainer.selectAll(".frequency")
      .data(stackedData, function (d) { return d.key; })
      .enter()
      .append("g")
      .attr("class", function (d) { return "frequency " + d.key.replace("/", ""); })
      .style("fill", function (d) { return colorScale(d.key); });

    groups.selectAll("rect")
      .data(function (d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return xScale(d.data.id); })
      .attr("y", function (d) { return yScale(d[1]); })
      .attr("height", function (d) { return yScale(d[0]) - yScale(d[1]); })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function () { d3.select(".unit-container").select(".tooltip").style("display", null); })
      .on("mouseout", function () { d3.select(".unit-container").select(".tooltip").style("display", "none"); })
      .on("mousemove", function (d) {
        var xPosition = d3.mouse(this)[0] + 5;
        var yPosition = d3.mouse(this)[1] + 5;
        var tooltip = d3.select(".unit-container").select(".tooltip");
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = 'Helvetica Neue 12pt';
        var nameWidth = context.measureText(d.data.president).width;
        var titleWidth = context.measureText(d.data.title).width;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
        tooltip.select("rect").attr("width", nameWidth > titleWidth ? nameWidth + 60 : titleWidth + 60);
        tooltip.select(".speech-title").text(d.data.title);
        tooltip.select(".speech-president").text(d.data.president);
        tooltip.select(".topic-frequency").text(((d[1] - d[0]) * 100).toFixed(3) + "%");
      });
  }

  render() {

    return (
      <Grid container={true} className={this.props.visible ? "unit-container" : "hidden"}>
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

export default UnitView;
