import React from 'react';
import '../App.css';
import { Typography } from '@material-ui/core';

class CompareView extends React.Component {

  render() {

    return (
      <div className={this.props.visible ? "compare-container" : "hidden compare-container"}>
        <Typography>
          {"Compare view goes here"}
        </Typography>
      </div>
    );
  }
}

export default CompareView;
