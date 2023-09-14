import React from "react";
import FormDialog from "./FormDialog";
import { personalForm } from "@/utilities/types";
import { useGlobalContext } from "@/app/context/store";
import Cookies from "js-cookie";
import { useTranslation } from "@/utilities/translations/useTranslation";

interface BookAppointmentForm {
  showFormPopup: boolean;
  setShowFormPopup: React.Dispatch<React.SetStateAction<boolean>>;
  personalForm: personalForm[];
  answers: { [key: string]: string };
  setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  chosenAppointmentTime: string;
  bookAppointment: (
    appointmentTime: string,
    answers?:
      | {
          [key: string]: string;
        }
      | undefined
  ) => Promise<void>;
}

const BookAppointmentForm = ({
  showFormPopup,
  setShowFormPopup,
  personalForm,
  answers,
  setAnswers,
  chosenAppointmentTime,
  bookAppointment,
}: BookAppointmentForm) => {
  const { setAlert, setAlertOpen } = useGlobalContext();
  const { t } = useTranslation();
  const testFormValidity = (
    appointmentStartTime?: string,
    e?: React.FormEvent<HTMLFormElement>,
    answers?: { [key: string]: string }
  ) => {
    e && e.preventDefault();

    let appointmentTime: string;
    if (
      appointmentStartTime &&
      appointmentStartTime !== chosenAppointmentTime
    ) {
      appointmentTime = appointmentStartTime;
    } else {
      appointmentTime = chosenAppointmentTime;
    }

    if (e) {
      let formFilledProperly = true;
      personalForm?.forEach((question, index) => {
        if (question.required && answers && !answers[question.question]) {
          console.log("answers", answers);
          setAlert({
            message: question.question,
            severity: "error",
            code: index,
          });
          setAlertOpen(true);
          formFilledProperly = false;
          return;
        }
      });
      // general test for the whole form
      if (!formFilledProperly) return;
      // special test for phone or email
      if (
        answers &&
        !answers["What is your email?"] &&
        !answers["What is your phone number?"]
      ) {
        alert("You have to fill either phone or email.");
        return;
      }
      if (!answers) return;
      Cookies.set("name", answers["What is your name?"], { expires: 365 });
      Cookies.set("email", answers["What is your email?"], { expires: 365 });
      Cookies.set("phone", answers["What is your phone number?"], {
        expires: 365,
      });
      Cookies.set(
        "preferredWay",
        answers["Preferred channel of communication?"],
        { expires: 365 }
      );
    }

    // after form declared valid, book the appointment
    return bookAppointment(appointmentTime, answers);
  };

  return (
    <FormDialog
      open={showFormPopup}
      setOpen={setShowFormPopup}
      personalForm={personalForm.map((question) => ({
        ...question,
        question: t(question.question),
      }))}
      answers={answers}
      setAnswers={setAnswers}
      handleSubmit={testFormValidity}
    />
  );
};

export default BookAppointmentForm;
