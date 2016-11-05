angular.module('Project2', ['ngRoute', 'ngResource', 'Project2.factories', 'Project2.controllers', 'Project2.services'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    })
    .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
    })
    .when('/categories/:id', { // goes to page with all posts by category
        templateUrl: 'views/category.html',
        controller: 'CategoryController'
    })
    .when('/users/new', { // for a new user to sign up
        templateUrl: 'views/newuser.html',
        controller: 'NewUserController'
    })
    .when('/users/:id', { // for a page that single user with all of their posts
        templateUrl: 'views/userpage.html',
        controller: 'UserManagementController'
    })
    .when('/users', { //admin only; to edit or delete users
        templateUrl: 'views/userslist.html',
        controller: 'UserListController'
    })
    .when('/compose', { // takes to compose page for logged in user
        templateUrl: 'views/compose.html',
        controller: 'ComposeController'
    })
    .when('/posts/:id/update', { // allows user to update selected post
        templateUrl: 'views/update.html',
        controller: 'UpdateController'
    })
    .when('/posts/:id', {
        templateUrl: 'views/single.html',
        controller: 'SinglePostController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);



// .when('/login', {
//         templateUrl: 'views/login.html',
//         controller: 'LoginController'
//     })