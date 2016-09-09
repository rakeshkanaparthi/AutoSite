


	
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

$scope.getBank = function(da) {
        $http.post('/api/getbankname',da)
            .success(function(data) {
                console.log(data);
                // alert(data.ok);
                 
                $scope.bankname=JSON.parse(data);;
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

