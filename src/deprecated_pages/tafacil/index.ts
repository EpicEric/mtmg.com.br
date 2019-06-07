const Typewriter = require('typewriter-effect/dist/core');
import '../../../node_modules/bulmaswatch/slate/bulmaswatch.min.css';
import * as CryptoJS from 'crypto-js';

/* Declarations and constants */
const fadeTimeMs = 300;
const fadeStepPercentage = 7;

/* Calculated constants */
const fadeOpacityDelta = fadeStepPercentage / 100;
const fadeTimeout = fadeTimeMs * fadeOpacityDelta;

/* Title typewriter */
const typewriterElement = document.getElementById('typewriter');
const typewriter = new Typewriter(typewriterElement, {
    loop: false
});
const defaultTypewriterFontSize = document.getElementById('typewriter').style.fontSize;
typewriter.callFunction(() => document.getElementById('typewriter').style.fontSize = '0')
    .changeDelay(0)
    .typeString('mtmg_enigma')
    .changeDelay('natural')
    .callFunction(() => {
        document.getElementById('typewriter-placeholder').style.fontSize = '0';
        document.getElementById('typewriter').style.fontSize = defaultTypewriterFontSize;
    })
    .pauseFor(750)
    .deleteChars('mtmg_enigma'.length - 'mtmg_'.length)
    .pauseFor(500)
    .typeString('tá_fácil?')
    .pauseFor(1000)
    .callFunction(function(state: any) {
        state.elements.cursor.style.display = 'none';
    })
    .start();

/* Form type definition */
interface TaFacilForm extends HTMLFormElement {
    'ta-facil-form-date': HTMLInputElement
}

/* Date format enforcement */
const nonNumericalRegex = /\D/g;
document.getElementById('ta-facil-form-date').onkeyup = (event) => {
    const target = event.target as HTMLInputElement;
    // Remove non-numerical characters
    const strippedTarget = target.value.replace(nonNumericalRegex, '').slice(0, 8);
    // Add slashes
    if (strippedTarget.length > 4) {
        target.value = `${strippedTarget.slice(0, 2)}/${strippedTarget.slice(2, 4)}/${strippedTarget.slice(4, 8)}`;
        return;
    }
    if (strippedTarget.length > 2) {
        target.value = `${strippedTarget.slice(0, 2)}/${strippedTarget.slice(2, 4)}`;
        return;
    }
    target.value = strippedTarget;
}

/* Form validation */
(document.getElementById('ta-facil-form') as HTMLFormElement).onsubmit = (event) => {
    event.preventDefault();
    const target = event.target as TaFacilForm;
    const button = target.querySelector('.button') as HTMLButtonElement;
    if (button.classList.contains('is-loading')) {
        return;
    }
    button.classList.add('is-loading');
    const notification = target.querySelector('span');
    notification.innerHTML = '';
    const bodyParams = new URLSearchParams();
    const passphrase = target['ta-facil-form-date'].value;

    setTimeout(() => {
        const encryptedElement = document.getElementById('secret-encrypted') as HTMLDivElement;
        const transitMessage = encryptedElement.innerHTML.trim();
        const transitHmac = transitMessage.substring(0, 64);
        const transitEncrypted = transitMessage.substring(64);
        const decryptedHmac = CryptoJS.HmacSHA256(transitEncrypted, CryptoJS.SHA256(passphrase)).toString();

        if (transitHmac == decryptedHmac) {
            const decryptedMessage = CryptoJS.AES.decrypt(transitEncrypted, passphrase).toString(CryptoJS.enc.Utf8);
            const container = document.getElementById('ta-facil-container') as HTMLDivElement;
            container.style.opacity = '1';
            (function fadeOut() {
                let newOpacity = parseFloat(container.style.opacity) - fadeOpacityDelta;
                container.style.opacity = newOpacity.toString();
                if (newOpacity <= 0) {
                    container.innerHTML = decryptedMessage;
                    (function fadeIn() {
                        newOpacity = parseFloat(container.style.opacity) + fadeOpacityDelta;
                        container.style.opacity = newOpacity.toString();
                        if (newOpacity < 1) {
                            setTimeout(fadeIn, fadeTimeout);
                        }
                    })();
                } else {
                    setTimeout(fadeOut, fadeTimeout);
                }
            })();
        } else {
            const notificationTypewriter = new Typewriter(notification, {
                loop: false,
                delay: 15
            });
            button.classList.remove('is-loading');
            notificationTypewriter.typeString('Senha incorreta! Tente novamente...').start();
        }
    }, 1000);
};

/* Manual generator of encrypted HTML */
if (false) {
    const secretElement = document.getElementById('secret-html') as HTMLDivElement;
    if (secretElement) {
        const message = secretElement.innerHTML;
        const passphrase = '00/00/0000'; // FIXME
        const encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();
        const hmac = CryptoJS.HmacSHA256(encrypted, CryptoJS.SHA256(passphrase)).toString();
        console.log(hmac + encrypted);
    }
}
