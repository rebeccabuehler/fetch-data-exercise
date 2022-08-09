const useDataApi = (initalUrl, initialData) => {
    const {useState, useEffect, useReducer} = React;
    const [url, setUrl] = useState(initalUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData
    });

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({type: "FETCH_INIT"});
            try{
                const result = await axios(url);
                if(!didCancel) {
                    dispatch({type: "FETCH_SUCCESS", payload: result.data});
                }
            } catch (error) {
                if(!didCancel) {
                    dispatch({type: "FETCH_FAILURE"});
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


function App() {
    const {Fragment, useState, useEffect, useReducer} = React;
    const {query, setQuery} = useState("MIT");
    const {currentPage, setCurrentPage} = useState(1);
    const pageSize = 10;
    const [{data, isLoading, isError}, doFetch] = useDataApi(    "https://hn.algolia.com/api/v1/search?query=MIT",
    {
      hits: []
    });

    return;
}