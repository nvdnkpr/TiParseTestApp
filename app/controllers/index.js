require("ti.parse_mine")({
  facebookAppId : 'facebookAppId',
  applicationId : "applicationId",
  javascriptkey : "javascriptkey"
});

/**
 * click logout, logout of parse
 */
$.logoutBtn.addEventListener('click', function() {
  Parse.User.logOut();

  console.log("User Just Logged Out");
  userIsNotLoggedIn();
});

/**
 * on successful login, display user information
 */
$.loginSuccessAction = function(_options) {

  Ti.API.info('logged in user information');
  Ti.API.info(JSON.stringify(_options.model, null, 2));

  // pre-populate the feed with recent photos
  $.mainController.initialize();

  // get the current user
  Alloy.Globals.currentUser = _options.model;

  // do any necessary cleanup in login controller
  $.loginController && $.loginController.close();
};

/**
 * if the user is not logged in then create controller and display
 * login view for account creation or login effort
 */
function userIsNotLoggedIn() {

  // open the login controller to login the user
  $.loginController = Alloy.createController("login", {
    parentController : $,
    reset : true,
    loginSuccess : function(_user) {
      userIsLoggedIn(_user);

      // close login window/controller
      setTimeout(function() {
        $.loginController.close();
      }, 300);
    }
  });

  // open the window
  $.loginController.open(true);

};

/**
 * if user is logged in, then display the account information
 *
 * @param {Object} _currentUser
 */
function userIsLoggedIn(_currentUser) {

  // open index if not open already
  if ($.indexIsNotOpened) {
    $.index.open();
    $.indexIsNotOpened = false;
  }

  if (_currentUser) {

    // get the current user
    Alloy.Globals.currentUser = _currentUser;

    // do stuff with the user
    console.log(JSON.stringify(_currentUser, null, 2));
    $.fb_un.text = _currentUser.get('fb_username') || 'No Value: FB username';
    $.un.text = _currentUser.get('username');
    $.fn.text = _currentUser.get('first_name') || 'No Value: first name';
    $.ln.text = _currentUser.get('last_name') || 'No Value: last name';
    $.email.text = _currentUser.get('email') || 'No Value: email';
    $.phone.text = _currentUser.get('phone') || 'No Value: phone number';
    $.isFB.text = _currentUser.get('authData') ? 'Facebook' : 'Not Facebook';

  }
};

// when we start up, create a user and log in
var currentUser = Parse.User.current();

$.indexContainer.top = (Alloy.Globals.iOS7 ? 40 : 0) + 'dp';
$.indexIsNotOpened = true;

// we are using the default administration account for now
// user.login("wileytigram_admin", "wileytigram_admin", function(_response) {
if (currentUser) {
  userIsLoggedIn(currentUser);

} else {
  console.log("userIsNotLoggedIn");
  userIsNotLoggedIn();
}
