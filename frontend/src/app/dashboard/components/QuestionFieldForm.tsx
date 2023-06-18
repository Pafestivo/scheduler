import React from 'react';
import FormInput from '@/components/FormInput';
import FormSelectInput from '@/components/FormSelectInput';
import { Grid } from '@mui/material';
import { PersonalForm } from '@/utilities/types';

const QuestionFieldForm = ({
  index,
  defaultOption,
  defaultValue,
  setQuestions,
}: {
  index: number;
  defaultOption: string;
  defaultValue?: string;
  setQuestions: React.Dispatch<React.SetStateAction<PersonalForm[]>>;
}) => {
  const handleQuestionChange = (value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].question = value;
      return newQuestions;
    });
  };

  const handleTypeChange = (value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].inputType = value;
      return newQuestions;
    });
  };

  return (
    <Grid container key={index} direction="row" spacing={2} alignItems={'center'}>
      <Grid item xs={8} sx={{ paddingBottom: '8px' }}>
        <FormInput
          name={`question${index}`}
          label="Question"
          title="Question"
          type="text"
          fieldIdx={index}
          defaultValue={defaultValue}
          setState={handleQuestionChange}
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
    </Grid>
  );
};

export default QuestionFieldForm;
