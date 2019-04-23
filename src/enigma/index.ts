const Typewriter = require('typewriter-effect/dist/core');
import '../../node_modules/bulmaswatch/slate/bulmaswatch.min.css';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
const fetchPollyfill = require('whatwg-fetch').fetch as typeof window.fetch;

/* Constants and declarations */
declare const BACKEND_URL: string;
const typewriterString: string = 'mtmg11_enigma.exe';
const fetchTimeoutMs: number = 6000;

/* Select fetch from polyfill or default accordingly */
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetchPollyfill;

/* Title typewriter */
const typewriterElement = document.getElementById('typewriter');
const typewriter = new Typewriter(typewriterElement, {
    loop: false
});
typewriter.pauseFor(1250)
    .typeString(typewriterString)
    .pauseFor(1000)
    .callFunction(function(state: any) {
        state.elements.cursor.style.display = 'none';
    })
    .start();

/* Form type definition */
interface EnigmaForm extends HTMLFormElement {
    'enigma-form-name': {
        value: string;
        disabled: boolean;
    },
    'enigma-form-code': {
        value: string;
        disabled: boolean;
    }
}

/* Lowercase enforcement */
document.getElementById('enigma-form-code').onkeyup = (event) => {
    // event.preventDefault();
    const target = event.target as HTMLInputElement;
    target.value = target.value.toLowerCase().trim();
}

/* Form validation */
(document.getElementById('enigma-form') as HTMLFormElement).onsubmit = (event) => {
    event.preventDefault();
    const target = event.target as EnigmaForm;
    const button = target.querySelector('.button') as HTMLButtonElement;
    if (button.classList.contains('is-loading')) {
        return;
    }
    button.classList.add('is-loading');
    const notification = target.querySelector('span');
    notification.innerHTML = '';
    notification.classList.remove('has-text-danger', 'has-text-success');
    const bodyParams = new URLSearchParams();
    bodyParams.append('name', target['enigma-form-name'].value);
    bodyParams.append('secret', target['enigma-form-code'].value);
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
        controller.abort();
    }, fetchTimeoutMs);
    abortableFetch(`${BACKEND_URL}/enigma`, {
        method: 'POST', 
        body: bodyParams,
        signal
    }).then((response) => {
        return response.json();
    }).then((data) => {
        const notificationTypewriter = new Typewriter(notification, {
            loop: false,
            delay: 15
        });
        const reason: string = data.reason;
        const status: string = data.status;
        button.classList.remove('is-loading');
        if (status == 'error') {
            console.log('status = error', data);
            notification.classList.add('has-text-danger');
            notificationTypewriter.typeString(reason).start();
        } else if (status == 'success') {
            console.log('status = success', data);
            target['enigma-form-name'].disabled = true;
            target['enigma-form-code'].disabled = true;
            button.disabled = true;
            notification.classList.add('has-text-success');
            notificationTypewriter.typeString(reason).start();
            const url: string = data.url;
            setTimeout(() => {
                window.location.replace(url);
            }, 5000);
        } else {
            console.error('unhandled status case', status);
        }
    }).catch((err) => {
        console.error(err);
        button.classList.remove('is-loading');
        notification.classList.add('has-text-danger');
        const notificationTypewriter = new Typewriter(notification, {
            loop: false,
            delay: 15
        });
        const errorPrint = 'O servidor está instável ou você não está conectado à Internet. Tente novamente!';
        notificationTypewriter.typeString(errorPrint).start();
    });
};
