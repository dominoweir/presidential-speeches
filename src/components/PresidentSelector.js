import React from 'react';
import '../App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Typography, CardActionArea, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import SpeechData from '../data/all_speeches.json';

class PresidentSelector extends React.Component {

  state = {
    currentSelection: [],
    presidentNames: this.presidents = ["George Washington", "John Adams", "Thomas Jefferson", "James Madison", "James Monroe", "John Quincy Adams", 
    "Andrew Jackson", "Martin Van Buren", "William Harrison", "John Tyler", "James Polk", "Zachary Taylor", "Millard Filmore", 
    "Franklin Pierce", "James Buchanan", "Abraham Lincoln", "Andrew Johnson", "Ulysses Grant", "Rutherford Hayes", "James Garfield", 
    "Chester Arthur", "Grover Cleveland", "Benjamin Harrison", "William McKinley", "Theodore Roosevelt", "William Taft", "Woodrow Wilson", 
    "William Harding", "Calvin Coolidge", "Herbert Hoover", "Franklin Roosevelt", "Harry Truman", "Dwight Eisenhower", "John Kennedy", 
    "Lydon Johnson", "Richard Nixon", "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "George H.W. Bush", "Bill Clinton", "George W. Bush", 
    "Barack Obama", "Donald Trump"],
    dataset: SpeechData
  }

  render() {

    const PresidentCards = () => (this.state.presidentNames.map(president => (
      <Grid item={true} xs={2} key={president}>
        <Card>
          <CardActionArea onClick={() => this.props.onPresidentChange(president)}>
            <Typography>
                {president}
            </Typography>
          </CardActionArea>
        </Card>
      </Grid>
    )));

    return (
      <div className="president-selector">
        <ExpansionPanel>
          <ExpansionPanelSummary>
            <Typography>
              Select Presidents
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={1}>
              <PresidentCards />
              <Grid item={true} xs={2}>
                <Card>
                  <CardActionArea>
                      <Typography>
                        {"Select All"}
                      </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item={true} xs={2}>
                <Card>
                  <CardActionArea>
                      <Typography>
                        {"Clear All"}
                      </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    );
  }
}

export default PresidentSelector;
