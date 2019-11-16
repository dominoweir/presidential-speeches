import React from 'react';

export default ({ className, hoveredBox, xScale, yScale, topicIndex }) => {

  const topics = ['Election', 'Middle East', 'Civil War', 'Faith/Humanity', 'Labor/China', 'Topic 6', 'Civil Rights',
    'Economy', 'Immigration', 'Strategic Resources', 'Topic 11', 'World War II', 'Industry/Jobs', 'Topic 14', 'Colonialism',
    'Agriculture', 'Education/Health', 'Topic 18', 'Military Threats', 'Currency'];

  const styles = {
    left: (xScale(topicIndex) + 153) + "px",
    top: (yScale(hoveredBox.id) + 680) + "px"
  }

  const topicName = topics[topicIndex];
  const topicProbability= hoveredBox.topic_probabilities[topics[topicIndex]] * 100;

  return (
    <div className={className} style={styles}>
      <p>
        {hoveredBox.title}
      </p>
      <p>
        {hoveredBox.president}
      </p>
      <p>
        { topicName + ": " + (topicProbability === 0 ? "0" : topicProbability.toFixed(3)) + "% likelihood" }
      </p>
    </div>
  )
}
