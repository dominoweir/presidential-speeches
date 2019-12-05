import React from 'react';
import './App.css';
import PresidentSelector from './components/PresidentSelector';
import TopicSelector from './components/TopicSelector';
import { Chip, Grid, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import HeatMapView from './components/HeatMapView';
import TopicTrendsView from './components/TopicTrendsView';
import UnitView from './components/UnitView';
import CompareView from './components/CompareView';
import SpeechData from './data/all_speeches.json';

class App extends React.Component {

  constructor() {
    super();
    this.numTopics = 20;
    this.topics = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
      'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency'];
    this.presidents = ["George Washington", "John Adams", "Thomas Jefferson", "James Madison", "James Monroe", "John Quincy Adams",
      "Andrew Jackson", "Martin Van Buren", "William Harrison", "John Tyler", "James Polk", "Zachary Taylor", "Millard Filmore",
      "Franklin Pierce", "James Buchanan", "Abraham Lincoln", "Andrew Johnson", "Ulysses Grant", "Rutherford Hayes", "James Garfield",
      "Chester Arthur", "Grover Cleveland", "Benjamin Harrison", "William McKinley", "Theodore Roosevelt", "William Taft", "Woodrow Wilson",
      "William Harding", "Calvin Coolidge", "Herbert Hoover", "Franklin Roosevelt", "Harry Truman", "Dwight Eisenhower", "John Kennedy",
      "Lydon Johnson", "Richard Nixon", "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "George H.W. Bush", "Bill Clinton", "George W. Bush",
      "Barack Obama", "Donald Trump"];
    this.partieswords = ["Topic-Party-President", "Party-Topic", "President-Topic", "frequency", "numspeeches", "sublingweight"];
    this.handlePresidentSelectionChange.bind(this);
    this.handleTopicSelectionChange.bind(this);
    this.handlepartieswords.bind(this);
  }

  state = {
    currentTopics: ["Election", "Middle East"],
    currentPresidents: ["Bill Clinton", "George W. Bush", "Barack Obama", "Donald Trump"],
    currentView: "bars",
    data: SpeechData,
    partieswords: "Topic-Party-President",
  }

  render() {

    const TopicTags = () => (this.state.currentTopics.map(topic => (
      <Chip key={topic} label={topic} onDelete={() => this.handleTopicSelectionChange(topic)} className="tag" />
    )));

    const PresidentTags = () => (this.state.currentPresidents.map(president => (
      <Chip key={president} label={president} onDelete={() => this.handlePresidentSelectionChange(president)} className="tag" />
    )));

    return (
      <div className='App'>
        <h2>Language Used in Presidential Speeches</h2>
        <Grid container={true}>
          <Grid item={true} xs={12} className="compare-selector">
            <div className='radio'>
              <Typography>Select a bubble hierarchy:
    			      <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="Topic-Party-President" onChange={this.handlepartieswords} checked={this.state.partieswords === "Topic-Party-President"} /> Topic -> Party -> President
    			      </label>
                <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="Party-Topic" onChange={this.handlepartieswords} checked={this.state.partieswords === "Party-Topic"} /> Party -> Topic
    			      </label>
                <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="President-Topic" onChange={this.handlepartieswords} checked={this.state.partieswords === "President-Topic"} /> President -> Topic
    			      </label>
              </Typography>
              <Typography>Select an attribute to display:
    			      <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="frequency" onChange={this.handlepartieswords} checked={this.state.partieswords === "frequency"} /> total word frequency
    			      </label>
                <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="numspeeches" onChange={this.handlepartieswords} checked={this.state.partieswords === "numspeeches"} /> # of speeches containing a word
    			      </label>
                <label className='radio-inline'>
                  <input type="radio" name="presidentword" value="sublingweight" onChange={this.handlepartieswords} checked={this.state.partieswords === "sublingweight"} /> word-topic relationship strength
    			      </label>
              </Typography>
            </div>
          </Grid>
          <Grid item={true} xs={12}>
            <CompareView selection={this.state.partieswords} />
          </Grid>
        </Grid>
        <h2>Topics Discussed in Presidential Speeches</h2>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <TopicSelector onTopicChange={this.handleTopicSelectionChange} />
          </Grid>
          <Grid item={true} xs={12}>
            <PresidentSelector onPresidentChange={this.handlePresidentSelectionChange} />
          </Grid>
          <Grid item={true} xs={12} className="tag-container">
            <TopicTags />
          </Grid>
          <Grid item={true} xs={12} className="tag-container">
            <PresidentTags />
          </Grid>
        </Grid>
        <ToggleButtonGroup value={this.state.currentView} exclusive={true} onChange={this.handleViewChange} className="view-selector">
          <ToggleButton value="bars">
            <Typography>{"Topic Frequencies by Speech"}</Typography>
          </ToggleButton>
          <ToggleButton value="trends">
            <Typography>{"Topic Trends Over Time"}</Typography>
          </ToggleButton>
          <ToggleButton value="heatmap">
            <Typography>{"View All Topics"}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        <UnitView visible={this.state.currentView === "bars"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
        <TopicTrendsView visible={this.state.currentView === "trends"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
        <HeatMapView visible={this.state.currentView === "heatmap"} topics={this.state.currentTopics} presidents={this.state.currentPresidents} />
      </div>
    );
  }

  handlepartieswords = (event) => {
    this.setState({
      partieswords: event.target.value
    });
  }

  handleTopicSelectionChange = (selection) => {
    if (selection === "Select All") {
      this.setState({
        currentTopics: this.topics
      });
    } else if (selection === "Clear All") {
      this.setState({
        currentTopics: []
      });
    } else {
      var index = this.state.currentTopics.indexOf(selection);
      var newTopics = this.state.currentTopics;
      if (index > -1) {
        newTopics.splice(index, 1);
      } else {
        newTopics.push(selection);
      }
      this.setState({
        currentTopics: newTopics
      });
    }
  }

  handlePresidentSelectionChange = (selection) => {
    if (selection === "Select All") {
      this.setState({
        currentPresidents: this.presidents
      });
    } else if (selection === "Clear All") {
      this.setState({
        currentPresidents: []
      });
    } else {
      var index = this.state.currentPresidents.indexOf(selection);
      var newPresidents = this.state.currentPresidents;
      if (index > -1) {
        newPresidents.splice(index, 1);
      } else {
        newPresidents.push(selection);
      }
      this.setState({
        currentPresidents: newPresidents
      });
    }
  }

  handleViewChange = (event, newView) => {
    this.setState({
      currentView: newView
    });
  }
}

export default App;
