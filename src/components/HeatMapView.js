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
    this.selectedSpeechIds = [];
    this.heatmapWidth = 700;
    this.height = 1000;
    this.margin = { top: 110, right: 75, bottom: 150, left: 50 };
  }

  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    hoverObj: null,
    hoverId: 0,
    hoverTitle: null,
    hoverPresident: null,
    hoverDate: null,
    hoverParty: null,
    hoverProbability: null,
    hoverTopics: [],
    hoverWords: [],
    svgCreated: false,
    currentHoverTopic: 0
  }

  componentDidMount() {
    this.createHeatmap();
  }

  // update heatmaps here as president/topic selection changes
  componentDidUpdate() {
    if (this.state.svgCreated) {
      this.updateHeatmap();
    }
    else {
      this.createHeatmap();
    }
  }

  createHeatmap = () => {
    var topics = ['Election', 'Middle East', 'Civil War', 'Faith/Humanity', 'Labor/China', 'Westward Expansion', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Vietnam  War', 'World War II', 'Industry/Jobs', 'Legislative Issues', 'Colonialism',
      'Agriculture', 'Education/Health', 'Presidential Cabinet', 'Military Threats', 'Currency'];
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    var selectedProbabilityObjects = this.state.topicProbabilities.filter(function (d) {
      return selectedSpeeches.some(s => s.id === d.id);
    });

    var selectedSpeechIds = [];
    selectedSpeeches.forEach(element => {
      selectedSpeechIds.push(element.id);
    });

    var selectedProbabilities = [];
    selectedProbabilityObjects.forEach(element => {
      var probabilities = [];
      var id = element.id;
      for (var key in element) {
        if (key !== "id") {
          var topicIndex = topics.indexOf(key);
          probabilities.push(id + ":" + element[key] + ":" + topicIndex);
        }
      }
      selectedProbabilities.push({ probabilities });
    });

    this.selectedSpeechIds = selectedSpeechIds;
    this.height = (selectedSpeechIds.length * 35);

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

    // add a container group for our heatmap rows
    var svg = d3.select(this.refs.heatmapSvg)
      .append("g")
      .attr("class", "heatmap-row-container")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // our entry point for the heatmap is this singular g container element, which then gets
    // one g element appended to it per speech
    var speeches = svg.selectAll("g")
      .data(selectedProbabilities)
      .enter()
      .append("g")
      .attr("class", "heatmap-row");

    // actually create all the boxes for our map
    speeches.selectAll()
      .data(function (d) { return d.probabilities; })
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
      .style("font-size", 15);

    // hide axis lines
    svg.selectAll(".domain")
      .style("fill", "none")
      .style("stroke", "#fff")
      .style("stroke-width", "1");

    this.setState({
      svgCreated: true
    });
  }

  updateHeatmap = () => {
    if (this.props.visible && this.state.svgCreated) {
      var topics = ['Election', 'Middle East', 'Civil War', 'Faith/Humanity', 'Labor/China', 'Westward Expansion', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Vietnam  War', 'World War II', 'Industry/Jobs', 'Legislative Issues', 'Colonialism',
      'Agriculture', 'Education/Health', 'Presidential Cabinet', 'Military Threats', 'Currency'];
      var selectedPresidents = this.props.presidents;
      var selectedTopics = this.props.topics;
      var selectedSpeechIds = [];
      var selectedProbabilities = [];

      var selectedSpeeches = this.state.data.filter(function (d) {
        var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
          return d.topic_probabilities[key] !== 0.0;
        });
        return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
      });

      var selectedProbabilityObjects = this.state.topicProbabilities.filter(function (d) {
        return selectedSpeeches.some(s => s.id === d.id);
      });

      selectedSpeeches.forEach(element => {
        selectedSpeechIds.push(element.id);
      });

      selectedProbabilityObjects.forEach(element => {
        var probabilities = [];
        var id = element.id;
        for (var key in element) {
          if (key !== "id") {
            var topicIndex = topics.indexOf(key);
            probabilities.push(id + ":" + element[key] + ":" + topicIndex);
          }
        }
        selectedProbabilities.push({ probabilities });
      });

      this.selectedSpeechIds = selectedSpeechIds;
      this.height = (selectedSpeechIds.length * 35);

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
        .data(selectedProbabilities);

      // actually create all the new rows for our map
      var speechesEnter = speeches.enter()
        .append("g")
        .attr("class", "heatmap-row");

      speechesEnter.selectAll()
        .data(function (d) { return d.probabilities; })
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

      // merge the old state of the graph with the new one
      speeches.merge(speechesEnter);

      // remove the rows that no longer need to be displayed
      speeches.exit().remove();
    }
  }

  mouseover() {
    d3.select(".heatmap-tooltip")
      .attr("class", "heatmap-tooltip");
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }

  mousemove = (d) => {
    var topics = ['Election', 'Middle East', 'Civil War', 'Faith/Humanity', 'Labor/China', 'Westward Expansion', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Vietnam  War', 'World War II', 'Industry/Jobs', 'Legislative Issues', 'Colonialism',
      'Agriculture', 'Education/Health', 'Presidential Cabinet', 'Military Threats', 'Currency'];
    var currentHoverId = d.split(":")[0];
    var currentHoverProbability = parseFloat(d.split(":")[1]) * 100;
    var currentHoverTopic = d.split(":")[2];
    var selectedSpeech = this.state.data.filter(function (d) {
      return d.id === currentHoverId;
    })[0];
    this.setState({
      hoverObj: selectedSpeech,
      hoverId: currentHoverId,
      hoverTitle: selectedSpeech.title,
      hoverPresident: selectedSpeech.president,
      hoverDate: selectedSpeech.date,
      hoverParty: selectedSpeech.party,
      hoverTopics: selectedSpeech.most_similar_topics,
      hoverWords: selectedSpeech.most_similar_words,
      hoverProbability: topics[currentHoverTopic] + ": " + (currentHoverProbability === 0 ? "0" : currentHoverProbability.toFixed(3)) + "% frequency",
      currentHoverTopic: currentHoverTopic,
    });
  }

  mouseleave() {
    d3.select(".heatmap-tooltip")
      .attr("class", "heatmap-tooltip hidden");
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1);
  }

  render() {

    const TopicRankings = () => (this.state.hoverTopics.map(speech => (
      <div key={speech.id} className="rankings">
        <Typography>{speech.rank + ". " + speech.title + " by " + speech.president + " (" + speech.score + "% similar)"}</Typography>
      </div>
    )));

    const LanguageRankings = () => (this.state.hoverWords.map(speech => (
      <div key={speech.id} className="rankings">
        <Typography>{speech.rank + ". " + speech.title + " by " + speech.president + " (" + speech.score + "% similar)"}</Typography>
      </div>
    )));

    return (
      <Grid container={true} className={this.props.visible ? "heatmap-container" : "hidden"}>
        <Grid item={true} xs={8} className={this.props.visible ? "" : "hidden"}>
          <svg ref="heatmapSvg" className={this.props.visible ? "" : "hidden"}
            width={this.heatmapWidth + this.margin.left + this.margin.right}
            height={this.height + this.margin.top + this.margin.bottom}>
          </svg>
        </Grid>
        <Grid item={true} xs={4} className={this.props.visible ? "heatmap-sidebar" : "hidden"}>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverTitle}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverDate}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverPresident}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverParty}</Typography>
          <Typography className={this.props.visible ? "" : "hidden"}>{this.state.hoverProbability}</Typography>
          <Typography className={this.props.visible ? "similarity-header" : "hidden"}>{this.state.hoverId === 0 ? null : "Speeches discussing similar topics"}</Typography>
          <TopicRankings />
          <Typography className={this.props.visible ? "similarity-header" : "hidden"}>{this.state.hoverId === 0 ? null : "Speeches using similar language"}</Typography>
          <LanguageRankings />
        </Grid>
      </Grid>
    );
  }
}

export default HeatMapView;
