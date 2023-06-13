import { useGlobalContext } from '@/app/context/store';
import React from 'react';
import QuestionFieldForm from './QuestionFieldForm';
import { Box } from '@mui/material';

const FormQuestions = () => {
  const { calendar } = useGlobalContext()

  return (
    <div>
      {calendar?.personalForm.map((question, index) => {
        return (
          <QuestionFieldForm key={index} index={index} defaultOption={question.inputType} defaultValue={question.question} />
        )
      })}
    </div>
  )
};

export default FormQuestions;
