import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface ComponentList {
  name: string;
  icon: JSX.Element;
  component: JSX.Element;
}

const DashBoardSettingsList = ({
  setActiveSetting,
  list,
}: {
  setActiveSetting: React.Dispatch<React.SetStateAction<number | null>>;
  list: ComponentList[];
}) => {
  return (
    <React.Fragment>
      {list.map((component, index) => (
        <ListItemButton key={index} onClick={() => setActiveSetting(index)}>
          <ListItemIcon>{component.icon}</ListItemIcon>
          <ListItemText primary={component.name} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export default DashBoardSettingsList;
