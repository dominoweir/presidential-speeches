import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';
import { Grid } from '@material-ui/core';
import HeatmapTooltip from './HeatmapTooltip';

class TopicTrendsView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.selectedSpeechIds = [];
    this.heatmapWidth = 800;
    this.width = 1000;
    this.height = 600;
    this.margin = { top: 50, right: 75, bottom: 150, left: 75 };
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
    hoverTopics: [],
    hoverWords: [],
    svgCreated: false,
    currentHoverTopic: 0
  }

  // update heatmaps here as president/topic selection changes
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

    var selectedSpeechIds = [];
    var topicObjects = [];
    selectedSpeeches.forEach(d => {
      var topicObj = d.topic_probabilities;
      topicObj["id"] = d.id;
      topicObj["date"] = new Date(d.date.split('/')[2], parseInt(d.date.split('/')[0]) - 1, parseInt(d.date.split('/')[1]) - 1);
      selectedSpeechIds.push(d.id);
      topicObjects.push(topicObj);
    });
    this.selectedSpeechIds = selectedSpeechIds;

    var stackedData = d3.stack()
      .keys(selectedTopics)(topicObjects);

    var xScale = d3.scaleTime()
      .range([0, this.heatmapWidth])
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
      .attr("transform", "translate(0," + this.height + ")");

    svg.append("g")
      .call(yAxis);

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", this.heatmapWidth / 2)
      .attr("y", this.height + 50)
      .text("Time (Speech Date)");

    svg.append('g')
      .attr('transform', 'translate(' + (-50) + ', ' + (this.height / 2) + ')')
      .append('text')
      .attr("class", "y label")
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Topic Probability');

    var legend = svg.append("g")
      .attr("class", "legend");

    // Add one dot in the legend for each name.
    var size = 20;
    legend.selectAll("legend-rect")
      .data(selectedTopics)
      .enter()
      .append("rect")
        .attr("x", this.heatmapWidth + 50)
        .attr("y", function(d,i){ return 10 + i*(size+5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale(d)});
        // .on("mouseover", highlight)
        // .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    legend.selectAll("legend-label")
      .data(selectedTopics)
      .enter()
      .append("text")
        .attr("x", this.heatmapWidth + 50 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)})
        .style("fill", function(d){ return colorScale(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
        // .on("mouseover", highlight)
        // .on("mouseleave", noHighlight)

    var areaContainer = svg.append("g")
      .attr("class", "stacked-area");

    // we create one series per topic
    areaContainer.selectAll(".series")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", function (d) { return "myArea " + d.key })
      .style("fill", function (d) { return colorScale(d.key); })
      .attr("d", area);

    this.setState({
      svgCreated: true
    });
  }

  updateTopicTrends = () => {

    // // actually create all the new rows for our map
    // var seriesEnter = speeches.enter()
    //   .append("g")
    //   .attr("class", "series");

    // // merge the old state of the graph with the new one
    // series.merge(seriesEnter);

    // series.selectAll()
    //   .data(function (d) { return d.probabilities; })
    //   .enter()
    //   .append("rect")
    //   .attr("x", function (d, i) { return xScale(i); })
    //   .attr("y", function (d) { return (yScale(d.split(":")[0])) })
    //   .attr("width", 35)
    //   .attr("height", 35)
    //   .attr("class", "heatmap-box")
    //   .style("fill", function (d) { return colorScale(d.split(":")[1]); })
    //   .on("mouseover", this.mouseover)
    //   .on("mousemove", this.mousemove)
    //   .on("mouseleave", this.mouseleave);

    // // remove the rows that no longer need to be displayed
    // series.exit().remove();
  }

  mouseover() {
    d3.select(".heatmap-tooltip")
      .attr("class", "heatmap-tooltip");
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }

  mousemove = (d) => {
    var currentHoverId = d.split(":")[0];
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

    return (
      <Grid container={true} className={this.props.visible ? "trends-container" : "hidden"}>
        <Grid item={true} xs={12} className={this.props.visible ? "" : "hidden"}>
          <svg ref="trendSvg" className={this.props.visible ? "" : "hidden"}
            width={this.width + this.margin.left + this.margin.right}
            height={this.height + this.margin.top + this.margin.bottom}>
          </svg>
          {this.state.hoverObj ?
            <HeatmapTooltip
              className={"heatmap-tooltip hidden"}
              hoveredBox={this.state.hoverObj}
              xScale={d3.scaleLinear()
                .range([0, this.heatmapWidth])
                .domain([0, this.numTopics - 1])}
              yScale={d3.scaleBand()
                .range([0, this.height])
                .domain(this.selectedSpeechIds)}
              topicIndex={this.state.currentHoverTopic}
            /> :
            null
          }
        </Grid>
      </Grid>
    );
  }
}

export default TopicTrendsView;
