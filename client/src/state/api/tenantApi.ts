import { Tenant } from "@/types/prismaTypes";
import { baseApi } from "./baseApi";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
    }),
  }),
});

export const { useUpdateTenantSettingsMutation } = tenantApi;
