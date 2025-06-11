"use client";

import SettingsForm from "@/components/SettingsForm";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import { useUpdateManagerSettingsMutation } from "@/state/api/managerApi";
import React from "react";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  console.log("ManagerSettings authUser", authUser);

  const [updateManager] = useUpdateManagerSettingsMutation();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const initialData = {
    name: authUser?.userInfo?.name || "",
    email: authUser?.userInfo?.email || "",
    phoneNumber: authUser?.userInfo?.phoneNumber || "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.userInfo?.cognitoId || "",
      ...data,
    });
  };
  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;
