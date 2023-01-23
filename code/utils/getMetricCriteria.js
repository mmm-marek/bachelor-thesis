export const getMetricCriteria = (metric, criterias) => {
  for (const criteria of criterias) {
    if (criteria.metric === metric.id) {
      return {
        ...criteria,
        metricName: metric.name,
        metricDescription: metric.description,
      };
    }
  }
  return null;
};
