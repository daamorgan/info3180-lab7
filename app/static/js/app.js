/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload"> Upload</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})


const UploadForm=Vue.component('upload-form', {
    data: function() {
        return{
            success: false,
            failure: false,
            error_messages: []
        }
    },
    template:`
        <div>
            <h1> Upload Form</h1>
            <p v-if="success" class="alert alert-success"> File upload was sucessful </p>
            <div v-else="failure" v-for="error_array in error_messages" class="alert alert-danger">
                <div v-for="error_list in error_array">
                    <div v-for="error in error_list">
                        <p> {{error}}</p>
                    </div>
                </div>
            </div>
            <form method="post" @submit.prevent="uploadPhoto" id="uploadForm" >
                <label for="description"> Description</label>
                <input type="textarea" id="description" name="description" placeholder="Please give a description of the photo being uploaded"/>
                <label for="photo"> Photo</label>
                <input type="file" name="photo"/>
                <button type="submit" id="submitBtn"> Submit </button>
            </form>
        </div>
    `
, 
    methods: {
        uploadPhoto: function(){
            let self= this
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch('/api/upload',{
                method: "POST",
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                    },
                credentials: 'same-origin'
            })
            .then( function(response) {
                if (response.statusText==="success"){
                    self.success=true;
                }else{
                    self.failure=true;
                }
                return response.json();
            })
            .then(function(jsonResponse){
                console.log(jsonResponse);  
                self.error_messages=jsonResponse.error;
            })
            .catch(function(error){
                console.log(error);
            })
    }
}})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: UploadForm},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});