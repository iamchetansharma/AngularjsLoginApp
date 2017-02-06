var userDetails = [];
var msgDetails = [];
var loggedInUser = {};

var app = angular.module("myApp", ["ngRoute"])
.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        template:""
        
    })
    .when("/login", {
        templateUrl : "login.html",
        controller:"cntr_Login"
    }) 
    .when("/sign_in", {
        templateUrl : "sign_in.html",
        controller:"cntr_sign_in"
    }) 
    .when("/message", {
        templateUrl : "message.html",
        controller:"cntr_message"
    }) 
    .when("/logout", {  
         templateUrl : "home.html", 
        controller:"cntr_logout"
    })     
    .when("/home", {
        templateUrl : "home.html"        
    })      
    .when("/profile", {
        templateUrl : "profile.html",
        controller:"cntr_profile"		
    });
})
.controller('cntr_index', function($scope,$http,$rootScope){
    console.log("Index controller");
    
    $rootScope.loggedUser = "";
    
     if(window.localStorage.getItem("localStorageData")==null){
         $http.get("data.json")
        .then(function(response){ 
            console.log("inside");
            $rootScope.userDetails=response.data;
            console.log("data is copied ");
            // storing data in local storage
            console.log("in local");
            window.localStorage["localStorageData"]=angular.toJson($rootScope.userDetails);
            $rootScope.userDetails=angular.fromJson(localStorage.localStorageData);
             console.log($rootScope.userDetails[0].username);
         });
    
     }
         
    else{
       $rootScope.userDetails=angular.fromJson(localStorage.localStorageData);
     console.log("userDetails"+$rootScope.userDetails[0].username);  
    }
    
    
    if(window.localStorage.getItem("mesgStorageData")==null){
         $http.get("message.json")
        .then(function(response){ 
        $rootScope.msgDetails=response.data;
        console.log("message data is copied ");
        window.localStorage["mesgStorageData"]=angular.toJson($rootScope.msgDetails);
        $rootScope.msgDetails=angular.fromJson(localStorage.mesgStorageData);
    });
        
    }
    else{
       $rootScope.msgDetails=angular.fromJson(localStorage.mesgStorageData);
     console.log($rootScope.msgDetails);  
    }
    
})
.controller('cntr_sign_in', function($scope,$http,$rootScope,$location){
    console.log("inside signin controller");
    $scope.SignUpClickEvent = function() {
        console.log("inside SignUpClickEvent   ");
        var newUser={
            "username":$scope.uname,
            "password": $scope.pword,
            "firstname":$scope.fname,
            "lastname": $scope.lname,
            "email": $scope.email,
            "phone":$scope.phone,
            "location":$scope.loc
        };
        console.log("new user: "+newUser.username);
        $rootScope.userDetails.push(newUser);
        console.log("userDetails"+$rootScope.userDetails);     window.localStorage["localStorageData"]=angular.toJson($rootScope.userDetails);
        alert("New Details have added");
        $location.url("login.html");
    };
    
       
   
    
})
.controller('cntr_logout', function($scope,$http,$rootScope,$location){
    console.log("logout controller called");
    delete sessionStorage.user;
    console.log("deleted session value");
    $rootScope.div1=false;
    $rootScope.loggedUser = "Welcome. Please log in!" 
    $location.path('/index');
    
})
.controller('cntr_message', function($scope,$http,$rootScope,$location){
    console.log("Inside message controller"+$rootScope.userDetails);
    var loggedFname;
    
     $scope.deleteClickEvent = function(obj) {
       console.log("deleteClickEvent");
         console.log(obj);
         console.log($rootScope.msgDetails);
         var tempdetails=$rootScope.msgDetails;
        console.log("before: "+tempdetails.length);
         console.log("  ");		 
         for(var i=0;i<tempdetails.length;i++){
             if(tempdetails[i]===obj){
                 console.log("equal");
                 tempdetails.splice(i,1);
                 i=tempdetails.length;
             }
         }
         $rootScope.msgDetails=tempdetails;
         console.log("after: "+$rootScope.msgDetails.length);
         window.localStorage["mesgStorageData"]=angular.toJson($rootScope.msgDetails);
        $rootScope.msgDetails=angular.fromJson(localStorage.mesgStorageData);
     };
    
    $scope.replyClickEvent = function(obj) {
        console.log("replyClickEvent ");
        $rootScope.area=true;
        $rootScope.msg_div=true;
        $rootScope.sent_div=true;
        $rootScope.replyMsg="RE:"+obj;
        $scope.toaddress=obj.sender;
        $scope.msgTitle=obj.title;
        
    };
    $scope.sendClickEvent = function() {
        console.log("sendClickEvent  "+$scope.message);
        
        var newMsg={
            "recipient":$scope.toaddress,
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":$rootScope.loggedUser,
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":$scope.msgTitle,
            "description":$scope.mesg,
            "created_at":new Date(),
            "important":"0"
        };
        $rootScope.msgDetails.push(newMsg);
       

        console.log($rootScope.msgDetails);
        
        window.localStorage["mesgStorageData"]=angular.toJson($rootScope.msgDetails);
        $rootScope.msgDetails=angular.fromJson(localStorage.mesgStorageData);
        console.log("Your message have sucessfully sent!...");
        alert("Your message have sucessfully sent!...");
         $rootScope.area=true;        
    };
    
    $scope.sentMailClickEvent = function() {
 console.log("Sent Mail ClickEvent");
        $scope.msg_div = !$scope.msg_div ;
        var logged=angular.fromJson(sessionStorage.user);
        $scope.msgs=$rootScope.msgDetails;
    }
    
    $scope.inboxClickEvent = function() {
        $scope.msg_div = !$scope.msg_div ;
        console.log("inboxClickEvent");
        $scope.msgs=$rootScope.msgDetails;   
        console.log($scope.msgs);
        $scope.logged=angular.fromJson(sessionStorage.user); 
    };
    
})
.controller('cntr_profile', function($scope,$http,$location,$rootScope){
    console.log("contr profile");
    
    $scope.change=true;
    $scope.show_btn2=true;
    $scope.show_btn1=false;
    console.log("inside profile controller");
    $scope.userIndex;
    
    var logged=angular.fromJson(sessionStorage.user);
        for(var i=0;i<$rootScope.userDetails.length;i++){
            if(logged==$rootScope.userDetails[i].username){
                $scope.uname_E=$rootScope.userDetails[i].username;
                $scope.pword_E=$rootScope.userDetails[i].password;
                $scope.fname_E=$rootScope.userDetails[i].firstname;
                $scope.lname_E=$rootScope.userDetails[i].lastname;
                $scope.email_E=$rootScope.userDetails[i].email;
                $scope.phone_E=$rootScope.userDetails[i].phone;
                $scope.loc_E=$rootScope.userDetails[i].location;
                $scope.userIndex=i;
                i=$rootScope.userDetails.length;
            }
        }
    $scope.profileEditClickEvent = function() {
       
         $scope.change=false;
       $scope.show_btn2=false;
    $scope.show_btn1=true;
       
    };
    $scope.profileUpdateClickEvent = function() {
        console.log("Inside profile Update click");
        $rootScope.userDetails[$scope.userIndex].username=$scope.uname_E;
        $rootScope.userDetails[$scope.userIndex].password=$scope.pword_E;
        $rootScope.userDetails[$scope.userIndex].firstname=$scope.fname_E;
        $rootScope.userDetails[$scope.userIndex].lastname=$scope.lname_E;
        $rootScope.userDetails[$scope.userIndex].email=$scope.email_E;
        $rootScope.userDetails[$scope.userIndex].phone=$scope.phone_E;
        $rootScope.userDetails[$scope.userIndex].location=$scope.loc_E;
        
        console.log( $rootScope.userDetails[$scope.userIndex]); window.localStorage["localStorageData"]=angular.toJson($rootScope.userDetails);
        
        template:"<div>Your chages have been saved!!</div>"
        $scope.change=true;
        $scope.show_btn2=true;
        $scope.show_btn1=false;
    };
    
})
.controller('cntr_Login', function($scope,$http,$location,$rootScope){
    console.log("contr login");
	console.log("login controller initiated");
	
    $scope.loginClickEvent = function() {
        console.log("login click triggered"); 
        $http.get("data.json")
        var username=$scope.username;
        var password=$scope.password;
        $scope.loggedUser="";
        console.log("type of userdetails  "+ $rootScope.userDetails[0].username+" , "+$rootScope.userDetails[0].password);
         for(var i=0;i<$rootScope.userDetails.length;i++){
            if((username==$rootScope.userDetails[i].username)&& (password==$rootScope.userDetails[i].password)){                   
                    $rootScope.loggedUser = $scope.loggedUser=username;
                    sessionStorage.user = angular.toJson(username);
                                               
                }
            }
            
            if($scope.loggedUser.length!=0){
                console.log("Valid user");
                 $rootScope.div1=true;
                $location.url("/home");
            }
            else{
                console.log("Invalid user");
                alert("Please enter correct username and password");
            }
    };
});

    


    