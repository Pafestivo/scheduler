import React, { useReducer } from 'react';
import QuestionFieldForm from './QuestionFieldForm';
import { Box, Button } from '@mui/material';
import { putData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import { PersonalForm, fullCalendarResponse } from '@/utilities/types';
import generateHash from '@/utilities/generateHash';

type State = PersonalForm[];
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

const initialState = (calendar: fullCalendarResponse | null) =>
  calendar?.personalForm?.map((question) => {
    if (question.options) {
      return {
        ...question,
        options: Object.keys(question.options).map((key) => ({
          id: generateHash(Math.random().toString()),
          value: question.options[key],
        })),
      };
    }
    return question;
  }) || [];

const reducer = (state: State, action: Action): State => {
  const updatedQuestions = [...state];
  switch (action.type) {
    case 'UPDATE_QUESTION':
      updatedQuestions[action.index].question = action.value;
      return updatedQuestions;
    case 'UPDATE_TYPE':
      updatedQuestions[action.index].inputType = action.value;
      if (action.value === 'select') {
        updatedQuestions[action.index].options = [{ id: generateHash(Math.random().toString()), value: 'New Option' }];
      }
      return updatedQuestions;
    case 'UPDATE_REQUIRED':
      updatedQuestions[action.index].required = action.value;
      return updatedQuestions;
    case 'UPDATE_OPTIONS': {
      const questionToUpdate = updatedQuestions[action.index];
      action.value.forEach((newOption) => {
        const existingOption = questionToUpdate.options.find((option: OptionObject) => option.id === newOption.id);
        if (existingOption) {
          existingOption.value = newOption.value;
        }
      });

      return updatedQuestions;
    }

    case 'ADD_QUESTION':
      return [
        ...state,
        {
          question: 'Insert Question Here',
          inputType: 'text',
          required: false,
          id: generateHash(Math.random().toString()),
        },
      ];
    case 'ADD_OPTION':
      updatedQuestions[action.index].options.push({ id: generateHash(Math.random().toString()), value: 'New Option' });
      return updatedQuestions;
    case 'DELETE_QUESTION':
      updatedQuestions.splice(action.index, 1);
      return updatedQuestions;
    case 'DELETE_OPTION':
      updatedQuestions[action.index].options = updatedQuestions[action.index].options.filter(
        (option: OptionObject) => option.id !== action.id
      );
      return updatedQuestions;
    default:
      throw new Error();
  }
};

const FormQuestions = () => {
  const { calendar, setAlertOpen, setAlert, setLoading } = useGlobalContext();
  const [questions, dispatch] = useReducer(reducer, initialState(calendar));

  const handleDelete = (index: number) => {
    dispatch({ type: 'DELETE_QUESTION', index });
  };

  const addQuestionRow = () => {
    dispatch({ type: 'ADD_QUESTION' });
  };

  const updatePersonalForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // update in database
    try {
      setLoading(true);
      const modifiedQuestionStructure = questions.map((question) => {
        if (question.options) {
          return {
            ...question,
            options: question.options.reduce((acc: { [key: string]: string }, option: { [key: string]: string }) => {
              return { ...acc, [option.value]: option.value };
            }, {}),
          };
        }
        return question;
      });
      await putData(`/calendars`, {
        hash: calendar?.hash,
        personalForm: modifiedQuestionStructure,
      });
      // if updated successfully, update in global context
      if (calendar) {
        setLoading(false);
        calendar.personalForm = modifiedQuestionStructure;
        setAlert({ code: 200, message: 'Personal form updated!', severity: 'success' });
        setAlertOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setAlert({ code: 500, message: 'Something went wrong!', severity: 'error' });
      setAlertOpen(true);
    }
  };

  return (
    <Box component="form" onSubmit={updatePersonalForm}>
      {questions.map((question, index) => {
        return (
          <Box key={question.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <QuestionFieldForm
              index={index}
              dispatch={dispatch}
              defaultOption={question.inputType}
              defaultValue={question.question}
              defaultRequired={question.required}
              defaultOptions={question.options ? question.options : []}
              handleDelete={handleDelete}
            />
          </Box>
        );
      })}
      <Button onClick={addQuestionRow}>Add Question+</Button>
      <Button type="submit">Save!</Button>
    </Box>
  );
};

export default FormQuestions;
