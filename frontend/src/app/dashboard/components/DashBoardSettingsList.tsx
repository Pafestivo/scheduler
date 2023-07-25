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
  hasUnsavedChanges,
  setHasUnsavedChanges
}: {
  setActiveSetting: React.Dispatch<React.SetStateAction<number>>;
  activeSetting: number | null;
  list: ComponentList[];
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const changeActiveSetting = (index: number) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        // If the user confirms, proceed with the navigation.
        setActiveSetting(index);
        setHasUnsavedChanges(false);
      }
    } else {
      // If there are no unsaved changes, proceed with the navigation.
      setActiveSetting(index);
    }
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
