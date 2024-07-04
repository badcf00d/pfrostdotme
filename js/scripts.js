function initAddressBarAnimation()
{
	var frameIndex = 0
	var frameCount = 0
	var advanceRight = true
	var countUp = true
	const animationFrames = [
		'(•_•)', 10,
		'(\u0701•_•)', 12,
		'(\u0701•_•)>⌐◾-◾', 13,
		'(\u0701•⌐)>-◾', 14,
		'(\u0701◾_◾)', 15,
		'(◾_◾)', 25
	];

	if (window.location.pathname.includes("boids"))
	{
		return;
	}

	setInterval(function() 
	{ 
		let frameUpdate = (decodeURI(window.location.hash) != ('#' + animationFrames[frameIndex]))
		
		if (frameUpdate == true)
		{
			window.location.replace('#' + animationFrames[frameIndex])
		}

		
		if (frameIndex >= (animationFrames.length - 2)) {
			advanceRight = false;
		} else if (frameIndex <= 0) {
			advanceRight = true;
		}

		if (frameCount >= animationFrames[(animationFrames.length - 1)]) {
			countUp = false;
		} else if (frameCount <= 0) {
			countUp = true;
		}

		if ((frameCount >= animationFrames[frameIndex + 1]) && (advanceRight == true)) {
			frameIndex += 2
		} else if ((frameCount <= animationFrames[frameIndex - 1]) && (advanceRight == false)) {
			frameIndex -= 2
		}

		frameCount += countUp ? 1 : -1
	}, 100);
}

function initTypewritter()
{
	const lines = [
		"What... is the capital of Assyria?",
		"'Tis but a scratch!",
		"some farcical aquatic ceremony.",
		"Right. One... two... five!",
		"It's just a flesh wound.",
		"Ni!",
		"Help! Help! I'm being repressed!",
		"We're an anarcho-syndicalist commune",
		"A scratch? Your arm's off!",
		"You've got no arms left!",
		"What have the Romans ever done for us?",
		"Yippee-ki-yay.",
		"Life is like a box of chocolates.",
		"Run, Forrest! Run!",
		"Pining for the fjords",
		"This... is an ex parrot",
		"They'll never take our freedom!",
		"Are you not entertained‽",
		"It's one louder than 10",
		"The Royale with cheese.",
		"Wax on, wax off.",
		"hello world",
		"0xDEADBEEF",
		"Good morning Vietnam!",
		"My precious.",
		"It's alive!",
		"Go ahead, make my day.",
		"Do I feel lucky?",
		"I'm having an old friend for dinner.",
		"Shaken, not stirred.",
		"We don't need roads.",
		"Say hello to my little friend!",
		"And don't call me Shirley.",
		"Here's Johnny!",
		"Houston, we have a problem.",
		"You can't handle the truth!",
		"I'll be back.",
		"Why... so... serious?",
		"I am your father.",
		"You don't talk about Fight Club.",
		"You're gonna need a bigger boat.",
		"Good luck, we're all counting on you.",
		"foobar",
		"0xA5A5A5A5",
		"undefined reference",
		"#define + -",
		"precise bus fault",
		"imprecise bus fault",
		"for (uint8_t i = 0; i < 256; i++) {}",
		"you can't fight in here, this is the war room!",
		"0x8BADF00D",
		"Sometimes, I dream about cheese"
	];
	const numSpins = 4;
	const typeInverval = 80;
	var frameCount = 0;
	var jumboTxt = lines[Math.floor(Math.random() * lines.length)] + " ";
	var jumbotronElement = document.getElementsByClassName("style-jumbotron")[0];
	var jumbotronTimer;

	if (jumbotronElement) 
	{
		if (jumbotronElement.title.length > 0)
		{
			jumboTxt = jumbotronElement.title;
		}
		jumbotronTimer = setInterval(jumbotronTypewriter, typeInverval);
	}


	function jumbotronTypewriter() 
	{ 
		if (frameCount < numSpins)
		{
			switch (jumbotronElement.innerText) {
				case '|':
					jumbotronElement.innerText = '/';
					break;
				case '/':
					jumbotronElement.innerText = '—';
					break;
				case '—':
					jumbotronElement.innerText = '\\';
					break;
				case '\\':
					jumbotronElement.innerText = '|';
					frameCount++;
					break;
			}
		}
		else if (frameCount == numSpins)
		{
			jumbotronElement.innerText = '';
			frameCount++;
		}
		else
		{
			if (jumbotronElement.innerText.length < jumboTxt.length) 
			{
				jumbotronElement.innerText += jumboTxt.charAt(jumbotronElement.innerText.length);
			} else {
				clearInterval(jumbotronTimer);
			}
			frameCount++;
		}
	}
}

initTypewritter();
initAddressBarAnimation();

