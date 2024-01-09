'use client'

import React, { useState, useEffect } from 'react';
import { scheduleMeeting } from '../../actions/schedule-meeting';
import { getaccessToken } from "../../actions/get-access-token";
import { useSearchParams } from "next/navigation";

const ScheduleMeetingForm = ({ setmeetinginfo }) => {
    const [accesstoken, setaccesstoken] = useState("");
    const query = useSearchParams();

    const [authToken, setAuthToken] = useState("");

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
  
    useEffect(() => {
        setAuthToken(query.get('code') || '');
        const rootElement = document.getElementById('zmmtg-root');
        if (rootElement) {
          rootElement.remove();
        }
      }, [query]);
    

      useEffect(() => {
        const fetchAccessToken = async () => {
          if (authToken !== '') {
            const at = await getaccessToken({ authToken });
            setaccesstoken(at);
            console.log('accesstoken ->', at);
          }
        };
    
        fetchAccessToken();
      }, [authToken]);
    



    const handleChange = (e) => {
      const { id, value } = e.target;
      setMeetingDetails({
        ...meetingDetails,
        [id]: value,
      });
      console.log(meetingDetails);
    };
  
    const scheduleMeet = async (e) => {
        e.preventDefault();
        try {
            const res = await scheduleMeeting({ accessToken: accesstoken, meetingData: meetingDetails });
            const info = res.json; // assuming res.json() returns an object

            setMeetingDetails({
                id: info.id,
                password: info.password
              });

            console.log('Meeting details ->', info);
            setmeetinginfo(info);
            
          } catch (error) {
            console.error('Error generating meeting details:', error);
          }
        };
    return (
      <div>
        
      <section className="max-w-4xl z-[9999] p-6 mx-auto rounded-md shadow-md  mt-20">

      {/* <button onClick={accessToken}>acess token</button> */}

        <h1 className="text-xl font-bold capitalize">Meeting Details</h1>

        <form onSubmit={scheduleMeet}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="" htmlFor="topic">topic</label>
              <input value={meetingDetails.topic} onChange={(e)=>handleChange(e)} id="topic" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="" htmlFor="agenda">agenda</label>
              <input value={meetingDetails.agenda} onChange={(e)=>handleChange(e)} id="agenda" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
            </div>
            <div>
              <label className="" htmlFor="duration">duration</label>
              <input value={meetingDetails.duration} onChange={(e)=>handleChange(e)} id="duration" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
            </div>
  
            <div>
              <label className="" htmlFor="start_time">start time</label>
              <input value={meetingDetails.start_time} onChange={(e)=>handleChange(e)} id="start_time" type="datetime-local" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
            </div>
          </div>
  
          <div className="flex justify-end mt-6">
            <button type='submit' className="px-6 py-2 leading-5 transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 text-white focus:outline-none focus:bg-gray-600">Schedule</button>
          </div>
          
        </form>
      </section>
        
        {/* Show meeting details after submitting the form */}
      {meetingDetails.id && (
        <div>
          <h1 className="text-xl">Meeting Details</h1>
          <p>meeting id: {meetingDetails.id}</p>
          <p>meeting password: {meetingDetails.password}</p>
        </div>
      )}
  
    </div>
    );
  };
  
  export default ScheduleMeetingForm;