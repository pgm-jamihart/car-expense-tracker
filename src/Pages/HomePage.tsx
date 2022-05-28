import React from "react";
import { PageTitle } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const HomePage = () => {
  return (
    <BaseLayout>
      <PageTitle>Homepage</PageTitle>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default HomePage;
