import Head from 'next/head';
import { useState } from 'react';
import React from 'react';
import Select from 'react-select';
import styles from './index.module.css';

export default function Home() {
  const [messageInput, setMessageInput] = useState('');
  const [userMBTI, setUserMBTI] = useState('');
  const [receiverMBTI, setReceiverMBTI] = useState('');
  const [result, setResult] = useState();

  const mbtiOptions = [
    { value: 'ISTJ', label: 'ISTJ' },
    { value: 'ISFJ', label: 'ISFJ' },
    { value: 'INFJ', label: 'INFJ' },
    { value: 'INTJ', label: 'INTJ' },
    { value: 'ISTP', label: 'ISTP' },
    { value: 'ISFP', label: 'ISFP' },
    { value: 'INFP', label: 'INFP' },
    { value: 'INTP', label: 'INTP' },
    { value: 'ESTP', label: 'ESTP' },
    { value: 'ESFP', label: 'ESFP' },
    { value: 'ENFP', label: 'ENFP' },
    { value: 'ENTP', label: 'ENTP' },
    { value: 'ESTJ', label: 'ESTJ' },
    { value: 'ESFJ', label: 'ESFJ' },
    { value: 'ENFJ', label: 'ENFJ' },
    { value: 'ENTJ', label: 'ENTJ' },
  ];

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMBTI: userMBTI,
          receiverMBTI: receiverMBTI,
          message: messageInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setMessageInput('');
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Message Advisor</title>
        <link rel="icon" href="/message.png" />
      </Head>

      <main className={styles.main}>
        <img src="/message.png" className={styles.icon} />
        <h3>Get Advice on Messages</h3>
        <form onSubmit={onSubmit}>
          <label>Your MBTI (optional)</label>
          <Select
            className={styles.select}
            placeholder="Select your MBTI type"
            options={mbtiOptions}
            onChange={(option) => setUserMBTI(option.value)}
            value={userMBTI ? { label: userMBTI } : 'Select your MBTI type'}
          />
          <label>Message Sender's MBTI (optional)</label>
          <Select
            className={styles.select}
            placeholder="Select their MBTI type"
            options={mbtiOptions}
            onChange={(option) => setReceiverMBTI(option.value)}
            value={
              receiverMBTI ? { label: receiverMBTI } : 'Select your MBTI type'
            }
          />
          <label>Message to Analyze and Provide a Response to:</label>
          <input
            type="text"
            name="message"
            placeholder="Enter a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />

          <input type="submit" value="Get Advice" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
