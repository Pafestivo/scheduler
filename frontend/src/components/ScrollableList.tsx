import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';


export default function ScrollableList({ 
  listHeaders, 
  listItems,
  writeableRequired
} : { 
  listHeaders: string[], 
  listItems: { summary: string }[][]
  writeableRequired: boolean
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
            <ListSubheader sx={{fontWeight: "bold", fontSize: "1.1rem"}}>{listHeaders[index]}</ListSubheader>
            {section.map((item) => (
              <ListItem key={`${listHeaders[index]}-${item.summary}`}>
                {/* the summary is the name of the calendar */}
                {listHeaders[index] === 'readOnly' && writeableRequired ? 
                (
                  <ListItemText primary={item.summary} sx={{color: "rgba(0, 0, 0, 0.56)", cursor: "not-allowed", userSelect: "none"}} />
                ) : (
                  <ListItemText primary={item.summary} sx={{cursor: 'pointer'}}/>
                  )}
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}