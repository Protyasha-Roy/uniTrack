import React, { useState } from 'react';
import { Input, Button, Select, Form } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';

const { TextArea } = Input;
const { Option } = Select;

const Attendance = () => {
  const [rolls, setRolls] = useState('');
  const [clubName, setClubName] = useState('');
  const [message, setMessage] = useState('');

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:30000/checkAttendance', {
        rolls: values.rolls.split(',').map((roll) => roll.trim()), // Convert rolls to an array
        clubName: values.clubName,
      });

      if (response.data === 'Rolls matched') {
        setMessage('Rolls matched');
      } else if (Array.isArray(response.data.mismatchedRolls)) {
        setMessage(`Mismatched rolls: ${response.data.mismatchedRolls.join(', ')}`);
      } else {
        setMessage('Error checking attendance');
      }
    } catch (error) {
      setMessage('Error checking attendance');
      console.error('Error checking attendance:', error);
    }
  };

  const handleAddToAttendance = async () => {
    try {
      await axios.post('http://localhost:30000/addToAttendance', {
        rolls: rolls.split(',').map((roll) => roll.trim()), // Convert rolls to an array
        clubName,
      });

      setMessage('Added to attendance successfully!');
    } catch (error) {
      setMessage('Error adding to attendance');
      console.error('Error adding to attendance:', error);
    }
  };

  return (
    <div className='w-4 m-auto' style={{ marginTop: '50px' }}>
      <Header />
      <Form layout='vertical' onFinish={onFinish}>
        <Form.Item
          label="Enter rolls separated by commas"
          name="rolls"
          rules={[
            {
              required: true,
              message: 'Please enter rolls separated by commas',
              whitespace: true,
            },
          ]}
        >
          <TextArea
            placeholder="Enter rolls separated by commas"
            onChange={(e) => setRolls(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Select club name"
          name="clubName"
          rules={[
            {
              required: true,
              message: 'Please select a club name',
            },
          ]}
        >
          <Select
            placeholder="Select club name"
            onChange={(value) => setClubName(value)}
          >
            <Option value="scienceClub">Science Club</Option>
            <Option value="programmingClub">Programming Club</Option>
            <Option value="languageClub">Language Club</Option>
            <Option value="debateClub">Debate Club</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className='flex m-5'>
            <Button type="primary" htmlType="submit">
              Check Attendance
            </Button>
            <Button type="primary" onClick={handleAddToAttendance} style={{ marginLeft: '10px' }}>
              Add to Attendance
            </Button>
          </div>
        </Form.Item>
      </Form>
      <p>{message}</p>
    </div>
  );
};

export default Attendance;
