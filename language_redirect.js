// Example using the IPAPI geolocation API and jQuery
$.getJSON('https://ipapi.co/json/', function(response) {
    var countryCode = response.country_code;
    // Determine appropriate language based on countryCode
    var language = '';
    if (countryCode === 'LU') {
        language = 'Luxembourgish';
    } else if (countryCode === 'DE') {
        language = 'German';
    } else if (countryCode === 'BE' || countryCode === 'FR') {
        language = 'French';
    } else {
        language = 'English';
    }
    // Create HTML popup to confirm preferred language
    var popup = '<div class="language-popup">';
    popup += '<p>It seems that you are in ' + countryCode + '.</p>';
    popup += '<p>Would you like to continue with ' + language + ' or English?</p>';
    popup += '<button id="language-confirm">' + language + '</button>';
    popup += '<button id="language-english">English</button>';
    popup += '</div>';
    $('body').append(popup);
    // Add click listeners for language buttons
    $('#language-confirm').click(function() {
        var selectedLanguage = (language === 'English') ? 'en' : countryCode.toLowerCase();
        window.location.href = 'https://elchiito.com/' + selectedLanguage + '/';
    });
    $('#language-english').click(function() {
        window.location.href = 'https://elchiito.com/en/';
    });
});
