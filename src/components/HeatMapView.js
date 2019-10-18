import React from 'react';
import '../App.css';
import * as d3 from "d3";
import TopicData from '../data/topic_probability_by_speech.csv';
import SpeechData from '../data/all_speeches.csv';
import { Typography } from '@material-ui/core';

class HeatMapView extends React.Component {

  state = {
    speechMetadata: {}
  }

  // create heatmaps based on initial selection
  componentDidMount() {
    d3.csv(SpeechData).then(function(data) {
      var nested = d3.nest()
        .key(function(d) {
          return d.name;
        })
        .entries(data);
      console.log(nested);
    });

    d3.csv(TopicData).then(function(data) {
      // var nested = d3.nest()
      //   .key(function(d) {
      //     return d.Name;
      //   })
      //   .entries(data);
      // console.log(nested);
      data.forEach(function(d) {
        d.name = +d.Name;
        d.election = +d.Election;
      });
      console.log(data);
    });
  }

  // update heatmaps here as president/topic selection changes
  componentDidUpdate() {

  }

  render() {

    return (
      <div className={this.props.visible ? "heatmap-container" : "hidden heatmap-container"}>
        <Typography>
          {"HeatMap view goes here"}
        </Typography>
      </div>
    );
  }
}

export default HeatMapView;
