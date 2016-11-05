angular.module('Project2.services', [])
.service('UserService', ['$http', '$location', function($http, $location) {
    
    var user;
    var userPosts;

    this.isLoggedIn = function() {
        if (user) {
            this.user = user;
            return true;
        } else {
            return false;
        }
    }

    this.requireLogin = function() {
        if (!this.isLoggedIn()) {
            var current = $location.path();
            $location.path('/login').search('p', current);
        }
    }

    this.login = function(email, password) {
        return $http({
            method: 'POST',
            url: '/api/users/login',
            data: {
                email: email,
                password: password
            }
        }).then(function(success) {
            user = success.data;
            console.log(user);
            return success.data;
        })
    }

    this.logout = function() {
        return $http({
            method: 'GET',
            url: '/api/users/logout'
        }).then(function(success) {
            user = undefined;
        });
    }

    this.me = function() {
        if (user) {
            return Promise.resolve(user);
        } else {
            return $http({
                method: 'GET',
                url: '/api/users/me'
            }).then(function(success) {
                user = success.data;
                return success.data;
            })
        }
    }
}])
.service('SEOService', ['$rootScope', function($rootScope) { //we are basically copying the objec, seoObj, onto the root scope
    this.setSEO = function(seoObj) {
        $rootScope.seo = {};
        for (var prop in seoObj) {
            $rootScope.seo[prop] = seoObj[prop];
        }
    }
}])
.service('GetUserPostsService', ['$http', '$location', function($http, $location) {
    this.posts = function(id) {
        return $http({
            method: 'GET',
            url: '/api/posts/user/' + id
        }).then(function(response) {
            console.log(response.data);
            var userPosts = response.data;
            return response.data;
        });
    }
}])
.service('GetPostsByCategoryService', ['$http', '$location', function($http, $location) {
    this.posts = function(id) {
        return $http({
            method: 'GET',
            url: '/api/posts/categories/' + id
        }).then(function(response) {
            console.log(response.data);
            return response.data;
        });
    }
}]);

