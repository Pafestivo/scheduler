import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ComponentProp {
  name: string;
  component: JSX.Element;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabSettings({ 
  components,
  hasUnsavedChanges,
  setHasUnsavedChanges 
}: { 
  components: ComponentProp[];
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasSavedChanges: boolean) => void; 
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if(hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setValue(newValue);
        setHasUnsavedChanges(false);
      }
    } else {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {components.map((component, index) => (
            <Tab key={component.name} label={component.name} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {components.map((component, index) => (
        <TabPanel key={component.name} value={value} index={index}>
          {component.component}
        </TabPanel>
      ))}
    </Box>
  );
}
