
var app=angular.module('customApp',['ui.router','ngMessages']);

/* ui  router logic */
app.config(function($stateProvider,$urlRouterProvider){
   $urlRouterProvider.otherwise("/home");
   $stateProvider.state('home',{
    url:'/home',
	templateUrl:"home.html",
   });
    $stateProvider.state('addshop',{
    url:'/addshop',
	templateUrl:"addshop.html",
   });
    $stateProvider.state('result',{
    url:'/result',
	templateUrl:"result.html",
   });
   
});

 /* controller to check which url is currently active*/
app.controller('uiCtrl', function($scope,$location){
      
	   	
   $scope.getClass = function (path) {
	if ($location.path().substr(0, path.length) === path) {
	return 'active';
	} else {
	return '';
	}
	}
});
	/* form controller */
app.controller('appCtrl', function($scope,$filter,$timeout,calcAverage,state){
      
	$scope.shops=[];
	$scope.shops=state.getShops();
	$scope.result=state.getResult();
	$scope.totalShops=$scope.shops.length;
	$scope.type='medical';
	$scope.totalAverage=$filter('number')(calcAverage.average($scope.shops),2)||0;
		/* Inserting shop details in array */
    $scope.submit=function(){
			   var shop={ shop_name:$scope.shop_name,
						  owner_name:$scope.owner_name,
						  type:$scope.type,
						  area:$scope.area,
						  city:$scope.city,
						  district:$scope.district,
						  pincode:$scope.pincode,
						  budget:$scope.budget,  
						}
				$scope.shops.push(shop);
				/* finding average based on inserted data */
				switch(shop.type){
				 case 'medical': 	$scope.result[0].totalshops+=1; $scope.result[0].totalbudget+=shop.budget;
									$scope.result[0].average=$filter('number')($scope.result[0].totalbudget/$scope.result[0].totalshops,2);break;
				 case 'grocery': 	$scope.result[1].totalshops+=1; $scope.result[1].totalbudget+=shop.budget;
									$scope.result[1].average=$filter('number')($scope.result[1].totalbudget/$scope.result[1].totalshops,2);break;
				 case 'supermarket':$scope.result[2].totalshops+=1; $scope.result[2].totalbudget+=shop.budget;
									$scope.result[2].average=$filter('number')($scope.result[2].totalbudget/$scope.result[2].totalshops,2);break;
				 case 'other':		$scope.result[3].totalshops+=1; $scope.result[3].totalbudget+=shop.budget;
									$scope.result[3].average=$filter('number')($scope.result[3].totalbudget/$scope.result[3].totalshops,2);break;
				}
				$scope.totalShops=$scope.shops.length;     
				state.saveState($scope.shops,$scope.result);    //saving current state of data
				$scope.totalAverage=$filter('number')(calcAverage.average($scope.shops),2)||0;
				showAlertBox();
				$timeout(function () {hideAlertBox();},3500);
				formReset();			
     };
	   /* deleting record from shop array and result array */
	$scope.deleteShop=function(shop){
				 var index = $scope.shops.indexOf(shop);
				 $scope.shops.splice(index, 1); 
				 switch(shop.type){
				 case 'medical': 	$scope.result[0].totalshops-=1; $scope.result[0].totalbudget-=shop.budget;
									$scope.result[0].average=($filter('number')($scope.result[0].totalbudget/$scope.result[0].totalshops,2))||0;break;
				 case 'grocery': 	$scope.result[1].totalshops-=1; $scope.result[1].totalbudget-=shop.budget;
									$scope.result[1].average=($filter('number')(0+$scope.result[1].totalbudget/$scope.result[1].totalshops,2))||0;break;
				 case 'supermarket':$scope.result[2].totalshops-=1; $scope.result[2].totalbudget-=shop.budget;
									$scope.result[2].average=($filter('number')(0+$scope.result[2].totalbudget/$scope.result[2].totalshops,2))||0;break;
				 case 'other':		$scope.result[3].totalshops-=1; $scope.result[3].totalbudget-=shop.budget;
									$scope.result[3].average=($filter('number')($scope.result[3].totalbudget/$scope.result[3].totalshops,2))||0;break;
				}
				state.saveState($scope.shops,$scope.result);
				$scope.totalShops=$scope.shops.length;
				$scope.totalAverage=$filter('number')(calcAverage.average($scope.shops),2)||0;
	};		  
});

/*service calculates average of total shop budget */
app.service("calcAverage", function(){
    
    this.average=function(shops){
		var sum=0;
		for(var i=0;i<shops.length;i++)
		sum+=shops[i].budget;
		return sum/shops.length; 
	}
});
/* service store state of data and scope */
app.service("state",function(){
	 var shopdetails=[];
	 var results=[{type:'medical',totalshops:0,totalbudget:0,average:0.00},
		   {type:'grocery',totalshops:0,totalbudget:0,average:0.0},
		   {type:'supermarket',totalshops:0,totalbudget:0,average:0.00},
		   {type:'other',totalshops:0,totalbudget:0,average:0.00}
		   ];
	 this.saveState=function(shops,result){
			shopdetails=shops;
			results=result;
	 }
	 this.getShops=function(){
	  return shopdetails;
	 }
	 this.getResult=function(){
	 return results;
	 }

}); 
app.filter('capitalizeFirstLetter', function() {
  return function(input) {
    if (input!=null){
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	  
    };
  }
});

function hideAlertBox(){
var alert = document.getElementById("success");
	alert.style.opacity = 0;
	alert.style.zIndex=-1;
}
function showAlertBox(){
	var alert = document.getElementById("success");
	alert.style.opacity = 0.8;
	alert.style.zIndex=9999;
}
function formReset(){
	document.getElementById('shopform').reset();
}

