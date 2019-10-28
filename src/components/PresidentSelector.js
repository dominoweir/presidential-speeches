import React from 'react';
import '../App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { Typography, CardActionArea, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';

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

    const presidents = ['harrison', 'jefferson', 'fillmore', 'carter',
      'kennedy', 'ford', 'grant', 'harding', 'johnson', 'washington',
      'coolidge', 'monroe', 'hayes', 'nixon', 'taylor', 'jackson',
      'clinton', 'van-buren', 'adams', 'reagan', 'hoover', 'eisenhower',
      'cleveland', 'obama', 'arthur', 'madison', 'truman', 'pierce',
      'wilson', 'tyler', 'polk', 'taft', 'roosevelt', 'mckinley',
      'lincoln', 'garfield', 'bush', 'trump', 'buchanan']

    const PresidentCards = () => (presidents.map(president => (
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
