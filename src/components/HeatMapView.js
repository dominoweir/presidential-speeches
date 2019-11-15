import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';
import { Grid, Typography } from '@material-ui/core';

class HeatMapView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.heatmapWidth = 700;
    this.height = 1000;
  }

  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    svg: null,
    hoverId: 0,
    hoverTitle: null,
    hoverPresident: null,
    hoverDate: null,
    hoverParty: null,
    hoverTopics: {},
    hoverWords: {}
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
        const topics = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
          'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
          'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency'];

        var margin = { top: 110, right: 75, bottom: 30, left: 50 };

        var svg = d3.select(this.refs.heatmapSvg).append("svg")
          .attr("width", this.heatmapWidth + margin.left + margin.right)
          .attr("height", this.height + margin.top + margin.bottom)
          .append("g")
          .attr("class", "heatmap-row-container")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var selectedPresidents = this.props.presidents;
        var selectedTopics = this.props.topics;

        var selectedSpeeches = this.state.data.filter(function (d) {
          var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
            return d.topic_probabilities[key] !== 0.0;
          });
          return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
        });

        var selectedProbabilities = this.state.topicProbabilities.filter(function (d) {
          return selectedSpeeches.some(s => s.id === d.id);
        });

        var selectedSpeechIds = [];
        selectedSpeeches.forEach(element => {
          selectedSpeechIds.push(element.id);
        });

        var xScale = d3.scaleLinear()
          .range([0, this.heatmapWidth])
          .domain([0, this.numTopics - 1]);

        var yScale = d3.scaleBand()
          .range([0, this.height])
          .domain(selectedSpeechIds);

        var xAxis = d3.axisTop(xScale)
          .ticks(this.numTopics)
          .tickSize(0)
          .tickFormat(function (d) { return topics[d]; });

        var colorScale = d3.scaleSequential(d3.interpolateBuPu)
          .domain([0, 1]);

        // our entry point for the heatmap is this singular group element, which then gets
        // one g element appended to it per speech
        var speeches = svg.selectAll("g")
          .data(selectedProbabilities)
          .enter()
          .append("g")
          .attr("class", "heatmap-row");

        // actually create all the boxes for our map
        speeches.selectAll()
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
          .attr("width", 35)
          .attr("height", 35)
          .attr("class", "heatmap-box")
          .style("fill", function (d) { return colorScale(d.split(":")[1]); })
          .on("mouseover", this.mouseover)
          .on("mousemove", this.mousemove)
          .on("mouseleave", this.mouseleave);

        // append tick labels for topics to top x axis
        svg.append("g")
          .call(xAxis)
          .selectAll("text")
          .attr("transform", "translate(25,0)rotate(-45)")
          .style("text-anchor", "start")
          .style("font-size", 15)
          .style("fill", "#69a3b2");

        // hide axis lines
        svg.selectAll(".domain")
          .style("fill", "none")
          .style("stroke", "#fff")
          .style("stroke-width", "1");

        this.setState({
          svg: svg,
        });
      }
    }
  }

  updateHeatmap = () => {
    if (this.props.visible) {
      if (this.state.svg === null) {
        this.createHeatmap();
      } else {
        var selectedPresidents = this.props.presidents;
        var selectedTopics = this.props.topics;

        var selectedSpeeches = this.state.data.filter(function (d) {
          var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
            return d.topic_probabilities[key] !== 0.0;
          });
          return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
        });

        var selectedProbabilities = this.state.topicProbabilities.filter(function (d) {
          return selectedSpeeches.some(s => s.id === d.id);
        });

        var selectedSpeechIds = [];

        selectedSpeeches.forEach(element => {
          selectedSpeechIds.push(element.id);
        });

        var xScale = d3.scaleLinear()
          .range([0, this.heatmapWidth])
          .domain([0, this.numTopics - 1]);

        var yScale = d3.scaleBand()
          .range([0, this.height])
          .domain(selectedSpeechIds);

        var colorScale = d3.scaleSequential(d3.interpolateBuPu)
          .domain([0, 1]);

        // our entry point for the heatmap is this singular group element, which then gets
        // one g element appended to it per speech
        var speeches = d3.select(".heatmap-row-container")
          .selectAll(".heatmap-row")
          .data(selectedProbabilities, function (d) {
            var p = [];
            var id = d.id;
            for (var key in d) {
              if (key !== "id") {
                p.push(id + ":" + d[key]);
              }
            }
            return p;
          });

        speeches.exit().remove();

        // actually create all the boxes for our map
        var speechesEnter = speeches.selectAll(".heatmap-box").enter()
          .append("rect")
          .attr("x", function (d, i) { return xScale(i); })
          .attr("y", function (d) { 
            console.log("update boxes");
            console.log(d);
            return (yScale(d.id)) 
          })
          .attr("width", 35)
          .attr("height", 35)
          .attr("class", "heatmap-box")
          .style("fill", function (d) { return colorScale(d.split(":")[1]); })
          .on("mouseover", this.mouseover)
          .on("mousemove", this.mousemove)
          .on("mouseleave", this.mouseleave);

        speeches.merge(speechesEnter);
          // .attr('cy', function (d) {
          //   console.log(d)
          //   return (yScale(d.split(":")[0]));
          // });
      }
    }
  }

  mouseover() {
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }

  mousemove = (d) => {
    var currentHoverId = d.split(":")[0];
    var selectedSpeech = this.state.data.filter(function (d) {
      return d.id === currentHoverId;
    })[0];
    this.setState({
      hoverId: currentHoverId,
      hoverTitle: selectedSpeech.title,
      hoverPresident: selectedSpeech.president,
      hoverDate: selectedSpeech.date,
      hoverParty: selectedSpeech.party,
      hoverTopics: selectedSpeech.most_similar_topics,
      hoverWords: selectedSpeech.most_similar_words
    });
  }

  mouseleave() {
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1);
  }

  render() {
    return (
      <Grid container={true} className={this.props.visible ? "heatmap-container" : "hidden"}>
        <Grid item={true} xs={8} className={this.props.visible ? "heatmap-svg" : "hidden"}>
          <div ref="heatmapSvg" className={this.props.visible ? "" : "hidden"}>
          </div>
        </Grid>
        <Grid item={true} xs={4} className={this.props.visible ? "heatmap-sidebar" : "hidden"}>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverTitle}</Typography>          
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverDate}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverPresident}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverParty}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default HeatMapView;
