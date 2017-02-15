# Exciser
Excise is a web app to assist restaurant and bars owners in paying their monthly liquor sales tax.

### Current Process
On a monthly basis, owners have to do the following:

* Find and print the Excise Tax Form PDF provided through their county government.
* Do basic calculations of tax due based on their tax bracket and sales.
* Submit the PDF & provide documentation of sales.
* Write a check for the calculated amount.
* Snail mail both the printed PDF and check to their commissioner's office before the due date or be penalized.

### Automating the Process with Exciser
* The user creates an account on Exciser, which includes all data to be resused on a monthly basis (Business Name & Address, Tax ID & Bracket, etc)
* Payment Process:
    * Login
    * Enter Sales Amount
    * Upload Sales Documentation
    * Submit with Lob api or print prefilled PDF to be mailed.

### Frameworks & APIs
* MEAN Stack
    * Passport
* Bootstrap 4
* PDFkiut
