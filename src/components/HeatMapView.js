import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';

class HeatMapView extends React.Component {

  constructor() {
    super();
    this.topics = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
      'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency'];
    this.width = 1000;
    this.height = 750;
  }
  state = {
    data: SpeechData,
    topicProbabilities: TopicData,
    svg: null,
    tooltip: null,
    presidents: ["George Washington"]
  }

  // create heatmaps based on initial selection
  componentDidMount() {
    this.updateHeatmap();
    // d3.csv(SpeechData).then(function(data) {
    //   var nested = d3.nest()
    //     .key(function(d) {
    //       return d.name;
    //     })
    //     .entries(data);
    //   console.log(nested);
    // });

    // d3.csv(TopicData).then(function(data) {
    //   // var nested = d3.nest()
    //   //   .key(function(d) {
    //   //     return d.Name;
    //   //   })
    //   //   .entries(data);
    //   // console.log(nested);
    //   data.forEach(function(d) {
    //     d.name = +d.Name;
    //     d.election = +d.Election;
    //   });
    //   console.log(data);
    // });
  }

  // update heatmaps here as president/topic selection changes
  componentDidUpdate() {
    this.updateHeatmap();
  }

  updateHeatmap = () => {
    if (this.props.visible) {
      if (this.state.svg === null) {
        var svg = d3.select(this.refs.heatmapContainer).append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .append("g");
        // var tooltip = d3Tip()
        //   .attr("class", "d3-tip")
        //   .offset([5, 0])
        //   .html(function(d) {
        //       return "<p>"+d['id']+"</p>";
        //   });
        // svg.call(tooltip);
        this.setState({
          svg: svg,
          // tooltip: tooltip
        });
      } else {
        // temporary measure: just select all speeches from George Washington
        var selectedSpeeches = this.state.data.filter(function (d) {
          return d.president === "George Washington";
        });

        var nest = d3.nest()
          .key(function(d) { return d.id; })
          .entries(selectedSpeeches);

        var probabilities = d3.nest()
          .key(function(d) { return d.id; })
          .entries(TopicData);

        console.log(nest);
        console.log(probabilities);

        this.state.svg.selectAll("g")
          .data(selectedSpeeches)
          .enter()
          .append("g");

        // Build X scales and axis:
        var xScale = d3.scaleBand()
          .range([0, this.width])
          .domain(this.topics)
          .padding(0.01);

        this.state.svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(xScale))

        // Build Y scales and axis:
        var yScale = d3.scaleBand()
          .range([this.height, 0])
          .domain(selectedSpeeches)
          .padding(0.01);

        this.state.svg.append("g")
          .call(d3.axisLeft(yScale));

        // Build color scale
        var colorScale = d3.scaleLinear()
          .range(["white", "#69b3a2"])
          .domain([0, 1]);

        this.state.svg.selectAll()
          .data(TopicData, function (d, i) { return d["id"] + ':' + d[this.topics[i % this.topics.length]]; })
          .enter()
          .append("rect")
          .attr("x", function (d, i) { return xScale(d[this.topics[i % this.topics.length]]); })
          .attr("y", function (d) { return yScale(d["title"]); })
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .style("fill", function (d, i) { return colorScale(d[this.topics[i % this.topics.length]]); })

        // this.state.svg.selectAll()
        //   .data(topics)
        //   .enter()
        //   .append("rect")
        //   .attr("x", function (d, i) {
        //     return 0;
        //   })
        //   .attr("y", function (d, i) {
        //     return i * 70;
        //   })
        //   .attr("width", 65)
        //   .attr("height", 20)
        //   .attr("fill", "green");
        //  .on('mouseover', this.state.tooltip.show)
        // .on('mouseout', this.state.tooltip.hide);

        // this.state.svg.selectAll("text")
        //   .data(selectedSpeeches)
        //   .enter()
        //   .append("text")
        //   .text((d) => d.title)
        //   .attr("x", (d, i) => 0)
        //   .attr("y", (d, i) => (i * 70));
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
