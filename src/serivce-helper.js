
import request from 'request-promise-native';

export const endpoint = address =>
    'https://wrrpyqpv64.execute-api.us-east-1.amazonaws.com/testing' +
    `?address=${address}`;


export function parseDataToMessage({ result }) {
    const { senators, representative } = result;
    const message = `Your representative is ${representative.name}, ` +
                `and your senators are ${senators[0].name} and ` +
                `and ${senators[1].name}.`;
    return {
        message
    };
}

export function parseErrorToMessage({ error }) {

    const { statusCode, message } = error;
    return {
        statusCode,
        message
    }
}

export default function getMembersByAddress(address) {
    const options = {
        uri: endpoint(address),
        json: true
    };

    return request
        .get(options)
        .then(parseDataToMessage)
        .catch(parseErrorToMessage);
}

