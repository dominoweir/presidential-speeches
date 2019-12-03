import React from 'react';
import '../App.css';
import * as d3 from "d3";
import { Grid } from '@material-ui/core';

class CompareView extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.width = 1000;
    this.height = 1000;
    this.margin = { top: 110, right: 75, bottom: 150, left: 50 };
  }

  // update here as president/topic selection changes
  componentDidUpdate() {
    if (this.props.visible && this.state.svgCreated) {
      this.updateCompareView();
    }
    else if (this.props.visible && !this.state.svgCreated) {
      this.createCompareView();
    }
  }

  // this code runs initially when the program first starts up
  createCompareView = () => {
    var selectedPresidents = this.props.presidents;
    var selectedTopics = this.props.topics;

    var selectedSpeeches = this.state.data.filter(function (d) {
      var nonZeroTopics = Object.keys(d.topic_probabilities).filter(function (key) {
        return d.topic_probabilities[key] !== 0.0;
      });
      return selectedPresidents.some(p => p === d.president) && selectedTopics.some(t => nonZeroTopics.includes(t));
    });

    // this is the <svg> element that holds our vis
    var svg = d3.select(this.refs.compareSvg);

    // this should be the last line in this function
    this.setState({
      svgCreated: true
    });
  }

  // this code runs any time a change occurs
  // if your vis is static and does not respond to input (e.g. mouse click or drag) 
  // then you can probably leave this function empty
  updateCompareView = () => {

  }

  render() {

    return (
      <Grid container={true} className={this.props.visible ? "compare-container" : "hidden"}>
        <Grid item={true} xs={12} className={this.props.visible ? "" : "hidden"}>
          <svg ref="compareSvg" className={this.props.visible ? "" : "hidden"}
            width={this.width + this.margin.left + this.margin.right}
            height={this.height + this.margin.top + this.margin.bottom}>
          </svg>
        </Grid>
      </Grid>
    );
  }
}

export default CompareView;
