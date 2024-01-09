"use client"

import { useState } from 'react';
// import { scheduleMeeting } from '@/actions/schedule-meeting'; // Update the path accordingly


const ScheduleMeetingForm = ({  schduleform, setMeetingData }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    topic: 'My Meeting',
    type: 2,
    start_time: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // Set initial start time (2 minutes from now)
    duration: 60,
    timezone: 'Asia/Calcutta',
    agenda: 'Discuss important matters',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: false,
      watermark: false,
      use_pmi: false,
      approval_type: 2,
      registration_type: 1,
      audio: 'both',
      auto_recording: 'none',
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    setMeetingData(meetingDetails)
    schduleform
  };

  return (
    <form onSubmit={handleScheduleMeeting}>
      <label htmlFor="topic">Topic:</label>
      <input
        type="text"
        id="topic"
        name="topic"
        value={meetingDetails.topic}
        onChange={handleInputChange}
      />

      <label htmlFor="start_time">Start Time:</label>
      <input
        type="datetime-local"
        id="start_time"
        name="start_time"
        value={meetingDetails.start_time}
        onChange={handleInputChange}
      />

      <label htmlFor="duration">Duration (minutes):</label>
      <input
        type="number"
        id="duration"
        name="duration"
        value={meetingDetails.duration}
        onChange={handleInputChange}
      />

      <label htmlFor="agenda">Agenda:</label>
      <input
        type="text"
        id="agenda"
        name="agenda"
        value={meetingDetails.agenda}
        onChange={handleInputChange}
      />

      <button type="submit">Schedule Meeting</button>
    </form>
  );
};

export default ScheduleMeetingForm;