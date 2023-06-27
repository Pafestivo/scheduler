import axios from 'axios';
import FormData from 'form-data';

export const sendEmail = async (email: string, subject: string, text: string) => {
  const data = new FormData();
  data.append('to', `${email}`);
  data.append('subject', `${subject}`);
  data.append('content', `${text}`);

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.EMAIL_SERVICE_URL,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
