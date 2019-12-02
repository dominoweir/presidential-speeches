import React from 'react';
import '../App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Typography, CardActionArea, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, CardMedia } from '@material-ui/core';
import SpeechData from '../data/all_speeches.json';

class PresidentSelector extends React.Component {

  state = {
    currentSelection: [],
    presidentNames: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison", "James Monroe", "John Quincy Adams",
      "Andrew Jackson", "Martin Van Buren", "William Harrison", "John Tyler", "James Polk", "Zachary Taylor", "Millard Filmore",
      "Franklin Pierce", "James Buchanan", "Abraham Lincoln", "Andrew Johnson", "Ulysses Grant", "Rutherford Hayes", "James Garfield",
      "Chester Arthur", "Grover Cleveland", "Benjamin Harrison", "William McKinley", "Theodore Roosevelt", "William Taft", "Woodrow Wilson",
      "William Harding", "Calvin Coolidge", "Herbert Hoover", "Franklin Roosevelt", "Harry Truman", "Dwight Eisenhower", "John Kennedy",
      "Lydon Johnson", "Richard Nixon", "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "George H.W. Bush", "Bill Clinton", "George W. Bush",
      "Barack Obama", "Donald Trump"],
    dataset: SpeechData,
    numPresidents: 45
  }

  render() {

    var presidentImages = []
    for (var i = 1; i < this.state.numPresidents; i++) {
      const img = require('../data/portraits/' + (i > 23 ? i + 1 : i) + '.png');
      presidentImages.push(img);
    }

    const PresidentCards = () => (this.state.presidentNames.map((president, index) => (
      <Grid item={true} xs={3} key={president}>
        <Card>
          <CardActionArea onClick={() => this.props.onPresidentChange(president)}>
            <CardMedia image={presidentImages[index]} className="media"></CardMedia>
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
              <Grid item={true} xs={6}>
                <Card>
                  <CardActionArea className="select-button"  onClick={() => this.props.onPresidentChange("Select All")}>
                    <Typography>
                      {"Select All"}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item={true} xs={6}>
                <Card>
                  <CardActionArea className="select-button"  onClick={() => this.props.onPresidentChange("Clear All")}>
                    <Typography>
                      {"Clear All"}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
              <PresidentCards />
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>
    );
  }
}

export default PresidentSelector;
