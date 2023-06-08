package kr.so.java.configuration.http;

public enum BaseResponseCode {

	SUCCESS(200), // 성공
	ERROR(500), 
	LOGIN_REQUIRED(200),
	DATA_IS_NULL(500), // 실패

	VALIDATE_REQUIRED(200);
	
	private int status;
	
	BaseResponseCode(int status){
		this.status = status;
	}
	
	public int status() {
		return status;
	}
}
