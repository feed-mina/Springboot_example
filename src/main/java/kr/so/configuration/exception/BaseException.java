package kr.so.configuration.exception;

import kr.so.configuration.http.BaseResponseCode;

public class BaseException extends AbstractBaseException{

	private static final long serialVesrionUID = 8342235231880246631L;
	  
	  public BaseException() {
	  }
	  
	  public BaseException(BaseResponseCode responseCode) {
	  	this.responseCode = responseCode;
	  }
	  
	  public BaseException(BaseResponseCode dataIsNull, String[] args) {
		  this.responseCode = responseCode;
		  this.args = args;
	  }
	
}
