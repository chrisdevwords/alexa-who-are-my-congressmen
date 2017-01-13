
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

import { getMembersByAddress } from '../src/serivce-helper';

describe('The Service Helper Methods', () => {

    describe('Get member by Address', () => {

        it('gets a member of congress by address', (done) => {
            getMembersByAddress('45 Main St. Brooklyn')
                .then(({ representative }) => {
                    const { name } = representative;
                    expect(name).to.eq(
                        'Nydia M. Velázquez'
                    );
                    done();
                })
                .catch(done);
        });
    });
});
