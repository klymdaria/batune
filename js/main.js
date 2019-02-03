function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return minutes + ":" + seconds;
}

;
(function () {
	"use strict";

	const xhr = new XMLHttpRequest();
	const loader = document.querySelector('.preloader-wrapper');

	const tunesList = document.querySelector('.ba-tunes-list'),
		tuneTmpl = document.querySelector('#tune-tmpl').innerHTML;

	let tuneListHTML;


	xhr.onload = function () {
		let ajax = this;

		const data = JSON.parse(ajax.response);
		const tunes = data.results;

		console.log(data);

		tuneListHTML = '';

		tunes.forEach(function (tune) {
			//Create tune card from tmpl and result data

			let duration = msToTime(tune.trackTimeMillis);
			let largeImg = tune.artworkUrl100.replace('100x100', '600x600');

			tuneListHTML += tuneTmpl
				.replace(/{{artworkUrl100}}/ig, largeImg)
				.replace(/{{collectionName}}/ig, tune.collectionName)
				.replace(/{{duration}}/ig, duration)
				.replace(/{{artistName}}/ig, tune.artistName)
				.replace(/{{previewUrl}}/ig, tune.previewUrl)
				.replace(/{{trackName}}/ig, tune.trackName)
				.replace(/{{trackId}}/ig, tune.trackId)
				.replace(/{{collectionName}}/ig, tune.collectionName)
				.replace(/{{primaryGenreName}}/ig, tune.primaryGenreName)
				.replace(/{{collectionPrice}}/ig, tune.collectionPrice)
				.replace(/{{collectionViewUrl}}/ig, tune.collectionViewUrl);

		});
		//Insert tune list into HTML doc
		setTimeout(() => {
			tunesList.innerHTML = tuneListHTML;
			loader.classList.remove('active');
			
		}, 1000); //Delay showing result and loader
	}




	const form = document.querySelector('.ba-search-form');
	let query,
		url;



	form.addEventListener('submit', function (e) {
		e.preventDefault();


		//Clear previouse search result
		tunesList.innerHTML = '';
		loader.classList.add('active');

		query = form['search-query'].value;
		url = `https://itunes.apple.com/search?term=${query}&limit=12`

		xhr.open('GET', url);
		xhr.send();

	});

	tunesList.addEventListener('click', function (e) {

		e.preventDefault();
		const actionButton = e.target;

		if (actionButton.dataset.action !== 'play') return;

		const audioId = actionButton.dataset.id,
			audio = document.getElementById(audioId);

		const allAudios = document.querySelectorAll('audio');

		allAudios.forEach(function (audioItem) {
			if (audioItem != audio) {
				audioItem.pause();
			}

		});

		audio.paused ? audio.play() : audio.pause();

		const allPlayBtn = document.querySelectorAll('[data-action="play"]');

		allPlayBtn.forEach(btnItem => {

			if (btnItem != actionButton) {
				btnItem.classList.remove('pulse');
			}

		});

		actionButton.classList.toggle('pulse');


	});


})();