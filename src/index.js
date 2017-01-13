

import alexa from  'alexa-app';
import {
    getMembersByAddress,
    parseDataToMessage,
    parseErrorToMessage,
    getContactInfo,
    senioritySort,
} from './serivce-helper';

// eslint-disable-next-line babel/new-cap
const app = new alexa.app('who-are-my-congressmen');

const slots = {
    ADDRESS: 'AMAZON.PostalAddress',
    POSITION: 'LIST_OF_POSITIONS'
};

let sessionData;

const positionList = ['representative', 'senior senator', 'junior senator'];

const utterances =  [
    '{|representative|senator|member|congressman|congressmen} ' +
    '{|of} {|congress} {|for|at} {-|ADDRESS}'
];

app.intent('FindByAddress', { slots, utterances },

    (req, res) => {

        const address = req.slot('ADDRESS');
        const reprompt = 'Tell me your address.';

        if (!address || !address.length) {
            const prompt = 'I didn\'t hear an address. Tell me an address.';
            res
                .say(prompt)
                .reprompt(reprompt)
                .shouldEndSession(false);
            return true;
        }
        getMembersByAddress(address)
            .then((data) => {
                const { message } = parseDataToMessage(data);
                sessionData = data;
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

app.intent('GetContact', { slots, utterances },

    (req, res) => {

        const position = req.slot('POSITION');
        const reprompt = 'Give me your member of congress position.';
        let name;

        if (!positionList.includes(position) || !sessionData) {
            const prompt = 'I didn\'t hear a correct position. Tell me ' +
                'whether he or she is a junior senator, a senior senator ' +
                'or a representative';
            res
                .say(prompt)
                .reprompt(reprompt)
                .shouldEndSession(false)
                .send();
            return true;
        }

        const orderSenators = senioritySort(sessionData.senators);

        if (position === 'representative') {
            name = sessionData.representative.name;
        } else if (position === 'junior senator') {
            name = orderSenators[0].name;
        } else {
            name = orderSenators[1].name;
        }

        getContactInfo(name)
            .then(({ message }) => {
                res
                    .say(message)
                    .shouldEndSession(false)
                    .send();
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

const exitFunction = (req, res) => {
    res.say('Goodbye!');
};

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
