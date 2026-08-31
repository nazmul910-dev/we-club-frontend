import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { academyApi } from "./academyApi";

import { ModuleVideo, AcademyModule } from "./academyTypes";

interface AcademyState {
  videos: ModuleVideo[];

  loading: boolean;

  error: string | null;
  entitlement: any | null;
  modules: AcademyModule[];
  selectedModule: any | null;
}

const initialState: AcademyState = {
  videos: [],

  loading: false,

  entitlement: null,
  error: null,
  modules: [],
  selectedModule: null,
};

export const fetchModuleVideos = createAsyncThunk(
  "academy/videos",

  async (moduleId: string) => {
    return await academyApi.getModuleVideos(moduleId);
  },
);

export const uploadModuleVideo = createAsyncThunk(
  "academy/uploadVideo",

  async (data: any) => {
    return await academyApi.uploadVideo(data);
  },
);

export const fetchMyEntitlement = createAsyncThunk(
  "academy/entitlement",

  async () => {
    return await academyApi.getMyEntitlement();
  },
);

export const fetchModules = createAsyncThunk(
  "academy/modules",

  async () => {
    return await academyApi.getModules();
  },
);

export const fetchModuleById = createAsyncThunk(
  "academy/module",

  async (id: string) => {
    return await academyApi.getModuleById(id);
  },
);

const academySlice = createSlice({
  name: "academy",

  initialState,

  reducers: {
    clearVideos: (state) => {
      state.videos = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchModuleVideos.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchModuleVideos.fulfilled, (state, action) => {
        state.loading = false;

        state.videos = action.payload.data || action.payload;
      })

      .addCase(fetchModuleVideos.rejected, (state) => {
        state.loading = false;

        state.error = "Failed loading videos";
      })

      .addCase(uploadModuleVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload.data || action.payload);
      })

      .addCase(
        fetchMyEntitlement.fulfilled,

        (state, action) => {
          state.entitlement = action.payload.data || action.payload;
        },
      )
      .addCase(
        fetchModules.fulfilled,

        (state, action) => {
          state.modules = action.payload.data || action.payload;
        },
      )
      .addCase(
        fetchModuleById.fulfilled,

        (state, action) => {
          state.selectedModule = action.payload.data || action.payload;
        },
      );
  },
});

export const { clearVideos } = academySlice.actions;

export default academySlice.reducer;
