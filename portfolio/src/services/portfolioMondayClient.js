const MONDAY_API_URL = 'https://api.monday.com/v2'

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
}

const ensureConfig = () => {
  const missingValues = [
    ['VITE_MONDAY_TOKEN', config.token],
    ['VITE_MONDAY_BOARD_ID', config.boardId],
    ['VITE_MONDAY_DESCRIPTION_COLUMN_ID', config.columns.description],
    ['VITE_MONDAY_TECH_STACK_COLUMN_ID', config.columns.techStack],
    ['VITE_MONDAY_STATUS_COLUMN_ID', config.columns.status],
    ['VITE_MONDAY_GITHUB_LINK_COLUMN_ID', config.columns.githubLink],
    ['VITE_MONDAY_IMAGE_URL_COLUMN_ID', config.columns.imageUrl],
  ].filter(([, value]) => !value)

  if (missingValues.length > 0) {
    const names = missingValues.map(([name]) => name).join(', ')
    throw new Error(`Missing monday.com setup values: ${names}. Check your .env file.`)
  }
}

const makeRequest = async (query, variables = {}) => {
  ensureConfig()

  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.token,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await response.json()

  if (!response.ok) throw new Error(`monday.com request failed with status ${response.status}.`)
  if (json.errors?.length) throw new Error(json.errors[0].message)

  return json.data
}

const toColumnValuesObject = (item) => ({
  [config.columns.description]: item.description || '',
  [config.columns.techStack]: item.techStack || '',
  [config.columns.status]: item.status ? { label: item.status } : {},
  [config.columns.githubLink]: item.githubLink || '',
  [config.columns.imageUrl]: item.imageUrl || '',
})

const mapColumnValues = (columnValues = []) => {
  const valueById = Object.fromEntries(columnValues.map((column) => [column.id, column.text || '']))
  return {
    description: valueById[config.columns.description] || '',
    techStack: valueById[config.columns.techStack] || '',
    status: valueById[config.columns.status] || '',
    githubLink: valueById[config.columns.githubLink] || '',
    imageUrl: valueById[config.columns.imageUrl] || '',
  }
}

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
  `

  const data = await makeRequest(query, { boardId: [config.boardId] })
  const items = data.boards?.[0]?.items_page?.items || []
  return items.map((item) => ({ id: item.id, title: item.name, ...mapColumnValues(item.column_values) }))
}

export const createPortfolioItem = async (item) => {
  const mutation = `
    mutation CreatePortfolioItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `

  await makeRequest(mutation, {
    boardId: config.boardId,
    itemName: item.title,
    columnValues: JSON.stringify(toColumnValuesObject(item)),
  })
}

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
  `

  await makeRequest(mutation, {
    boardId: config.boardId,
    itemId,
    itemName: item.title,
    columnValues: JSON.stringify(toColumnValuesObject(item)),
  })
}

export const deletePortfolioItem = async (itemId) => {
  const mutation = `
    mutation DeletePortfolioItem($itemId: ID!) {
      delete_item(item_id: $itemId) {
        id
      }
    }
  `

  await makeRequest(mutation, { itemId })
}
