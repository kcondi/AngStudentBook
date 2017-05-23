var app = angular.module('app', []);

app.controller("StudentBookController",function($scope) {
    $scope.students = [];
    $scope.inputGender = "male";
    $scope.studentLimit = false;

    $scope.submit = function () {
        $scope.students.push(
            {
                firstName: $scope.inputName,
                lastName: $scope.inputLastName,
                gender: $scope.inputGender,
                entryDate: new Date(Math.random() * new Date())
            });
        $scope.inputName = "";
        $scope.inputLastName = "";
        if ($scope.students.length >= 10)
            $scope.studentLimit = true;
    }

    $scope.toggleMales = function () {
        $scope.malesHidden = !$scope.malesHidden;
    }

    $scope.toggleFemales = function () {
        $scope.femalesHidden = !$scope.femalesHidden;
    }

    $scope.sexFilter = function (student) {
        return !$scope.malesHidden && student.gender === "male" || !$scope.femalesHidden && student.gender === "female";
    }
})