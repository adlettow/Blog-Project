angular.module('Project2.controllers', [])
.controller('WelcomeController', ['$scope', '$routeParams', '$location', 'UserService', function($scope, $routeParams, $location, UserService) {
    UserService.me().then(function(me) {
        redirect();
    });
    
    $scope.login = function() {
        UserService.login($scope.email, $scope.password)
        .then(function() {
            redirect();
        }, function(err) {
            console.log(err);
        });
    }

    function redirect() {
        var dest = $location.search().p;
        if (!dest) {
            dest = '/main';
        }
        $location.path(dest).search('p', null).replace();
    }

}])
.controller('MainController', ['$scope', '$routeParams', '$location','UserService', 'Category', function($scope, $routeParams, $location, UserService, Category) {
    UserService.requireLogin();
    $scope.loggedInUser;
    var userId;

    if(UserService.isLoggedIn()){
        $scope.loggedInUser = UserService.user;
        var userId = UserService.user.id;
    }

    $scope.goToComposer = function() {
        $location.path('/compose')
    }

    $scope.goToUserManagment = function() {
        $location.path('/users/' + userId);
    }

    $scope.categories = Category.query();

    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            $location.path('/');
        })
    }

}])
.controller('CategoryController', ['$scope', '$routeParams', '$location', 'Post', 'UserService', 'GetPostsByCategoryService', function($scope, $routeParams, $location, Post, UserService, GetPostsByCategoryService) {
    UserService.requireLogin();
    var categoryId = $routeParams.id;
    $scope.loggedInUser;
    var userId;
    
    if(UserService.isLoggedIn()){
        $scope.loggedInUser = UserService.user;
        var userId = UserService.user.id;
    }

    GetPostsByCategoryService.posts(categoryId)
        .then(function(posts) {
            $scope.categoryPosts = posts;
        })

    $scope.goToUserManagment = function() {
        $location.path('/users/' + userId);
    }

}])
.controller('ComposeController', ['$scope', '$routeParams', '$location', 'Post', 'Category', 'UserService', function($scope, $routeParams, $location, Post, Category, UserService) {
    UserService.requireLogin();
    $scope.loggedInUser;
    var userid;
    
    if(UserService.isLoggedIn()){
        $scope.loggedInUser = UserService.user;
        var userid = UserService.user.id;
    }

    $scope.categories = Category.query();
    $scope.posts = Post.query();

    $scope.submitPost = function() {
        var data = {
            userid: $scope.loggedInUser.id,
            categoryid: $scope.categoryid,
            title: $scope.title,
            content: $scope.content
        }

        var post = new Post(data);
        post.$save(function(success) {
            console.log('post saved');
            console.log(success);
            $location.path('/users/' + loggedInUser.id);

        });
    }

    $scope.goToUserManagment = function() {
        $location.path('/users/' + userId);
    }

    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            $location.path('/');
        })
    }
    
}])
.controller('UserManagementController', ['$scope', '$routeParams', '$location', 'Post', 'UserService', 'GetUserPostsService', function($scope, $routeParams, $location, Post, UserService, GetUserPostsService) {
    UserService.requireLogin();
    var userId = $routeParams.id;
    $scope.loggedInUser;
    
    if(UserService.isLoggedIn()){
        $scope.loggedInUser = UserService.user;
        console.log(UserService.user);
    }
    
    GetUserPostsService.posts(userId).then(function(posts) {
        $scope.userPosts = posts;
    });

    $scope.goToMain = function() {
        $location.path('/main');
    }

    $scope.goToComposer = function() {
        $location.path('/compose')
    }

    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            $location.path('/');
        })
    }
}])
.controller('SinglePostController', ['$scope', '$routeParams', '$location', 'Post', function($scope, $routeParams, $location, Post) {
    var singleId = $routeParams.id;
    console.log(singleId);
    $scope.post = Post.get({ id: singleId })

    $scope.goToUpdate = function() {
        $location.path('/posts/' + singleId +'/update');
    }

    $scope.goToMain = function() {
        $location.path('/main');
    }

    $scope.promptDelete = function() {
        var deleteQuestion = confirm('Are you sure you want to delete this blog post? This can not be undone..');
        if (deleteQuestion) {
            $scope.post.$delete(function(success) {
                $location.path('/');
            });
        } else {
            alert('Whew! That was close!');
        }
    }
}])
.controller('UpdateController', ['$scope', '$routeParams', '$location', 'Post', 'User', 'Category', 'UserService', function($scope, $routeParams, $location, Post, User, Category, UserService) {
    var id = $routeParams.id;
    $scope.users = User.query();
    $scope.categories = Category.query();
    $scope.post = Post.get({ id: id }, function() {
    $scope.post.userid = String($scope.post.userid);
    $scope.post.categoryid = String($scope.post.categoryid);
    });
    
    $scope.loggedInUser;
    
    if(UserService.isLoggedIn()){
        $scope.loggedInUser = UserService.user;
        console.log(UserService.user);
    }

    $scope.update = function() {
        $scope.post.$update(function(success) {
            $location.path('/users/' + $scope.post.userid)
        })
    }

    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            $location.path('/');
        })
    }

    $scope.goToMain = function() {
        $location.path('/main');
    }


}])
.controller('UserListController', ['$scope', '$location', 'User', 'UserService', function($scope, $location, User, UserService) {
    // UserService.requireLogin();
    $scope.users = User.query();

     $scope.GoToNewUserPage = function() {
        $location.path('/users/new');
    }

    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            $location.path('/');
        })
    }

    $scope.deleteUser = function(user) {
        var shouldDelete = confirm('Are you sure you want to delete this user? All associated posts will be deleted as well.')
        if (shouldDelete) {
            console.log('deleting user!')
            console.log(user);
            user.$delete(function() {
                console.log('deleted!');
                $scope.users = User.query();
            });
        };
    }

    $scope.updateUser = function(user) {
        user.$update(function(success) {
            alert('User was updated succesfully');
        });
    }
}])
.controller('NewUserController', ['$scope', '$location', 'User', 'UserService', function($scope, $location, User, UserService) {
    $scope.create = function() {
        var data = {
            email: $scope.email,
            password: $scope.password,
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            role: 'user'
        }

        var user = new User(data);
        console.log(data);
        user.$save(function(success) {
            console.log('user saved');
            console.log(success);
            $location.path('/main');
        });
    }
}])
.controller('HomePageController', ['SEOService', '$location', function(SEOService, $location) {
    SEOService.setSEO({
        title: 'Open Spaces Blog | Home',
        description: 'Secure personal blog to post daily activities',
        image: 'http://' + $location.host() + '/images/blog.png',
        url: $location.absUrl()
    });
}]);