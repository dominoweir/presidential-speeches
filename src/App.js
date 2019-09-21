import React from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PresidentSelector from './PresidentSelector';

class App extends React.Component {

  state = {
    currentTopic: 'Select a Topic'
  }

  render() {

    const topicNames = ['Election', 'Middle East', 'Civil War', 'Faith-Humanity', 'Labor China', 'Topic 6', 'Civil Rights',
      'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
      'Agriculture', 'Education/Health', 'Topic 18', 'Militry Threats', 'Currency'];

    return (
      <div className='App'>
        <h2>
          Topics Discussed in Presidential Speeches
        </h2>
        <div>
          <form>
            <FormControl variant='outlined' className='dropdown'>
              <Select
                value={this.state.currentTopic}
                onChange={this.handleTopicChange}
                displayEmpty={true}
                renderValue={() => {
                  return this.state.currentTopic;
                }}
              >
                {topicNames.map(topic => (
                  <MenuItem value={topic} key={topic}>{topic}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
          <PresidentSelector />
        </div>
      </div>
    );
  }

  handleTopicChange = (event) => {
    this.setState({
      currentTopic: String(event.target.value)
    });
  }

  handlePresidentSelectChange = () => {

  }
}

export default App;
