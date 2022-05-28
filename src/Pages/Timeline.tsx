import React from "react";
import { Title } from "../components";
import { SpeedDialTooltipOpen } from "../components/Buttons";
import BaseLayout from "../Layouts/BaseLayout";

const Timeline = () => {
  return (
    <BaseLayout>
      <Title>Timeline</Title>

      <SpeedDialTooltipOpen />
    </BaseLayout>
  );
};

export default Timeline;
