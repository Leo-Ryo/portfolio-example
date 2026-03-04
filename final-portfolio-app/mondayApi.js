/**
 * ==========================================================
 * QUICK START (what students do)
 * ==========================================================
 * 1) Create a .env file:
 *      MONDAY_TOKEN=your_token_here
 * 2) Install dotenv (once):
 *      npm i dotenv
 * 3) Run:
 *      node mondayApi.js.js
 *
 * ==========================================================
 * “TRIGGERS” - Quick ways to force outcomes to teach
 * ==========================================================
 * SUCCESS:
 * - Use a valid token and a board ID you have access to
 *
 * TRIGGER #1 — Missing Token (your script throws early)
 * - Remove MONDAY_TOKEN from .env OR rename it to MONDAY_TOKN
 * - Lesson: “If secret is missing, request can’t authenticate”
 *
 * TRIGGER #2 — 401 Unauthorized
 * - Set MONDAY_TOKEN=abc123 (fake token) in .env
 * - Lesson: “401 = token is wrong or doesn’t have permission”
 *
 * TRIGGER #3 — GraphQL Error (HTTP 200 but errors array)
 * - In the query, typo a field name: items_paege (wrong)
 * - Lesson: “GraphQL can fail even with HTTP 200; check data.errors”
 *
 * OUTCOME — Empty Results (still ‘successful’, but no items)
 * - Use a board that exists but has no items, OR set a board ID you can access
 *   that has no items
 * - Lesson: “Success response can still be empty; handle gracefully”
 *
 * TRIGGER #4 — 429 Rate Limit (hard to force reliably)
 * - If it happens naturally, great. If not, explain it.
 * - Optional: temporarily add a loop to spam requests (advanced/optional).
 */

// Gives access to the variables in the .env file using process.env
import "dotenv/config";

/**
 * ==========================================================
 * Define the GraphQL Query
 * ==========================================================
 * GraphQL mental model:
 * - One endpoint (https://api.monday.com/v2)
 * - You send a query string describing EXACTLY what data you want
 * - The response JSON shape mirrors your query structure
 *
 * This query requests:
 * - board by ID
 * - items on that board
 * - each item: id, name, and column values (id + text)
 *
 * NOTE (future improvement):
 * - Move board id into .env so interns can change it easily:
 *   MONDAY_BOARD_ID=...
 *   boards(ids: Number(process.env.MONDAY_BOARD_ID))
 */
const MONDAY_QUERY = `
  query {
    boards(ids: 18396816803) {
      items_page {
        items {
          id
          name
          column_values {
            id
            text
          }
        }
      }
    }
  }
`;

/**
 * ==========================================================
 * Make the API request
 * ==========================================================
 * API request essentials:
 * - endpoint URL: where we send the request
 * - method: POST (GraphQL is commonly POST)
 * - headers:
 *    Content-Type: "application/json"
 *    Authorization: token proving access
 * - body: JSON containing the query
 */
export const fetchFromMondayAPI = async () => {
  // LESSON: secrets + env vars
  // If MONDAY_TOKEN is missing, we fail fast with a clear message.
  if (!process.env.MONDAY_TOKEN) {
    throw new Error(
      "Missing MONDAY_TOKEN. Add it to your .env file (MONDAY_TOKEN=...).",
    );
  }

  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.MONDAY_TOKEN,
    },
    body: JSON.stringify({ query: MONDAY_QUERY }),
  });

  /**
   * ==========================================================
   * Handle common HTTP outcomes
   * ==========================================================
   * - 200 OK: request succeeded (but GraphQL may still return errors)
   * - 401 Unauthorized: bad token or missing permissions
   * - 429 Too Many Requests: rate limited (slow down)
   * - Other 4xx/5xx: general errors
   */

  // Rate-limit check (simple beginner-friendly handling)
  if (response.status === 429) {
    console.log(
      "429 Too Many Requests (rate limit). Wait a few seconds and try again.",
    );
    // We return here so we don’t try to parse a normal JSON payload.
    return { rateLimited: true };
  }

  // If not 2xx, print the raw response for easier debugging
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${text}`);
  }

  /**
   * ==========================================================
   * Parse JSON
   * ==========================================================
   * response.json() converts the response body into a JavaScript object.
   */
  const data = await response.json();

  /**
   * ==========================================================
   * GraphQL Error Handling (important!)
   * ==========================================================
   * GraphQL can return HTTP 200 but still include:
   *   { errors: [ { message: "..." } ] }
   * This is a key teaching point: "HTTP success ≠ GraphQL success"
   */
  if (data.errors?.length) {
    throw new Error(`GraphQL Error: ${data.errors[0].message}`);
  }

  /**
   * ==========================================================
   * Transform JSON into usable output
   * ==========================================================
   * Do you need all of the data?
   * We pull out item id + name and print a readable table.
   */
  const items = data?.data?.boards?.[0]?.items_page?.items ?? [];

  console.log("\n=== Clean View (Portfolio-friendly) ===");
  console.log("Item Count:", items.length);

  if (items.length === 0) {
    console.log(
      "No items found. (This can be a valid outcome if the board is empty.)",
    );
  } else {
    console.table(
      items.map((i) => ({
        id: i.id,
        name: i.name,
      })),
    );
  }

  return data;
};

/**
 * ==========================================================
 * Run the script (prints in terminal)
 * ==========================================================
 * - fetchFromMondayAPI() returns a Promise
 * - .then(...) runs on success
 * - .catch(...) runs on failure
 *
 * - “Success” means we got data back AND it was useful
 * - “Failure” means we read the error and fix the right thing
 */
fetchFromMondayAPI()
  .then((data) => {
    // If we returned our special rate limit object, keep it simple
    if (data?.rateLimited) return;

    console.log("\nYay! Successfully fetched data from monday.com!");

    // Show full JSON
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error("\nAw shucks! Failed to fetch data from monday.com:");
    console.error("Reason:", err.message);

    // Quick “debug hint” lines (great for entry-level)
    console.error("\nDebug hints:");
    console.error("- Missing token? Check .env for MONDAY_TOKEN");
    console.error("- 401? Token wrong or lacks access");
    console.error("- GraphQL error? Query typo or board permissions");
    console.error("- Nothing printed? Board may be empty");

    // Exit the process
    process.exit(1);
  });

/**
 * ==========================================================
 * OPTIONAL QUICK EXERCISES (5–10 min each)
 * ==========================================================
 * Exercise A (Easy): Remove column_values from the query to reduce data.
 * Exercise B (Easy): Print only the first 3 items.
 * Exercise C (Medium): Move board id into .env:
 *   - add MONDAY_BOARD_ID to .env
 *   - update query to use that env var (string replace or template)
 */
