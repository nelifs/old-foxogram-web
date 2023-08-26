<template>
  <div class="login_container">
    <div class="login_bg">
      <h1 class="login_title">Foxxogram</h1>
      <h3 class="login_subtitle">(not)Powerful browser Messenger</h3>
      <h3 class="login_text">Username</h3>
      <label for="m"><input
        id="username_input" v-model="username" autocomplete="on"
        placeholder="coof"/></label>
      <h3 class="login_text">E-mail</h3>
      <label for="m"><input
        id="email_input" v-model="email" autocomplete="on"
        placeholder="fox@floof.com"/></label>
      <h3 class="login_text">Password</h3>
      <label for="m"><input
        id="password_input" type="password" v-model="password" autocomplete="on"
        placeholder="123456"/></label>
      <v-btn @click="reg">Continue</v-btn>
      <p class="login_footer_text" id="first">Already have an account?
        <a href="/login">Login</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCreatePage',
  data() {
    return {
      websocket: null,
      username: null,
      password: null,
      email: null,
      invitecode: null,
      cookie: null,
    };
  },
  mounted() {
    this.websocket = new WebSocket('ws://localhost:8080');


    function generateRandomString(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }

      return result;
    }

    this.websocket.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);

      if (data.type === 'auth/new') {
        this.$cookies.set('loggedIn', generateRandomString(20), {
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
          secure: true,
        });

        this.cookie = this.$cookies.get('loggedIn');

        const data = {
          type: 'auth/cookie_set',
          username: this.username,
          email: this.email,
          password: this.password,
          cookie: this.$cookies.get('loggedIn'),
        };

        this.websocket.send(JSON.stringify(data));
      } else if (data.type === 'auth/cookie_set') {
        document.location.href = '/';
      }
    });

    if (this.cookie !== null && this.cookie.length > 0) document.location.href = '/';
  },
  methods: {
    reg() {
      function shake(element) {
        element.classList.add('shake');
        element.style.transition = 'all 150ms ease-in-out';
        element.style.backgroundColor = '#281515';
        element.style.boxShadow = '0px 0px 15px 5px rgba(40, 21, 21, .5)';
        setTimeout(() => {
          element.classList.remove('shake');
          element.style.backgroundColor = '#0e0e0e';
          element.style.boxShadow = 'none';
        }, 800);
      }

      const emailInput = document.querySelector('#email_input');
      const passwordInput = document.querySelector('#password_input');
      const usernameInput = document.querySelector('#username_input');

      if (this.username === null || this.username.length < 0) {
        shake(usernameInput);
      } else if (this.email === null || this.email.length < 0) {
        shake(emailInput);
      } else if (this.password === null || this.password.length < 0) {
        shake(passwordInput);
      } else {
        const data = {
          type: 'auth/new',
          email: this.email,
          password: this.password,
          cookie: null,
        };

        this.websocket.send(JSON.stringify(data));
      }
    },
  },
};
</script>

<style>
.v-btn {
  margin-top: 30px !important;
  width: 90% !important;
  height: 40px !important;
  background: var(--main-color) !important;
  border-radius: 15px !important;
  border: none !important;
  padding: 10px !important;
}

.login_container {
  text-align: center;
}

.login_bg {
  margin: 10vw auto 0;
  border: 1px solid #3b3b3b;
  padding: 30px;
  border-radius: 15px;
  background: #1a1a1a;
  width: 500px;
}

.login_title {
  color: var(--main-color);
}

.login_subtitle {
  padding-bottom: 30px;
}

.login_text {
  text-align: left;
  color: #757575;
  padding-left: 23px;
  padding-top: 15px;
  padding-bottom: 5px;
}

#first {
  padding-top: 20px;
}

.login_footer_text {
  color: #757575;
  text-align: left;
  padding-left: 20px;
}

input {
  background: #0e0e0e;
  border-radius: 15px;
  padding: 10px;
  width: 90%;
  margin-right: .5%;
}

@media screen and (max-width: 768px) {
  .login_bg {
    width: 60vw;
  }
}

@media screen and (max-width: 468px) {
  .login_bg {
    width: 80vw;
  }
}
</style>
