class InputValidator {
	constructor(selector) {
		this.resetTimeout = singletonTimeout(500);
		this.inputEl = document.querySelector(selector);
		this.feedbackHandler = new FeedbackHandler(
			document.querySelector(selector).parentElement.querySelector('.feedback')
		);
	}
	check(checkFn, errMsg) {
		this.resetTimeout(() => {
			if (checkFn(this.inputEl.value)) {
				this.feedbackHandler.ok('Checks out. ✔');
			} else {
				this.feedbackHandler.fail(errMsg);
			}
			maybeToggleSubmit();
		});
	}
}

class FeedbackHandler {
	constructor(feedbackEl) {
		this.feedbackEl = feedbackEl;
		this.resetTimeout = singletonTimeout(3000);
	}
	ok(successMsg) {
		this.feedbackEl.classList.remove('error');
		this.feedbackEl.classList.add('success');
		this.feedbackEl.innerText = successMsg;
	}
	fail(errMsg) {
		this.feedbackEl.classList.remove('success');
		this.feedbackEl.classList.add('error');
		this.feedbackEl.innerText = errMsg;
		this.resetTimeout(() => {
			this.feedbackEl.classList.remove('error');
		});
	}
}

const EmailValidator = new InputValidator('[data-email-input]');
const PasswordValidator = new InputValidator('[data-password-input]');
const Password2Validator = new InputValidator('[data-password2-input]');

document.querySelector('[data-email-input]').addEventListener('input', e => {
	if (e.target instanceof HTMLInputElement) {
		EmailValidator.check(validEmail, 'Format seems off. 👎');
	}
});
document.querySelector('[data-password-input]').addEventListener('input', e => {
	if (e.target instanceof HTMLInputElement) {
		PasswordValidator.check(validPassword, 'Make it longer. 🎢');
	}
});
document
	.querySelector('[data-password2-input]')
	.addEventListener('input', e => {
		if (e.target instanceof HTMLInputElement) {
			Password2Validator.check(
				// @ts-ignore
				validPassword2(document.querySelector('[data-password-input]').value),
				'Make it match. 🧦'
			);
		}
	});

function validEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function validPassword(password) {
	return password.length >= 6;
}
function validPassword2(password1) {
	return password2 => password1 === password2;
}
function singletonTimeout(length) {
	let timeoutID = undefined;
	function resetTimeout(cb) {
		if (timeoutID != undefined) {
			clearTimeout(timeoutID);
		}
		timeoutID = setTimeout(() => {
			timeoutID = undefined;
			cb();
		}, length);
	}
	return resetTimeout;
}
function maybeToggleSubmit() {
	if (document.querySelectorAll('.success').length == 3) {
		document.querySelector('form button').removeAttribute('disabled');
	} else if (document.querySelectorAll('.success').length !== 3) {
		document.querySelector('form button').setAttribute('disabled', 'true');
	}
}
