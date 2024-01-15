import React, { useState } from 'react';
import { Input, Button, Select } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const Attendance = () => {
  const [rolls, setRolls] = useState('');
  const [clubName, setClubName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:30000/checkAttendance', {
        rolls: rolls.split(',').map((roll) => roll.trim()), // Convert rolls to an array
        clubName,
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
    console.log(rolls.split(',').map((roll) => roll.trim()));
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
    <div className='w-4 m-auto' style={{
      marginTop: '50px'
    }}>
      <TextArea
      className='m-5'
        placeholder="Enter rolls separated by commas"
        onChange={(e) => setRolls(e.target.value)}
        required
      />
      <Select
      className='m-5'
        placeholder="Select club name"
        onChange={(value) => setClubName(value)}
        style={{ width: '100%' }}
        required
      >
        <Option value="scienceClub">Science Club</Option>
        <Option value="programmingClub">Programming Club</Option>
        <Option value="languageClub">Language Club</Option>
        <Option value="debateClub">Debate Club</Option>
      </Select>
      <div className='flex m-5'>
        <Button type="primary" onClick={handleSubmit}>
          Check Attendance
        </Button>
        <Button type="primary" onClick={handleAddToAttendance} style={{ marginLeft: '10px' }}>
          Add to Attendance
        </Button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Attendance;