import React from "react";
import { Title } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const Dashboard = () => {
  return (
    <BaseLayout>
      <Title>Dashboard</Title>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default Dashboard;
