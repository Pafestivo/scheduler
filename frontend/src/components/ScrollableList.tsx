import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { useTranslation } from "@/utilities/translations/useTranslation";

export default function ScrollableList({
  listHeaders,
  listItems,
  writeableRequired,
  update,
}: {
  listHeaders: string[];
  listItems: { summary: string }[][];
  writeableRequired: boolean;
  update: (itemSummary: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {listItems.map((section, index) => (
        <li key={`section-${listHeaders[index]}`}>
          <ul>
            <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {t(listHeaders[index])}
            </ListSubheader>
            {section.map((item) => (
              <ListItem key={`${listHeaders[index]}-${item.summary}`}>
                {listHeaders[index] === "readOnly" && writeableRequired ? (
                  <ListItemText
                    primary={item.summary}
                    sx={{
                      color: "rgba(0, 0, 0, 0.56)",
                      cursor: "not-allowed",
                      userSelect: "none",
                    }}
                  />
                ) : (
                  <ListItemText
                    primary={item.summary}
                    onClick={() => update(item.summary)}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}
