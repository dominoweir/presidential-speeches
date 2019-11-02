import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';

class HeatMapView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.width = 1200;
    this.height = 1000;
  }
  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    svg: null,
    tooltip: null,
    mouseover: null,
    mousemove: null,
    mouseleave: null,
    presidents: ["George Washington"]
  }

  // create heatmaps based on initial selection
  componentDidMount() {
    this.createHeatmap();
  }

  // update heatmaps here as president/topic selection changes
  componentDidUpdate() {
    this.updateHeatmap();
  }

  createHeatmap = () => {
    if (this.props.visible) {
      if (this.state.svg === null) {
        var margin = { top: 110, right: 75, bottom: 30, left: 50 };

        var svg = d3.select(this.refs.heatmapContainer).append("svg")
          .attr("width", this.width + margin.left + margin.right)
          .attr("height", this.height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        var tooltip = d3.select("g")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px");

        var mouseover = function (d) {
          tooltip
            .style("opacity", 1);
          d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
        }
        var mousemove = function (d) {
          // tooltip
          //   .text("The exact value of this cell is: " + d.split(":")[1])
          //   .attr("x", d3.event.pageX)
          //   .attr("y", d3.event.pageY);

          d3.select(this).append("text")
            .text(d)
            .attr("x", d3.event.pageX)
            .attr("y", d3.event.pageY)
            .style("font-size", 15)
            .style("fill", "#69a3b2");
        }
        var mouseleave = function (d) {
          tooltip
            .style("opacity", 0);
          d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1);
        }

        this.setState({
          svg: svg,
          tooltip: tooltip,
          mouseover: mouseover,
          mousemove: mousemove,
          mouseleave: mouseleave
        });
      }
    }
  }

  updateHeatmap = () => {
    if (this.props.visible) {
      if (this.state.svg === null) {
        this.createHeatmap();
      } else {
        var topics = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
          'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
          'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency'];

        var selectedSpeeches = this.state.data.filter(function (d) {
          return d.president === "George Washington";
        });

        var nestedSpeeches = d3.nest()
          .key(function (d) { return d.id })
          .entries(selectedSpeeches);

        var selectedProbabilities = this.state.topicProbabilities.filter(function (d) {
          return selectedSpeeches.some(s => s.id === d.id);
        });

        var selectedSpeechIds = [];

        selectedSpeeches.forEach(element => {
          selectedSpeechIds.push(element.id);
        });

        var xScale = d3.scaleLinear()
          .range([0, this.width])
          .domain([0, this.numTopics - 1]);

        var yScale = d3.scaleBand()
          .range([this.height, 0])
          .domain(selectedSpeechIds);

        var xAxis = d3.axisTop(xScale)
          .ticks(this.numTopics)
          .tickSize(0)
          .tickFormat(function (d) { return topics[d]; });

        var yAxis = d3.axisLeft(yScale)
          .ticks(selectedSpeechIds.length)
          .tickSize(0)
          .tickFormat(function (d, i) { return nestedSpeeches[i].values[0].title; });

        var colorScale = d3.scaleSequential(d3.interpolateBuPu)
          .domain([0, 1]);

        // our entry point for the heatmap is this singular group element, which then gets
        // one g element appended to it per speech
        var speechesEnter = this.state.svg.selectAll("g")
          .data(selectedProbabilities)
          .enter()
          .append("g");

        // actually create all the boxes for our map
        speechesEnter.selectAll()
          .data(function (d) {
            var p = [];
            var id = d.id;
            for (var key in d) {
              if (key !== "id") {
                p.push(id + ":" + d[key]);
              }
            }
            return p;
          })
          .enter()
          .append("rect")
          .attr("x", function (d, i) { return xScale(i); })
          .attr("y", function (d) { return (yScale(d.split(":")[0])) })
          .attr("width", 40)
          .attr("height", 40)
          .style("fill", function (d) { return colorScale(d.split(":")[1]); })
          .on("mouseover", this.state.mouseover)
          .on("mousemove", this.state.mousemove)
          .on("mouseleave", this.state.mouseleave);

        // append tick labels for topics to top x axis
        this.state.svg.append("g")
          .call(xAxis)
          .selectAll("text")
          .attr("transform", "translate(25,0)rotate(-45)")
          .style("text-anchor", "start")
          .style("font-size", 15)
          .style("fill", "#69a3b2");

        // append tick labels for speeches to left y axis
        this.state.svg.append("g")
          .call(yAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .style("font-size", 15)
          .style("fill", "#69a3b2");

        // hide axis lines
        this.state.svg.selectAll(".domain")
          .style("fill", "none")
          .style("stroke", "#fff")
          .style("stroke-width", "1");
      }
    }
  }

  render() {
    return (
      <div ref="heatmapContainer" className={this.props.visible ? "heatmap-container" : "hidden heatmap-container"}>
      </div>
    );
  }
}

export default HeatMapView;
