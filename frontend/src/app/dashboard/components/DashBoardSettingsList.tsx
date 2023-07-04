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
  activeSetting,
  list,
}: {
  setActiveSetting: React.Dispatch<React.SetStateAction<number>>;
  activeSetting: number | null;
  list: ComponentList[];
}) => {

  const changeActiveSetting = (index: number) => {
    setActiveSetting(index);
  }

  return (
    <React.Fragment>
      {list.map((component, index) => (
        <ListItemButton 
        sx={{
          backgroundColor: index === activeSetting ? '#556cd6' : 'inherit',
          color: index === activeSetting ? 'white' : 'inherit',
          "&:hover": {
            backgroundColor: index === activeSetting ? '#556cd6' : 'lighterGrey',
          },
        }} 
          key={index} 
          onClick={() => changeActiveSetting(index)}
        >
          <ListItemIcon>{component.icon}</ListItemIcon>
          <ListItemText primary={component.name} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

export default DashBoardSettingsList;
