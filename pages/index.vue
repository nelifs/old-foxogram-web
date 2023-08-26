<template>
  <div class="main_container">
    <div class="sidebar">
      <h1>Messenger</h1>
      <v-btn color="danger"  @click="logout">Logout</v-btn>
      <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn color="danger" @click="dialog = true" v-bind="props">Delete Account</v-btn>
        </template>

        <v-card>
          <v-card-text>
            <span class="modal_text">Are you sure you want to delete your account?</span>
          </v-card-text>
          <v-card-actions>
            <v-btn class="modal_button" color="danger" block @click="deleteAcc"
            >Yes</v-btn
            >
          </v-card-actions>
          <v-card-actions>
            <v-btn class="modal_button" color="primary" block @click="dialog = false"
            >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="messenger">
      <ul id="messages">
        <li v-for="message in messages" :id="'message-' + message.id" :key="message.id">
          <div :id="'message-div-' + message.id">
            <div :id="'message-contents-' + message.id">
              <img
                :src="message.avatar"
                alt="  ">
              <h3>{{ message.username }}</h3>
              <span>{{ message.content }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="message-input">
        <div class="profile_card">
          <img
            :src="avatar"
            alt="  ">
          <h3>{{ username }}</h3>
          <p>{{ id }}</p>
        </div>
        <label for="m"><input @keydown.enter="send"
                              id="m" v-model="message" autocomplete="on"
                              placeholder="Type your message"/></label>
        <v-btn @click="send">
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      dialog: false,
      currentIndex: 0,
      username: null,
      id: null,
      avatar: null,
      email: null,
      websocket: null,
      cookie: null,
      messages: [],
      message: '',
    };
  },
  mounted() {
    console.log(1);
    this.cookie = this.$cookies.get('loggedIn');
    // if (this.cookie === undefined || this.cookie.length <= 0) document.location.href = '/login';

    this.websocket = new WebSocket('ws://localhost:8080');

    setTimeout(() => {
      this.websocket.send(JSON.stringify({
        type: 'messages/get',
        cookie: this.$cookies.get('loggedIn'),
      }));
    }, 300);

    this.websocket.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'message') {
        const messageObj = JSON.parse(data.message);
        const newMessage = {
          id: messageObj.id,
          avatar: messageObj.author.avatar,
          username: messageObj.author.username,
          content: messageObj.content,
        };
        this.messages.push(newMessage);

        this.$nextTick(() => {
          const messagesContainer = document.querySelector('#messages');
          messagesContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        });
      } else if (data.type === 'messages/get') {
        console.log(data);
        if (data.success === "false") {
          document.location.href = 'login';
        } else {
          const user = JSON.parse(data.user);
          this.username = user.username;
          this.id = user.id;
          this.avatar = user.avatar;
          this.email = user.email;

          const messagesArray = Array.from(JSON.parse(data.messages));
          for (const message of messagesArray) {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage.author.avatar);
            const newMessage = {
              id: parsedMessage.id,
              avatar: parsedMessage.author.avatar,
              username: parsedMessage.author.username,
              content: parsedMessage.content,
            };

            this.messages.push(newMessage);
          }
        }
        setTimeout(() => {
          this.scrollToLatest();
        }, 100)
      } else if (data.type === 'auth/logout') {
        if (!data.success) return;

        this.$cookies.set('loggedIn', '');
        document.location.href = 'login';
      } else if (data.type === 'auth/delete_account') {
        if (!data.success) return;

        this.$cookies.set('loggedIn', '');
        document.location.href = 'login';
      }
    });
  },
  methods: {
    scrollToLatest() {
      const element = document.querySelectorAll('li')[this.messages.length - 1];
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'end' })
    },
    logout() {
      const data = {
        type: 'auth/logout',
        cookie: this.$cookies.get('loggedIn'),
      };

      this.websocket.send(JSON.stringify(data));
    },
    deleteAcc() {
      const data = {
        type: 'auth/delete_account',
        cookie: this.$cookies.get('loggedIn'),
      };

      this.websocket.send(JSON.stringify(data));
    },
    send() {
      const textInput = document.querySelector('input');
      const content = this.message;
      if (content === undefined || !content || content.length === 0) {
        textInput.classList.add('shake');
        textInput.style.transition = 'all 150ms ease-in-out';
        textInput.style.backgroundColor = '#281515';
        textInput.style.boxShadow = '0px 0px 15px 5px rgba(40, 21, 21, .5)';
        setTimeout(() => {
          textInput.classList.remove('shake');
          textInput.style.backgroundColor = '#0e0e0e';
          textInput.style.boxShadow = 'none';
        }, 800);
      } else {
        const data = {
          type: 'message',
          message: this.message,
          cookie: this.$cookies.get('loggedIn'),
        };
        this.websocket.send(JSON.stringify(data));
        this.message = '';
      }
    },
  },
};
</script>

<style>
.v-btn {
  height: 40px !important;
  border-radius: 15px !important;
  border: none !important;
  padding: 10px !important;
}

.modal_text {
  font-size: 16px !important;
  margin-top: 10px !important;
}

.v-card-actions .v-btn {
  width: 50px !important;
}

.danger {
  background: #ff4141 !important;
}

.primary {
  background: #e7691c !important;
}

.sidebar {
  height: 100%;
  width: 290px;
  background: #1a1a1a;
  position: fixed;
  text-align: center;
}

.profile_card {
  position: absolute;
  margin-left: 20px;
}

.profile_card p {
  padding-top: 0;
  margin-left: 60px;
}

.profile_card h3 {
  padding-top: 7px;
  margin-left: 60px;
}

.profile_card img {
  margin-top: 10px;
  float: left;
  width: 50px;
  border-radius: 50%;
}

.messenger {
  border: black 5px;
}

.message-input {
  background: #131313;
  padding: 3px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.message-input input {
  background: #0e0e0e;
  border: 0;
  border-radius: 15px;
  padding: 10px;
  width: 83vw;
  margin: 10px 10px 20px 300px;
}

.message-input button {
  display: none;
  background: #e7691c;
  border-radius: 15px;
  border: none;
  padding: 10px;
  margin-right: 20px;
}

.shake {
  animation: shake 800ms ease-in-out;
}

#messages {
  list-style-type: none;
  vertical-align: baseline;
  outline: none;
  position: relative;
  margin: 0 0 90px 300px;
  padding: 0;
}

#messages img {
  padding-top: 5px;
  float: left;
  width: 50px;
  border-radius: 50%;
}

#messages div {
}

#messages #contents {
}

#messages span {
  margin-left: 10px;
  vertical-align: baseline;
}

#messages h3 {
  font-weight: 500;
  margin-left: 60px;
  color: var(--main-color);;
}

#messages li {
  display: list-item;
  text-align: -webkit-match-parent;
  padding: 5px 10px;
  animation: fadeIn 200ms ease-in-out;
}

@media screen and (max-width: 768px) {
  .sidebar {
    display: none
  }

  #messages {
    margin-left: 10px
  }

  .profile_card {
    display: none
  }

  .message-input input {
    margin-left: 15px;
    width: 70vw;
    margin-right: 0;
  }

  .message-input button {
    display: inline-flex;
    width: 10vw;
    margin-left: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
