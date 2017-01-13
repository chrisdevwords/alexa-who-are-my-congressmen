
import request from 'request-promise-native';

const API_ROOT = 'https://wrrpyqpv64.execute-api.us-east-1.amazonaws.com/testing'

export const endpoint = address =>
    `${API_ROOT}?address=${address}`;

export const contactEndpoint = name =>
    `${API_ROOT}/contact?name=${name}`;


export function senioritySort(senators) {
    return senators.sort((a, b) =>
        parseInt(a.seniority, 10) - parseInt(b.seniority, 10)
    );
}

export function parseContactMessage({ name, contact }) {

    const message = `The phone number for ${name} is ${contact.phone}`;
    return { message };
}

export function parseDataToMessage(result) {
    const { senators, representative } = result;
    const orderSenators = senioritySort(senators);

    const message = `Your representative is ${representative.name}, ` +
                `your senior senator is ${orderSenators[1].name} and ` +
                `your junior senator is ${orderSenators[0].name}.`;
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
        .then(parseContactMessage)
        .catch(parseErrorToMessage);
}
