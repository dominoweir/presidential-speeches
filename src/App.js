import React from 'react';
import './App.css';
// import * as d3 from "d3";
import PresidentSelector from './components/PresidentSelector';
import TopicSelector from './components/TopicSelector';
import { Chip, Grid, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import WordNetView from './components/WordNetView';
import HeatMapView from './components/HeatMapView';
import CompareView from './components/CompareView';
import SpeechData from './data/all_speeches.json';

class App extends React.Component {

  state = {
    currentTopics: ["Election"],
    currentPresidents: ["George Washington"],
    currentView: "wordnet",
    data: SpeechData
  }

  render() {

    const TopicTags = () => (this.state.currentTopics.map(topic => (
      <Grid item={true} xs={2} key={topic}>
        <Chip label={topic} onDelete={() => this.onTopicChange(topic)} />
      </Grid>
    )));

    const PresidentTags = () => (this.state.currentPresidents.map(president => (
      <Grid item={true} xs={2} key={president}>
        <Chip label={president} onDelete={() => this.onPresidentChange(president)} />
      </Grid>
    )));

    return (
      <div className='App'>
        <h2>
          Topics Discussed in Presidential Speeches
        </h2>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <TopicSelector onTopicChange={this.handleTopicSelectionChange} />
          </Grid>
          <Grid item={true} xs={12}>
            <PresidentSelector onPresidentChange={this.handlePresidentSelectionChange} />
          </Grid>
          <TopicTags />
          <PresidentTags />
        </Grid>
        <ToggleButtonGroup value={this.state.currentView} exclusive={true} onChange={this.handleViewChange} className="view-selector">
          <ToggleButton value="wordnet">
            <Typography>{"WordNet"}</Typography>
          </ToggleButton>
          <ToggleButton value="heatmap">
            <Typography>{"Speech Topics"}</Typography>
          </ToggleButton>
          <ToggleButton value="compare">
            <Typography>{"Compare Presidents"}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        <WordNetView visible={this.state.currentView === "wordnet"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
        <HeatMapView visible={this.state.currentView === "heatmap"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
        <CompareView visible={this.state.currentView === "compare"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
      </div>
    );
  }

  // loadSpeechMetadata() {
  //   // const response = await fetch('data/all_speeches.json');
  //   // const json = await response.json();
  //   // console.log(json);
  //   fetch('./data/all_speeches.json')
  //     .then(response => {
  //       console.log(response);
  //       // The response is a Response instance.
  //       // You parse the data into a useable format using `.json()`
  //       return response.text();
  //     })
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(err => {
  //       console.log("error :(");
  //       console.log(err);
  //     });
  //   // d3.json(SpeechData, function (err, json) {
  //   //   if (err) {
  //   //     console.log(err);
  //   //   }
  //   // });
  // }

  handleTopicSelectionChange = (selection) => {
    if (selection === "Select All") {

    } else if (selection === "Clear All") {
      this.setState({
        currentTopics: []
      });
    } else {
      var index = this.state.currentTopics.indexOf(selection);
      if (index > -1) {
        this.state.currentTopics.splice(index, 1);
      } else {
        this.state.currentTopics.push(selection);
      }
    }
    console.log(this.state.currentTopics);
  }

  handlePresidentSelectionChange = (selection) => {
    if (selection === "Select All") {

    } else if (selection === "Clear All") {
      this.setState({
        currentPresidents: []
      });
    } else {
      var index = this.state.currentPresidents.indexOf(selection);
      if (index > -1) {
        this.state.currentPresidents.splice(index, 1);
      } else {
        this.state.currentPresidents.push(selection);
      }
    }
    console.log(this.state.currentPresidents);
  }

  handleViewChange = (event, newView) => {
    this.setState({
      currentView: newView
    });
  }
}

export default App;
