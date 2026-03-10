/*
  portfolioMondayClient.js

  PURPOSE
  This file is the "service layer" for the Portfolio Manager component.
  In plain language: it is the file that talks to monday.com for us.

  The component should not need to know the full API details.
  Instead, the component can call simple functions like:
  - fetchPortfolioItems()
  - createPortfolioItem()
  - updatePortfolioItem()
  - deletePortfolioItem()

  Lesson 1 -> Read   -> fetchPortfolioItems
  Lesson 2 -> Create -> createPortfolioItem
  Lesson 3 -> Update -> updatePortfolioItem
  Lesson 4 -> Delete -> deletePortfolioItem
*/

// monday.com uses one GraphQL API endpoint for requests.
const MONDAY_API_URL = "https://api.monday.com/v2";

// Read setup values from the .env file.
// Even if some values look numeric, environment variables are read as strings.
const config = {
  token: import.meta.env.VITE_MONDAY_TOKEN,
  boardId: import.meta.env.VITE_MONDAY_BOARD_ID,
  columns: {
    description: import.meta.env.VITE_MONDAY_DESCRIPTION_COLUMN_ID,
    techStack: import.meta.env.VITE_MONDAY_TECH_STACK_COLUMN_ID,
    status: import.meta.env.VITE_MONDAY_STATUS_COLUMN_ID,
    githubLink: import.meta.env.VITE_MONDAY_GITHUB_LINK_COLUMN_ID,
    imageUrl: import.meta.env.VITE_MONDAY_IMAGE_URL_COLUMN_ID,
  },
};

// Make sure the most important .env values exist before any request runs.
// This gives beginners a clearer error message if setup is incomplete.
const ensureConfig = () => {
  const missingValues = [
    ["VITE_MONDAY_TOKEN", config.token],
    ["VITE_MONDAY_BOARD_ID", config.boardId],
    ["VITE_MONDAY_DESCRIPTION_COLUMN_ID", config.columns.description],
    ["VITE_MONDAY_TECH_STACK_COLUMN_ID", config.columns.techStack],
    ["VITE_MONDAY_STATUS_COLUMN_ID", config.columns.status],
    ["VITE_MONDAY_GITHUB_LINK_COLUMN_ID", config.columns.githubLink],
    ["VITE_MONDAY_IMAGE_URL_COLUMN_ID", config.columns.imageUrl],
  ].filter(([, value]) => !value);

  if (missingValues.length > 0) {
    const names = missingValues.map(([name]) => name).join(", ");
    throw new Error(
      `Missing monday.com setup values: ${names}. Check your .env file.`,
    );
  }
};

// Generic helper that sends a query or mutation to monday.com.
// This keeps the CRUD functions smaller and easier to read.
const makeRequest = async (query, variables = {}) => {
  ensureConfig();

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // The monday token is sent in the Authorization header.
      Authorization: config.token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  // Throw readable errors if the HTTP request or GraphQL request fails.
  if (!response.ok)
    throw new Error(
      `monday.com request failed with status ${response.status}.`,
    );
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data;
};

// Convert our simple JavaScript item shape into the object monday.com expects.
// IMPORTANT:
// - Description, Tech Stack, GitHub Link, and Image URL are simple text values
// - Status is sent as an object with a label because monday status columns expect that shape
const toColumnValuesObject = (item) => ({
  [config.columns.description]: item.description || "",
  [config.columns.techStack]: item.techStack || "",
  [config.columns.status]: item.status ? { label: item.status } : {},
  [config.columns.githubLink]: item.githubLink || "",
  [config.columns.imageUrl]: item.imageUrl || "",
});

// Convert raw monday column values into a cleaner object for the Vue component.
// The component should not have to search through an array every time.
const mapColumnValues = (columnValues = []) => {
  // Build an object like:
  // {
  //   column_id_1: 'some text',
  //   column_id_2: 'some other text'
  // }
  const valueById = Object.fromEntries(
    columnValues.map((column) => [column.id, column.text || ""]),
  );

  return {
    description: valueById[config.columns.description] || "",
    techStack: valueById[config.columns.techStack] || "",
    status: valueById[config.columns.status] || "",
    githubLink: valueById[config.columns.githubLink] || "",
    imageUrl: valueById[config.columns.imageUrl] || "",
  };
};

// ===== LESSON 1: READ =====
// Get all portfolio items from the chosen monday board.
export const fetchPortfolioItems = async () => {
  const query = `
    query GetPortfolioItems($boardId: [ID!]) {
      boards(ids: $boardId) {
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

  const data = await makeRequest(query, { boardId: [config.boardId] });
  const items = data.boards?.[0]?.items_page?.items || [];

  // Map monday's response into the simpler item shape used by the component.
  return items.map((item) => ({
    id: item.id,
    title: item.name, // monday item name becomes our Title field
    ...mapColumnValues(item.column_values),
  }));
};

// ===== LESSON 2: CREATE =====
// Create a brand-new item in monday.com.
export const createPortfolioItem = async (item) => {
  const mutation = `
    mutation CreatePortfolioItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;

  await makeRequest(mutation, {
    boardId: config.boardId,

    // Title is not a separate text column.
    // In monday, the main item name acts as the title.
    itemName: item.title,

    // monday expects column_values as a JSON string.
    columnValues: JSON.stringify(toColumnValuesObject(item)),
  });
};

// ===== LESSON 3: UPDATE =====
// Update an existing item using its monday item id.
export const updatePortfolioItem = async (itemId, item) => {
  const mutation = `
    mutation UpdatePortfolioItem($boardId: ID!, $itemId: ID!, $itemName: String!, $columnValues: JSON!) {
      change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $columnValues) {
        id
      }
      change_simple_column_value(board_id: $boardId, item_id: $itemId, column_id: "name", value: $itemName) {
        id
      }
    }
  `;

  await makeRequest(mutation, {
    boardId: config.boardId,
    itemId,
    itemName: item.title,
    columnValues: JSON.stringify(toColumnValuesObject(item)),
  });
};

// ===== LESSON 4: DELETE =====
// Remove one item from monday.com by id.
export const deletePortfolioItem = async (itemId) => {
  const mutation = `
    mutation DeletePortfolioItem($itemId: ID!) {
      delete_item(item_id: $itemId) {
        id
      }
    }
  `;

  await makeRequest(mutation, { itemId });
};
