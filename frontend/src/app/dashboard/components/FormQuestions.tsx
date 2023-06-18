import { useGlobalContext } from '@/app/context/store';
import React, { useState } from 'react';
import QuestionFieldForm from './QuestionFieldForm';
import { Box, Button, IconButton } from '@mui/material';
import { putData } from '@/utilities/serverRequests/serverRequests';
import DeleteIcon from '@mui/icons-material/Delete';

const FormQuestions = () => {
  const { calendar, setAlertOpen, setAlert, setLoading } = useGlobalContext();
  const [questions, setQuestions] = useState(calendar?.personalForm || []);

  const addQuestionRow = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: '',
        inputType: 'text',
        required: false,
      },
    ]);
  };

  const handleDelete = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updatePersonalForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPersonalForm = [];
    const data = new FormData(e.currentTarget);
    for (let i = 0; i < questions.length; i++) {
      const currentQuestion = data.get(`question${i}`) as string;
      const currentType = data.get(`type${i}`) as string;
      const questionObject = {
        question: currentQuestion,
        inputType: currentType,
        required: false,
      };
      newPersonalForm.push(questionObject);
    }

    // update in database
    try {
      setLoading(true);
      const response = await putData(`/calendars`, {
        hash: calendar?.hash,
        personalForm: newPersonalForm,
      });
      // if updated successfully, update in global context
      if (calendar) {
        setLoading(false);
        calendar.personalForm = newPersonalForm;
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
          <Box key={Math.random()} sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => {
                handleDelete(index);
              }}
            >
              <DeleteIcon />
            </IconButton>
            <QuestionFieldForm
              index={index}
              setQuestions={setQuestions}
              defaultOption={question.inputType}
              defaultValue={question.question}
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
