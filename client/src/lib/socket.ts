const connectWebSocket = (): WebSocket => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  console.log("Connecting to WebSocket at:", wsUrl);
  
  const socket = new WebSocket(wsUrl);
  
  socket.addEventListener("open", () => {
    console.log("WebSocket connection established");
  });
  
  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });
  
  return socket;
};

export default connectWebSocket;
