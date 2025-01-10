import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SearchBox from "./components/SearchBox";
import MovieListHeading from "./components/MovieListHeading";
import ScrollContainer from "react-indiana-drag-scroll";

function App() {
    
    const [searchValue, setSearchValue] = useState('');
    const [movies, setMovies] = useState([]);
    const [favourites, setFavourites] = useState([]); // 선호작 영화

    //서버에서 검색한 영화들 데이터를 가져옴
    async function getMovieRequest(s) {
        const url = `http://www.omdbapi.com/?apikey=6bfc4a64&s=${s}`;
        const response = await fetch(url); //omdb 서버에서 데이터를 제이슨으로 받음
        const jsonData = await response.json(); //제이슨문자열을 자바스크립트 객체로 변환
        //console.log(jsonData);
        //검색 결과 없을경우에만 영화를 업데이트 하지 않는다.
        if (jsonData.Search != null && jsonData.Search.length > 0) {
            setMovies(jsonData.Search);
        }
       
    }
    //앱 실행시 처음 한번만 실행[], 이젠 검색어가 바뀔때마다 실행됨
    useEffect(() => {
        //처음에 null값 이기 때문에 아무것도 안뜸, 그래서 if문으로 조건을 만들어 줘야함
        if(searchValue.length >= 3) {
            getMovieRequest(searchValue); // 컴포넌트가 처음 렌더링 될때만 실행
        }
    }, [searchValue]); //[] 빈배열이 의존성 배열 즉 api를 한번만 실행할때 사용한다.
    
    //처음 한번 실행 로컬스토리지에서 선호작 가져오기
    useEffect(() => {
        const movieLikes = JSON.parse(localStorage.getItem('favorites'));
        if (movieLikes) {
            setFavourites(movieLikes);
        }
    }, [])
    //로컬에 저장하는 메소드
    function saveToLocalStorage(items) {
        localStorage.setItem('favorites', JSON.stringify(items));
    }
    //선호작 추가하는 함수
    function addFavouriteMovie(movie) {
        //... 하면은 새로운 배열을 만들어준다.
        const newList = [...favourites, movie];
        setFavourites(newList); // 스테이지 업데이트
        saveToLocalStorage(newList); // 저장소에 저장
    }
    //선호작 제거 함수
    function removeMovie(movie) {
        //filter를 써서 id가 같은 영화가 있으면 제거됨!
        const newList = favourites.filter(fm => fm.imdbID !== movie.imdbID)
        
        setFavourites(newList);
        saveToLocalStorage(newList);
    }
    return (
        <div className="container-fluid movie-app">
            <div className="row align-items-center my-4">
                <MovieListHeading heading="영화 검색과 선호작 등록"/>
                <SearchBox searchValue={searchValue} setSearchValue={setSearchValue}/>
            </div>
            
            <ScrollContainer className="row scroll-container">
                <MovieList addMovie={true} movies={movies} handleClick={addFavouriteMovie} />
            </ScrollContainer>

            <div className="row align-items-center my-4">
                <MovieListHeading heading="내 선호작"/>
            </div>

            <ScrollContainer className="row scroll-container">
                <MovieList addMovie={false} movies={favourites} handleClick={removeMovie} />
            </ScrollContainer>
        </div>
    );
}

export default App;
