import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { certificateApi } from "./certificateApi";
import type {
  IPaginationMeta,
  IQuizCertificate,
  IQuizCertificateAdminQuery,
} from "./certificateTypes";

interface CertificateState {
  certificates: IQuizCertificate[];
  meta: IPaginationMeta;
  selectedCertificate: IQuizCertificate | null;
  myCertificates: IQuizCertificate[];
  loading: boolean;
  detailLoading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  certificates: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  selectedCertificate: null,
  myCertificates: [],
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,
};

export const fetchAllCertificates = createAsyncThunk(
  "certificate/getAll",
  async (query: IQuizCertificateAdminQuery | undefined) => {
    const res = await certificateApi.getAll(query ?? {});
    return res.data;
  },
);

export const fetchCertificateById = createAsyncThunk(
  "certificate/getById",
  async (id: string) => {
    const res = await certificateApi.getById(id);
    return res.data;
  },
);

export const attachCertificateUrl = createAsyncThunk(
  "certificate/attachUrl",
  async ({ id, certificateUrl }: { id: string; certificateUrl: string }) => {
    const res = await certificateApi.attachUrl(id, { certificateUrl });
    return res.data;
  },
);

export const revokeCertificate = createAsyncThunk(
  "certificate/revoke",
  async ({ id, reason }: { id: string; reason?: string }) => {
    const res = await certificateApi.revoke(id, reason);
    return res.data;
  },
);

export const fetchMyCertificates = createAsyncThunk(
  "certificate/getMine",
  async () => {
    const res = await certificateApi.getMine();
    return res.data;
  },
);

const upsertCertificate = (
  state: CertificateState,
  updated: IQuizCertificate,
) => {
  const index = state.certificates.findIndex(
    (item) => item._id === updated._id,
  );
  if (index !== -1) {
    state.certificates[index] = updated;
  } else {
    state.certificates.unshift(updated);
  }
  if (state.selectedCertificate?._id === updated._id) {
    state.selectedCertificate = updated;
  }
};

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    clearSelectedCertificate: (state) => {
      state.selectedCertificate = null;
    },
    setSelectedCertificate: (state, action) => {
      state.selectedCertificate = action.payload;
    },
    clearCertificateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.data || [];
        state.meta = action.payload.meta;
      })
      .addCase(fetchAllCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading certificates";
      })

      .addCase(fetchCertificateById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchCertificateById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedCertificate = action.payload;
      })
      .addCase(fetchCertificateById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.error.message || "Failed loading certificate";
      })

      .addCase(attachCertificateUrl.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(attachCertificateUrl.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertCertificate(state, action.payload);
      })
      .addCase(attachCertificateUrl.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to attach certificate file";
      })

      .addCase(revokeCertificate.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(revokeCertificate.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertCertificate(state, action.payload);
      })
      .addCase(revokeCertificate.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to revoke certificate";
      })

      .addCase(fetchMyCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.myCertificates = action.payload || [];
      })
      .addCase(fetchMyCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading your certificates";
      });
  },
});

export const {
  clearSelectedCertificate,
  setSelectedCertificate,
  clearCertificateError,
} = certificateSlice.actions;

export default certificateSlice.reducer;