// src/mocks/browser.js
import { setupWorker } from 'msw';
import { handlersjobs } from './handlers';
import { handlerscandidates } from './handlercandidate';


export const worker = setupWorker(
    ...handlersjobs, 
    ...handlerscandidates
);
