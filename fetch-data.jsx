const Pagination = ({items, pageSize, onPageChange}) => {
    const {Button} = ReactBootstrap;
    if(items.length <= 1) return null;
    //using .ceil will round the resulting number to make it whole
    let num = Math.ceil(items.length / pageSize);
    let pages = range(1, num + 1);
    const list = pages.map(page => {
        return ( 
            //this will return a button for each page and allow on click to move to the next page
            <Button key={page} onClick={onPageChange} className="page-item">{page}</Button>
        );
    });
    return <nav>
        {/* prints a list of the buttons */}
        <ul className="pagination">{list}</ul>
    </nav>
};

const range = (start, end) => {
    return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + 1);
};

function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
};

const useDataApi = (initalUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initalUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
        throw new Error();
  }
};
//App gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const { query, setQuery } = useState("MIT");
  const { currentPage, setCurrentPage } = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=MIT",
    {
      hits: [],
    }
  );

  const handlePageChange = e => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.hits;
  if(page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`current page: ${currentPage}`);
  }

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch("http://hn.algolia.com/api/v1/search?query=${query}");
          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul className="list-group">
          {page.map(item => (
            <li className="list-group-item" key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
};

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));

