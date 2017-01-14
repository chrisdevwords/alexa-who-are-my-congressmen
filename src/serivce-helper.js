
import request from 'request-promise-native';

const API_ROOT = 'https://wrrpyqpv64.execute-api.us-east-1.amazonaws.com/testing';

const SMS_ROOT = 'https://l40zel7jme.execute-api.us-east-1.amazonaws.com/prod';

const partyHash = { D: 'a Democrat', R: 'a Republican', I: 'an Independent' };

export const smsEndpoint = (number, message) =>
    `${SMS_ROOT}/SMS-Twilio?to=${number}&message=${message}`;

export const endpoint = address =>
    `${API_ROOT}?address=${address}`;

export const contactEndpoint = name =>
    `${API_ROOT}/contact?name=${name}`;


export function senioritySort(senators) {
    return senators.sort((a, b) =>
        parseInt(a.seniority, 10) - parseInt(b.seniority, 10)
    );
}

export function parseContactMessage(name, result) {
    const message = `The phone number for ${name} is ${result.contact.phone}`

    return { message };
}

export function sendBulkMessage(message) {
    const options = {
        uri: smsEndpoint(encodeURI(2163347295), encodeURI(message)),
        json:true
    };

    return request
        .get(options)
        .catch(error => console.log(error.message));
}

export function parseBulkMessages(messages) {
    const bulkMessage = messages.map(({ message }) => message).join(' ');
    return bulkMessage;
}

export function parseDataToMessage(result) {
    const { senators, representative } = result;
    const orderSenators = senioritySort(senators);

    const message = `Your representative is ${representative.name} ` +
            `${partyHash[representative.party]}, ` +
            `Your senior senator is ${orderSenators[1].name} ` +
            `${partyHash[orderSenators[1].party]}, and ` +
            `Your junior senator is ${orderSenators[0].name} ` +
            `${partyHash[orderSenators[0].party]}. ` +
            'Would you like me to send you their contact information?';
    return { message };
}

export function parseErrorToMessage({ error }) {

    const { statusCode, message } = error;
    return {
        statusCode,
        message
    }
}

export function getMembersByAddress(address) {
    const options = {
        uri: endpoint(address),
        json: true
    };

    return request
        .get(options)
        .then(({ result }) => result);
}

export function getContactInfo(name) {
    const options = {
        uri: contactEndpoint(encodeURI(name)),
        json: true
    };
    return request
        .get(options)
        .then(result => parseContactMessage(name, result))
        .catch(parseErrorToMessage);
}

export function getBulkContactMessage(names) {
    return Promise.all(
        names.map(name => getContactInfo(name))
    )
}
