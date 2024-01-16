import React, { useState } from 'react';
import { Input, Button, Select, Form, message } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';
import MailInstruction from '../../components/MailInstruction/MailInstruction';


const { TextArea } = Input;
const { Option } = Select;

const SendMultipleMail = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [messageToSend, setMessageToSend] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [appPass, setAppPass] = useState('');
  const userEmail = localStorage.getItem('userEmail');
  const [form] = Form.useForm();

  const handleSendMail = async () => {
    try {
      const response = await axios.post(`http://localhost:30000/sendMail`, {
        recipient,
        subject,
        messageToSend,
        userEmail,
        fromEmail,
        appPass
      });

      form.resetFields();

      // Handle the response as needed
      message.success(response.data.message);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  return (
    <div className='w-4 m-auto' style={{ marginTop: '50px' }}>
      <Header />
      <Form form={form} onFinish={handleSendMail} layout='vertical'>
        <Form.Item
          label="Whom to send"
          name="recipient"
          rules={[
            {
              required: true,
              message: 'Please select a recipient',
            },
          ]}
        >
          <Select
            placeholder="Select recipient"
            onChange={(value) => setRecipient(value)}
          >
            <Option value="All Students">All Students</Option>
            <Option value="Science Club">Science Club</Option>
            <Option value="Programming Club">Programming Club</Option>
            <Option value="Debate Club">Debate Club</Option>
            <Option value="Language Club">Language Club</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="From-Email"
          name="fromEmail"
          rules={[
            {
              required: true,
              message: 'Please enter from email',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder="Enter from email"
            onChange={(e) => setFromEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Gmail app-password"
          name="appPassword"
          rules={[
            {
              required: true,
              message: 'Please enter the app-password for nodemailer',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder="Enter your app-password"
            onChange={(e) => setAppPass(e.target.value)}
          />
        </Form.Item>

        <MailInstruction/>

        <Form.Item
          label="Mail Subject"
          name="subject"
          rules={[
            {
              required: true,
              message: 'Please enter the mail subject',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder="Enter mail subject"
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[
            {
              required: true,
              message: 'Please enter the message',
              whitespace: true,
            },
          ]}
        >
          <TextArea
          rows={6}
            placeholder="Enter your message"
            onChange={(e) => setMessageToSend(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit'>
            Send Mail
          </Button>
        </Form.Item>
      </Form>
      <p>{resultMessage}</p>
    </div>
  );
};

export default SendMultipleMail;
