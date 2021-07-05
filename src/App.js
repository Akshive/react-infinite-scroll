import React from 'react'
import useBookSearch from './useBookSearch';
import {useState, useRef, useCallback} from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        console.log('visible')
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if(node) observer.current.observe(node)
    console.log(node)
  }, [loading, hasMore])

  const handleSearch = (ev) => {
    setQuery(ev.target.value)
    setPageNumber(1)
  }
  useBookSearch(query, pageNumber)

  return (<>
    <input type="text" value={query} onChange={handleSearch}></input>
    {books.map((book, index) => {
      if(books.length === index + 1) {
        return <div key={book} ref={lastBookElementRef}>{book}</div>
      }else {
        return <div key={book}>{book}</div>
      }
    })}
    <div>{loading && 'Loading...'}</div>
    <div>{error && 'Error...'}</div>
  </>);
}

export default App;
