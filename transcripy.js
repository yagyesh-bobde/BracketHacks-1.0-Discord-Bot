import fetch, { Headers } from 'node-fetch';
import dotenv from 'dotenv'

dotenv.config()

const getAuthentication = async () => {

    try {
        const fetchResponse = await fetch('https://api.symbl.ai/oauth2/token:generate', {
            method: 'post',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                type: 'application',
                appId: process.env.SYMBL_APP_ID,
                appSecret: process.env.SYMBL_APP_SECRET
            })
        });
        const responseBody = await fetchResponse.json();
        // accessToken = responseBody.accessToken
        return responseBody.accessToken;
        
    } catch (error) {
        console.log(error)
    }
    
    
}

const getConversationId = async ( url) => {
    let accessToken =  await getAuthentication()


        let body = {
            name: "audio",
            url: url
        }
        
    const fetchResponse = await fetch('https://api.symbl.ai/v1/process/audio/url', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'x-api-key': `${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const responseBody = await fetchResponse.json();
        console.log(responseBody)
        return ({
            accessToken: accessToken,
            conversationId: responseBody.conversationId, 
            jobId: responseBody.jobId
        })

}
const getVideoId = async ( url) => {
    let accessToken =  await getAuthentication()
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", `${accessToken}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var raw = JSON.stringify({
        "url": "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_video_file.mp4",
        "confidenceThreshold": 0.6,
        "timezoneOffset": 0
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const fetchResponse = await fetch("https://api.symbl.ai/v1/process/video/url", requestOptions)
    const responseBody = await fetchResponse.json();
    console.log(responseBody)
    return ({
        accessToken: accessToken,
        conversationId: responseBody.conversationId,
        jobId: responseBody.jobId
    })

}

const isJobDone = async (myHeaders, jobId) => {

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

   const response = await fetch(`https://api.symbl.ai/v1/job/${jobId}`, requestOptions)
   const json = await response.json()
   return json.status
}


const getTranscription = async (url, audio) => {
    let res;
    if (audio){
         res = await getConversationId(url)

    }else{ 
         res = await getVideoId(url)
    }
    let { accessToken, conversationId, jobId } = res
    console.log(accessToken, conversationId, jobId)

    var myHeaders = new Headers();
    myHeaders.append("x-api-key", `${accessToken}`);
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    let status = await isJobDone(myHeaders, jobId)
    while (status === 'in_progress'){
        status = await isJobDone(myHeaders, jobId) 
    }

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let reqUrl = `https://api.symbl.ai/v1/conversations/${conversationId}/messages`
    const response = await  fetch( reqUrl, requestOptions)
    const json = await response.json()
    console.log(json)

    return json.messages
    
}
export default getTranscription;

