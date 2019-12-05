import React from 'react';

export default ({ className, hoveredBox, xScale, yScale, topicIndex }) => {

  const topics = ['Election', 'Middle East', 'Civil War', 'Faith/Humanity', 'Labor/China', 'Westward Expansion', 'Civil Rights',
    'Economy', 'Immigration', 'Strategic Resources', 'Legislative Issues', 'World War II', 'Industry/Jobs', 'Legislative Issues', 'Colonialism',
    'Agriculture', 'Education/Health', 'Presidential Cabinet', 'Military Threats', 'Currency'];

  const styles = {
    left: (xScale(topicIndex) + 153) + "px",
    top: (yScale(hoveredBox.id) + 2000) + "px"
  }

  const topicName = topics[topicIndex];
  const topicProbability = hoveredBox.topic_probabilities[topicName] * 100;

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
