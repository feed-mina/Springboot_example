package kr.so.mvc.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.so.framework.data.domain.PageRequestParameter;
import kr.so.mvc.domain.Board;
import kr.so.mvc.parameter.BoardParameter;
import kr.so.mvc.parameter.BoardSearchParameter;
import kr.so.mvc.repository.BoardRepository;

@Service
public class OriginBoardService {
	@Autowired
	public BoardRepository repository;
	
	public List<Board> getList(PageRequestParameter<BoardSearchParameter> pageRequestParameter){
		return repository.getList(pageRequestParameter);
	}
	
	public Board get(int boardSeq) {
		return repository.get(boardSeq);
	}
	
	public void save(BoardParameter parameter) {
	
		Board board = repository.get(parameter.getBoardSeq());
		if (board==null) {
			repository.save(parameter);
		} else {
			repository.update(parameter);
		}
	}
	 	
	// 단순 반복문을 이용한 등록 처리
	public void saveList1(List<BoardParameter> list) {
		for (BoardParameter parameter : list) {
			repository.save(parameter);
		}
	}
	
	// 100개씩 배열에 담아서 일괄 등록 처리
	public void saveList2(List<BoardParameter> boardList) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("boardList", boardList);
		repository.saveList(paramMap);
	}
	
	public void delete(int boardSeq) {
		repository.delete(boardSeq);
	}
}
