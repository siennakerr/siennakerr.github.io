$(document).ready(function() {
	$(function () {
		$('.menubutton, .mob-menu').on('click', function (e) {
			e.preventDefault();
			$('ul').stop().slideToggle();
		});

	})

	$('.menubutton, .mob-menu').click(function () {
		$('.bar').toggleClass('open');
		$('.dropdown-nav-links').stop().slideToggle('open');
	});

	// Elements
	var bannerEl = document.querySelector(".banner");
	var previousEl = document.querySelector(".previous");
	var nextEl = document.querySelector(".next");
	var linksEl = document.querySelector(".links");

	if (!linksEl) {
		return;
	}

	var imgLinks = linksEl.getElementsByTagName("a");

	// Data attributes
	var height = bannerEl.getAttribute("data-height");
	var width = bannerEl.getAttribute("data-width");
	var slideSpeed = bannerEl.getAttribute("data-slide-speed");
	var autoSlide = bannerEl.getAttribute("data-autoslide");
	var nextCursor = nextEl.getAttribute("data-next-cursor");
	var previousCursor = previousEl.getAttribute("data-previous-cursor");

	// Slider variables
	var totalImgs = imgLinks.length;
	var currentImgNumber = 1;
	var nextImgNumber = currentImgNumber + 1;
	var previousImgNumber = totalImgs;
	var randomImgNumber = 3;
	var currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
	var nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
	var previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
	var randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');

	// Set CSS to element or elements
	function setCSS(styles, elements) {
		if (elements.length > 1) {
			for (var i = 0; i < elements.length; i++) {
				Object.assign(elements[i].style, styles);
			}
		} else {
			Object.assign(elements.style, styles);
		}
	}

	// Set CSS before elements appear
	document.body.style.margin = '0';

	(function () {
		function fadeTo(element, speed, opacity) {
			setCSS({
				transition: 'opacity ' + speed + 'ms',
				opacity: opacity
			}, element);
		}

		function loadImg() {
			fadeTo(currentImg, slideSpeed, 1);
		}

		function nextImgFade() {
			fadeTo(currentImg, slideSpeed, 0);
			fadeTo(nextImg, slideSpeed, 1);
		}

		function previousImgFade() {
			fadeTo(currentImg, slideSpeed, 0);
			fadeTo(previousImg, slideSpeed, 1);
		}

		function randomImgFade() {
			fadeTo(currentImg, slideSpeed, 0);
			fadeTo(randomImg, slideSpeed, 1);
		}

		function boldText() {
			for (var i = 0; i < imgLinks.length; i++) {
				var currentHref = imgLinks[i].getAttribute('href');
				var opacity = currentImgNumber == currentHref ? 0.8 : 0.4;
				setCSS({ opacity: opacity }, imgLinks[i]);
			}
		}

		function imgLoop() {
			nextImgNumber = currentImgNumber + 1;
			previousImgNumber = currentImgNumber - 1;

			if (currentImgNumber == totalImgs) {
				nextImgNumber = 1;
			}

			if (currentImgNumber == 1) {
				previousImgNumber = totalImgs;
			}
		}

		function refreshImgs() {
			currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
			nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
			previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
			randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');
		}

		function callFunctions() {
			boldText();
			imgLoop();
			refreshImgs();
		}

		function restartInterval() {
			clearInterval(interval);
			interval = setInterval(loopImages, autoSlide);
		}

		function loopImages() {
			var event = document.createEvent('HTMLEvents');
			event.initEvent('click', 1, 0);
			nextEl.dispatchEvent(event);
		}

		// Iterate over all links
		// On link click, restart interval, and fade in that image
		for (var i = 0; i < imgLinks.length; i++) {
			imgLinks[i].onclick = function () {
				restartInterval();
				randomImgNumber = parseInt(this.getAttribute('href'));
				randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');
				randomImgFade();
				currentImgNumber = randomImgNumber;
				callFunctions();
				return false;
			};
		}

		// Iterate over previous and next elements
		// On click, check direction, fade next image in and assign current image number
		var previousAndNext = [previousEl, nextEl];
		for (var t = 0; t < previousAndNext.length; t++) {
			if (totalImgs > 1) {
				previousAndNext[t].onclick = function (e) {
					var direction = e.target.getAttribute('class');
					if (direction == "next") {
						nextImgFade();
						currentImgNumber = nextImgNumber;
					} else {
						previousImgFade();
						currentImgNumber = previousImgNumber;
					}
					restartInterval();
					callFunctions();
				};
			}
		}

		boldText();
		loadImg();

		// Only set interval if there is more than 1 image
		if (totalImgs > 1) {
			var interval = setInterval(loopImages, autoSlide);
		}
	})();
});
