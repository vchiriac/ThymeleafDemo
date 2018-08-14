var timer = 30;
var timer_b = 10;

var a = "";
var b = "";

var ikeaFamilyCardValidatorUrl = "/kiosk/ikea/rest/customer/validate/card/";
var ikeaPhoneValidatorUrl = "/kiosk/ikea/rest/customer/validate/phone/";
var postalCodesUrl = "/kiosk/ikea/rest/postalcodes/";
var translationsUrl = "/kiosk/ikea/rest/translations/get?key=";
var otherHousingUrl = "/kiosk/ikea/rest/otherhousing";
var bankAccountValidatorUrl = "/kiosk/ikea/rest/customer/validate/account/";

var months = [
    {name: "Jan", value: 1},
    {name: "Feb", value: 2},
    {name: "Mar", value: 3},
    {name: "Apr", value: 4},
    {name: "May", value: 5},
    {name: "Jun", value: 6},
    {name: "Jul", value: 7},
    {name: "Aug", value: 8},
    {name: "Sep", value: 9},
    {name: "Oct", value: 10},
    {name: "Nov", value: 11},
    {name: "Dec", value: 12}
    ];

window.onload = function () {
    startTimer();
};

function startTimer() {
    a = setTimeout(displayBox, 1000);
}

function displayBox() {
    if (timer === 0) {
        var expirationMessage = $('#expirationMessage')[0].value;
        var expirationTime = $('#expirationTime')[0].value;
        $.colorbox({
            width: "50%",
            html: expirationMessage + "&nbsp;<span id='timer'>10</span>&nbsp;" + expirationTime
        });
        reloadForm();
    } else {
        timer--;
        a = setTimeout(displayBox, 1000);
    }
}

function reloadForm() {
    if (timer_b === 0) {
        window.location.href = '/kiosk/ikea';
    } else {
        timer_b--;
        $("#timer").html(timer_b);
        b = setTimeout(reloadForm, 1000);
    }
}

function resettimer() {
    if (timer === 0) {
        $.colorbox.close();
        timer = 30;
        timer_b = 10;
        a = setTimeout(displayBox, 1000);
    } else {
        timer = 30;
        timer_b = 10;
    }
    clearTimeout(b);
}

function showPartnerDetailsTab(status) {
    var partnerDetailsPanel = $('#partner-details');
    if (status === "MARRIED" || status === "COHABITANT") {
        selectDefaultValuesForPartner();
        partnerDetailsPanel.show();
    } else {
        partnerDetailsPanel.hide();
    }
}

function displayChildrenPanel(ev) {
    var childrenDataPanel = $('#dependent-children');
    if (ev.value === "true") {
        childrenDataPanel.show();
    } else {
        var childrenNumber = $('#childrenNumber')[0];
        childrenNumber.value = 0;
        childrenDataPanel.hide();
    }
}

function displayOthersPanel(ev) {
    var othersDataPanel = $('#dependant-others');
    if (ev.value === "true") {
        othersDataPanel.show();
    } else {
        var othersInChargeNumber = $('#dependantsNumber')[0];
        othersInChargeNumber.value = 0;
        othersDataPanel.hide();
    }
}

function displayDefaultPartnerTab(ev) {
    var partnerDetailsPanel = $('#partner-details');
    if(partnerDetailsPanel.is(":hidden")) {
        var defaultSelectedStatus = $('#SINGLE');
        defaultSelectedStatus[0].checked = true;
    }

    var dateFormat = '99/99/9999';
    var ownerBirthDate = $('#birthDate');
    var partnerBirthDate = $('#partnerBirthDate');
    ownerBirthDate.mask(dateFormat);
    partnerBirthDate.mask(dateFormat);
}

function selectDefaultValues() {

    var cellPrefixOptions = $('#cellPrefix')[0].options;
    $.each(cellPrefixOptions, function (index, value) {
        if (value.getAttribute('name') === "true") {
            value.defaultSelected = true;
        }
    });

    var countries = $('#countries')[0].options;
    $.each(countries, function (index, value) {
        if (value.getAttribute('defaultselected') === "true") {
            value.defaultSelected = true;
        }
    });
}

function selectDefaultValuesForPartner() {
    var cellPrefixPartnerOptions = $('#partnerCellPrefix')[0].options;
    $.each(cellPrefixPartnerOptions, function (index, value) {
        if (value.getAttribute('name') === "true") {
            value.defaultSelected = true;
        }
    });
}

function selectDefaultValuesProfessionalSituation() {
    var divEmployerInfo = $('#div-employer-info');
    var divPartnerEmployer = $('#partner-employer-info');
    var form = $('#professional-data-form')[0];
    if (!divEmployerInfo.is(":hidden")) {
        var postalCode = form.postalCode.value;
        var selectedCountry = $("#countries option:selected").val();
        $.getJSON(postalCodesUrl + selectedCountry, {ajax: 'true'}, function (data) {
            if (data.length === 0) {
                $('#div-select-postal-codes').hide();
                $('#div-input-postal-code').show();
                $('#inputPostalCode')[0].value = postalCode;
            } else {
                $('#div-select-postal-codes').show();
                $('#div-input-postal-code').hide();
                $('#postalCodes').children('option:not(:first)').remove();
                $.each(data, function (index, item) {
                    if(item.value === postalCode) {
                        $('#postalCodes').append($("<option selected></option>").text(item.text).val(item.value));
                    } else {
                        $('#postalCodes').append($("<option></option>").text(item.text).val(item.value));
                    }
                });
            }
        });
    }

    if (!divPartnerEmployer.is(":hidden")) {
        var partnerPostalCode = form.partnerPostalCode.value;
        var selectedCountryPartner = $("#partnerCountries option:selected").val();
        $.getJSON(postalCodesUrl + selectedCountryPartner, {ajax: 'true'}, function (data) {
            if (data.length === 0) {
                $('#div-select-partner-postal-codes').hide();
                $('#div-input-partner-postal-code').show();
                $('#inputPartnerPostalCode')[0].value = partnerPostalCode;
            } else {
                $('#div-select-partner-postal-codes').show();
                $('#div-input-partner-postal-code').hide();
                $('#partnerPostalCodes').children('option:not(:first)').remove();
                $.each(data, function (index, item) {
                    if(item.value === partnerPostalCode) {
                        $('#partnerPostalCodes').append($("<option selected></option>").text(item.text).val(item.value));
                    } else {
                        $('#partnerPostalCodes').append($("<option></option>").text(item.text).val(item.value));
                    }
                });
            }
        });
    }
}

// Contract types ----------------------------------------------------------------
function displayContractType(ev) {
    var contractTypeDiv = $('#div-contract-type');
    var contractTypeSelection = $('#contractType');
    var employerDiv = $('#div-employer-info');
    for (var i = 0; i < ev.options.length; i++) {
        if (ev.options[i].selected) {
            var displayContractType = ev.options[i].getAttribute('name');
            if (displayContractType === "true") {
                contractTypeDiv.show();
                employerDiv.show();
            } else {
                clearSelectedEmployerInfo();
                contractTypeDiv.hide();
                employerDiv.hide();
                contractTypeSelection.init(0)[0].value = "0";
            }
        }
    }
}

function clearSelectedEmployerInfo() {
    $('#inputEmployerName')[0].value = "";
    $('#countries')[0].value = "";
    $('#inputEmployerAddress')[0].value = "";
    $('#inputPostalCode')[0].value = "";
    $('#employerPhone')[0].value = "";
    $('#postalCodes')[0].value = "";
}

function clearSelectedPartnerEmployerInfo() {
    $('#inputPartnerEmployerName')[0].value = "";
    $('#partnerCountries')[0].value = "";
    $('#inputPartnerEmployerAddress')[0].value = "";
    $('#inputPartnerPostalCode')[0].value = "";
    $('#employerPartnerPhone')[0].value = "";
    $('#partnerPostalCodes')[0].value = "";
}

function displayPartnerContractType(ev) {
    var contractTypeDiv = $('#div-partner-contract-type');
    var contractTypeSelection = $('#partnerContractType');
    var employerPartnerDiv = $('#partner-employer-info');
    for (var i = 0; i < ev.options.length; i++) {
        if (ev.options[i].selected) {
            var displayContractType = ev.options[i].getAttribute('name');
            if (displayContractType === "true") {
                contractTypeDiv.show();
                employerPartnerDiv.show();
            } else {
                clearSelectedPartnerEmployerInfo();
                employerPartnerDiv.hide();
                contractTypeDiv.hide();
                contractTypeSelection.init(0)[0].value = "0";
            }
        }
    }
}
// Contract types ----------------------------------------------------------------
// Postal codes ------------------------------------------------------------------
function displayPostalCodes(ev) {
    var selectedCountry = $("#countries option:selected").val();
    $('#postalCodes').children('option:not(:first)').remove();
    $.getJSON(postalCodesUrl + selectedCountry, {ajax: 'true'}, function (data) {
        if (data.length === 0) {
            $('#div-select-postal-codes').hide();
            $('#div-input-postal-code').show();
        } else {
            $.each(data, function (index, item) {
                $('#postalCodes').append($("<option></option>").text(item.text).val(item.value));
            });
            $('#div-select-postal-codes').show();
            $('#div-input-postal-code').hide();
        }
    });
}
function displayPartnerPostalCodes(ev) {
    var selectedCountry = $("#partnerCountries option:selected").val();
    $('#partnerPostalCodes').children('option:not(:first)').remove();
    $.getJSON(postalCodesUrl + selectedCountry, {ajax: 'true'}, function (data) {
        if (data.length === 0) {
            $('#div-select-partner-postal-codes').hide();
            $('#div-input-partner-postal-code').show();
        } else {
            $.each(data, function (index, item) {
                $('#partnerPostalCodes').append($("<option></option>").text(item.text).val(item.value));
            });
            $('#div-select-partner-postal-codes').show();
            $('#div-input-partner-postal-code').hide();
        }
    });
}
// Postal codes ------------------------------------------------------------------

function getTranslation(message) {
    return $.ajax({
        type: "GET",
        url: translationsUrl + message,
        async: false
    }).responseText;
}

function validateIkeaFamilyCard(card) {
    return $.ajax({
        type: "GET",
        url: ikeaFamilyCardValidatorUrl + card,
        async: false
    }).responseText;
}

function validateIkeaCard(card) {
    return validateIkeaFamilyCard(card.value);
}

function validateIkeaPhone(prefix, phoneNumber) {
    return $.ajax({
        type: "GET",
        url: ikeaPhoneValidatorUrl + prefix + '/' + phoneNumber,
        async: false
    }).responseText;
}

function validateBankAccount(countryCode, accountNumber) {
    return $.ajax({
        type: "GET",
        url: bankAccountValidatorUrl + countryCode + '/' + accountNumber,
        async: false
    }).responseText;
}

function showFinancialPanel(status) {
    $('span#ACCESSING_OWNERSHIP')[0].className = "checkmark big_checkmark";
    $('span#OWNER')[0].className = "checkmark big_checkmark";
    $('span#RENTING')[0].className = "checkmark big_checkmark";
    $('span#HOUSED_BY_FAMILY')[0].className = "checkmark big_checkmark";
    $('span#HOUSED_BY_EMPLOYER')[0].className = "checkmark big_checkmark";
    $('span#OTHER')[0].className = "checkmark big_checkmark";

    var otherFinancialStatusPanel = $('#div-other-financial-status');
    if (status == 6) {
        otherFinancialStatusPanel.show();
    } else {
        $('#otherFinancialStatus')[0].value = '0';
        otherFinancialStatusPanel.hide();
    }
}

function checkHousingStatusIsOther() {
   return $('#OTHER')[0].checked;
}

function checkOneHousingStatusIsSelected() {
    return $('#OTHER')[0].checked || $('#ACCESSING_OWNERSHIP')[0].checked ||
        $('#OWNER')[0].checked || $('#RENTING')[0].checked ||
        $('#HOUSED_BY_FAMILY')[0].checked || $('#HOUSED_BY_EMPLOYER')[0].checked;
}

function checkHousingStatusIsAccessingOwnership() {
    return $('#ACCESSING_OWNERSHIP')[0].checked;
}

function checkHousingStatusIsRenting() {
    return $('#RENTING')[0].checked;
}

function displayDefaultFinancialStatus(ev) {
    var otherFinancialStatusPanel = $('#div-other-financial-status');
    if(checkHousingStatusIsOther()) {
        otherFinancialStatusPanel.show();
    }

    var ibanFormat = "";

    var iban = $('#iban')[0];
    if (iban.value.length > 0 ) {
        $('#inputBankAccount')[0].value = iban.value.substring(2);
    }

    var countryCodes = $("#countryCode")[0];
    if(countryCodes !== undefined) {
        var inputBankAcct = $("#inputBankAccount");
        $.each(countryCodes, function (index, country) {
            if (country.getAttribute('defaultSelected') === "true") {
                ibanFormat = country.getAttribute('ibanFormat');
            }
        });
        inputBankAcct.mask(ibanFormat);
    }
}

function displayOtherHousing() {
    $.getJSON(otherHousingUrl, {ajax: 'true'}, function (data) {
        if (data.length !== 0) {
            $('#otherFinancialStatus').children('option:not(:first)').remove();
            $.each(data, function (index, item) {
                $('#otherFinancialStatus').append($("<option></option>").text(item).val(item));
            });
        }
    });
}

function displayIkeaFamilyPopUp() {
    $.colorbox({
        width: "40%",
        html: "<h2 style='margin-top:0px;'>Carte IKEA FAMILY</h2>" +
        "<br/><br/>Si vous ne poss&eacute;dez pas encore de carte Ikea Family, merci d'en cr&eacute;er une au pr&eacute;alable &agrave; l'aide des bornes mises &agrave; votre disposition &agrave; cet effet.<br/>" +
        "<br/>Vous pourrez ensuite initier votre demande d'Ikea Family Mastercard en scannant le code-barres qui vous sera remis."
    });
}

function displayData(object) {
    console.log(JSON.stringify(object));
}

function checkLength(len, ele) {
    var fieldLength = ele.value.length;
    if (fieldLength <= len) {
        return true;
    } else {
        var str = ele.value;
        str = str.substring(0, str.length - 1);
        ele.value = str;
    }
}

function onChange(e) {
    if (e.keyCode < 48 || e.keyCode > 57) {
        console.log('not a number');
    }
}

$( document ).ready(function () {
    $("#countryCode").on('change', function (event) {
        var ibanFormat = event.target.selectedOptions[0].getAttribute('ibanFormat');
        $("#inputBankAccount").mask(ibanFormat);
    });
});

function digitOnly(evt) {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function alphaOnly(evt) {
    var theEvent = evt || window.event;
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /^[a-zA-Z-]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function dateOnly(evt) {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9/]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function validateFirstName(field) {
    var regex = /^[^-]*-?[^-]*$/;
    var fieldData = field.value;
    field.className = 'form-control';
    if(!regex.test(fieldData)) {
        field.className = 'form-control form-validation-error';
        return false;
    }
    return true;
}

function validateFirstNameAndReturnMessage(field) {
    var message = null;
    if(!validateFirstName(field)) {
        message = getTranslation('message.validation.ikea.family.customer.name.error');
    }
    return message;
}

function isNotEmpty(field) {
    var fieldData = field.value;
    field.className = 'form-control';
    if(fieldData.length == 0 && fieldData == "" || !fieldData) {
        field.className = 'form-control form-validation-error';
        return false;
    }
    return true;
}

function formatAsDate(field) {
    var fieldData = field.value;
    if(fieldData.substring(2,3) === '/' && fieldData.substring(5,6) === '/') {
        return true;
    }
    var screenDate = field.value.replace(/\//g, '');
    var day = screenDate.substring(0,2);
    var month = screenDate.substring(2,4);
    var year = screenDate.substring(4,8);
    fieldData = day + '/' + month + '/' + year;
    field.value = fieldData;
    return true;
}

function checkIfNotZero(field) {
    var fieldData = field.value;
    if(fieldData === "0") {
        field.className = 'form-control form-validation-error';
        return false;
    } else {
        field.className = 'form-control';
        return true;
    }
}

function checkMandatoryField(field) {
    var errMessage = '';
    if(!isNotEmpty(field)) {
        errMessage = 'message.validation.ikea.family.card.not.empty';
    }
    if(errMessage !== '') {
        showToastrMessage(getTranslation(errMessage), 'error');
        return false;
    }
    return true;
}

function validateEmail(field) {
    field.className = '';
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(field.value)) {
        field.className = 'form-validation-error';
        return false;
    }
    return true;
}

function checkDate(field) {
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    var yearNow = new Date().getFullYear();
    var screenDate = field.value.replace(/\//g, '');
    var day = parseInt(screenDate.substring(0,2) ,10);
    var month = parseInt(screenDate.substring(2,4), 10);
    var year = parseInt(screenDate.substring(4,8), 10);
    console.log(year);
    console.log(yearNow);
    var errMessage = null;
    field.className = 'form-control';
    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    if(year < 1000 || year > 3000 || month === 0 || month > 12 ||  day > monthLength[month - 1]) {
        errMessage = getTranslation('message.validation.ikea.family.date.invalid.format');
    }
    if(yearNow - year <= 0) {
        errMessage = getTranslation('message.validation.ikea.family.date.invalid.date');
    }
    if(yearNow - year > 75) {
        errMessage = getTranslation('message.validation.ikea.family.date.too.old');
    }
    if(yearNow - year < 18 && yearNow - year > 0) {
        errMessage = getTranslation('message.validation.ikea.family.date.too.young');
    }
    if(errMessage) {
        field.className = 'form-control form-validation-error';
    }
    return errMessage;
}

function validateJobSelector(field) {
    var fieldData = field.value;
    var errMessage = null;
    if(fieldData === "0" || !fieldData) {
        errMessage = getTranslation('message.validation.ikea.family.card.not.empty');
    }
    if(errMessage) {
        showToastrMessage(errMessage, 'error');
        field.className = 'styled-select select-validation-error';
        return false;
    } else {
        field.className = 'styled-select';
        return true;
    }
}

function validateForm(form) {
    if(form.id === 'scan-form') return validateScanForm(form);
    if(form.id === 'personal-data-form') return validatePersonalDataForm(form);
    if(form.id === 'professional-data-form') return validateProfessionalDataForm(form);
    if(form.id ==='financial-data-form') return validateFinancialDataForm(form);
}

function checkFromYear(field) {
    var errMessage = validateYear(field);
    if(errMessage) {
        showToastrMessage(getTranslation(errMessage), 'error');
        field.className = 'select-validation-error';
        return false;
    }
    var customerJobMothFrom =  $('#div-customer-job-month');
    var yearNow = new Date().getFullYear();
    var year = parseInt(field.value, 10);
    if(yearNow - year < 2) {
        customerJobMothFrom.show();
    } else {
        if (!customerJobMothFrom.is(":hidden")) {
            $('#inputFromMonth')[0].value = "0";
            customerJobMothFrom.hide();
        }
    }
    field.className = '';
    return true;
}

function validateYear(field) {
    var errMessage = null;
    var year = parseInt(field.value, 10);
    var yearNow = new Date().getFullYear();

    if(year > yearNow) {
        errMessage = 'message.validation.ikea.family.date.not.correct';
    } else {
        var customerBirthDate = $('#customerBirthDate')[0].value;
        var birthdayYear = parseInt(convertToYear(customerBirthDate), 10);
        if(year - birthdayYear < 16) {
            errMessage = 'message.validation.ikea.customer.startjob.date.error';
        }
    }
    return errMessage;
}

function checkFromPartnerYear(field) {
    var errMessage = validatePartnerYear(field);

    if(errMessage !== '') {
        showToastrMessage(getTranslation(errMessage), 'error');
        field.className = 'select-validation-error';
        return false;
    }

    var customerJobMothFrom =  $('#div-customer-partner-job-month');
    var year = parseInt(field.value, 10);
    var yearNow = new Date().getFullYear();
    if(yearNow - year < 2) {
        customerJobMothFrom.show();
    } else {
        if (!customerJobMothFrom.is(":hidden")) {
            $('#inputPartnerFromMonth')[0].value = "0";
            customerJobMothFrom.hide();
        }
    }
    field.className = '';
    return true;
}

function validatePartnerYear(field) {
    var errMessage = '';
    var year = parseInt(field.value, 10);
    var yearNow = new Date().getFullYear();

    if(year > yearNow) {
        errMessage = 'message.validation.ikea.family.date.not.correct';
    } else {
        var customerPartnerBirthDate = $('#customerPartnerBirthDate')[0].value;
        var birthdayYear = parseInt(convertToYear(customerPartnerBirthDate), 10);
        if(year - birthdayYear < 16) {
            errMessage = 'message.validation.ikea.customer.startjob.date.error';
        }
    }
    return errMessage;
}

function checkFromMonth(field) {
    var year = $('#inputFromYear')[0].value;
    if (field.id === "inputPartnerFromMonth") {
        year = $('#inputFromPartnerYear')[0].value;
    }
    var errMessage = checkMonth(field, year);
    field.className = 'styled-select';

    if(errMessage) {
        showToastrMessage(getTranslation(errMessage), 'error');
        field.className = 'styled-select select-validation-error';
        return false;
    }

    return true;
}

function checkMonth(field, year) {
    var month = parseInt(field.value, 10);
    var yearNow = new Date().getFullYear();
    var monthNow = new Date().getMonth();
    if(month < 1 || month > 12) {
        return 'message.validation.ikea.family.date.invalid.month.format';
    }
    if(year >= yearNow && month > monthNow + 1) {
        return 'message.validation.ikea.family.date.not.correct';
    }
    return null;
}

function checkFinancialYear(field) {
    var errMessage = null;
    field.className = '';
    var yearNow = new Date().getFullYear();
    var year = parseInt(field.value, 10);

    if(year > yearNow) {
        errMessage = 'message.validation.ikea.family.date.not.correct';
    }
    if(year < 1970) {
        errMessage = 'message.validation.ikea.family.year.invalid';
    }
    if(errMessage) {
        field.className = 'select-validation-error';
    }
    return errMessage;
}

$( document ).ready(function() {

    $('#ikeaFamilyCardNumber').bind('keyup','keydown', function(event) {
        var scanForm = $('#scan-form')[0];
        var element = $('#ikeaFamilyCardNumber')[0];
        var parent = $('#div-ikeaFamilyCardNumber')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#customerLastName').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#customerLastName')[0];
        var parent = $('#div-customer-first-name')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#customerFirstName').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#customerFirstName')[0];
        var parent = $('#div-customer-last-name')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#birthDate').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#birthDate')[0];
        var parent = $('#div-customer-birthday')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#email').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#email')[0];
        var parent = $('#div-customer-email')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#phone').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#phone')[0];
        var parent = $('#div-customer-phone')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#partnerName').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#partnerName')[0];
        var parent = $('#div-customer-partner-last-name')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#partnerFirstName').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#partnerFirstName')[0];
        var parent = $('#div-customer-partner-first-name')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#partnerBirthDate').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#partnerBirthDate')[0];
        var parent = $('#div-customer-partner-birth-date')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#partnerEmail').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#partnerEmail')[0];
        var parent = $('#div-customer-partner-email')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#partnerPhone').bind('keyup','keydown', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#partnerPhone')[0];
        var parent = $('#div-customer-partner-phone')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#childrenNumber').on('change', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#childrenNumber')[0];
        var parent = $('#dependent-children')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#dependantsNumber').on('change', function(event) {
        var scanForm = $('#personal-data-form')[0];
        var element = $('#dependantsNumber')[0];
        var parent = $('#dependant-others')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#situationProf').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#situationProf')[0];
        var parent = $('#div-professional-status')[0];
        clear_errors(parent, element, scanForm);
    });
    $('#inputFromYear').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#inputFromYear')[0];
        var parent = $('#div-customer-job-year')[0];
        clear_errors(parent, element, scanForm);
    });
    $('#inputFromMonth').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#inputFromMonth')[0];
        var parent = $('#div-customer-job-month')[0];
        clear_errors(parent, element, scanForm);
    });
    $('#contractType').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#contractType')[0];
        var parent = $('#div-contract-type')[0];
        clear_errors(parent, element, scanForm);
    });

    $('#inputEmployerName').bind('keyup','keydown', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#inputEmployerName')[0];
        var parent = $('#div-employer-name')[0];
        clear_errors(parent, element, scanForm);
    });

   $('#countries').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#countries')[0];
        var parent = $('#div-countries')[0];
        clear_errors(parent, element, scanForm);
    });
    $('#inputEmployerAddress').on('change', function(event) {
        var scanForm = $('#professional-data-form')[0];
        var element = $('#inputEmployerAddress')[0];
        var parent = $('#div-employer-address')[0];
        clear_errors(parent, element, scanForm);
    });

});

function clear_errors(parent, element, form) {
    var errors = form.querySelectorAll('.error_bubble');
    $.each(errors, function (index, error) {
        if(error && error.parentElement === parent) {
            parent.removeChild(error);
            setInitialClassName(element);
        }
    });
}
function setInitialClassName(element) {
    if (element.className.includes('form-control')) {
        element.className = 'form-control';
    } else {
        if(element.className.includes('small_number')) {
            element.className = 'small_number';
        } else {
            if(element.className.includes('styled-select')) {
                element.className = 'styled-select';
            }
        }
    }
}

function show_error_message(parent, message) {
    parent.insertAdjacentHTML("beforeend", "<span class='error_bubble'>"+ message + "</span>");
}

// validate ikea scan form
function validateScanForm(form) {
    var message = null;
    var ikeaFamilyCardNumber =  form.ikeaFamilyCardNumber;
    var parent = ikeaFamilyCardNumber.parentNode;
    ikeaFamilyCardNumber.className = 'form-control';

    if(!isNotEmpty(ikeaFamilyCardNumber)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        var error = validateIkeaCard(ikeaFamilyCardNumber);
        if (error) {
            message = getTranslation(error);
            ikeaFamilyCardNumber.className = 'form-control form-validation-error';
        }
    }
    if(message) {
        show_error_message(parent, message);
        return false;
    }
    return true;
}

// validate personal data form
function validatePersonalDataForm(form) {
    var errorMessages = [];
    var customerLastName = form.customerLastName;
    var customerFirstName = form.customerFirstName;
    var birthDate = form.birthDate;
    var email = form.email;
    var prefix = form.cellPrefix;
    var phone = form.phone;
    var message = null;
    var parent = null;

    // owner last name - there is a div switch between last name and first name
    parent = $('#div-customer-first-name')[0];
    if(!isNotEmpty(customerLastName)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
        errorMessages.push(message);
        show_error_message(parent, message);
    }
    // owner first name - there is a div switch between last name and first name
    parent = $('#div-customer-last-name')[0];
    message = null;
    if(!isNotEmpty(customerFirstName)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        message = validateFirstNameAndReturnMessage(customerFirstName);
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // owner birth date
    parent = $('#div-customer-birthday')[0];
    message = null;
    if(!isNotEmpty(birthDate)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        message = checkDate(birthDate);
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // owner e-mail
    message = null;
    parent = $('#div-customer-email')[0];
    if(!isNotEmpty(email)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        if(!validateEmail(email)) {
            message = getTranslation('message.dossier.professional.data.customer.wrong.email');
        }
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // owner phone number
    message = null;
    parent = $('#div-customer-phone')[0];
    if(!isNotEmpty(phone)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        message = validateIkeaPhone(prefix.value, phone.value);
        if (message) {
            phone.className = 'form-control form-validation-error';
        }
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    var partnerDetailsPanel = $('#partner-details');
    if (!partnerDetailsPanel.is(":hidden")) {
        var partnerLastName = form.partnerName;
        var partnerFirstName = form.partnerFirstName;
        var partnerBirthDate = form.partnerBirthDate;
        var partnerEmail = form.partnerEmail;
        var partnerPhone = form.partnerPhone;
        var partnerCellPrefix = form.partnerCellPrefix;

        // partner last name
        message = null;
        parent = $('#div-customer-partner-last-name')[0];
        if(!isNotEmpty(partnerLastName)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // partner first name
        message = null;
        parent = $('#div-customer-partner-first-name')[0];
        if(!isNotEmpty(partnerFirstName)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        } else {
            message = validateFirstNameAndReturnMessage(partnerFirstName);
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // partner birth date
        message = null;
        parent = $('#div-customer-partner-birth-date')[0];
        if(!isNotEmpty(partnerBirthDate)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        } else {
            message = checkDate(partnerBirthDate);
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // partner e-mail
        message = null;
        parent = $('#div-customer-partner-email')[0];
        if(!isNotEmpty(partnerEmail)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        } else {
            if(!validateEmail(partnerEmail)) {
                message = getTranslation('message.dossier.professional.data.customer.wrong.email');
            }
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // partner e-mail - here
        message = null;
        parent = $('#div-customer-partner-phone')[0];
        if(!isNotEmpty(partnerPhone)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        } else {
            message = validateIkeaPhone(partnerCellPrefix.value, partnerPhone.value);
            if (message) {
                phone.className = 'form-control form-validation-error';
            }
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }
    }

    // validate children in charge
    message = null;
    var childrenNumber = $('#childrenNumber');
    parent = $('#dependent-children')[0];
    if (!childrenNumber.is(":hidden") && form.childrenNumber.value === "0") {
        form.childrenNumber.className = 'small_number form-validation-error';
        message = getTranslation('message.validation.ikea.family.children.in.charge.error');
    } else {
        form.childrenNumber.className = 'small_number';
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // validate other persons in charge
    message = null;
    var dependantsNumber = $('#dependantsNumber');
    parent = $('#dependant-others')[0];
    if (!dependantsNumber.is(":hidden") && form.dependantsNumber.value === "0") {
        form.dependantsNumber.className = 'small_number form-validation-error';
        message = getTranslation('message.validation.ikea.family.others.in.charge.error');

    } else {
        form.dependantsNumber.className = 'small_number';
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    return errorMessages.length === 0;
}

// validate professional data form
function validateProfessionalDataForm(form) {
    var errorMessages = [];

    var situationProf = form.situationProf;
    var inputFromYear = form.inputFromYear;
    var parent = null;
    var message = null;

    // professional status
    parent = $('#div-professional-status')[0];
    if(situationProf.value === "0") {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
        situationProf.className = 'styled-select select-validation-error';
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // from year
    message = null;
    parent = $('#div-customer-job-year')[0];
    if(!isNotEmpty(inputFromYear)) {
        message = getTranslation('message.validation.ikea.family.card.not.empty');
    } else {
        var errMessage = validateYear(inputFromYear);
        if(errMessage) {
            form.inputFromYear.className = 'form-validation-error';
            message = getTranslation(errMessage);
        }
    }
    if(message) {
        errorMessages.push(message);
        show_error_message(parent, message);
    }

    // from month, in case selected year > current year - 2
    var customerMonthPanel = $('#div-customer-job-month');
    if (!customerMonthPanel.is(":hidden")) {
        message = null;
        parent = customerMonthPanel[0];
        if(form.inputFromMonth.value === "0") {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        } else {
            var invalidMonth = checkMonth(form.inputFromMonth, inputFromYear.value);
            if(invalidMonth) {
                message = getTranslation(invalidMonth);
            }
        }
        if(message) {
            form.inputFromMonth.className = "styled-select select-validation-error";
            errorMessages.push(message);
            show_error_message(parent, message);
        }
    }

    // customer contract type
    var customerContractType = $('#div-contract-type');
    if(!customerContractType.is(":hidden")) {
        message = null;
        parent = customerContractType[0];
        var contractType = form.contractType;
        if(contractType.value === '0') {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        }
        if(message) {
            contractType.className = "styled-select select-validation-error";
            errorMessages.push(message);
            show_error_message(parent, message);
        }
    } else {
        form.contractType.value = '';
    }

    // owner employer validation
    var employerInfoPanel = $('#div-employer-info');
    if(!employerInfoPanel.is(":hidden")) {
        var inputEmployerName = form.inputEmployerName;
        message = null;
        parent = $('#div-employer-name')[0];
        if(!isNotEmpty(inputEmployerName)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // owner employer country
        var countries = form.countries;
        message = null;
        parent = $('#div-countries')[0];
        if(countries.value === '0') {
            countries.className = 'styled-select select-validation-error';
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // owner employer address
        message = null;
        parent = $('#div-employer-address')[0];
        if(!isNotEmpty(form.inputEmployerAddress)) {
            message = getTranslation('message.validation.ikea.family.card.not.empty');
        }
        if(message) {
            errorMessages.push(message);
            show_error_message(parent, message);
        }

        // employer postal codes
        var divPostalCodePanel = $('#div-select-postal-codes');
        if(!divPostalCodePanel.is(":hidden")) {
            if(form.postalCodes.value === '0') {
                form.postalCodes.className = 'select-validation-error';
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            } else {
                form.postalCode.value = form.postalCodes.value;
            }
        }
        var manualPostalCodePanel = $('#div-input-postal-code');
        if(!manualPostalCodePanel.is(":hidden")) {
            if(!isNotEmpty(form.inputPostalCode)) {
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            } else {
                form.postalCode.value = form.inputPostalCode.value;
            }
        }
        var employerPhone = form.employerPhone;
        var employerCellPrefix = form.employerCellPrefix;
        if(!isNotEmpty(employerPhone)) {
            errorMessages.push('message.validation.ikea.family.card.not.empty');
        } else {
             message = validateIkeaPhone(employerCellPrefix.value, employerPhone.value);
            if (message) {
                employerPhone.className = 'form-control form-validation-error';
                errorMessages.push(message);
            }
        }
    }

    var partnerInfoPanel = $('#div-partner-info');
    if(!partnerInfoPanel.is(":hidden")) {
        var situationProfPartner = form.situationProfPartner;
        if(situationProfPartner.value === '0') {
            situationProfPartner.className = 'select-validation-error';
            errorMessages.push('message.validation.ikea.family.card.not.empty');
        }
        if(!isNotEmpty(form.inputFromPartnerYear)) {
            errorMessages.push('message.validation.ikea.family.card.not.empty');
        } else {
             errMessage = validatePartnerYear(form.inputFromPartnerYear);
            if(errMessage !== '') {
                form.inputFromPartnerYear.className = 'form-validation-error';
                errorMessages.push(errMessage);
            }
        }
        var customerPartnerMonthPanel = $('#div-customer-partner-job-month');
        if (!customerPartnerMonthPanel.is(":hidden")) {
            if(form.inputPartnerFromMonth.value === "0") {
                form.inputPartnerFromMonth.className = "form-validation-error";
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            }
            var invalidPartnerMonth = checkMonth(form.inputPartnerFromMonth, form.inputFromPartnerYear.value);
            if(invalidPartnerMonth) {
                form.inputPartnerFromMonth.className = 'form-validation-error';
                errorMessages.push(invalidPartnerMonth);
            }
        }
        var customerPartnerContractType = $('#div-partner-contract-type');
        if(!customerPartnerContractType.is(":hidden")) {
            var partnerContractType = form.partnerContractType;
            if(partnerContractType.value === '0') {
                partnerContractType.className = 'select-validation-error';
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            }
        } else {
            form.partnerContractType.value = '';
        }
        var partnerEmployerInfoPanel = $('#partner-employer-info');
        if(!partnerEmployerInfoPanel.is(":hidden")) {
            if(!isNotEmpty(form.inputPartnerEmployerName)) {
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            }
            var partnerCountries = form.partnerCountries;
            if(partnerCountries.value === '0') {
                partnerCountries.className = 'select-validation-error';
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            }
            if(!isNotEmpty(form.inputPartnerEmployerAddress)) {
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            }
            var divPartnerPostalCodes = $('#div-select-partner-postal-codes');
            if(!divPartnerPostalCodes.is(":hidden")) {
                if(form.partnerPostalCodes.value === '0') {
                    form.partnerPostalCodes.className = 'select-validation-error';
                    errorMessages.push('message.validation.ikea.family.card.not.empty');
                } else {
                    form.partnerPostalCode.value = form.partnerPostalCodes.value;
                }
            }
            var manualPartnerPostalCodePanel = $('#div-input-partner-postal-code');
            if(!manualPartnerPostalCodePanel.is(":hidden")) {
                if(!isNotEmpty(form.inputPartnerPostalCode)) {
                    errorMessages.push('message.validation.ikea.family.card.not.empty');
                } else {
                    form.partnerPostalCode.value = form.inputPartnerPostalCode.value;
                }
            }
            if(!isNotEmpty(form.employerPartnerPhone)) {
                errorMessages.push('message.validation.ikea.family.card.not.empty');
            } else {
                message = validateIkeaPhone(form.employerPartnerCellPrefix.value, form.employerPartnerPhone.value);
                if (message) {
                    form.employerPartnerPhone.className = 'form-control form-validation-error';
                    errorMessages.push(message);
                }
            }
        }
    } else {
        form.situationProfPartner.value = '';
    }

    return errorMessages.length === 0;
}

function validateFinancialDataForm(form) {
    var errorMessages = [];

    var checked = checkOneHousingStatusIsSelected();
    if (!checked) {
        $('span#ACCESSING_OWNERSHIP')[0].className = "checkmark big_checkmark select-validation-error";
        $('span#OWNER')[0].className = "checkmark big_checkmark select-validation-error";
        $('span#RENTING')[0].className = "checkmark big_checkmark select-validation-error";
        $('span#HOUSED_BY_FAMILY')[0].className = "checkmark big_checkmark select-validation-error";
        $('span#HOUSED_BY_EMPLOYER')[0].className = "checkmark big_checkmark select-validation-error";
        $('span#OTHER')[0].className = "checkmark big_checkmark select-validation-error";

        errorMessages.push('message.validation.ikea.family.card.not.empty');
    }
    var divOtherFinancialStatus = $('#div-other-financial-status');
    if(!divOtherFinancialStatus.is(":hidden")) {
        if(form.otherFinancialStatus.value === '0') {
            form.otherFinancialStatus.className = 'select-validation-error';
            errorMessages.push('message.validation.ikea.family.card.not.empty');
        }
    }
    if(!isNotEmpty(form.inputPeriodStart)) {
        errorMessages.push('message.validation.ikea.family.card.not.empty');
    } else {
       var errorMessage = checkFinancialYear(form.inputPeriodStart);
       if(errorMessage) {
           errorMessages.push(errorMessage);
       }
    }

    if(!isNotEmpty(form.inputBankAccount)) {
        errorMessages.push('message.validation.ikea.family.card.not.empty');
    } else {
        var countryCode = form.countryCode;
        var inputBankAccount = form.inputBankAccount.value.replace(/-/g, "");
        var message = validateBankAccount(countryCode.value, inputBankAccount);
        if (message) {
            form.inputBankAccount.className = 'form-control form-validation-error';
            errorMessages.push(message);
        } else {
            form.iban.value = countryCode.value + inputBankAccount;
        }
    }
    if(!isNotEmpty(form.inputPeriodBankAccount)) {
        errorMessages.push('message.validation.ikea.family.card.not.empty');
    } else {
        errorMessage = checkFinancialYear(form.inputPeriodBankAccount);
        if(errorMessage) {
            errorMessages.push(errorMessage);
        }
    }
    if(!isNotEmpty(form.inputMonthlyRevenue)) {
        errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
    } else {
        if(!checkIfNotZero(form.inputMonthlyRevenue)) {
            errorMessages.push('message.validation.ikea.customer.revenue.must.not.be.zero');
        }
    }
    if(!isNotEmpty(form.inputMonthlyOtherRevenue)) {
        errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
    }
    if(!isNotEmpty(form.inputMonthlyChargesAlimony)) {
        errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
    }
    if(!isNotEmpty(form.inputMonthlyChargesFamilyAllowance)) {
        errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
    }
    var partnerMonthlyRevenue = $('#div-partner-monthly-revenue');
    if(!partnerMonthlyRevenue.is(":hidden")) {
        if(!isNotEmpty(form.inputMonthlyPartnerRevenue)) {
            errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
        }
        if(!isNotEmpty(form.inputMonthlyPartnerOtherRevenue)) {
            errorMessages.push('message.validation.ikea.family.financial.revenues.empty');
        }
    }
    var chargesArray = [];
    if(!isNotEmpty(form.inputMonthlyChargesCreditCard)) {
        errorMessages.push('message.validation.ikea.family.financial.charges.empty');
    } else {
        chargesArray.push(parseInt(form.inputMonthlyChargesCreditCard.value, 10))
    }
    if(!isNotEmpty(form.inputMonthlyChargesCreditHouse)) {
        errorMessages.push('message.validation.ikea.family.financial.charges.empty');
    }  else {
        chargesArray.push(parseInt(form.inputMonthlyChargesCreditHouse.value, 10));
        if(checkHousingStatusIsAccessingOwnership() && !checkIfNotZero(form.inputMonthlyChargesCreditHouse)) {
            errorMessages.push('message.dossier.details.customer.house.credit.incorrect');
        }
    }
    if(!isNotEmpty(form.inputMonthlyChargesRent)) {
        errorMessages.push('message.validation.ikea.family.financial.charges.empty');
    }  else {
        chargesArray.push(parseInt(form.inputMonthlyChargesRent.value, 10));
        if(checkHousingStatusIsRenting() && !checkIfNotZero(form.inputMonthlyChargesRent)) {
            errorMessages.push('message.dossier.details.customer.house.rent.incorrect');
        }
    }
    if(!isNotEmpty(form.inputMonthlyChargesCarCredit)) {
        errorMessages.push('message.validation.ikea.family.financial.charges.empty');
    } else {
        chargesArray.push(parseInt(form.inputMonthlyChargesCarCredit.value, 10))
    }
    if(!isNotEmpty(form.inputMonthlyChargesOtherCredit)) {
        errorMessages.push('message.validation.ikea.family.financial.charges.empty');
    } else {
        chargesArray.push(parseInt(form.inputMonthlyChargesOtherCredit.value, 10))
    }
    var nrOfCharges = parseInt(form.inputMonthlyCharges.value, 10);
    form.inputMonthlyCharges.className = 'form-control';
    if(!chargesAreCorrect(nrOfCharges, chargesArray)) {
        form.inputMonthlyCharges.className = 'form-control form-validation-error';
        errorMessages.push('message.dossier.details.customer.incorrect.charges');
    }
    return validateErrorMessages(errorMessages);
}

function chargesAreCorrect(nrOfCharges, chargesArray) {
    var count = 0;
    $.each(chargesArray, function (index, charge) {
        if (charge > 0) {
            count ++;
        }
    });
    return count === nrOfCharges;
}

function showToastrMessage(message, type, args) {
    if (args) {
        args = typeof args === 'number' ? args.toString() : args;
        args = typeof args === 'string' ? [args] : args;
        for (var i = 0; i < args.length; i++) {
            message = message.replace('{' + i + '}', args[i]);
        }
    }
    toastr[type](message);
    $('#toast-container .toast-' + type).show();
}

function validateErrorMessages(errorMessages) {
    if(errorMessages.length !== 0) {
        var errorMessagesTranslated = [];
        for (var i = 0; i < errorMessages.length; i++) {
            errorMessagesTranslated.push(getTranslation(errorMessages[i]));
        }

        if(errorMessagesTranslated.length > 0) {
            for (var j = 0; j < errorMessagesTranslated.length; j++ ) {
                showToastrMessage(errorMessagesTranslated[j], 'error');
            }
        }
        return false;
    }
    return true;
}

function convertToYear(value) {
    var birthdayYear;
    if(value.length === 29) {
        birthdayYear = value.substring(25, value.length);
    } else {
        birthdayYear = value.substring(24, value.length);
    }
    return birthdayYear;
}

function convertToMonth(value) {
    var month = value.substring(4,7);
    var birthdayMonth = months.filter(function(key) {return key.name === month});
    return birthdayMonth[0].value;
}
