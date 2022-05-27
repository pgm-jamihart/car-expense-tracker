import React, { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { MdLocalGasStation } from "react-icons/md";
import { FaParking } from "react-icons/fa";
import { FiTool, FiMoreVertical } from "react-icons/fi";
import { BsShieldFillPlus } from "react-icons/bs";

const actions = [
  { icon: <FiMoreVertical />, name: "Other" },
  { icon: <BsShieldFillPlus />, name: "Insurance" },
  { icon: <FiTool />, name: "Maintainence" },
  { icon: <FaParking />, name: "Parking" },
  { icon: <MdLocalGasStation />, name: "Fuel" },
];

export default function SpeedDialTooltipOpen() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          sx: {
            bgcolor: "#2c698d",
            color: "white",
            "&:hover": {
              bgcolor: "#253237",
              color: "#fca311",
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
            FabProps={{
              sx: {
                fontSize: "1.3rem",
                bgcolor: "#253237",
                color: "white",
                "&:hover": {
                  bgcolor: "#253237",
                  color: "#fca311",
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
