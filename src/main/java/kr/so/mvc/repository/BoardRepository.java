package kr.so.mvc.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.so.framework.data.domain.PageRequestParameter;
import kr.so.mvc.domain.Board;
import kr.so.mvc.parameter.BoardParameter;
import kr.so.mvc.parameter.BoardSearchParameter;

@Repository
public interface BoardRepository {

	List<Board> getList(PageRequestParameter<BoardSearchParameter> pageRequestParameter);
	
	Board get(int boardSeq);
	
	void save(BoardParameter board);
	
	void saveList(Map<String, Object> paramMap);
	
	void update(BoardParameter board);
	
	void delete(int boardSeq);

}
