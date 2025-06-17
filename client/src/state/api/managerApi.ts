import { Manager } from "@/types/prismaTypes";
import { baseApi } from "./baseApi";

export const managerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
    }),
  }),
});

export const { useUpdateManagerSettingsMutation } = managerApi;
