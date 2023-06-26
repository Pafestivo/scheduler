import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormInput from './FormInput';
import FormSelectInput from './FormSelectInput';
// import { Checkbox, FormControlLabel } from '@mui/material';
import FormCheckInput from './FormCheckboxInput';

interface FormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (...args: any[]) => Promise<void>;
  personalForm?: {
    question: string;
    inputType: string;
    options?: {[key: string]: string} | undefined;
    required?: boolean;
  }[];
  answers?: { [key: string]: string };
  setAnswers?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const FormDialog = ({ open, setOpen, personalForm, answers, setAnswers, handleSubmit }: FormDialogProps) => {
  const handleSetAnswers = (textFieldValue: string, name: string) => {
    if (!setAnswers) return;
    setAnswers((prev) => ({
      ...prev,
      [name]: textFieldValue,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>The booker has some questions for you</DialogTitle>
        <DialogContent>
          <DialogContentText>Fields marked with * are required.</DialogContentText>
          <form onSubmit={(e) => handleSubmit('', e, answers)}>
            {/* default questions */}
            {/* <FormInput
              name={'What is your name?'}
              label={'What is your name?'}
              title={'What is your name?'}
              type={'text'}
              fieldIdx={0}
              setState={handleSetAnswers}
            />

            <FormInput
              name={'What is your phone number?'}
              label={'What is your phone number?'}
              title={'What is your phone number?'}
              type={'text'}
              fieldIdx={1}
              setState={handleSetAnswers}
            />

            <FormInput
              name={'What is your email?'}
              label={'What is your email?'}
              title={'What is your email?'}
              type={'text'}
              fieldIdx={2}
              setState={handleSetAnswers}
            />

            <FormSelectInput
              label={'preferred channel of communication?'}
              options={{'email': 'Email', 'phone': 'Phone'}}
              setState={setAnswers}
              fieldIdx={3}
            /> */}

            {/* personal questions */}
            {personalForm &&
              personalForm.map((question, index) => {
                return (
                  <div key={`${question.question} + ${index}`}>
                    {question.inputType === 'select' && question.options ? (
                      <FormSelectInput
                        name={question.question}
                        label={question.question}
                        options={question.options}
                        setState={handleSetAnswers}
                        fieldIdx={index}
                      />
                    ) : question.inputType === 'checkbox' ? (
                      <FormCheckInput label={question.question} setState={setAnswers} fieldIdx={index} />
                    ) : (
                      <FormInput
                        name={question.question}
                        label={question.question}
                        title={question.question}
                        type={question.inputType}
                        fieldIdx={index}
                        setState={handleSetAnswers}
                      />
                    )}
                  </div>
                );
              })}
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit">
              Book Appointment
            </Button>
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
