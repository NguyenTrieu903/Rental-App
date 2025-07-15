"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api/applicationApi";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import React, { useState } from "react";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo?.userId,
      userType: "manager",
    },
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const handleStatusChange = async (id: number, status: string) => {
    await updateApplicationStatus({ id, status });
  };

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  const filteredApplications = applications?.filter((app) => {
    if (activeTab === "all") return true;
    return app.status.toLowerCase() === activeTab;
  });
  return (
    <div className="dashboard-container">
      <Header
        title="Applications"
        subtitle="View and manage applications for your properties"
      />
    </div>
  );
};

export default Applications;
