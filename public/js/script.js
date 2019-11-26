
//Main declaration of the vim or app angular module instance
var app = angular.module('landing', ['ngPatternRestrict'])


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
async function mainAppFunction( $scope, $http, $timeout )
{
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
  $scope.contactForm = { name: 'alberto', email: 'a.herrera07@ufromail.cl', item: '', phone: '+56934940091' } // Fetching Object for query
  $scope.error = false





  // SCOPED FUNCTIONS
  //Little about: When we scope function is available for Virtual DOM, so you can play with it in the HTML by calling it as myfunc()

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
      $scope.codePhoneNumbers = codePhoneNumbers; //JSON of all code numbers for phone selector at the FORM
      $scope.flagStyle = "flag-icon-cl"; //Initial flag skin based on the Adobe XD Mock-up
      $scope.page_texts = es; // Initial language hardcoded by now (should detect the zone)
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
    if(checkForm( el_index )){
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




  //Non Scoped FUNCTIONS
  //Little about: Non scoped functions will not accesible by virtual DOM, so you will only able to use it in your JS files (Yep all of its)


  //Description: Checks the email format given at the modal form stepper.
  function checkEmail( email ){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  //Description: Checks the phone format given at the modal form stepper.
  function checkNumber( number ){
    var re = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/
    return re.test(String(number).toLowerCase())
  }



  //Description: Shows a modal toast with a message for 3 seconds ( or 3000ms)
  function showToast( text_to_show ) {
    $scope.toastMessageText = text_to_show
    $scope.toastClass = "show";
    $timeout(function(){
      $scope.toastClass = ""
    }, 3000);
  }

  //Description: Verify if the information of the modal form stepper, are OK
  function checkForm( el_to_verify ){
    switch (el_to_verify) {
      case 0:
        if( $scope.contactForm.name == '' || $scope.contactForm.name == undefined){
          showToast($scope.page_texts.ERROR_TOAST.NAME.NON_FILLED)
          return false
        }
        return true;
      case 1:
        if( $scope.contactForm.email == '' || $scope.contactForm.email == undefined){
          showToast($scope.page_texts.ERROR_TOAST.EMAIL.NON_FILLED)
          return false
        } else if ( !checkEmail( $scope.contactForm.email ) ){
          showToast($scope.page_texts.ERROR_TOAST.EMAIL.INVALID)
          return false
        }
        return true;
      case 2:
        if( $scope.contactForm.item == '' || $scope.contactForm.item == undefined ){
          showToast($scope.page_texts.ERROR_TOAST.ITEM.NON_FILLED)
          return false
        }
        return true;
      case 3:
        if($scope.contactForm.phone == '' || $scope.contactForm.phone == undefined){
            showToast($scope.page_texts.ERROR_TOAST.PHONE.NON_FILLED)
            return false
        } else if( !checkNumber( $scope.contactForm.phone ) ){
          showToast($scope.page_texts.ERROR_TOAST.PHONE.INVALID)
          return false
        }
        $scope.sendInfo()
        return true


    }
  }




}
