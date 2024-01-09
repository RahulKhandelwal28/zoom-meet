'use client';
import { getaccessToken } from "@/actions/get-access-token";
import { scheduleMeeting } from "@/actions/schedule-meeting";
import { ZoomMtg } from "@zoomus/websdk";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Home from "./home";

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

const ZoomMeeting = () => {
    const query = useSearchParams();
    const router = useRouter();
    const authToken = query.get("code") || "";
    const [token, settoken] = useState("");
    
    const [meetingDetails, setMeetingDetails] = useState({id:"",password:""})
    const [showForm, setshowForm] = useState(false)
 

    useEffect(() => {

        const rootElement = document.getElementById("zmmtg-root");
        if (rootElement) {
            rootElement.remove();
        }


        setshowForm(true)
        // if(authToken){
        //     accessToken
        // }
    }, [authToken])



    // const fetchZak = async (authToken) => {
    //     try {
    //         const zakReq = await fetch(
    //             `https://api.zoom.us/v2/users/me/token?type=zak`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${authToken || "ixPfTrr5codJbC7pJkTQ8mf9-N7MIR9sQ"}`,
    //                 },
    //             }
    //         );
    
    //         const { token } = await zakReq.json();
    //         console.log("zak token : ", token);
    
    //         if (token) {
    //             settoken(token);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching Zak token:", error);
    //     }
    // };
    
    
    const schedulemeeting = async () => {
        router.push(`https://zoom.us/oauth/authorize?response_type=code&client_id=Uyn9IsyIThStBELbW_Pn3w&redirect_uri=${process.env.NEXT_PUBLIC_URL}/schedule`)
        const token =  query.get("code");
        console.log("auth", authToken)
        settoken(token || "")
        // console.log("auth", authToken)
        console.log("access", accesstoken)
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

    

    return (
        <div className="h-screen  w-screen flex items-center justify-center gap-10 p-10">
            <div className="flex z-[9999] fixed top-0 bg-orange-500 text-xl p-4 text-white gap-8">
                <button onClick={schedulemeeting}>scheduleMeeting</button>
                <button onClick={startMeeting}>Start Meeting</button>
                <button onClick={joinMeeting}>Join Meeting</button>
            </div>
            <Home/>
            {/* {showForm && <Home setmeetinginfo={setMeetingDetails}  />}
            {showForm && <div>
                <h1 className="text-xl">Meeting Details</h1>
                <p>meeting id : {meetingDetails.id}</p>
                <p>meeting password : {meetingDetails.password}</p>
            </div>} */}
        </div>
    );
};

export default ZoomMeeting;