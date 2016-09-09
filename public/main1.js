function myfunction(data){
	console.log('In the my function');
	console.log(data);
}

	baseurl='https://ifsc.razorpay.com';
angular.module('retail',['mgcrea.ngStrap','angularUtils.directives.dirPagination'])
.controller('retailCtrl',function($scope,$http) {

	 $scope.dd='';
        $scope.getSearch=function(data) {
                console.log(data + ":" + $scope.searchBy);
                fstr = '';
 
                if($scope.searchBy=='date'){
                        fstr = data.getDate()  + '/' +( data.getMonth()+ 1) + '/' +  data.getFullYear();
                        // fstr ='' ;
                        console.log(fstr);
                        $scope.dd=fstr;
                }else{
                        fstr = data;
                        $scope.dd=data;
                }
        };

	//$http.defaults.useXDomain = true;

/*	$scope.getBank=function(data) {
		$http.jsonp(baseurl+'/'+data.ifsc)
		.success(function(res) {
			console.log(res);
	//		$scope.bankname=res.data;
		});
	};
*/
$scope.getBank = function(da) {
        $http.get(baseurl+'/'+da.ifsc)
            .success(function(data) {
                alert(data.ok);
            });
    };

	$scope.uploadPdf=function(data){
		console.log(data);
		$http.post('/api/uploadPdf',data)
		.success(function(res){
			alert('upload success');
		});
	};
	//cal=false;
	$scope.insertData=function(data){
		$http.post('/api/insertData',data)
		.success(function(res){
			alert('inserted');
			console.log(res.ifsc);
			$http.post('api/getRecord',res)
			.success(function(res){
				console.log(res);
				$scope.pdfdata=res;
			});
			// $scope.getRecords({ifsc:res.ifsc});
			//cal=true;
		});
	};

	// if(cal) $scope.getRecords(data);	
	$scope.getRecords=function(data){
		$http.post('api/getRecord',data)
		.success(function(res){
			console.log(res);
			$scope.pdfdata=res;
		});
	};

// $scope.upload();

});

/*function getRecords(a,b,c){
	a.post('/api/getRecord',{ifsc:c})
	.success(function(res){
		b.pdfdata=res;
	});
}
*/
