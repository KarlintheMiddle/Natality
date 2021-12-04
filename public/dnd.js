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

window.addEventListener("load", function () {
	console.log("clicked");
	var url_string = window.location.href; //window.location.href
	var url = new URL(url_string);
	var c = url.searchParams.get("Status");
	console.log(c);
	var danger = document.getElementById("alertDanger");
	var success = document.getElementById("alertSuccess");
	if (c == "Failed") {
		danger.classList.add("show");
		danger.classList.remove("hide");
		success.classList.remove("show");
		success.classList.add("hide");
	} else if (c == "Success") {
		success.classList.add("show");
		success.classList.remove("hide");
		danger.classList.remove("show");
		danger.classList.add("hide");
	} else {
		success.classList.add("hide");
		danger.classList.add("hide");
	}
});

document.getElementById("previewFile").addEventListener("click", function (event) {
	var input = document.getElementById("drop-zone__input");
	var table = document.getElementById("tbody");
	var selectedFile = document.getElementById("drop-zone__input").files[0];
	console.log(selectedFile);
	if (selectedFile) {
		var fileReader = new FileReader();
		fileReader.onload = function (event) {
			var data = event.target.result;
			var workbook = XLSX.read(data, {
				type: "binary",
			});
			workbook.SheetNames.forEach((sheet) => {
				let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
				let jsonObject = JSON.stringify(rowObject);
				// console.log(jsonObject);
				var data = JSON.parse(jsonObject);

				// console.log(data);
				// Populate Table with the JSON

				//append_json(data, table);
				addData(data);
			});
		};
		fileReader.readAsBinaryString(selectedFile);
	}
});

function addData(json) {
	var mytable = $("#example").DataTable();

	json.forEach(function (object) {
		console.log(
			mytable.row
				.add([
					new Date(object.dateOfDeath),
					object.fname,
					object.mname,
					object.lname,
					object.gender,
					object.birthday,
					object.age,
					object.icd10,
					object.causeofdeath,
					object.placeofdeath,
					object.barangay,
				])
				.draw()
		);
	});
}

function append_json(json, table) {
	//refresh table
	// var i = 0;
	// json.forEach(function (object) {
	// 	function isOdd(num) {
	// 		return num % 2;
	// 	}
	// 	table.row.add(object);
	// var tr = document.createElement("tr");
	// if (i > 0) {
	// 	tr.classList.remove("");
	// }
	// i = i + 1;
	// console.log(i);
	// if (isOdd(i) == 1) {
	// 	tr.classList.add("odd");
	// } else if (isOdd(i) == 0) {
	// 	tr.classList.add("even");
	// }
	// tr.innerHTML =
	// 	"<td>" +
	// 	object.dateOfDeath +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.fname +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.mname +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.lname +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.gender +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.birthday +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.age +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.icd10 +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.causeofdeath +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.placeofdeath +
	// 	"</td>" +
	// 	"<td>" +
	// 	object.barangay +
	// 	"</td>";
	// table.appendChild(tr);
	// });
}
