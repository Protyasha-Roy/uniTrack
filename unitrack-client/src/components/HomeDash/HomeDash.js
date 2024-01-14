import React from 'react'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
   UserOutlined
  } from '@ant-design/icons';

export default function HomeDash() {
    const navigate = useNavigate();

    const handleLogOut = () => {
        console.log('loged out');
    }

  return (
    <section>
        <h2 className='headingText'><span className='appName'>UniTrack</span> - Student Management System</h2>
        <div className='container'>
                <div className='container pointer'>
                    <div onClick={() => navigate('/userProfile')} className='border p-5 m-5 container'>
                        <UserOutlined />
                        <p>Even bigger name, bigger than anything</p>
                    </div>
                    <Button className='w-full' onClick={handleLogOut}>Log Out</Button>
                </div>
                <div className='flex gap-10'>
                    <div className='container p-10 justify-between gap-10'>
                        <h3 className='textCenter'>Actions List</h3>
                        <Button className='w-full' onClick={() => navigate('/addStudent')}>Add new student</Button>
                        <Button className='w-full' onClick={() => navigate('/attendance')}>Take Attendance</Button>
                        <Button className='w-full' onClick={() => navigate('/sendMails')}>Send Multiple Mail</Button>
                    </div>
                    <div className='container p-10 justify-between gap-10'>
                        <h3 className='textCenter'>Saved Data</h3>
                        <Button className='w-full' onClick={() => navigate('/studentsList')}>Students List</Button>
                        <Button className='w-full' onClick={() => navigate('/attendanceList')}>Attendance List</Button>
                        <Button className='w-full' onClick={() => navigate('/allMails')}>Sent Mails</Button>
                    </div>
                </div>
            </div>
    </section>
  )
}
