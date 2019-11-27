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
function showToast( text_to_show, $scope, $timeout ) {
  $scope.toastMessageText = text_to_show
  $scope.toastClass = "show";
  $timeout(function(){
    $scope.toastClass = ""
  }, 3000);
}

//Description: Verify if the information of the modal form stepper, are OK
function checkForm( el_to_verify, $scope, $timeout ){
  switch (el_to_verify) {
    case 0:
      if( $scope.contactForm.name == '' || $scope.contactForm.name == undefined){
        showToast($scope.page_texts.ERROR_TOAST.NAME.NON_FILLED, $scope, $timeout)
        return false
      }
      return true;
    case 1:
      if( $scope.contactForm.email == '' || $scope.contactForm.email == undefined){
        showToast($scope.page_texts.ERROR_TOAST.EMAIL.NON_FILLED, $scope, $timeout)
        return false
      } else if ( !checkEmail( $scope.contactForm.email ) ){
        showToast($scope.page_texts.ERROR_TOAST.EMAIL.INVALID, $scope, $timeout)
        return false
      }
      return true;
    case 2:
      if( $scope.contactForm.item == '' || $scope.contactForm.item == undefined ){
        showToast($scope.page_texts.ERROR_TOAST.ITEM.NON_FILLED, $scope, $timeout)
        return false
      }
      return true;
    case 3:
      if($scope.contactForm.phone == '' || $scope.contactForm.phone == undefined){
          showToast($scope.page_texts.ERROR_TOAST.PHONE.NON_FILLED, $scope, $timeout)
          return false
      } else if( !checkNumber( $scope.contactForm.phone ) ){
        showToast($scope.page_texts.ERROR_TOAST.PHONE.INVALID, $scope, $timeout)
        return false
      }
      $scope.sendInfo()
      return true


  }
}
