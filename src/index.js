

import alexa from  'alexa-app';

// eslint-disable-next-line babel/new-cap
const app = new alexa.app('who-are-my-congressmen');

const slots = {
    ADDRESS: 'AMAZON.PostalAddress'
};

const utterances =  [
    '{|representative|senator|member|congressman|congressmen} ' +
    '{|of} {|congress} {|for|at} {-|ADDRESS}'
];

app.intent('find by address', { slots, utterances },

    (req, res) => {

        const address = req.slot('ADDRESS');
        const reprompt = 'Tell me your address.';

        if (!address || !address.length) {
            const prompt = 'I didn\'t hear an address. Tell me an address.';
            res
                .say(prompt)
                .reprompt(reprompt)
                .shouldEndSession(false);
        } else {
            res
                .say(address)
                .shouldEndSession(true)
                .send();
        }

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
