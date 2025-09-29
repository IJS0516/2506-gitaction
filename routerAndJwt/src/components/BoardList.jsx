import { useEffect, useState } from "react";
import REQ_URL from "../js/request";
import "./boardList.css";

const BoardList = () => {
  // 게시판 글 서버 응답 저장
  const [boards, setBoards] = useState([]);
  // 페이지 설정
  const [currentPage, setCurrentPage] = useState(1);
  const boardPerPage = 5; // 1페이지에 5개

  useEffect(() => {
    // 요청 함수
    async function fetchBoards() {
      const token = localStorage.getItem("token");
      try {
      const response = await fetch(`${REQ_URL}/api/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.ok){
        const data = await response.json()     //json 문자열 body 를 js객체로
        setBoards(data);
      }
    } catch(error) {
      console.error("데이터 요청 실패:", error);
    }
    } // 여기까지는 api 요청함수 정의

    fetchBoards();  // 함수 실행
  }, []); //  [] 의존성리스트가 비어있으면 처음 랜더링할 때 한 번 실행됨
  console.log(boards);  // 로그 출력은 여기서만 확인 가능

  // 페이징은 리액트가 합니다.
  const indexOfLast = currentPage * boardPerPage;
  const indexOfStart = indexOfLast - boardPerPage;
  const currentBoards = boards.slice(indexOfStart, indexOfLast);  // last 는 미포함

  const totalPages =Math.ceil(boards.length/boardPerPage)

  return (
    <div className="board-container">
      <h1>전체 글</h1>
      <div>현재 페이지 : {currentPage}</div>
      <div className="pagination">
        {Array.from({length : totalPages}, (_, i) => (
          <button key={i+1} onClick={()=>setCurrentPage(i+1)}
          className="{currentPage === i+1 ? 'active': ''}">
            {i + 1}
          </button>
        ))}
      </div>
      <table className="board-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>작성일</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board =>(
            <tr key={board.id}>
              <td>{board.title}</td>
              <td>{board.content}</td>
              <td>{new Date(board.createdAt).toLocaleDateString()}</td>
              <td>{board.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardList;
