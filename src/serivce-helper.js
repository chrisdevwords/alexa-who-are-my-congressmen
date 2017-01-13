
import request from 'request-promise-native';

export const endpoint = address =>
    'https://wrrpyqpv64.execute-api.us-east-1.amazonaws.com/testing' +
    `?address=${address}`;

export function senioritySort(senators) {
    return senators.sort((a, b) =>
        parseInt(a.seniority, 10) - parseInt(b.seniority, 10)
    );
}

export function parseContactMessage({ result }) {
    const { representative } = result;
    const message = `The contact info for ${representative.name}, ` +
                'is blah blah blah';

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

export function sendData({ result }) {
    return result;
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
        .then(sendData)
        .catch(parseErrorToMessage);
}

export function getContactInfo(name) {
    const options = {
        uri: endpoint('45 Main Street, Brooklyn NY'),
        json: true
    };

    return request
        .get(options)
        .then(parseContactMessage)
        .catch(parseErrorToMessage);
}

