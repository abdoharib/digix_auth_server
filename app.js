const puppeteer = require('puppeteer');
let result = null;
let browser = null;


const minimal_args = [
	'--autoplay-policy=user-gesture-required',
	'--disable-background-networking',
	'--disable-background-timer-throttling',
	'--disable-backgrounding-occluded-windows',
	'--disable-breakpad',
	'--disable-client-side-phishing-detection',
	'--disable-component-update',
	'--disable-default-apps',
	'--disable-dev-shm-usage',
	'--disable-domain-reliability',
	'--disable-extensions',
	'--disable-features=AudioServiceOutOfProcess',
	'--disable-hang-monitor',
	'--disable-ipc-flooding-protection',
	'--disable-notifications',
	'--disable-offer-store-unmasked-wallet-cards',
	'--disable-popup-blocking',
	'--disable-print-preview',
	'--disable-prompt-on-repost',
	'--disable-renderer-backgrounding',
	'--disable-setuid-sandbox',
	'--disable-speech-api',
	'--disable-sync',
	'--hide-scrollbars',
	'--ignore-gpu-blacklist',
	'--metrics-recording-only',
	'--mute-audio',
	'--no-default-browser-check',
	'--no-first-run',
	'--no-pings',
	'--no-sandbox',
	'--no-zygote',
	'--password-store=basic',
	'--use-gl=swiftshader',
	'--use-mock-keychain'
];




   exports.app =  async ( { username, password, scopes, clientid, domain, region, type  }  ) => {
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: minimal_args
		});

		let page = await browser.newPage();

		await page.setRequestInterception(true);
		page.on('request', (req) => {
			if (req.resourceType() === 'image' ||req.resourceType() === 'css' ) {
				req.abort();
			} else {
				req.continue();
			}
		});
		if(type =="phone"){ username = '+' + username }
		await page.goto(`https://${domain}.auth.${region}.amazoncognito.com/login?client_id=${clientid}&response_type=code&scope=${scopes}&redirect_uri=https://www.google.com/`,
			{
				waitUntil: 'networkidle2'
			}
		);

	//	await page.waitForNavigation();
		//
		//


		await page.screenshot({ path: './screen.png' });
	
		//now we are in the sign in page
	
let url2 = await page.url();
		console.log(url2);

		await page.type("input[name='username']", username);
		await page.type('#signInFormPassword', password);

	//	await page.screenshot({ path: './screen2.png' });

		await page.click("input[name='signInSubmitButton']");

		await page.waitForNavigation();

		let url = await page.url();

		if (browser !== null) {
			await browser.close();
		
		}

		function getParameterByName(name, url) {
		    name = name.replace(/[\[\]]/g, '\\$&');
		        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			        results = regex.exec(url);
				    if (!results) return null;
				        if (!results[2]) return '';
					    return decodeURIComponent(results[2].replace(/\+/g, ' '));
					    }

		let code = getParameterByName('code', url)


		console.log(url);
		return code

	} catch (error) {
		console.log(error);
		if( typeof error == "object" ){
		return JSON.stringify(error)
		}
	}

};

