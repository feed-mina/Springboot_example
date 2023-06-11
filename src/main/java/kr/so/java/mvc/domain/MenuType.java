package kr.so.java.mvc.domain;

public enum MenuType {
 
	community(BoardType.COMMUNITY),
	notice(BoardType.NOTICE),
	faq(BoardType.FAQ),
	inquary(BoardType.INQUARY),
	;
	
	private String code;
	private String label;
	
	MenuType(BoardType boardType){
		this.code = name();
		this.label = label;
	}
	
	
	
}
