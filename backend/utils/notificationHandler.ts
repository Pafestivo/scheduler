import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';

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

export const sendSMS = async (phone: string, message: string) => {
  const data = qs.stringify({
    post: '2',
    token: process.env.SMS_API_KEY,
    msg: `${message}`,
    list: `${phone}`,
    from: `WECOME`,
  });
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: encodeURI('http://www.micropay.co.il/ExtApi/ScheduleSms.php'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };
  try {
    const res = await axios(config);
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};
