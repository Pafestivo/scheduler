// import React from 'react';
// import FormInput from '@/components/FormInput';
// import FormSelectInput from '@/components/FormSelectInput';
// import { Grid, Checkbox, FormControlLabel, Box, IconButton, Paper, Button } from '@mui/material';
// import { PersonalForm } from '@/utilities/types';
// import DeleteIcon from '@mui/icons-material/Delete';

// const QuestionFieldForm = ({
//   index,
//   defaultOption,
//   defaultValue,
//   defaultRequired,
//   setQuestions,
//   handleDelete,
//   defaultOptions,
// }: {
//   index: number;
//   defaultOption: string;
//   defaultValue?: string;
//   defaultRequired?: boolean;
//   setQuestions: React.Dispatch<React.SetStateAction<PersonalForm[]>>;
//   handleDelete: (index: number) => void;
//   defaultOptions?: string[];
// }) => {
//   const handleQuestionChange = (value: string) => {
//     setQuestions((prev) => {
//       const newQuestions = [...prev];
//       newQuestions[index].question = value;
//       return newQuestions;
//     });
//   };

//   const handleTypeChange = (value: string) => {
//     if (value === 'select' && !defaultOptions) {
//       setQuestions((prev) => {
//         const newQuestions = [...prev];
//         newQuestions[index].options = ['Option 1', 'Option 2', 'Option 3'];
//         return newQuestions;
//       });
//     } else {
//       setQuestions((prev) => {
//         const newQuestions = [...prev];
//         newQuestions[index].inputType = value;
//         return newQuestions;
//       });
//     }
//   };

//   const handleRequireChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setQuestions((prev) => {
//       const newQuestions = [...prev];
//       newQuestions[index].required = event.target.checked;
//       return newQuestions;
//     });
//   };

//   const handleOptionChange = (value: string, optionIndex: number) => {
//     setQuestions((prev) => {
//       const newQuestions = [...prev];
//       const options = [...newQuestions[index].options];

//       if (optionIndex >= 0 && optionIndex < options.length) {
//         options[optionIndex] = value;
//       } else {
//         options.push(value);
//       }

//       newQuestions[index].options = options;
//       return newQuestions;
//     });
//   };

//   const addOptionRow = () => {
//     setQuestions((prev) => {
//       const newQuestions = [...prev];
//       newQuestions[index].options.push('New Option');
//       return newQuestions;
//     });
//   };

//   const removeOptionRow = (optionIndex: number) => {
//     setQuestions((prev) => {
//       const newQuestions = [...prev];
//       newQuestions[index].options.splice(optionIndex, 1);
//       return newQuestions;
//     });
//   };

//   console.log(defaultRequired);

//   return (
//     <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 1 }}>
//       <Grid container key={index} direction="row" spacing={2} alignItems={'center'}>
//         <Grid item xs={1}>
//           <IconButton
//             onClick={() => {
//               handleDelete(index);
//             }}
//           >
//             <DeleteIcon />
//           </IconButton>
//         </Grid>
//         <Grid item xs={5} sx={{ paddingBottom: '8px' }}>
//           <FormInput
//             name={`question${index}`}
//             label="Question"
//             title="Question"
//             type="text"
//             fieldIdx={index}
//             defaultValue={defaultValue}
//             setState={handleQuestionChange}
//             noFocus
//           />
//         </Grid>

//         <Grid item xs={3}>
//           <FormSelectInput
//             label="Question Type"
//             name={`type${index}`}
//             options={{
//               text: 'text',
//               select: 'select',
//               checkbox: 'checkbox',
//             }}
//             fieldIdx={index}
//             defaultOption={defaultOption}
//             setState={handleTypeChange}
//           />
//         </Grid>

//         <Grid item xs={1}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 defaultChecked={defaultRequired}
//                 onChange={handleRequireChange}
//                 name={`require${index}`}
//                 color="primary"
//               />
//             }
//             name={`required${index}`}
//             label="Required"
//           />
//         </Grid>
//       </Grid>
//       <Box>
//         {defaultOptions && defaultOption === 'select' && (
//           <>
//             {defaultOptions.map((key, idx) => (
//               <Box key={key} sx={{ display: 'flex' }}>
//                 <IconButton
//                   onClick={() => {
//                     removeOptionRow(idx);
//                   }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//                 <FormInput
//                   name=""
//                   fieldIdx={idx}
//                   title="Select Option"
//                   label="Select Option"
//                   type="text"
//                   defaultValue={key}
//                   setState={handleOptionChange}
//                   noFocus
//                 />
//               </Box>
//             ))}
//             <Button type="button" onClick={addOptionRow}>
//               Add Option+
//             </Button>
//           </>
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default QuestionFieldForm;
import React from 'react';
import FormInput from '@/components/FormInput';
import FormSelectInput from '@/components/FormSelectInput';
import { Grid, Checkbox, FormControlLabel, Box, IconButton, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import generateHash from '@/utilities/generateHash';

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
    if (value === 'select' && !defaultOptions) {
      dispatch({
        type: 'UPDATE_OPTIONS',
        value: [
          { id: generateHash(Math.random().toString()), value: 'Option 1' },
          { id: generateHash(Math.random().toString()), value: 'Option 2' },
          { id: generateHash(Math.random().toString()), value: 'Option 3' },
        ],
        index,
      });
    }
  };

  const handleRequireChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_REQUIRED', value: event.target.checked, index });
  };

  const handleOptionChange = (id: string, value: string) => {
    const updatedOptions = [...(defaultOptions || [])];
    const targetOption = updatedOptions.find((option) => option.id === id);

    if (targetOption) {
      targetOption.value = value;
    }

    dispatch({ type: 'UPDATE_OPTIONS', value: updatedOptions, index });
  };

  const addOptionRow = () => {
    const updatedOptions = [
      ...(defaultOptions || []),
      { id: generateHash(Math.random().toString()), value: 'New Option' },
    ];
    dispatch({ type: 'UPDATE_OPTIONS', value: updatedOptions, index });
  };

  const removeOptionRow = (id: string) => {
    const updatedOptions = [...(defaultOptions || [])];
    const targetIndex = updatedOptions.findIndex((option) => option.id === id);

    if (targetIndex !== -1) {
      updatedOptions.splice(targetIndex, 1);
    }

    dispatch({ type: 'UPDATE_OPTIONS', value: updatedOptions, index });
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
        {defaultOptions && defaultOption === 'select' && (
          <>
            {defaultOptions.map((object, idx) => (
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
