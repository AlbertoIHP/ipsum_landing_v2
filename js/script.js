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

  $scope.contactForm = { name: '', email: '', item: '', phone: '' }


  //Functions

  $scope.nextStep = async function( el_index = $scope.currentStep ){
    if( el_index < $scope.steps.length ){
      $scope.steps[el_index] = false;
      $scope.steps[(el_index+1)] = true;
      $scope.currentStep = (el_index+1)
    }
    console.log("steps: ",$scope.steps)
    console.log("contact form: ",$scope.contactForm)
  }


  $scope.backStep = async function( el_index = $scope.currentStep){
    if( el_index > 0){
      $scope.steps[el_index] = false;
      $scope.steps[(el_index-1)] = true;
      $scope.currentStep = (el_index-1)
    }
    console.log("steps: ",$scope.steps)
    console.log("contact form: ",$scope.contactForm)
  }

  $scope.openForm = async function(){
    console.log("Se deberia abrir modal")
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
