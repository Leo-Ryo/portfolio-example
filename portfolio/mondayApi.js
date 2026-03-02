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

export const fetchFromMondayAPI = async () => {
    const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': MONDAY_TOKEN
        },
        body: JSON.stringify({ query: MONDAY_QUERY })
    });

    const data = await response.json();
    return data;
};

// Directly run and print the data
fetchFromMondayAPI().then(data => {
    console.log(JSON.stringify(data, null, 2));
});
const myname= 'Loc'
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
console.log(myname)
