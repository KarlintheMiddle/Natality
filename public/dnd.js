document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
	const dropZoneElement = inputElement.closest(".drop-zone");

	dropZoneElement.addEventListener("click", (e) => {
		inputElement.click();
	});

	inputElement.addEventListener("change", (e) => {
		if (inputElement.files.length) {
			updateThumbnail(dropZoneElement, inputElement.files[0]);
		}
	});

	dropZoneElement.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZoneElement.classList.add("drop-zone--over");
	});

	["dragleave", "dragend"].forEach((type) => {
		dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove("drop-zone--over");
		});
	});

	dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();

		if (e.dataTransfer.files.length) {
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
		}

		dropZoneElement.classList.remove("drop-zone--over");
	});
});

function updateThumbnail(dropZoneElement, file) {
	let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
	let inputFileValue = dropZoneElement.querySelector(".drop-zone__input");

	//console.log(file.type.endsWith("sheet"));
	if (dropZoneElement.querySelector(".drop-zone__promt")) {
		dropZoneElement.querySelector(".drop-zone__promt").remove();
	}

	if (!thumbnailElement) {
		thumbnailElement = document.createElement("div");
		thumbnailElement.classList.add("drop-zone__thumb");
		dropZoneElement.appendChild(thumbnailElement);
	}

	thumbnailElement.dataset.label = file.name;

	if (file.type.startsWith("image/")) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
		};
	} else if (file.type.endsWith("sheet")) {
		thumbnailElement.style.backgroundImage = "url('image/excel.png')";
	} else {
		thumbnailElement.style.backgroundImage = null;
	}
}

function showAlert() {
	document.getElementById("uploadFile").addEventListener("click", function () {
		var url_string = window.location.href; //window.location.href
		var url = new URL(url_string);
		var c = url.searchParams.get("Status");
		console.log(c);
		console.log("clicked");
	});

	// document.getElementById("uploadFile").addEventListener("click", function () {
	// 	console.log("clicked");
	// 	var url_string = window.location.href; //window.location.href
	// 	var url = new URL(url_string);
	// 	var c = url.searchParams.get("status");
	// 	console.log(c);
	// 	var danger = document.getElementById("alertDanger");
	// 	var success = document.getElementById("alertSuccess");
	// 	if (c == "Failed") {
	// 		danger.classList.add("show");
	// 		danger.classList.remove("hide");
	// 		success.classList.remove("show");
	// 		success.classList.add("hide");
	// 	} else if (c == "Success") {
	// 		success.classList.add("show");
	// 		success.classList.remove("hide");
	// 		danger.classList.remove("show");
	// 		danger.classList.add("hide");
	// 	} else {
	// 		success.classList.add("hide");
	// 		danger.classList.add("hide");
	// 	}
	// });
}
