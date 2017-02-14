(function () {
	var PDF = require('pdfkit');
	var fs = require('fs');
	var moment = require('moment');

	function pastCutoff(reportMonthYear){
		//reportMonth is a month year combination
		var cutoffDate = moment(reportMonthYear,"MM-YYYY");
		cutoffDate.add(1,'month').add(19, 'days');

		return !(+moment() <= +cutoffDate);
	}

	var generator = {
		generatePDF: function(formBody){

			var estName = formBody.estName;
			var estAddr1 = formBody.estAddr1;
			var estAddr2 = formBody.estAddr2;
			var licenseNum = formBody.licenseNum;
			var salesTaxID = formBody.salesTaxID;
			var reportMonthYear = formBody.reportMonthYear;
			//reportMonthYear should look like this -> "02/2017",
			// I was getting it from bootstrap datepicker3
			var grossSales = formBody.grossSales;

			var monthOfReport = moment(reportMonthYear,"MM-YYYY").format('MMMM');
			var yearOfReport = moment(reportMonthYear, "MM-YYYY").format('YYYY');

			var taxDue = grossSales * .03;
			var pmtMadeOn = moment().format("MMM Do YYYY");
			var vendorCompensation =
				pastCutoff(reportMonthYear) ? 0.00 : parseFloat(taxDue*.03).toFixed(2);

			var totalTaxes = taxDue - vendorCompensation;

			var penalty = function() {
				if(pastCutoff(reportMonthYear)){
					if ((taxDue*.10)> 100) {
						return taxDue*.10;
					} else {return 100}
				} else {return 0}
			};

			var interest = function (){
				var today = moment();
				var monthCutoff = moment(reportMonthYear,"MM-YYYY").add(1,'months');
				var monthsLate = today.diff(monthCutoff, 'months');
				var interestPerMonth = 0.00542 * (taxDue + penalty());
				var val = monthsLate * interestPerMonth;

				return val > 0 ? val : 0;
			};

			var total = totalTaxes + penalty() + interest();

			// Now that we have all our calculations, lets build the pdf.
			doc = new PDF();
			var pdfName = estName + "_" + moment(reportMonthYear,"MM-YYYY").format('YYYY-MM');
			doc.pipe(fs.createWriteStream('./public/pdfs/' + pdfName + '.pdf'));  //creating a write stream


			doc.image('./pdfs/templates/accAlcoholExcise.jpg', 0,0, {width: 650})
				.text(estName,200,182)
				.text(estAddr1, 200,211)
				.text(estAddr2, 200,235)
				.text(licenseNum, 330, 270)
				.text(salesTaxID, 250, 298)
				.text(monthOfReport,190, 328)
				.text(yearOfReport, 340, 328)
				.text(pmtMadeOn, 190, 357)
				.text(Number(grossSales).toFixed(2), 400, 380)
				.text(taxDue.toFixed(2), 400, 418)
				.text(vendorCompensation, 400, 453)
				.text(totalTaxes.toFixed(2), 400, 487)
				.text(penalty().toFixed(2), 400, 523)
				.text(interest().toFixed(2), 400, 559)
				.text(total.toFixed(2), 400, 593)
				.text(moment().format("MMM Do YYYY"), 450, 694);

			doc.end(); //we end the document writing.
		}
	};

	module.exports = generator;

})();