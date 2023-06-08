package kr.so.java.mvc.parameter;

import java.util.List;

import kr.so.java.mvc.domain.BoardType;
import lombok.Data;

@Data
public class BoardSearchParameter {

	private String keyword;
	private List<BoardType> boardTypes;
	
	public BoardSearchParameter() { 
	}

	
 
}
