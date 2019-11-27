
//Main declaration of the vim or app angular module instance
var app = angular.module('landing', ['ngPatternRestrict', 'ng.deviceDetector', 'ngTouch'])


// Directives applied for the main instance of angular
app.directive('fullscreen-dialog', function () {
  return {
		controller: 'mainApp',
		restrict : 'E',
		replace: true,
		transclude: true,
		template : '<div class="dialog-container"><ng-transclude></ng-transclude></div>'
	}
})

// Controllers applied for the main instance of angular
app.controller('mainApp', mainAppFunction )



// Controllers functions
async function mainAppFunction( $scope, $http, $timeout, deviceDetector )
{

  console.log("Device_detector: ",)
  //Init vars
  var actual_flag = ""; //To get a snapshot of the flag at the phone selector
  $scope.codePhoneNumbers = codePhoneNumbers; //JSON of all code numbers for phone selector at the FORM
  $scope.flagStyle = "flag-icon-cl"; //Initial flag skin based on the Adobe XD Mock-up
  $scope.page_texts = es; // Initial language hardcoded by now (should detect the zone)
  $scope.isPanelVisible = false; // Initial state for the modal
  $scope.steps = [ true, false, false, false, false ] // Initial state of form steps in modal
  $scope.notSending = true // Initial state for fetching logic (API mailing)
  $scope.sending = false  // Initial state for fetching logic (API mailing)
  $scope.sended = false // Initial state for fetching logic (API mailing)
  $scope.currentStep = 0 // Counter for a snapshot of the step in the form modal
  $scope.contactForm = { name: '', email: '', item: '', phone: '+569' } // Fetching Object for query
  $scope.error = false
  $scope.isMobile = deviceDetector.isMobile()
  $scope.mobileOverFooterStyle = $scope.isMobile ? "over-over-footer" : ""
  $scope.mobileIntegrationContainer = $scope.isMobile ? "integration-mobile" : "non-mobile-integration"
  $scope.bodyMobileContainer = $scope.isMobile ? "body-mobile-container" : ""
  $scope.isPageLoaded = true;





  // SCOPED FUNCTIONS
  //Little about: When we scope function is available for Virtual DOM, so you can play with it in the HTML by calling it as myfunc()


  //description: Function to swipe image from slider for mobile
  $scope.swipe = async function( n_to_slide  ){
    currentSlide(n_to_slide)
  }


  //Description: Function to change language based on the Object provided by a JSON
  $scope.changeLanguage = async function( language ){
    switch (language){
      case 'es':
        $scope.page_texts = es; //SPANISH
        break;
      case 'en':
        $scope.page_texts = en; //ENGLISH
        break;
      case 'pr':
        $scope.page_texts = pr; //PORTUGUESE
        break;

    }
  }

  //Description: function to show the modal with the form stepper inside it
  $scope.showDialog = function () {
    $scope.changeClass = "fade-in" //With ng-class we can change dinamically and in real time with the virtual dom an css class
    $scope.isPanelVisible = true; // We change the state of modal
  };


  //Description: function to hide the modal with the form stepper inside it
  $scope.hideDialog = async () => {
    $scope.changeClass = "fade-out"
    $timeout(function () {
      var actual_flag = ""; //To get a snapshot of the flag at the phone selector
      $scope.flagStyle = "flag-icon-cl"; //Initial flag skin based on the Adobe XD Mock-up
      $scope.isPanelVisible = false; // Initial state for the modal
      $scope.steps = [ true, false, false, false, false ] // Initial state of form steps in modal
      $scope.notSending = true // Initial state for fetching logic (API mailing)
      $scope.sending = false  // Initial state for fetching logic (API mailing)
      $scope.sended = false // Initial state for fetching logic (API mailing)
      $scope.error = false // Initial state for fetching logic (API mailing)
      $scope.currentStep = 0 // Counter for a snapshot of the step in the form modal
      $scope.contactForm = { name: '', email: '', item: '', phone: '+569' } // Fetching Object for query

    }, 450);
  };

  //Description: function to detect ENTER pressing at the inputs on the modal stepper form
  $scope.keyPressed = async function( event, step ){
    if ( event.which === 13 ){
      step == 2 ? null : $scope.nextStep( step )
    }
  }

  //Description: Get the selection of the ITEM in the modal form stepper.
  $scope.selectItem = async function( selected_item ){
    $scope.contactForm.item = selected_item;
    $scope.nextStep(2)
  }



  //Description: Goes to the next step in the modal form stepper.
  $scope.nextStep = async function( el_index = $scope.currentStep ){
    if(checkForm( el_index, $scope, $timeout )){
      if( el_index < $scope.steps.length ){
        $scope.steps[el_index] = false;
        $scope.steps[(el_index+1)] = true;
        $scope.currentStep = (el_index+1)
      }
    }
  }

  //Description: Goes to the previous step in the modal form stepper.
  $scope.backStep = async function( el_index = $scope.currentStep){
    if( el_index > 0){
      $scope.steps[el_index] = false;
      $scope.steps[(el_index-1)] = true;
      $scope.currentStep = (el_index-1)
    }
  }

  //Description: Selects an flag by following the select used by the user
  $scope.updateFlag = function() {
    actual_flag = $scope.contactForm.phone
    $scope.contactForm.phone = actual_flag.dial_code
    $scope.flagStyle = "flag-icon-"+actual_flag.code.toLowerCase()
    console.log(actual_flag)

  }

  //Description: Applys the modal form stepper, and fetch the data into the server mailing API
  $scope.sendInfo = async function(){
      $scope.notSending = false
      $scope.sending = true

      let headers = {'Content-Type': "application/json" }
      let method = 'POST'


      $timeout(async function(){
        let fetch = await $http({method: method, url: env.MAIL_URL, headers: headers,data: $scope.contactForm })
        .then( (response) => {
          console.log(response)
          $scope.sending = false
          $scope.sended = true
          $scope.notSending = true
        }).catch( (error) => {
          console.log(error)
          $scope.sending = false
          $scope.sended = false
          $scope.notSending = true
          $scope.error = true
        })
      },2000)

  }




}
