import { useGlobalContext } from '@/app/context/store';
import React, { useState } from 'react';
import QuestionFieldForm from './QuestionFieldForm';
import { Box, Button } from '@mui/material';
import { putData } from '@/utilities/serverRequests/serverRequests';

const FormQuestions = () => {
  const { calendar } = useGlobalContext()
  const [questions, setQuestions] = useState(calendar?.personalForm || []);
  console.log(calendar)

  const addQuestionRow = () => {
    setQuestions(prevQuestions => [...prevQuestions, {
      question: '', 
      inputType: 'text',
      required: false
    }]);
  }

  const updatePersonalForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newPersonalForm = []
    const data = new FormData(e.currentTarget)
    for(let i = 0; i < questions.length; i++) {
      const currentQuestion = data.get(`question${i}`) as string;
      const currentType = data.get(`type${i}`) as string;
      const questionObject = {
        question: currentQuestion,
        inputType: currentType,
        required: false
      }
      newPersonalForm.push(questionObject)
    }

    // update in database
    const response = await putData(`/calendars`, {
      hash: calendar?.hash,
      personalForm: newPersonalForm
    })
    // if updated successfully, update in global context
    if(response.success && calendar) {
      calendar.personalForm = newPersonalForm
      console.log(calendar)
    }
  }

  return (
    <Box component="form" onSubmit={updatePersonalForm}>
      {questions.map((question, index) => {
        return (
            <QuestionFieldForm key={index} index={index} defaultOption={question.inputType} defaultValue={question.question} />
        )
      })}
      <Button onClick={addQuestionRow}>Add Question+</Button>
      <Button type='submit' >Save!</Button>
    </Box>
  )
};

export default FormQuestions;
