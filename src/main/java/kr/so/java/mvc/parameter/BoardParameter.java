package kr.so.java.mvc.parameter;
import kr.so.java.mvc.domain.BoardType;
import lombok.Data;

@Data
public class BoardParameter {

	private int boardSeq;
	private BoardType boardType;
	private String title;
	private String contents; 
	private boolean delYn;
	
	public BoardParameter() {
		
	}
	
	public BoardParameter(String title, String contents) {
		this.title = title;
		this.contents = contents;
	}
}
