import React from 'react';
import './App.css';
import * as d3 from "d3";
import SpeechData from './data/all_speeches.csv';
import PresidentSelector from './components/PresidentSelector';
import TopicSelector from './components/TopicSelector';
import { Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import WordNetView from './components/WordNetView';
import HeatMapView from './components/HeatMapView';
import CompareView from './components/CompareView';

class App extends React.Component {

  state = {
    currentTopics: [],
    currentPresidents: [],
    currentView: "wordnet"
  }

  componentDidMount() {
    this.loadSpeechMetadata();
  }

  render() {

    return (
      <div className='App'>
        <h2>
          Topics Discussed in Presidential Speeches
        </h2>
        <div>
          <TopicSelector />
          <PresidentSelector />
        </div>
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
        <WordNetView visible={this.state.currentView === "wordnet"} topics={this.state.currentTopics} presidents={this.state.currentPresidents}/>
        <HeatMapView visible={this.state.currentView === "heatmap"} topics={this.state.currentTopics} presidents={this.state.currentPresidents}/>
        <CompareView visible={this.state.currentView === "compare"} topics={this.state.currentTopics} presidents={this.state.currentPresidents}/>
      </div>
    );
  }

  loadSpeechMetadata() {
    d3.csv(SpeechData, function(dataset) {
      var nested = d3.nest()
        .key(function (d) {
          return d.president;
        })
        .entries(dataset);
      // console.log(nested);
    });
  }

  handleViewChange = (event, newView) => {
    this.setState({
      currentView: newView
    });
  }
}

export default App;
