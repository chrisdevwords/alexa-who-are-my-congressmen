

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
        const reprompt = 'Tell me your address.';
        const session = req.getSession();

        if (!address || !address.length) {
            const prompt = 'I didn\'t hear an address. Tell me an address.';
            res
                .say(prompt)
                .reprompt(reprompt)
                .shouldEndSession(false);
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

                            res
                                .say(`Ok, your information was texted to ${phone}`)
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
    res.say('Goodbye!');
};

app.intent('AMAZON.YesIntent', (req, res) => {
    res.say('Ok, please give me your phone number')
        .shouldEndSession(false)
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
    const prompt = 'For information on your members of congress, ' +
            'tell me your address.';
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
