import { withToast } from "@/lib/utils";
import { Lease, Payment } from "@/types/prismaTypes";
import { baseApi } from "./baseApi";

export const leasesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeases: build.query<Lease[], number>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch leases.",
        });
      },
    }),

    // get all leases for a property
    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases.",
        });
      },
    }),
    // get all payments for a lease
    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),
  }),
});

export const {
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyLeasesQuery,
} = leasesApi;
