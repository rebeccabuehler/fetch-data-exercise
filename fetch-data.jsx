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
  

  return;
}
