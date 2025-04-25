// File: src/unifiedAIClient.ts
'use server'

import axios from 'axios';

const baseURLs = {
  "OPENAI_API_KEY": 'https://api.openai.com/v1/chat/completions',
  "DEEPSEEK_API_KEY": 'https://api.deepseek.com/v1/chat/completions',
};

const getValueByName = (configArray : Array<any>, nameToFind : string) => {
    let API_key = null;
    if(configArray){
        configArray.map((key:any) => {
        if (key && key.name === nameToFind) {
            console.log("value in: ", nameToFind, key.value)
            API_key=key.value;
        }
        })
    }
    return API_key; // Or undefined, depending on your desired behavior if not found.
  }
  

export async function getAnswerFromModel(question : string,model : string ,temperature : Number ,max_tokens : Number ,keys : Array<any>) {

    console.log("keys: ", keys);
    if(question && model && temperature && max_tokens && keys){
        console.log("keys: ", keys);
        let baseURL = baseURLs.OPENAI_API_KEY;
        let key = getValueByName( keys, 'OPENAI_API_KEY');
        console.log("key", key)


        if(model.startsWith("deep")){
            baseURL = baseURLs.DEEPSEEK_API_KEY;
            key = getValueByName( keys, 'DEEPSEEK_API_KEY');
        }

        console.log("baseURL, key: ", baseURL, key)
        const messages = [
            { role: 'user', content: question },
        ];

        try {
            const response = await axios.post(
                baseURL,
                {
                    model,
                    messages,
                    temperature,
                    max_tokens,
                },
                {
                    headers: {
                        Authorization: `Bearer ${key}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            
            return response.data.choices[0].message.content;
        } catch (error: any) {
            const msg = error?.response?.data?.error?.message || error.message;
            throw new Error(`API error: ${msg}`);
        }
    }
    return null
}
