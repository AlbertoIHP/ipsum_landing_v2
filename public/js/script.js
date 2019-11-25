// AngularJS script for fetching and data bindings


var app = angular.module('landing', [])

app.directive('mainApp', function () {
  return {
		controller: 'mainApp',
		restrict : 'E',
		replace: true,
		transclude: true,
		template : '<div class="dialog-container"><ng-transclude></ng-transclude></div>'
	}
})

app.controller('mainApp', mainAppFunction )



async function mainAppFunction( $scope, $http, $timeout )
{

  $scope.codePhoneNumbers = codePhoneNumbers;
  var actual_flag = ""
  $scope.flagStyle = "flag-icon-cl"

  //Language selector
  $scope.page_texts = es;
  $scope.changeLanguage = async function( language ){
    switch (language){
      case 'es':
        $scope.page_texts = es;
        break;
      case 'en':
        $scope.page_texts = en;
        break;
      case 'pr':
        $scope.page_texts = pr;
        break;

    }
  }



  //modal
  $scope.isPanelVisible = false;

  $scope.showDialog = function () {
    $scope.changeClass = "fade-in"
    $scope.isPanelVisible = true;
  };
  $scope.hideDialog = async () => {
    $scope.changeClass = "fade-out"
    $timeout(function () {
      $scope.isPanelVisible = false;
      $scope.steps = [ true, false, false, false, false ]
    }, 450);
  };


  $scope.steps = [ true, false, false, false, false ]


  $scope.notSending = true
  $scope.sending = false
  $scope.sended = false
  $scope.currentStep = 0

  $scope.contactForm = { name: '', email: '', item: '', phone: '+569' }


  //Functions

  function checkEmail( email ){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function checkNumber( number ){
    var re = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/
    return re.test(String(number).toLowerCase())
  }



  function showToast( text_to_show ) {
    $scope.toastMessageText = text_to_show
    $scope.toastClass = "show";
    $timeout(function(){
      $scope.toastClass = ""
    }, 3000);
  }

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
        return true


    }
  }



  $scope.selectItem = async function( selected_item ){
    $scope.contactForm.item = selected_item;
    $scope.nextStep(2)
  }


  $scope.nextStep = async function( el_index = $scope.currentStep ){
    if(checkForm( el_index )){
      if( el_index < $scope.steps.length ){
        $scope.steps[el_index] = false;
        $scope.steps[(el_index+1)] = true;
        $scope.currentStep = (el_index+1)
      }
    }
  }


  $scope.backStep = async function( el_index = $scope.currentStep){
    if( el_index > 0){
      $scope.steps[el_index] = false;
      $scope.steps[(el_index-1)] = true;
      $scope.currentStep = (el_index-1)
    }
  }

  $scope.updateFlag = function() {
    actual_flag = $scope.contactForm.phone
    $scope.contactForm.phone = actual_flag.dial_code
    $scope.flagStyle = "flag-icon-"+actual_flag.code.toLowerCase()
    console.log(actual_flag)

  }


  $scope.sendInfo = async function(){
    if($scope.contactForm.name !== '' && $scope.contactForm.email !== '' && $scope.contactForm.phone !=='' && $scope.contactForm.bussinessArea != 'Área en la empresa' && $scope.contactForm.bussinessName != '')
    {

      $scope.notSending = false
      $scope.sending = true


      console.log($scope.contactForm)

      $http({
        method: 'POST',
        url: 'https://atomicback.herokuapp.com/api/contact',
         headers: {
           'Content-Type': "application/json"
         },
         data: $scope.contactForm
      }).then( (response) => {
        console.log(response)
        $scope.sending = false
        $scope.sended = true
      }).catch( (error) => {
        console.log(error)
        $scope.sending = false
        $scope.sended = false
        $scope.notSending = true
      })

    }
  }

}
