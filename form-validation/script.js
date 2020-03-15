// usea singelton to prevent stacking of setTimeout calls
const emailValidationTimeout = singletonTimeout(500);
const emailFeedbackTimeout = singletonTimeout(3000);
const passwordValidationTimeout = singletonTimeout(500);
const passwordFeedbackTimeout = singletonTimeout(3000);
const password2ValidationTimeout = singletonTimeout(500);
const password2FeedbackTimeout = singletonTimeout(3000);

document.querySelector('[data-email-input]').addEventListener('input', e => {
	if (e.target instanceof HTMLInputElement) {
		const testValue = e.target.value;
		const feedbackEl = e.target.parentElement.querySelector('.feedback');
		emailValidationTimeout(() => {
			validEmail(testValue)
				? flashValidationFeedback('success', feedbackEl, emailFeedbackTimeout)
				: flashValidationFeedback(
						'error',
						feedbackEl,
						emailFeedbackTimeout,
						'Format seems off. 👎'
				  );
			toggleSubmit();
		});
	}
});
document.querySelector('[data-password-input]').addEventListener('input', e => {
	if (e.target instanceof HTMLInputElement) {
		const testValue = e.target.value;
		const feedbackEl = e.target.parentElement.querySelector('.feedback');
		passwordValidationTimeout(() => {
			validPassword(testValue)
				? flashValidationFeedback(
						'success',
						feedbackEl,
						passwordFeedbackTimeout
				  )
				: flashValidationFeedback(
						'error',
						feedbackEl,
						passwordFeedbackTimeout,
						'Make it longer. 🎢'
				  );
			toggleSubmit();
		});
	}
});
document
	.querySelector('[data-password2-input]')
	.addEventListener('input', e => {
		if (e.target instanceof HTMLInputElement) {
			const testValue = e.target.value;
			// @ts-ignore
			const testValue2 = document.querySelector('[data-password-input]').value;
			const feedbackEl = e.target.parentElement.querySelector('.feedback');
			password2ValidationTimeout(() => {
				testValue === testValue2
					? flashValidationFeedback(
							'success',
							feedbackEl,
							password2FeedbackTimeout
					  )
					: flashValidationFeedback(
							'error',
							feedbackEl,
							password2FeedbackTimeout,
							'Make it match. 🧦'
					  );
				toggleSubmit();
			});
		}
	});

function validEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function validPassword(password) {
	return password.length >= 6;
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
function toggleSubmit() {
	if (document.querySelectorAll('.success').length == 3) {
		document.querySelector('form button').removeAttribute('disabled');
	} else if (document.querySelectorAll('.success').length !== 3) {
		document.querySelector('form button').setAttribute('disabled', 'true');
	}
}

function flashValidationFeedback(
	result,
	feedbackElement,
	feedbackTimeout,
	errMsg
) {
	if (result == 'success') {
		feedbackElement.classList.remove('error');
		feedbackElement.classList.add('success');
		feedbackElement.innerText = 'Checks out. ✔';
		return null;
	}
	if (result == 'error') {
		feedbackElement.classList.remove('success');
		feedbackElement.classList.add('error');
		feedbackElement.innerText = errMsg;
		feedbackTimeout(() => {
			feedbackElement.classList.remove('error');
		});
		return null;
	}
}
