"use strict";

export const getaccessToken = async ({ authToken }) => {
    const data = new URLSearchParams();
    data.append("code", authToken);
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", process.env.NEXT_PUBLIC_URL || "");
    data.append("client_id", "Uyn9IsyIThStBELbW_Pn3w");
    data.append("client_secret", 'z2edGfInZEvEH6oNSyEFX6wS2OA2SBHI');
    
    const res = await fetch("https://zoom.us/oauth/token", {
        method: "POST",
        body: data,
    });

    const json = await res.json();
    console.log(json);

    if (json.access_token) {
        return json.access_token;
    }
};