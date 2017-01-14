

import alexa from  'alexa-app';
import {
    getMembersByAddress,
    parseDataToMessage,
    parseErrorToMessage,
    getBulkContactMessage,
    parseBulkMessages,
    sendBulkMessage
} from './serivce-helper';

// eslint-disable-next-line babel/new-cap
const app = new alexa.app('who-are-my-congressmen');

const slots = {
    ADDRESS: 'AMAZON.PostalAddress'
};

const phoneSlots = {
    PHONE: 'NUMBER'
}

const utterances =  [
    '{|my address|I live|It|It\'s} ' +
    '{|is|at} {-|ADDRESS}'
];

const phoneUtterances = [
    '{|my|the|} ' +
    '{|phone|number|} ' +
    '{|is|it is| it\'s} {-|PHONE}'
];

app.intent('FindByAddress', { slots, utterances },

    (req, res) => {

        const address = req.slot('ADDRESS');
        const reprompt = 'Please tell me your address.';
        const session = req.getSession();

        if (!address || !address.length) {
            const prompt = 'I didn\'t hear an address. Please tell me an address.';
            res
                .say(prompt)
                .reprompt(reprompt)
                .shouldEndSession(true);
            return true;
        }
        session.set('address', address);
        getMembersByAddress(address)
            .then((data) => {
                const { message } = parseDataToMessage(data);
                const card = {
                    type: 'Simple',
                    title: 'Your Members of Congress',
                    content: message
                }

                session.set('address', address);
                session.set('data', data);
                res
                    .say(message)
                    .card(card)
                    .shouldEndSession(false)
                    .send()
            })
            .catch((err) => {
                const { message } = parseErrorToMessage(err);
                //console.log(err.stack);
                res
                    .say(message)
                    .shouldEndSession(true)
                    .send();
            });

        return false;
    }
);

app.intent('GetPhoneNumber', { slots: phoneSlots, utterances: phoneUtterances },
    (req, res) => {

        const phone = req.slot('PHONE');
        const session = req.getSession();
        const data = session.get('data');

        console.log('phone number is', phone);

        if (phone && data) {
            const { senators, representative } = data;
            const names = [
                representative.name,
                senators[0].name,
                senators[1].name
            ];

            getBulkContactMessage(names)
                .then(parseBulkMessages)
                .then((message) => {
                    const card = {
                        type: 'Simple',
                        title: 'Their Contact Info',
                        content: message
                    }
                    console.log('-- sending bulk message');
                    sendBulkMessage(phone, message)
                        .then((resp) => {
                            console.log('-- bulk message sent');
                            const phoneString = phone.toString().split('').join(' ');

                            res
                                .say(`Ok, I sent the list to ${phoneString}, thank you for taking the first step towards getting involved`)
                                .card(card)
                                .shouldEndSession(true)
                                .send();
                        })
                        .catch((err) => {
                            console.log('-- error sending bulk message', err);
                            res
                                .say('There was an error sending the text')
                                .say(message)
                                .card(card)
                                .shouldEndSession(true)
                                .send();
                        })

                })
                .catch((err) => {
                    const { message } = parseErrorToMessage(err);
                    res
                        .say(message)
                        .shouldEndSession(true)
                        .send();
                });
            return false;
        }

        const prompt = 'I didn\'t hear a phone number. Tell me a phone number.';
        const reprompt = 'Tell me your phone number.';

        res
            .say(prompt)
            .reprompt(reprompt)
            .shouldEndSession(false);
        return true;
    }
);


const exitFunction = (req, res) => {
    res.say('thanks for taking the first step towards getting involved');
};

app.intent('AMAZON.YesIntent', (req, res) => {
    res.say('Please give me your phone number.')
        .shouldEndSession(false)
        .send();
    return false;
});

app.intent('AMAZON.NoIntent', (req, res) => {
    res.say('This list will be here anytime you needed! thanks for taking the first step towards getting involved')
        .shouldEndSession(true)
        .send();
    return false;
});


app.intent('AMAZON.HelpIntent', (req, res) => {
    res
        .say(
            'To request information on your member of congress, ' +
            'tell me your address.'
        )
        .shouldEndSession(false)
        .send();
    return false;
});

app.intent('AMAZON.StopIntent', exitFunction);
app.intent('AMAZON.CancelIntent', exitFunction);

app.launch((req, res) => {
    const prompt = 'Hi, I am Waldo. I am happy to connect you with your members of congress. ' +
            'First, please tell me your address.';
    res
        .say(prompt)
        .reprompt(prompt)
        .shouldEndSession(false);
});

// hack for dynamic utterances
const utterancesMethod = app.utterances;
// eslint-disable-next-line no-useless-escape
app.utterances = () =>  utterancesMethod().replace(/\{\-\|/g, '{');

module.change_code = 1;
module.exports = app;
