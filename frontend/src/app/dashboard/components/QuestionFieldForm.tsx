import React from 'react';
import FormInput from '@/components/FormInput';
import FormSelectInput from '@/components/FormSelectInput';
import { Grid } from '@mui/material';

const QuestionFieldForm = ({
  index,
  defaultOption,
  defaultValue
}: {
  index: number
  defaultOption: string
  defaultValue?: string
}) => {
  return (
    <Grid container key={index} direction="row" spacing={2} alignItems={'center'}>
      <Grid item xs={8} sx={{paddingBottom: "8px"}}>
        <FormInput 
          name="question"
          label="Question"
          title="Question"
          type="text"
          fieldIdx={index}
          defaultValue={defaultValue || ''}
        />
      </Grid>
      
      <Grid item xs={3}>
      <FormSelectInput 
        label='Question Type'
        options={{
          text: 'text',
          select: 'select',
          checkbox: 'checkbox'
        }}
        fieldIdx={index}
        defaultOption={defaultOption}
      />
      </Grid>
    </Grid>
  )
};

export default QuestionFieldForm;
