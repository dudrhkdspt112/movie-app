import React from 'react'

function SearchBox(props) {
    function handleChange(e) {
       //e.target.value 입력창 적은 내용
       props.setSearchValue(e.target.value);
    }
    return (
    <div className='col col-sm-4'>
		  
	  </div>
  )
}

export default SearchBox