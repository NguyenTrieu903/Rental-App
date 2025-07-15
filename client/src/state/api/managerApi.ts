import { Manager, Property } from "@/types/prismaTypes";
import { baseApi } from "./baseApi";

export const managerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // update manager settings
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

    // get manager properties
    getManagerProperties: build.query<Property[], string>({
      query: (cognitoId) => `managers/${cognitoId}/properties`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
    }),
  }),
});

export const {
  useUpdateManagerSettingsMutation,
  useGetManagerPropertiesQuery,
} = managerApi;
