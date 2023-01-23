import { createSlice } from "@reduxjs/toolkit";

import { metricsMock } from "@/utils/mocks/apiMocks/metricsMock";
import { timePeriodsMock } from "@/utils/mocks/apiMocks/timeperiodsMock";
import { criteriaMock } from "@/utils/mocks/apiMocks/criteriaMock";

export const evaluationSlice = createSlice({
  name: "evaluation",
  initialState: {
    metrics: metricsMock.results,
    timePeriods: timePeriodsMock.results,
    criterias: criteriaMock.results,
  },
  reducers: {
    // TODO only placeholder
    setProposals: (state, action) => {
      state.proposals = action.payload;
    },
  },
});

export const { setProposals } = evaluationSlice.actions;

export default evaluationSlice.reducer;
