import fetch from 'node-fetch';
import dotenv from 'dotenv'
import fs from 'fs'
import qs from 'qs'


dotenv.config()

let accessToken;
let conversationId;

const getAuthentication = async () => {
    const fetchResponse = await fetch('https://api.symbl.ai/oauth2/token:generate', {
        method: 'post',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify({
            type: 'application',
            appId: process.env.APP_ID,
            appSecret: process.env.APP_SECRET
        })
    });
    const responseBody = await fetchResponse.json();
    if (responseBody.keys()[0]=== 'message'){
        return -1
    }else{
        accessToken = responseBody.accessToken
    }
    
}

const getConversationId = async (filename='', url) => {
    if (getAuthentication() === -1) {
        return 'Failed to get authentication'
    }
    
    // const symblaiParams = {
    //     'name': filename,
    //     'url': url
    // }
    // const fetchResponse = await fetch('https://api.symbl.ai/v1/process/audio/url', {
    //     method: 'post',
    //     body: JSON.stringify(symblaiParams),
    //     headers: {
    //         'Authorization': `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json'
    //     }
    // });

    // const responseBody = await fetchResponse.json();
    const contentType = 'audio/mp3';

    const fetchResponse = await fetch(`https://api.symbl.ai/v1/process/audio?${qs.stringify(symblaiParams)}`, {
        method: 'post',
        body: fs.createReadStream(filePath),
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': contentType,
        }
    });
    const responseBody = await fetchResponse.json()
    conversationId = responseBody.conversationId

}

const getTranscription = async (url) => {
    getConversationId(url)


    const fetchResponse = await fetch(`https://api.symbl.ai/v1/conversations/${conversationId}/messages?sentiment=true`, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
    }
    });

    const responseBody = await fetchResponse.json();
    console.log(responseBody)
}
export default getTranscription;