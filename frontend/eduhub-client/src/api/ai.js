import axios from "axios";

export async function askAI(message) {
  const res = await axios.post("http://localhost:5000/api/ai", {
    message: message
  });

  return res.data;
}
