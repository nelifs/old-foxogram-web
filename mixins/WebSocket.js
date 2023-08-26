export default {
  mounted() {
    new WebSocket('ws://localhost:8080');
  }
};
