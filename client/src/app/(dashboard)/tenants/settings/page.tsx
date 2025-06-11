"use client";

import SettingsForm from "@/components/SettingsForm";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import { useUpdateTenantSettingsMutation } from "@/state/api/tenantApi";
import React from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  console.log("TenantSettings authUser", authUser);

  const [updateTenant] = useUpdateTenantSettingsMutation();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const initialData = {
    name: authUser?.userInfo?.name || "",
    email: authUser?.userInfo?.email || "",
    phoneNumber: authUser?.userInfo?.phoneNumber || "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authUser?.userInfo?.cognitoId || "",
      ...data,
    });
  };
  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
