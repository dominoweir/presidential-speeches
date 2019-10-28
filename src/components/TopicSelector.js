import React from 'react';
import '../App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Typography, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CardActionArea } from '@material-ui/core';

class TopicSelector extends React.Component {

  state = {
    currentSelection: []
  }

  componentDidMount() {
    this.setState({
      currentSelection: []
    });
  }

  render() {

    const topics = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
      'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency', 'Select All', 'Clear All'];

    const TopicCards = () => (topics.map(topic => (
      <Grid item={true} xs={2} key={topic}>
        <Card>
          <CardActionArea onClick={() => this.props.onTopicChange(topic)}>
            <Typography>
                {topic}
            </Typography>
          </CardActionArea>
        </Card>
      </Grid>
    )));

    return (
      <div className="topic-selector">
        <ExpansionPanel>
          <ExpansionPanelSummary>
            <Typography>
              Select Topics
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={1}>
              <TopicCards />
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel> 
      </div>
    );
  }
}

export default TopicSelector;
