import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ICourseModule } from "./courseTypes";

interface CourseState {
  courses: ICourseModule[];

  selectedCourse: ICourseModule | null;

  loading: boolean;

  error: string | null;
}

const initialState: CourseState = {
  courses: [],

  selectedCourse: null,

  loading: false,

  error: null,
};

const courseSlice = createSlice({
  name: "course",

  initialState,

  reducers: {
    setCourses: (
      state,

      action: PayloadAction<ICourseModule[]>,
    ) => {
      state.courses = action.payload;
    },

    setSelectedCourse: (
      state,

      action: PayloadAction<ICourseModule>,
    ) => {
      state.selectedCourse = action.payload;
    },

    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },

    setCourseLoading: (
      state,

      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },

    setCourseError: (
      state,

      action: PayloadAction<string | null>,
    ) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCourses,

  setSelectedCourse,

  clearSelectedCourse,

  setCourseLoading,

  setCourseError,
} = courseSlice.actions;

export default courseSlice.reducer;
