<template>
  <div class="login_container">
    <img src="../assets/logo.png" alt=" ">
    <h1 class="login_title">Foxxogram</h1>
    <h3 class="login_subtitle">Floof browser Messenger</h3>
    <div class="login_bg">
      <h1>Welcome back!</h1>
      <h3>We’re so excited to see you again!</h3>
      <h3 class="login_text">E-mail</h3>
      <label for="m"><input
        id="email_input" v-model="email" autocomplete="on"
        placeholder="fox@floof.com"/></label>
      <h3 class="login_text">Password</h3>
      <label for="m"><input
        id="password_input" type="password" v-model="password" autocomplete="on"
        placeholder="123456"/></label>
      <p class="login_footer_text" id="password_reset"><a href="/reset">Forgot your password?</a></p>
      <v-btn @click="login"><h1>Log in</h1></v-btn>
      <p class="login_footer_text">Need an account?
        <a href="/create">Register</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      websocket: null,
      password: null,
      email: null,
    };
  },
  mounted() {
    this.websocket = new WebSocket('ws://localhost:8080');

    this.websocket.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);

      if (data.type === 'auth/login') {
        if (!data.success) return alert('That account doesn\'t exist!');
        const user = JSON.parse(data.user);

        this.$cookies.set('loggedIn', user.cookie);
        setTimeout(() => {
          document.location.href = '/';
        }, 500);

      }
    });
  },
  methods: {
    login() {
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

      if (this.email === null || this.email.length < 0) {
        shake(emailInput);
      } else if (this.password === null || this.password.length < 0) {
        shake(passwordInput);
      } else {
        const data = {
          type: 'auth/login',
          email: this.email,
          password: this.password,
        };

        this.websocket.send(JSON.stringify(data));
      }
    },
  },
};
</script>

<style>
.v-btn {
  width: 90% !important;
  height: 50px !important;
  background: var(--main-color) !important;
  border-radius: 15px !important;
  border: none !important;
  padding: 10px !important;
}

.v-btn h1 {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: var(--text-black-color) !important;
}

.login_container {
  text-align: center;
  padding-bottom: 100px;
}

.login_bg {
  margin: 2vw auto 0;
  border: 2px solid rgba(59, 59, 59, .2);
  padding: 30px;
  border-radius: 15px;
  background: rgba(26, 26, 26, .6);
  width: 500px;
}

img {
  padding-top: 50px;
  width: 300px;
}

.login_title {
  margin-top: -30px;
  color: var(--main-color);
  font-size: 96px;
}

.login_subtitle {
  margin-top: -20px;
  font-size: 41px;
}

.login_text {
  text-align: left;
  color: #757575;
  padding-left: 23px;
  padding-top: 15px;
  padding-bottom: 5px;
}

.login_footer_text {
  margin-top: 10px !important;
  color: #757575;
  text-align: left;
  padding-left: 20px;
}

input {
  background: var(--black-color);
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
