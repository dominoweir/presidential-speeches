import React from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

class PresidentSelector extends React.Component {

  state = {
    currentSelection: []
  }

  componentDidMount() {
    this.setState({
      currentSelection: []
    });
  }

  render() {

    const allPresidents = ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Madison',
      'James Monroe', 'John Quincy Adams', 'Andrew Jackson', 'Martin Van Buren'];

    const PresidentCards = () => (allPresidents.map(president => (
      <Grid item={true} xs={2} key={president}>
        <Card>
          <Typography>
            {president}
          </Typography>
        </Card>
      </Grid>
    )));

    return (
      <div className="president-selector">
        <Grid container={true} spacing={1}>
          <PresidentCards />
        </Grid>
      </div>
    );
  }
}

export default PresidentSelector;
