import React from 'react';
import '../App.css';
import { Typography } from '@material-ui/core';

class WordNetView extends React.Component {

  render() {

    return (
      <div className={this.props.visible ? "wordnet-container" : "wordnet-container hidden"}>
        <Typography>
          {"WordNet view goes here"}
        </Typography>
      </div>
    );
  }
}

export default WordNetView;
