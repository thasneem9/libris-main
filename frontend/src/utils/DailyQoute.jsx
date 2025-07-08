const QUOTE_KEY = "dailyQuote";
const TIME_KEY = "quoteTimestamp";

function isSameDay(oldTime) {
  const now = new Date();
  const oldDate = new Date(oldTime);
  return now.toDateString() === oldDate.toDateString();
}

export async function getDailyQuote() {
  const storedQuote = localStorage.getItem(QUOTE_KEY);
  const storedTime = localStorage.getItem(TIME_KEY);

  if (storedQuote && storedTime && isSameDay(storedTime)) {
    return storedQuote; // ✅ Return cached quote
  }

  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    const newQuote = `"${data.content}" — ${data.author}`;
    localStorage.setItem(QUOTE_KEY, newQuote);
    localStorage.setItem(TIME_KEY, new Date().toISOString());
    return newQuote;
  } catch (err) {
    return "“Inspiration failed to load.”";
  }
}
