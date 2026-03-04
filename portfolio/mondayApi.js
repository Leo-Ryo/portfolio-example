import "dotenv/config";

const MONDAY_QUERY = `
    query{
  boards(ids:18396816803) {
		items_page{
      items{
        id
        name
        column_values{
          id
          text
        }
      }
    }
  }
}
`;

// Make API Request
export const fetchFromMondayAPI = async () => {
  // Check if the token exists. If not, error.
  if (!process.env.MONDAY_TOKEN) {
    throw new Error (
      "Missing MONDAY_TOKEN! Add it to your .env file."
    );
  }

  // Capturing the API's response in a variable by making a request
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.MONDAY_TOKEN,
    },
    body: JSON.stringify({ query: MONDAY_QUERY }),
  });

  // Turn the response into a JavaScript object
  const data = await response.json();

  return data;
}

fetchFromMondayAPI()
  .then((data) => {
    console.log("Yay! I fetched the data from monday.com!");

    // Show the FULL JSON
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("Aw shucks! Failed to fetch data from monday.com :( ");
    console.error("Reason: ", err.message);

    process.exit(1);
  });