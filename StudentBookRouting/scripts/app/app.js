var app = angular.module("app", [
    "ui.router",
    "LocalStorageModule"
]);

app.run(function(localStorageService, $state) {

    var currentStudents = angular.fromJson(localStorageService.get("students"));
    if (currentStudents == null) {
        var students = [];
        localStorageService.set("students", angular.toJson(students));
    }
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state("home",
            {
                url: "/",
                controller: "HomeController",
                template: `
            <h1>Welcome</h1>
            <button ng-click="goToListOfStudents()">View all students</button>
        `
            })
        .state("list-all",
            {
                url: "/list-all",
                controller: "StudentListController",
                template: `
            <h1>These are the students:</h1>
            <div ng-repeat="student in students">
            {{student.firstName}} {{student.lastName}} 
                <button ui-sref="student-details({lastName : student.lastName})">Details</button>
                <button ng-click="deleteStudent(student)">Delete</button>
                <br/>
            </div>
            <button ui-sref="add-student">Add new student</button>
        `
            })
        .state("student-details",
            {
                url: "/student-details/:lastName",
                controller: "StudentDetailsController",
                template: `
            Name:
            {{chosenStudent.firstName}}
            {{chosenStudent.lastName}}
            <br/>
            Grade:
            {{chosenStudent.grade}}
            <br/>
            <button ui-sref="list-all">Back to students</button>
        `
            })
        .state("add-student",
            {
                url: "/add-student",
                controller: "AddStudentController",
                template: `
            Add a student <br/>
            First name:<br/>
            <input type="text" ng-model="inputName"/><br/>
            Last name:<br/>
            <input type="text" ng-model="inputLastName"/><br/>
             Grade (must be between 1 and 5):<br/>
            <input type="number" ng-model="inputGrade"/><br/>
            <button ng-click="submit()" ng-disabled="inputName===null || inputLastName===null || inputName.length===0 || inputLastName.length===0 || !parseInt(inputGrade) || inputGrade < 1 || inputGrade > 5">Add</button><br/>
            <button ui-sref="list-all">Back to students</button>
         `
            });
});

app.controller("HomeController",
    function ($scope, $state) {
        $scope.goToListOfStudents = function() {
            $state.go("list-all");
        }
    });

app.controller("StudentListController",
    function($scope, localStorageService) {
        $scope.students = angular.fromJson(localStorageService.get("students"));

        $scope.deleteStudent = function(chosenStudent) {
            $scope.students.splice($scope.students.indexOf(chosenStudent),1);
            localStorageService.set("students", angular.toJson($scope.students));
        }
    });

app.controller("StudentDetailsController",
    function ($scope, localStorageService, $state, $stateParams) {
        var allStudents = angular.fromJson(localStorageService.get("students"));
        $scope.chosenStudent = allStudents.find(student => student.lastName === $stateParams.lastName);
    });

app.controller("AddStudentController",
    function ($scope, localStorageService) {
        $scope.parseInt = parseInt;
        var allStudents = angular.fromJson(localStorageService.get("students"));
        $scope.submit = function() {
            allStudents.push(
                {
                    firstName: $scope.inputName,
                    lastName: $scope.inputLastName,
                    grade: $scope.inputGrade
                });
            $scope.inputName = "";
            $scope.inputLastName = "";
            $scope.inputGrade = null;
            localStorageService.set("students", angular.toJson(allStudents));
        }      
    });