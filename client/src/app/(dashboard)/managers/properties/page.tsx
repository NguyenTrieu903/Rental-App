"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import { useGetManagerPropertiesQuery } from "@/state/api/managerApi";

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) return <Loading />;

  if (error) return <div>Error loading manager properties</div>;
  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:rid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <div key={property.id} className="w-full">
            <Card
              key={property.id}
              property={property}
              isFavorite={true}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
          </div>
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>You don&lsquo;t manage any properties</p>
      )}
    </div>
  );
};

export default Properties;
