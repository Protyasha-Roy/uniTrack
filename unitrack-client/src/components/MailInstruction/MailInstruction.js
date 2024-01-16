import { Typography } from 'antd';
import React from 'react'

const { Text } = Typography;

export default function MailInstruction() {
  return (
    <section>
        <Text>To get your app-password:</Text>
        <ul>
            <li><Text>Turn on gmail account two-factor authentication</Text></li>
            <li><Text>Go to this page <a target="_blank" href='https://myaccount.google.com/apppasswords'>App Passwords</a></Text></li>
            <li><Text>Create password for 'nodemailer'</Text></li>
            <li><Text>Copy the password and paste here. (save it somewhere for later use)</Text></li>
        </ul>
    </section>
  )
}
