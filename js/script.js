// AngularJS script for fetching and data bindings


var app = angular.module('landing', [])

app.controller('mainApp', mainAppFunction )


async function mainAppFunction( $scope, $http )
{

  //Language selector
  $scope.page_texts = es;
  $scope.changeLanguage = async function( language ){
    $scope.page_texts = language === 'es' ? es : en
  }

  $scope.notSending = true
  $scope.sending = false
  $scope.sended = false

  $scope.contactForm = { name: '', email: '', item: '', phone: '' }

  $scope.sendInfo = async function()
  {
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
