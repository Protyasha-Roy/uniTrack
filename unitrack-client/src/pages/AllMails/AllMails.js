import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Collapse, message } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';

const { Panel } = Collapse;

const AllMails = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMails = async () => {
      const userEmail = localStorage.getItem('userEmail');

      try {
        const response = await axios.get('http://localhost:30000/allMails', {
          params: { userEmail },
        });
        setMails(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching mails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  const handleDelete = async (record) => {
    const userEmail = localStorage.getItem('userEmail');

    try {
      await axios.delete(`http://localhost:30000/deleteMail/${record._id}`, {
        params: { userEmail },
      });

      setMails((prevMails) => prevMails.filter((mail) => mail._id !== record._id));
      message.success('Mail deleted successfully!');
    } catch (error) {
      console.error('Error deleting mail:', error);
      message.error('Error deleting mail. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text) => (
        <Collapse>
        <Panel header="Expand Message" key="1" items={[{ key: '1', node: <div>{text}</div> }]}>
          {text}
        </Panel>
      </Collapse>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <Table
        dataSource={mails}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AllMails;