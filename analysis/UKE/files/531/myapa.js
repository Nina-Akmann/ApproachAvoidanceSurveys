/// <reference path="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js" />

/***********************************************************************************************************************************/
/**********    This section of the code  for login , logout and portal  links  *********************/
/***********************************************************************************************************************************/
var $j = jQuery.noConflict();

var disableSessionExpiredPopup = false;

var showPopup = false;

var showSessionExpiredPopup = false;


var expiredTime = 30;//30 min
var reminderTime = 25;
var cancelReminder = false;


var minutesToRefresh = 1;//5 min

var refreshRate = 1000 * 60 * minutesToRefresh;

var minutesCounter = 0;

var isHttpsPage = window.location.protocol == "https:";

var timer;
var isLogedIn = false;
var result = false;

var cartCookieName = "";
var cookieValidDays = 2000;
var elapsedTime = 0;
var elapsedMinutesCounter = 0;
var myApaUrl;
//var cartPath = "/shoppingCart"; 
$j(window).on("blur focus", function (e) {
    var prevType = $j(this).data("prevType");

    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
                if (isLogedIn) {
                    elapsedTime = Date.now();
                    elapsedMinutesCounter = minutesCounter;
                }
                console.log("blure");
                break;
            case "focus":
                if (elapsedTime > 0 && isLogedIn) {

                    duration = Math.floor(((Date.now() - elapsedTime) / 1000) / 60);
                    if (minutesCounter == elapsedMinutesCounter) {
                        minutesCounter += duration;
                    }
                    elapsedMinutesCounter = 0;
                    elapsedTime = 0;
                }
                console.log("focus");
                break;
        }
    }

    $j(this).data("prevType", e.type);
});

$j(document).ready(function () {

    myApaUrl = $j("#HeaderLoginLink a").attr("href").split('/')[0] + '//' + $j("#HeaderLoginLink a").attr("href").split('/')[2];
    var domain = myApaUrl.split('//')[1];
    cartCookieName = 'cart_' + domain.split('.')[0].replace("sso", "my") + '_' + domain.split('.')[1] + '_' + domain.split('.')[2];

    myApaUrl = myApaUrl.replace("http:", "https:");


    setTimeout(updateLoginLink(), 500);

    setTimeout(updateShoppingCartQuantity, 500);
    //check page to show Sessionpopup
    var currLocation = window.location.href.toLowerCase();
    if ((currLocation.indexOf('login') > -1) || (currLocation.indexOf('register') > -1)) { }
    else {
        timer = setInterval(checkSessionStatus, refreshRate);
        minutesCounter = minutesCounter + minutesToRefresh;
    }

});
function updateLoginLink() {

    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/IsSessionValid',
        'type': 'POST',
        'contentType': "application/json; charset-utf-8",

        'data': JSON.stringify({ 'sessionID': getCookie("ERIGHTS") }),
        'async': true
    }).done(function (data) {
        result = data.toLowerCase() == 'true' ? true : false;
        if (result) {
            $j("#HeaderLogoutLink").show();
            $j("#HeaderMyApaLink").show();
            $j("#HeaderLoginLink").hide();
            isLogedIn = true;
            hideLoginBox();
        }
        else {
            showLoginBox();
            $j("#HeaderLoginLink").show();
            $j("#HeaderLogoutLink").hide();
            $j("#HeaderMyApaLink").hide();
        }
    }).fail(function () {
        result = false;
    });

}
function checkSessionStatus() {
    if (isLogedIn) {
        if (minutesCounter >= reminderTime && !cancelReminder) {
            showReminder();
        }

        if (minutesCounter >= expiredTime) {
            if (!isSessionValid()) {
                cancelReminder = true;
                showExpired();
            }
        }
    }
    else {
        clearInterval(timer);
    }
    minutesCounter = minutesCounter + minutesToRefresh;
}
function showExpired() {

    $j("#HeaderLoginLink").show();
    $j("#HeaderLogoutLink").hide();
    $j("#HeaderMyApaLink").hide();
    //deleteErightsCookies();
    showExpiredModal();
    clearInterval(timer);
    isLogedIn = false;
    showLoginBox();
}
function showReminder() {
    showReminderModal();
}

function showExpiredModal() {
    $j(".ui-dialog-content.ui-widget-content").dialog("close");
    $j("<div id='sessionExpiredOverlay'  title='Session Expired'><p>Your session has been expired.Do you want to log in again?</p></div>").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Login": function () {
                $j(this).dialog("close");
                window.location = myApaUrl + "/apasso/idm/apalogin?ERIGHTS_TARGET=" + encodeURIComponent(window.parent.location.href);
            },
            Cancel: function () {
                $j(this).dialog("close");
            }
        }
    });
}


function showReminderModal() {
    var mintuesRemaining = expiredTime - minutesCounter;
    var remainingMsg = mintuesRemaining >= 0 ? mintuesRemaining : "";
    minutesToRefresh = 1;

    $j(".ui-dialog-content.ui-widget-content").dialog("close");
    $j("<div id='sessionReminderOverlay'  title='Session Reminder'><p>Your session is about to expire!<br>You will be logged out in <b id=timeRemaining>" + (remainingMsg) + "</b> minutes.<br>" +
        "Do you want to stay signed in? <br>If you log out, you will lose any unsaved information.</p></div > ").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Keep me logged in": function () {
                    $j(this).dialog("close");
                    refreshSession();
                },
                Cancel: function () {
                    cancelReminder = true;
                    $j(this).dialog("close");
                }
            }
        });
}


function deleteErightsCookies() {
    document.cookie = 'ERIGHTS=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function showLoginBox() {
    $j("#login").removeClass("hidden");
    $j("#loggedIn").addClass("hidden");
}
function hideLoginBox() {
    $j("#login").addClass("hidden");
    $j("#loggedIn").removeClass("hidden");
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/;domain=.apa.org";
}
function isSessionValid() {
    result = false;
    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/IsSessionValid',
        'type': 'POST',
        'contentType': "application/json; charset-utf-8",

        'data': JSON.stringify({ 'sessionID': getCookie("ERIGHTS") }),
        'async': true,
        'success': function (data) {
            if (data) {
                result = data.toLowerCase() == 'true' ? true : false;
            }
        },
        'error': function (request, error) {
            result = false;
        }
    });
    return result;
}
function refreshSession() {
    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/RefreshSession',
        'type': 'POST',
        'contentType': "application/json; charset-utf-8",
        'data': JSON.stringify({ 'sessionID': getCookie("ERIGHTS") }),
        'async': false,
        'success': function (data) {
            if (data == true || data.toLowerCase() == 'true') {
                minutesCounter = 0;

            }
        },
        'error': function (request, error) {

        }
    });

}
//-------------------------------------cart
function updateShoppingCartQuantity() {
    if (getCookie(cartCookieName) == null || getCookie(cartCookieName) == '' || getCookie(cartCookieName) == "null") {
        $j("#CartQuantity").html("(0)");
        return;
    }
    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/GetCartQuantity',
        'type': 'POST',
        'contentType': "application/json; charset-utf-8",
        'dataType': "json",
        'data': JSON.stringify({ 'cartGuid': getCookie(cartCookieName) }),
        'async': true
    }).done(function (data) {
        var quantity = data;
        if (quantity != '' && quantity != '-1') {
            $j("#CartQuantity").html("(" + quantity + ")");
        }
        else if (quantity == '-1') {
            document.cookie = cartCookieName + '=;path=/;domain=.apa.org;expires=Thu, 01 Jan 1970 00:00:01 GMT';
            $j("#CartQuantity").html("(0)");
        }
        else {
            $j("#CartQuantity").html("");
        }
    }).fail(function () {
        $j("#CartQuantity").html("(0)");
    });
}
function getCartGuid() {
    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/GetCartGuid',
        'type': 'GET',
        'dataType': "json",
        'success': function (data) {
            var cookieDetails = JSON.parse(data);
            cartCookieName = cookieDetails.cookieName;
            setCookie(cookieDetails.cookieName, cookieDetails.guid, cookieValidDays);
        },
        'error': function (request, error) {
        }
    });
}
function getCartList() {
    $j.ajax({
        'url': window.location.protocol + "//" + window.location.host + '/idem/GetCartList',
        'type': 'POST',
        'contentType': "application/json; charset-utf-8",
        'dataType': "json",
        'data': JSON.stringify({ 'cartGuid': getCookie(cartCookieName) }),
        'async': false,
        'success': function (data) {
            var list = JSON.parse(data);
        }
    });
}
function add_product_to_cart(itemId, quantity) {
    if (getCookie(cartCookieName) == null || getCookie(cartCookieName) == '' || getCookie(cartCookieName) == "null") {
        $j.ajax({
            'url': window.location.protocol + "//" + window.location.host + '/idem/GetCartGuid',
            'type': 'GET',
            'dataType': "json",
            'success': function (data) {
                var cookieDetails = JSON.parse(data);
                cartCookieName = cookieDetails.cookieName;
                setCookie(cookieDetails.cookieName, cookieDetails.guid, cookieValidDays);
                ajaxAddtoCart(itemId, quantity);
            },
            'error': function (request, error) {
            }
        });
    }
    else
        ajaxAddtoCart(itemId, quantity);
}
function add_pn_product_to_cart(strItemNo) {
    if (getCookie(cartCookieName) == null || getCookie(cartCookieName) == '' || getCookie(cartCookieName) == "null") {
        $j.ajax({
            'url': window.location.protocol + "//" + window.location.host + '/idem/GetCartGuid',
            'type': 'GET',
            'dataType': "json",
            'success': function (data) {
                var cookieDetails = JSON.parse(data);
                cartCookieName = cookieDetails.cookieName;
                setCookie(cookieDetails.cookieName, cookieDetails.guid, cookieValidDays);
                ajaxAddPNToCart(strItemNo);
            },
            'error': function (request, error) {
            }
        });
    }
    else
        ajaxAddPNToCart(strItemNo);

}
function ajaxAddtoCart(apaItemNum, quantity) {
    var CartItemJson = {
        "apaItemNum": apaItemNum,
        "quantity": quantity,
        "cartGuid": getCookie(cartCookieName),
        "sessionId": getCookie("ERIGHTS"),
    };
    try {
        $j.ajax({
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + "/idem/addtocart",
            data: JSON.stringify(CartItemJson),
            contentType: "application/json; charset-utf-8",
            success: displayCartCallback,
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    } catch (e) {
        console.log("Error calling jQuery post was : " + e.message);
    }
}
function ajaxAddPNToCart(strItemNo) {
    var jsonValue;
    switch (strItemNo) {
        case '3500001': //PI direct daypass
            jsonValue = {
                "cartGuid": getCookie(cartCookieName),
                "sessionId": getCookie("ERIGHTS"),
                "apaItemNum": strItemNo,
                "uid": '',
                "name": 'APA PsycInfo Day Pass',
                "description": '24 hr pass to APA PsycInfo',
                "imageUrl": 'https://www.apa.org/Content/Images/PsycInfo.png',
                "productUrl": 'https://www.apa.org/pubs/databases/access/direct',
                "documentCode": '',
                "onlineFirstPublications": false
            };
            break;
        case '2020001': //PSQ Direct daypass
            jsonValue = {
                "cartGuid": getCookie(cartCookieName),
                "sessionId": getCookie("ERIGHTS"),
                "apaItemNum": strItemNo,
                "uid": '',
                "name": 'APA PsycCritiques Day Pass',
                "description": '24 hr pass to APA PsycCritiques',
                "imageUrl": 'https://psycnet.apa.org/assets/img/purchaseHistory/db_combo.gif',
                "productUrl": 'https://www.apa.org/pubs/databases/access/direct',
                "documentCode": '',
                "onlineFirstPublications": false
            };
            break;
        case '3700001': //PE Direct daypass
            jsonValue = {
                "cartGuid": getCookie(cartCookieName),
                "sessionId": getCookie("ERIGHTS"),
                "apaItemNum": strItemNo,
                "uid": '',
                "name": 'APA PsycExtra Day Pass',
                "description": '24 hr pass to APA PsycExtra',
                "imageUrl": 'https://www.apa.org/Content/Images/PsycExtra.png',
                "productUrl": 'https://www.apa.org/pubs/databases/access/direct',
                "documentCode": '',
                "onlineFirstPublications": false
            };
            break;
        case '4840001': //Combo Daypass
            jsonValue = {
                "cartGuid": getCookie(cartCookieName),
                "sessionId": getCookie("ERIGHTS"),
                "apaItemNum": strItemNo,
                "uid": '',
                "name": 'Day Pass Combo',
                "description": '24 hr pass to APA PsycCritiques, APA PsycExtra and APA PsycInfo',
                "imageUrl": 'https://psycnet.apa.org/assets/img/purchaseHistory/db_combo.gif',
                "productUrl": 'https://www.apa.org/pubs/databases/access/direct',
                "documentCode": '',
                "onlineFirstPublications": false
            };
            break;
    }

    try {
        $j.ajax({
            type: "POST",
            url: window.location.protocol + "//" + window.location.host + "/idem/AddPNItemToCart",
            data: JSON.stringify(jsonValue),
            contentType: "application/json; charset-utf-8",
            success: displayCartCallback,
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    } catch (e) {
        console.log("Error calling jQuery post was : " + e.message);
    }


}
function displayCartCallback(cartSummary) {
    var jsonResponse = JSON.parse(cartSummary);
    var response = jsonResponse.status;
    updateShoppingCartQuantity();
    loginUrl = myApaUrl + '/apasso/idm/apalogin?ERIGHTS_TARGET=' + encodeURIComponent(window.parent.location.href);
    if (response == 'ITEM_ADDED_TO_CART') {
        cartUrl = $j('#HeaderCart > a').attr("href");
        window.location.href = cartUrl + '?cartGuid=' + getCookie(cartCookieName);
    }
    else if (response == 'ITEM_EXIST_IN_CART') {
        $j(".ui-dialog-content.ui-widget-content").dialog("close");
        $j("<div   title='Item exists in the cart'><p>Sorry, we can't add this item to your cart.<br>This item may only be purchased in single quantities.<br>You may, however, purchase other similar items.</p></div>").dialog({
            resizable: false,
            height: "auto",
            width: "auto",
            modal: true,
            buttons: {

                OK: function () {
                    $j(this).dialog("close");
                }
            }
        });
    }
    else if (response == 'USER_NOT_LOGGED_IN_ERROR') {
        $j(".ui-dialog-content.ui-widget-content").dialog("close");
        $j("<div   title='Need to login'><p>Membership in APA is required to place this order.<br>Please log in  to your APA account so that we can verify your membership.</p></div>").dialog({
            resizable: false,
            height: "auto",
            width: "auto",
            modal: true,
            buttons: {
                "Login": function () {
                    $j(this).dialog("close");
                    window.location = myApaUrl + "/apasso/idm/apalogin?ERIGHTS_TARGET=" + encodeURIComponent(window.parent.location.href);
                },
                Cancel: function () {
                    $j(this).dialog("close");
                }
            }
        });

    }
    else if (response == 'USER_NOT_AUTHORIZED_ERROR') {
        $j(".ui-dialog-content.ui-widget-content").dialog("close");
        $j("<div   title='Not authorized'><p style='font-size: 12px;'>We're Sorry, membership in APA is required to place this order, but your account doesn't appear to be associated with an active membership in APA.<br>" +
            "If you believe you have received this message in error, please contact the APA Service Center at (800) 374-2721 or (202) 336-5500, Monday through Friday, between the hours of 9:00 a.m. and 6:00 p.m. ET or e-mail <a href='mailto:loginconcern@apa.org'>loginconcern@apa.org</a>.</p></div>").dialog({
                resizable: false,
                height: "auto",
                width: 500,
                modal: true,
                buttons: {

                    OK: function () {
                        $j(this).dialog("close");
                    }
                }
            });

    }
    else if (response == 'NOT_ENOUGH_INVENTORY') {
        $j(".ui-dialog-content.ui-widget-content").dialog("close");
        $j("<div   title='Not enough inventory'><p >Sorry, we do not have the quantity you requested.<br>" +
            "We are updating your cart with the maximum quantity available.</p></div>").dialog({
                resizable: false,
                height: "auto",
                width: 500,
                modal: true,
                buttons: {

                    OK: function () {
                        $j(this).dialog("close");
                    }
                }
            });

    }
    else if (response == 'USER_HAS_EXISTING_LICENSE') {
        $j(".ui-dialog-content.ui-widget-content").dialog("close");
        $j("<div   title='License exists'><p >Sorry, we can't add this item to your cart.<br>" +
            "You already have an active license on this product.</p></div>").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {

                    OK: function () {
                        $j(this).dialog("close");
                    }
                }
            });

    }
    else {
        alert(response);
    }
    // add the code to show the different messages as popup
}
function hideModalOverlay() { $j("#overlay").remove(); $j(".notLoggedInDiv").remove(); }