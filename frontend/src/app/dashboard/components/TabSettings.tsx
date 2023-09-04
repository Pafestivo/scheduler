import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useGlobalContext } from '@/app/context/store';

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
  hasUnsavedChanges?: boolean;
  setHasUnsavedChanges?: (hasSavedChanges: boolean) => void; 
}) {
  const [value, setValue] = React.useState(0);
  const { translations } = useGlobalContext();

  const t = (key: string): string => translations?.[key] || key;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if(hasUnsavedChanges && setHasUnsavedChanges !== undefined) {
      const confirmationMessage = t('You have unsaved changes. Are you sure you want to discard them?')
      if (window.confirm(confirmationMessage)) {
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
        <Tabs value={value} onChange={handleChange} aria-label={t('basic tabs example')}>
          {components.map((component, index) => (
            <Tab key={component.name} label={t(component.name)} {...a11yProps(index)} />
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