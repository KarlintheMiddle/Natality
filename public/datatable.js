$(document).ready(function () {
	var table = $("#example").DataTable({
		dom: "Bfrtip",
		buttons: ["csv", "print"],
	});

	$("#example tbody").on("click", "tr", function () {
		console.log(table.row(this).data());

		document.getElementById("dbID").value = table.row(this).data()[0];
		document.getElementById("updod").value = table.row(this).data()[1];
		document.getElementById("upfname").value = table.row(this).data()[2];
		document.getElementById("upmname").value = table.row(this).data()[3];
		document.getElementById("uplname").value = table.row(this).data()[4];
		document.getElementById("upsex").value = table.row(this).data()[5];
		document.getElementById("upbday").value = table.row(this).data()[6];
		document.getElementById("upage").value = table.row(this).data()[7];
		document.getElementById("upicd10").value = table.row(this).data()[8];
		document.getElementById("upcod").value = table.row(this).data()[9];
		document.getElementById("uppod").value = table.row(this).data()[10];
		document.getElementById("upbarangay").value = table.row(this).data()[11];

		document.getElementById("delID").value = table.row(this).data()[0];
		document.getElementById("deldod").value = table.row(this).data()[1];
		document.getElementById("delfname").value = table.row(this).data()[2];
		document.getElementById("delmname").value = table.row(this).data()[3];
		document.getElementById("dellname").value = table.row(this).data()[4];
		document.getElementById("delsex").value = table.row(this).data()[5];
		document.getElementById("delbday").value = table.row(this).data()[6];
		document.getElementById("delage").value = table.row(this).data()[7];
		document.getElementById("delicd10").value = table.row(this).data()[8];
		document.getElementById("delcod").value = table.row(this).data()[9];
		document.getElementById("delpod").value = table.row(this).data()[10];
		document.getElementById("delbarangay").value = table.row(this).data()[11];
	});

	$("#example tbody").on("click", "tr", function () {
		$("#example tbody > tr").removeClass("selected");
		$(this).addClass("selected");
	});
});
