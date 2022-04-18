//console.log('WASSUP');

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const excelToJson = require("convert-excel-to-json");
const fileUpload = require("express-fileupload");

//fileupload

const app = express();

const connectionString = "mongodb+srv://Karl:Lpcho123@cluster0.uamuz.mongodb.net/Natality?retryWrites=true&w=majority";

//parser
app.use(express.urlencoded({ extended: true }));

app.listen(3000, function () {
	console.log("listening to port 3000");
});

//app.get(endpoint, callback)

// app.get('/', function(req, res)  {
//     res.sendFile(__dirname + '/public/pages/death.ejs')
//  })

app.use(
	fileUpload({
		createParentPath: true,
	})
);

MongoClient.connect(connectionString, {
	useUnifiedTopology: true,
})
	.then((client) => {
		//connects to the database
		console.log("Connected to Database");
		const db = client.db("Natality");
		const quotesCollection = db.collection("death");

		//middlewares
		app.set("view engine", "ejs");
		app.use("/", express.static(__dirname + "/public"));
		app.use("/", express.static(__dirname + "/views"));
		app.use("/", express.static(__dirname + "/uploads"));
		app.use(express.json());

		// Index Page Render
		app.get("/", (req, res) => {
			res.render("index.ejs");
		});

		//Death Page Render
		app.get("/death", (req, res) => {
			db.collection("death")
				.find()
				.toArray()
				.then((results) => {
					console.log("Death page Data retrieve");
					res.render("death.ejs", { death: results });
					//console.log({quotes: results});
				})
				.catch((error) => console.error(error));
			// ...
		});

		//Death Statistic Renderer
		app.get("/death-statistic", (req, res) => {
			db.collection("death")
				.aggregate([
					{
						$facet: {
							CategorizedByBarangay: [{ $unwind: "$Barangay" }],
						},
					},
				])
				.toArray()
				.then((results) => {
					console.log("Death Statistic page Data retrieve");
					res.render("death-statistic.ejs", { death: results });
					console.log(results);
				});
		});

		//Death Import Renderer
		app.get("/death-import", (req, res) => {
			res.render("death-import.ejs", { status: "" });
		});

		//submit death.ejs
		app.post("/death", (req, res) => {
			quotesCollection
				.insertOne(req.body)
				.then((result) => {
					console.log("Submitted to database");
					res.redirect("death");
				})
				.catch((error) => console.error(error));
		});

		//update death.ejs
		app.post("/update", (req, res) => {
			var findID = new ObjectID(req.body.id);
			var updateDOD = req.body.dateOfDeath;
			var updateFirstName = req.body.fname;
			var updateMiddleName = req.body.mname;
			var updateLastName = req.body.lname;
			var updateBirthday = req.body.bday;
			var updateAge = req.body.age;
			var updateICD10 = req.body.icd10;
			var updateCOD = req.body.causeofdeath;
			var updatePOD = req.body.placeofdeath;
			var updateBarangay = req.body.Barangay;

			quotesCollection
				.findOneAndUpdate(
					{ _id: findID },
					{
						$set: {
							dateOfDeath: updateDOD,
							fname: updateFirstName,
							mname: updateMiddleName,
							lname: updateLastName,
							bday: updateBirthday,
							age: updateAge,
							icd10: updateICD10,
							causeofdeath: updateCOD,
							placeofdeath: updatePOD,
							Barangay: updateBarangay,
						},
					},
					{
						upsert: true,
					}
				)
				.then((result) => {
					console.log("Update Succesful");
					res.redirect("death");
				})
				.catch((error) => console.error(error));
		});

		//Delete death.ejs
		app.post("/delete", (req, res) => {
			var findID = new ObjectID(req.body.delid);
			quotesCollection
				.deleteOne({ _id: findID })
				.then((result) => {
					if (result.deletedCount == 0) {
						console.log("No data to delete");
						return res.redirect("death");
					}
					console.log("Delete Succesful");
					res.redirect("death");
				})
				.catch((error) => console.error(error));
		});

		//Get File Directory
		app.post("/import", (req, res) => {
			var importAddress = req.files.myFile;
			//console.log(importAddress);

			const excelData = excelToJson({
				sourceFile: "./uploads/" + importAddress.name,
				sheets: [
					{
						// Excel Sheet Name
						name: "Sheet1",

						// Header Row -> be skipped and will not be present at our result object.
						header: {
							rows: 1,
						},

						// Mapping columns to keys
						columnToKey: {
							A: "dateOfDeath",
							B: "fname",
							C: "mname",
							D: "lname",
							E: "gender",
							F: "birthday",
							G: "age",
							H: "icd10",
							I: "causeofdeath",
							J: "placeofdeath",
							K: "Barangay",
						},
					},
				],
			});

			// -> Log Excel Data to Console
			console.log(excelData);

			try {
				if (!req.files) {
					console.log({
						status: false,
						message: "No file uploaded",
					});

					// do your thang
					res.redirect("death-import/?Status=Failed");
				} else {
					let myFile = req.files.myFile;

					myFile.mv("./uploads/" + myFile.name);

					console.log({
						status: true,
						message: "file is uploaded",
						data: {
							name: myFile.name,
							mimetype: myFile.mimetype,
							size: myFile.size,
						},
					});
					res.redirect("death-import/?Status=Success");
				}
			} catch (err) {
				res.status(500).send(err);
			}

			quotesCollection.insertMany(excelData.Sheet1, (err, res) => {
				if (err) throw err;

				console.log("Number of documents inserted: " + res.insertedCount);
			});
		});

		app.listen();
	})
	.catch((error) => console.error(error));
