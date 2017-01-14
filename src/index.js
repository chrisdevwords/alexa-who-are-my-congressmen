

import alexa from  'alexa-app';
import {
    getMembersByAddress,
    parseDataToMessage,
    parseErrorToMessage,
    getContactInfo
} from './serivce-helper';

// eslint-disable-next-line babel/new-cap
const app = new alexa.app('who-are-my-congressmen');

const slots = {
    ADDRESS: 'AMAZON.PostalAddress',
};

const utterances =  [
    '{|my address|I live|It|It\'s} ' +
    '{|is|at} {-|ADDRESS}'
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
                session.set('address', address);
                session.set('data', data);
                res
                    .say(message)
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

const exitFunction = (req, res) => {
    res.say('Goodbye!');
};

app.intent('AMAZON.YesIntent', (req, res) => {
    const session = req.getSession();
    const data = session.get('data');
    const name = data.representative.name;

    if (data) {
        getContactInfo(name)
            .then(({ message }) => {
                res
                    .say(message)
                    .shouldEndSession(true)
                    .send();
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

    exitFunction();

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
