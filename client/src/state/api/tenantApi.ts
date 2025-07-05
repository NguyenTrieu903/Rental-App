import { Tenant } from "@/types/prismaTypes";
import { baseApi } from "./baseApi";
import TenantSettings from "@/app/(dashboard)/tenants/settings/page";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Mutation to update tenant settings
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

    // Mutation to add a property to tenant's favorites
    addFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
    }),

    // Mutation to remove a property from tenant's favorites
  }),
});

export const {
  useUpdateTenantSettingsMutation,
  useAddFavoritePropertyMutation,
} = tenantApi;
