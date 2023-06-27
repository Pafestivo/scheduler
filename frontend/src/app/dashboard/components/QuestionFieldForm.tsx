import React from 'react';
import FormInput from '@/components/FormInput';
import FormSelectInput from '@/components/FormSelectInput';
import { Grid, Checkbox, FormControlLabel, Box, IconButton, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type OptionObject = {
  id: string;
  value: string;
};

type Action =
  | { type: 'UPDATE_QUESTION'; value: string; index: number }
  | { type: 'UPDATE_TYPE'; value: string; index: number }
  | { type: 'UPDATE_REQUIRED'; value: boolean; index: number }
  | { type: 'UPDATE_OPTIONS'; value: OptionObject[]; index: number }
  | { type: 'ADD_QUESTION' }
  | { type: 'ADD_OPTION'; index: number }
  | { type: 'DELETE_OPTION'; id: string; index: number }
  | { type: 'DELETE_QUESTION'; index: number };

const QuestionFieldForm = ({
  index,
  defaultOption,
  defaultValue,
  defaultRequired,
  dispatch,
  handleDelete,
  defaultOptions,
}: {
  index: number;
  defaultOption: string;
  defaultValue?: string;
  defaultRequired?: boolean;
  dispatch: React.Dispatch<Action>;
  handleDelete: (index: number) => void;
  defaultOptions?: OptionObject[];
}) => {
  const handleQuestionChange = (value: string) => {
    dispatch({ type: 'UPDATE_QUESTION', value, index });
  };

  const handleTypeChange = (value: string) => {
    dispatch({ type: 'UPDATE_TYPE', value, index });
  };

  const handleRequireChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_REQUIRED', value: event.target.checked, index });
  };

  const handleOptionChange = (value: string, id: string) => {
    const updatedOptions = [...(defaultOptions || [])];

    const targetOption = updatedOptions.find((option) => option.id === id);
    if (targetOption) {
      targetOption.value = value;
    }

    dispatch({ type: 'UPDATE_OPTIONS', value: updatedOptions, index });
  };

  const addOptionRow = () => {
    dispatch({ type: 'ADD_OPTION', index });
  };

  const removeOptionRow = (id: string) => {
    dispatch({ type: 'DELETE_OPTION', id, index });
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 1 }}>
      <Grid container key={index} direction="row" spacing={2} alignItems={'center'}>
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              handleDelete(index);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={5} sx={{ paddingBottom: '8px' }}>
          <FormInput
            name={`question${index}`}
            label="Question"
            title="Question"
            type="text"
            fieldIdx={index}
            defaultValue={defaultValue}
            setState={handleQuestionChange}
            noFocus
          />
        </Grid>

        <Grid item xs={3}>
          <FormSelectInput
            label="Question Type"
            name={`type${index}`}
            options={{
              text: 'text',
              select: 'select',
              checkbox: 'checkbox',
            }}
            fieldIdx={index}
            defaultOption={defaultOption}
            setState={handleTypeChange}
          />
        </Grid>

        <Grid item xs={1}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={defaultRequired}
                onChange={handleRequireChange}
                name={`require${index}`}
                color="primary"
              />
            }
            name={`required${index}`}
            label="Required"
          />
        </Grid>
      </Grid>
      <Box>
        {defaultOption === 'select' && (
          <>
            {(defaultOptions || []).map((object, idx) => (
              <Box key={object.id} sx={{ display: 'flex' }}>
                <IconButton
                  onClick={() => {
                    removeOptionRow(object.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <FormInput
                  name=""
                  fieldIdx={idx}
                  listid={object.id}
                  title="Select Option"
                  label="Select Option"
                  type="text"
                  defaultValue={object.value}
                  setState={handleOptionChange}
                  noFocus
                />
              </Box>
            ))}
            <Button type="button" onClick={addOptionRow}>
              Add Option+
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default QuestionFieldForm;
