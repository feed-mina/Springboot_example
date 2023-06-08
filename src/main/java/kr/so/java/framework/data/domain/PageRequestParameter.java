package kr.so.java.framework.data.domain;

import lombok.Data;

@Data
public class PageRequestParameter<T> {

	
	private PageRequest pageRequest;
	private T parameter;
	
	public PageRequestParameter(PageRequest pageRequest,T parameter ) {
		this.pageRequest = pageRequest;
		this.parameter = parameter;
	}

}
