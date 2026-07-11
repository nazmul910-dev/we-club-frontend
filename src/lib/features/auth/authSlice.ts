import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "./authApi";

export type AccessTo = "we_command_center" | "invictus" | "both";

export type UserRole =
  | "associate"
  | "ceo"
  | "ceo_partner"
  | "partner"
  | "ambassador"
  | "we_club_member"
  | "admin"
  | "manager";

export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole | "";
  accessTo: AccessTo | "";
  licenseNumber: string;
  brokerage: string;
  phone: string;
  city: string;
  country: string;
  bio: string;
  marketingChannels: string[];
  socialLinks: SocialLinks;
  discountCode: string;
}

interface RegistrationState {
  currentStep: number;
  totalSteps: number;
  formData: RegistrationFormData;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  checkoutUrl: string | null;
}

const initialFormData: RegistrationFormData = {
  fullName: "",
  email: "",
  password: "",
  role: "",
  accessTo: "",
  licenseNumber: "",
  brokerage: "",
  phone: "",
  city: "",
  country: "",
  bio: "",
  marketingChannels: [],
  socialLinks: {},
  discountCode: "",
};

const initialState: RegistrationState = {
  currentStep: 1,
  totalSteps: 2,
  formData: initialFormData,
  isSubmitting: false,
  error: null,
  successMessage: null,
  checkoutUrl: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,

  reducers: {
    setAccessTo: (state, action: PayloadAction<AccessTo>) => {
      state.formData.accessTo = action.payload;
      state.currentStep = 2;
    },

    updateField: (
      state,
      action: PayloadAction<{
        field: keyof RegistrationFormData;
        value: RegistrationFormData[keyof RegistrationFormData];
      }>
    ) => {
      (
        state.formData[action.payload.field] as RegistrationFormData[keyof RegistrationFormData]
      ) = action.payload.value;
    },

    updateSocialLink: (
      state,
      action: PayloadAction<{
        key: keyof SocialLinks;
        value: string;
      }>
    ) => {
      state.formData.socialLinks[action.payload.key] =
        action.payload.value;
    },

    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep++;
      }
    },

    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep--;
      }
    },

    goToStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    resetRegistration: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = action.payload.data.message;
        state.checkoutUrl = action.payload.data.checkoutUrl;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error =
          action.payload ?? "Registration failed";
      })

      .addCase(loginUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = action.payload.message;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error =
          action.payload ?? "Login failed";
      });
  },
});

export const {
  setAccessTo,
  updateField,
  updateSocialLink,
  nextStep,
  prevStep,
  goToStep,
  resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;