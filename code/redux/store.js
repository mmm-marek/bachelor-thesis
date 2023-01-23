import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import evaluationReducer from "./evaluation";

const makeStore = () =>
  configureStore({
    reducer: {
      evaluation: evaluationReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
