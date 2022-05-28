import React from "react";
import { Title } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const HomePage = () => {
  return (
    <BaseLayout>
      <Title>Homepage</Title>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default HomePage;
