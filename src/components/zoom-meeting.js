'use client';
import { getaccessToken } from "@/actions/get-access-token";
import { scheduleMeeting } from "@/actions/schedule-meeting";
import { ZoomMtg } from "@zoomus/websdk";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ScheduleMeetingForm from "./schedule-meeting-form";
import { useRouter } from "next/navigation";

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

const ZoomMeeting = () => {
    const router = useRouter();
    const query = useSearchParams();
    const authToken = query.get("code") || "";
    const [token, settoken] = useState("");
    const [accesstoken, setaccesstoken] = useState("");
    const [meetingDetails, setmeetingDetails] = useState({id:"",password:""})
    const [showScheduleForm, setShowScheduleForm] = useState(false); 
    const [meetingData, setMeetingData] = useState();

    useEffect(() => {
        console.log("access token : ", authToken);
        if (fetchZak) {
            fetchZak(authToken);
        }
    }, [authToken]);


    const fetchZak = async (authToken) => {
        try {
            const zakReq = await fetch(
                `https://api.zoom.us/v2/users/me/token?type=zak`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken || "ixPfTrr5codJbC7pJkTQ8mf9-N7MIR9sQ"}`,
                    },
                }
            );
    
            const { token } = await zakReq.json();
            console.log("zak token : ", token);
    
            if (token) {
                settoken(token);
            }
        } catch (error) {
            console.error("Error fetching Zak token:", error);
        }
    };
    
    
    const accessToken = async () => {
        const at = await getaccessToken({ authToken: authToken })
        setaccesstoken(at)
    }

    //  const accessToken = async (authCode) => {
    //     try {
    //         const at = await getaccessToken({ authToken: authCode });
    //         setaccesstoken(at);
    //     } catch (error) {
    //         console.error("Error getting access token:", error);
    //     }
    // }





    // const schedulemeeting = async () => {
    //     try {

    //         const authorizeResponse = await fetch(
    //             `https://zoom.us/oauth/authorize?response_type=code&client_id=Uyn9IsyIThStBELbW_Pn3w&redirect_uri=${process.env.NEXT_PUBLIC_URL}`,
    //             {
    //                 method: "GET",
    //             }
    //         );

    //         // Check if authorization was successful (You might need to handle redirects appropriately)
    //         if (!authorizeResponse.ok) {
    //             throw new Error("Authorization failed");
    //         }

    //         // Extract the authorization code from the response or URL depending on your flow
    //         const authorizationCode = ""; // Extract the code from the response

    //         // Set the access token
    //         await accessToken(authorizationCode);

    //         // Set the meeting details
    //         const md = await scheduleMeeting({ accesstoken: accesstoken });
    //         setmeetingDetails(md.json);

    //         // Show the schedule form
    //         setShowScheduleForm(true);

    //     } catch (error) {
    //         console.error("Error scheduling meeting:", error);
    //     }
    // }

    const schedulemeet = async () => {
        await getauthorize 
        await accessToken
        
        setShowScheduleForm(true);
    }

    const scheduleform = async () => {
        const md = await scheduleMeeting({ accesstoken: accesstoken, meetingData: meetingData })
        setmeetingDetails(md.json)
    }



    const startMeeting = async () => {
        try {
            if (ZoomMtg.init) {
                ZoomMtg.init({
                    leaveUrl: process.env.NEXT_PUBLIC_URL || "",
                    success: (success) => {
                        if (typeof document !== 'undefined') {
                            const rootElement = document.getElementById("zmmtg-root");
                            if (rootElement) {
                                rootElement.style.display = "block";
                            }
                        }
                        console.log(success);
                        const signature = ZoomMtg.generateSDKSignature({ sdkKey: "Uyn9IsyIThStBELbW_Pn3w", sdkSecret: "z2edGfInZEvEH6oNSyEFX6wS2OA2SBHI", meetingNumber: meetingDetails.id.toString(), role: "1" })
                        if (ZoomMtg.join) {
                            ZoomMtg.join({
                                passWord: meetingDetails.password,
                                sdkKey: "Uyn9IsyIThStBELbW_Pn3w",
                                signature: signature,
                                meetingNumber: meetingDetails.id,
                                userName: "rahul",
                                zak: token,
                                success: (success) => {
                                    console.log(success);
                                },
                                error: (error) => {
                                    console.log(error);
                                },
                            });
                        }
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const joinMeeting = async () => {
        try {
            if (typeof document !== 'undefined') {
                const rootElement = document.getElementById("zmmtg-root");
                if (rootElement) {
                    rootElement.style.display = "block";
                }
            }
            const signature = ZoomMtg.generateSDKSignature({ sdkKey: "Uyn9IsyIThStBELbW_Pn3w", sdkSecret: "z2edGfInZEvEH6oNSyEFX6wS2OA2SBHI", meetingNumber: meetingDetails.id.toString(), role: "0" })

            if (ZoomMtg.init) {
                ZoomMtg.init({
                    leaveUrl: process.env.NEXT_PUBLIC_URL || "",
                    isSupportAV: true,
                    success: (success) => {
                        console.log(success);

                        if (ZoomMtg.join) {
                            ZoomMtg.join({
                                passWord: meetingDetails.password,
                                sdkKey: "Uyn9IsyIThStBELbW_Pn3w",
                                signature: signature,
                                meetingNumber: meetingDetails.id,
                                userName: "rahul",
                                success: (success) => {
                                    console.log(success);
                                },
                                error: (error) => {
                                    console.log(error);
                                },
                            });
                        }
                    },
                });
            }
        } catch (error) {
            console.error("Error joining Zoom meeting:", error);
        }
    };

    const getauthorize = async ()=> {
        router.push(`https://zoom.us/oauth/authorize?response_type=code&client_id=Uyn9IsyIThStBELbW_Pn3w&redirect_uri=${process.env.NEXT_PUBLIC_URL}`)

    }

    return (
        <div className="flex z-[9999] fixed top-0 bg-orange-500 text-xl p-4 text-white gap-8">
            {/* <Link
                href={`https://zoom.us/oauth/authorize?response_type=code&client_id=Uyn9IsyIThStBELbW_Pn3w&redirect_uri=${process.env.NEXT_PUBLIC_URL}`}
            > authorize
            </Link> */}

            {/* <button onClick={accessToken}>get access token</button> */}


            <button onClick={schedulemeet}>Schedule Meeting</button>
            <button onClick={startMeeting}>Start Meeting</button>
            <button onClick={joinMeeting}>Join Meeting</button>

            {/*  Conditional rendering of ScheduleMeetingForm  */}

            {showScheduleForm && (
                <ScheduleMeetingForm
                    // accessToken={accesstoken}
                    setMeetingDetails={setmeetingDetails}
                    // setShowScheduleForm={setShowScheduleForm}
                    scheduleform={scheduleform}
                    setMeetingData={setMeetingData}
                />
            )}

        </div>
    );
};

export default ZoomMeeting;
