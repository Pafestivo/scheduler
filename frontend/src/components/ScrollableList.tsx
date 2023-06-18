import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';


export default function ScrollableList({ 
  listHeaders, 
  listItems 
} : { 
  listHeaders: string[], 
  listItems: { summary: string }[][]
}) {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
      {listItems.map((section, index) => (
        <li key={`section-${listHeaders[index]}`}>
          <ul>
            {/* use the headers array to get the section header based on index */}
            <ListSubheader>{listHeaders[index]}</ListSubheader>
            {section.map((item) => (
              <ListItem key={`${listHeaders[index]}-${item.summary}`}>
                {/* the summary is the name of the calendar */}
                <ListItemText primary={item.summary} />
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}