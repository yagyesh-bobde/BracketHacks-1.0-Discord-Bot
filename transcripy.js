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

const getConversationId = async ( url, audio) => {
    let accessToken =  await getAuthentication()

    try {
        let body = {
            name: "audio",
            url: url
        }
        
        let host = 'https://api.symbl.ai/v1/process/audio/url'
        if (!audio) {
            host = 'https://api.symbl.ai/v1/process/video/url'
            body = {
                url: url,
                confidenceThreshold: 0.6,
                timezoneOffset: 0
            }
        }
        const fetchResponse = await fetch(host, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'x-api-key': `${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const responseBody = await fetchResponse.json();
        return ({
            accessToken: accessToken,
            conversationId: responseBody.conversationId, 
            jobId: responseBody.jobId
        })
    } catch (error) {
        console.log(error)
    }

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
    let { accessToken, conversationId, jobId } = await getConversationId(url, audio)


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

    return json.messages
    
}
export default getTranscription;

