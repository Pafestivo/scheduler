import Button from "@mui/material/Button";
// import TextField from '@mui/material/TextField';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormInput from "./FormInput";
import FormSelectInput from "./FormSelectInput";
// import { Checkbox, FormControlLabel } from '@mui/material';
import FormCheckInput from "./FormCheckboxInput";
import "@/styles/bookAppointmentForm.css";

interface FormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (...args: any[]) => void;
  personalForm?: {
    question: string;
    inputType: string;
    options?: { [key: string]: string } | undefined;
    required?: boolean;
  }[];
  answers?: { [key: string]: string };
  setAnswers?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const FormDialog = ({
  open,
  setOpen,
  personalForm,
  answers,
  setAnswers,
  handleSubmit,
}: FormDialogProps) => {
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
          <DialogContentText>
            Fields marked with * are required.
          </DialogContentText>
          <form onSubmit={(e) => handleSubmit("", e, answers)}>
            {personalForm &&
              personalForm.map((question, index) => {
                return (
                  <div key={`${question.question} + ${index}`}>
                    {question.inputType === "select" && question.options ? (
                      <FormSelectInput
                        name={question.question}
                        label={
                          question.required
                            ? `${question.question}*`
                            : question.question
                        }
                        options={question.options}
                        defaultOption={Object.keys(question.options)[0]}
                        setState={handleSetAnswers}
                        fieldIdx={index}
                      />
                    ) : question.inputType === "checkbox" ? (
                      <FormCheckInput
                        name={question.question}
                        label={
                          question.required
                            ? `${question.question}*`
                            : question.question
                        }
                        setState={setAnswers}
                        fieldIdx={index}
                      />
                    ) : (
                      <FormInput
                        name={question.question}
                        label={
                          question.required
                            ? `${question.question}*`
                            : question.question
                        }
                        title={question.question}
                        type={question.inputType}
                        defaultValue={answers ? answers[question.question] : ""}
                        fieldIdx={index}
                        setState={handleSetAnswers}
                      />
                    )}
                  </div>
                );
              })}
            <Button
              className="bookAppointmentBtn"
              variant="contained"
              type="submit"
              sx={{ width: "100%", marginBottom: "10px" }}
            >
              Book Appointment
            </Button>
            <Button
              className="cancelBookAppointmentBtn"
              variant="contained"
              onClick={handleClose}
              sx={{ width: "100%", marginBottom: "10px" }}
            >
              Cancel
            </Button>
          </form>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
