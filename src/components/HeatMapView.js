import React from 'react';
import '../App.css';
import * as d3 from "d3";
import SpeechData from '../data/all_speeches.json';
import TopicData from '../data/topic_probability_by_id.json';

class HeatMapView extends React.Component {

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
    if (this.state.svg === null) {
      var svg = d3.select(this.refs.heatmapContainer).append("svg")
        .attr("width", 1000)
        .attr("height", 750);
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
      var selectedSpeeches = this.state.data.filter(function (d) {
        return d.president === "George Washington";
      })
      this.state.svg.selectAll("rect")
        .data(selectedSpeeches)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return 0;
        })
        .attr("y", function (d, i) {
          return i * 70;
        })
        .attr("width", 65)
        .attr("height", 20)
        .attr("fill", "green");
        // .on('mouseover', this.state.tooltip.show)
        // .on('mouseout', this.state.tooltip.hide);

      this.state.svg.selectAll("text")
        .data(selectedSpeeches)
        .enter()
        .append("text")
        .text((d) => d.title)
        .attr("x", (d, i) => i * 20)
        .attr("y", (d, i) => (i % 10) * 50);
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
