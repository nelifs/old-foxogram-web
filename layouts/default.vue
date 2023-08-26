<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style>
:root {
  --main-color: #FF8034;
  --background-color: #121212;
  --text-main-color: #E2E2E2;
  --text-secondary-color: #AAA;
  --text-dark-color: #4A4A4A;
  --text-black-color: #181818;
  --black-color: #111111;
  --gray-color: #2F2F2F;
}

@font-face {
  font-family: 'Hauora';
  font-style: normal;
  font-weight: 400;
  src: local("Hauora"),
  url("../assets/Hauora-Regular.woff2");
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}

body {
  font: 17px "Hauora";
  background: linear-gradient(135deg, rgba(18,18,18,1) 0%, rgba(27,14,8,1) 100%);
}

::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar-track {
  background: var(--gray-color);
}

::-webkit-scrollbar-thumb {
  border-radius: 15px;
  background: var(--black-color);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-dark-color);
}

.v-app, .v-main, .v-container {
  background: linear-gradient(135deg, rgba(18,18,18,1) 0%, rgba(27,14,8,1) 100%) !important;
  scrollbar-track-color: var(--black-color) !important;
  scrollbar-base-color: var(--black-color) !important;
  scroll-behavior: smooth !important;
}

a {
  color: var(--main-color) !important;
}

.container {
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
}
</style>
